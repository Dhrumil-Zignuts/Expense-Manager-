const jwt = require('jsonwebtoken');

module.exports = function(req, res, proceed){
    try{
        const token = req.cookies.access_token;
        // If didn't get the token then redirect to the login page
        if(!token){
            return res.redirect('/login')
        }

        // If we get the Token then find the Current User's Id
        const userInfo = jwt.verify(token, process.env.SECRET_KEY);
        req.userId = userInfo.userId;
        proceed();
    } catch(error){
        return res.redirect('/login');
    }
}