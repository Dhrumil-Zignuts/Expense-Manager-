const jwt = require('jsonwebtoken')

module.exports = {

    // Create a Default Account When User SignUp .
    defaultAccount: async (req, res) => {
        const creatorId = req.query.creatorId

        // create a Default Account with this data
        const accountDetails = {
            creatorId: creatorId,
            accountName: 'Default Account',
            users: []
        }

        try {
            const createDefaultAccount = await Account.create(accountDetails).fetch()
            res.status(200).redirect(`/getAllAccounts`)
        } catch (err) {
            res.status(500).send({ message: `Default account is not created..! ): `, error: err })
        }
    },

    // Add New Account 
    addNewAccount: async (req, res) => {
        const userId = req.userId

        // new Account will add in this formate
        const newAccount = {
            creatorId: userId,
            accountName: req.body.accountName,
            users: []
        }
        try {
            const addNewAccount = await Account.create(newAccount).fetch()
            res.redirect('/getAllAccounts')
        } catch (err) {
            res.status(500).json({
                message: 'New Account is Not Added',
                error: err
            })
        }
    },

    // Delete Account 
    deleteAccount : async (req,res)=> {
        const userId = req.userId

        const accountId = req.params.accountId
        try{

            // user can delete the Account If He/She Created it
            const deleteAccount = await Account.destroy({creatorId : userId, id : accountId})
            res.redirect('/getAllAccounts')
        }catch(err){
            res.status(500).json({
                message: 'New Account is Not Added',
                error: err
            })
        }
        
    },

    // Update Account Name
    updateAccountName : async (req,res)=>{
        const userId = req.userId

        const accountId = req.params.accountId
        const creatorId = req.params.creatorId
            try{
                const updateAccountName = await Account.updateOne({id : accountId }).set({accountName : req.body.accountName})
                res.redirect(`/getAllAccounts`)
            }catch(err){
                res.status(500).json({
                    message: 'Account name is not Updated',
                    error: err
                })
            }
    },

    getAllAccounts: async (req, res) => {
        // Get User Id from Token in Policies
        const userId = req.userId

        try {
            // Get Account where user is an Admin
            const allAccounts = await Account.find({ creatorId: userId }).populate('creatorId')
            try {
                
                // Get Accounts where user was addded
                const userAddedInAccounts = await User.findOne({ id: userId }).populate('userHavingAccounts')
                res.view('pages/dashboard', { allAccounts: allAccounts, userAddedInAccounts: userAddedInAccounts.userHavingAccounts })
            } catch (err) {
                res.view('pages/dashboard', { allAccounts: allAccounts })
            }
        } catch (err) {
            res.status(500).json({ message: `Error in Getting All Accounts` })
        }
    },


    // Add User In Account
    addUsersInAccount: async (req, res) => {
        const userId = req.userId

        const data = req.body
        const accountId = req.params.accountId

        // This is a Array of user's Id 
        const usersId = Object.keys(data)

        try {
            const accountinfo = await Account.findOne({id: accountId})

            // Condition for Admin can Add Users in Account
            if(accountinfo.creatorId == userId ){
                const addUser = await Account.addToCollection(accountId, 'totleUsers', usersId)
                res.redirect(`/openedAccount/${accountId}`)
            }else{
                res.send(`You Don't have Access to Add Users in Account`)
            }
        } catch (err) {
            res.status(500).json({
                message: `cann't Add Users in Acccount`,
                error: err
            })
        }
        
    },

    // Transaction will filter by Account Name
    getAllTransactionByAccounts : async (req,res)=>{
        const userId = req.userId

        try{
            const accounts = await Account.find({creatorId : userId}).populate('totalTransactions')
            res.status(200).view('pages/transactionByAccounts',{accounts : accounts})
        }catch(err){
            res.status(500).json({
                message: `Error in getting All Transaction By Accounts`,
                error : err
            })
        }
    },

    // Delete User From Account
    deleteUser : async (req,res)=>{
        const userId = req.userId
        const deleteuserId = await req.params.userId
        const accountId = await req.params.accountId

        try{
            const accountInfo = await Account.findOne({id: accountId})

            // Condition : Only Admin and Delete Users or User can Delete himSelf Only
            if (accountInfo.creatorId == userId || deleteuserId == userId){
                const deleteUser = await Account.removeFromCollection(accountId, 'totleUsers').members(deleteuserId);
                res.redirect(`/getAllAccounts`)
            }else{
                res.send(`You Don't have Acceess to Delete User`)
            }
        }catch(err){
            res.status(500).send({
                message : `Can Find User`,
                error : err
            })
        }
    }


};

