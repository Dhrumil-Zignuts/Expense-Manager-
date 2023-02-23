/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')

module.exports = {


    // Signup Controller
    signup: async (req, res) => {
        console.log(req.body);

        if (req.body === {}) {
            return res.status(400).json({
                message: 'Empty req body'
            })
        }

        const findUserbyEmail = await User.findOne({ email: req.body.email })
        const finduserbyUsername = await User.findOne({ username: req.body.username })

        if (!findUserbyEmail && !finduserbyUsername) {
            try {
                const hash = await bcrypt.hash(req.body.password, 10)
                console.log(`This is a hash ${hash}`);
                if (hash) {
                    try {
                        const data = {
                            email : req.body.email,
                            password: hash,
                            username : req.body.username,
                            profileImage : 'https://res.cloudinary.com/dhrumil-zignuts/image/upload/v1676892898/Screenshot_2023-02-20_at_5.03.28_PM_oxqo6u.png',
                            mobileNumber : 9999999999,
                            userInfo: 'Hello! I am new User Here',
                            location: 'Gujarat' ,
                            facebook : 'https://www.facebook.com/',
                            instagram : 'https://www.instagram.com/',
                        }
                        const newUser = await User.create(data).fetch()
                        try {
                            const token = await jwt.sign({ email: newUser.email, userId: newUser.id }, process.env.SECRET_KEY , { expiresIn: '3h' })

                            sendConfirmationCode();

                        } catch (err) {
                            console.log(`New User is Created But Token is not geneated..! ${err}`);
                            res.status(500).json({ message: `New User is Created But Token is not geneated..!`, error: err })
                        }
                    } catch (err) {
                        console.log(`New User is not Created.! ${err}`);
                        res.status(500).json({ message: 'New User is not Created..', error: err })
                    }
                } else {
                    console.log(`could not generate a hash value of the Password..! ${err}`);
                    res.status(500).json({ message: `could not generate a hash value of the Password` })
                }
            } catch (err) {
                console.log(`There is a Problem in hashing the password ${err}`);
                res.status(500).json({ message: 'There is a Problem in hashing the password ', error: err })
            }
        } else {
            console.log(`Already Have an Account on this email Address..!! OR username is Taken..!! `);
            res.status(500).json({ message: 'Already Have an Account on this email Address..!! OR username is Taken..!!' })
        }

        function sendConfirmationCode(){
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: "expansemanager2023@gmail.com",
                    pass: "sundieblhghfkuzh"
                }
            })
            const number = Math.random().toString().substr(2, 6)
            const options = {
                from: "expansemanager2023@gmail.com",
                to: newUser.email,
                subject: "Welcome to Expance Manager..!",
                html: `<h3>This is a Verication code..! Do Not Share it with anyone</h3><br><h2>${number}</h2>`
            }

            transporter.sendMail(options, (err, info) => {
                if (err) {
                    console.log(`This is a Error while Sending the Email : ${err}`);
                    res.send(500, { message: `Error in sending the mail`, error: err })
                } else {
                    res.redirect(`/confirmation?token=${token}&code=${number}`)
                }
            })
        }
    },

    // Confirmation page rendering
    confirmationPage: async (req, res) => {
        res.view('pages/confirmation', { token: req.query.token, number: req.query.code })
    },

    // Confirmation Controller
    confirmation: async (req, res) => {
        const token = req.params.token
        const number = req.params.number
        const enteredNumber = req.body.verification
        jwt.verify(token, process.env.SECRET_KEY, async (err, result) => {
            if (err) {
                res.status(500).json({ message: `JWT is not decoded`, error: err })
            } else {
                console.log(result);
                try {
                    const findUserbyEmail = await User.updateOne({ _id: result.userId }).set({ verification: number })
                    if (number === enteredNumber && findUserbyEmail.verification) {
                        res.cookie('access_token', token, { httpOnly: true }).redirect(`/defaultAccount?creatorId=${result.userId}`)
                    } else {
                        res.status(500).json({ message: `Entered Verification Code is doesn't match ` })
                    }
                } catch (err) {
                    res.status(500).json({ message: `Can't find user based on token` })
                }
            }
        })
    },

    // Login Controller
    login: async (req, res) => {
        const email = req.body.email
        const password = req.body.password
        const findUserbyEmail = await User.findOne({ email: email })
        if (findUserbyEmail && findUserbyEmail.verification) {
            bcrypt.compare(password, findUserbyEmail.password, (err, result) => {
                if (err) {
                    res.redirect('/login')
                } else {
                    if(result == false){
                    res.redirect(`/login?err=${result}`)
                    }else{
                        const token = jwt.sign({ email: findUserbyEmail.email, userId: findUserbyEmail.id }, process.env.SECRET_KEY, { expiresIn: '3h' })
                        res.cookie('access_token', token, { httpOnly: true }).redirect('/getAllAccounts')
                    }
                }
            })
        } else {
            res.send(500, { message: 'You do have not Account on this Email Address OR you might not Verify your email Account' })
        }
    },

    // Logout Controller
    logout: async (req, res) => {
        try {
            res.clearCookie('access_token').redirect('/login')
        } catch (err) {
            res.send(500, { message: 'User have not Logout...!!' })
        }
    },

    profile : async (req,res)=>{

        const userId = req.userId

        try{
            const userData = await User.findOne({id : userId})
            res.view('pages/profile',{user : userData})

        }catch(err){
            res.status(500).json({
                message : ' Profile data can not fetch',
                error : err
            })
        }


        
    },
    updateProfile : async (req,res)=>{
        const userId = req.params.userId

        try{
            const updateUser = await User.updateOne({id : userId}).set(req.body)
            res.redirect('/profile')
        }catch(err){
            res.status(500).json({
                message : `User is not Updated`,
                error : err
            })
        }
    },
    updateImage : async (req,res)=>{
        const userId = req.params.userId
        const userImage = req.body.url
        try{
            const updateImage = await User.updateOne({id : userId}).set({ profileImage : userImage})
            res.redirect(`/getAllAccounts`)
        }catch(err){
            res.status(500).json({
                message : `Image is not set`,
                error : err
            })
        }
    }
};
