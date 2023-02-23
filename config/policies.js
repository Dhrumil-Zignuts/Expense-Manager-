module.exports.policies = {

  UserController : {
    logout : 'isAuth',
    profile : 'isAuth',
    updateProfile:'isAuth' ,
    updateImage : 'isAuth',
  },
  AccountController : {
    '*': 'isAuth',
  },
  TransactionController : {
    '*' : 'isAuth'
  }
};