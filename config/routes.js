/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */


module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` your home page.            *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/


  // Rendering Pages in Different Layout

  'GET /signup': {
    view: 'pages/signup',
    locals: {
      layout: 'layouts/authentication'
    }
  },
  'GET /login': {
    view: 'pages/login',
    locals: {
      layout: 'layouts/authentication'
    }
  },



  // User  Routes

  '/user/signup' : 'UserController.signup',
  '/user/login' : 'UserController.login',
  '/user/logout' : 'UserController.logout',
  '/confirmation' : 'UserController.confirmationPage',
  '/user/confirmation/:token/:number': 'UserController.confirmation',
  '/profile': 'UserController.profile',
  '/updateProfile/:userId' : 'UserController.updateProfile',
  '/updateImage/:userId' : 'UserController.updateImage' ,

  // Account Routes

  '/defaultAccount' : 'AccountController.defaultAccount',
  '/getAllAccounts' : 'AccountController.getAllAccounts',
  '/updateAccount/:accountId/:creatorId' : 'AccountController.updateAccountName',
  '/addNewAccount' : 'AccountController.addNewAccount',
  '/deleteAccount/:accountId': 'AccountController.deleteAccount',
  '/addUserInAccount/:accountId' : 'AccountController.addUsersInAccount',
  '/deleteUser/:userId/:accountId' : 'AccountController.deleteUser',
  
  // transaction Routes

  '/openedAccount/:accountId': 'TransactionController.getAllTransaction',
  '/addTransaction/:accountId': 'TransactionController.addTransaction',
  '/getTransactionOfAllAccounts' : 'AccountController.getAllTransactionByAccounts',
  '/getTransactionByUsers/:accountId' : 'TransactionController.getTransactionsByUsers',
  '/editTransaction/:accountId/:transactionId' : 'TransactionController.editTransaction',
  '/deleteTransaction/:transactionId/:accountId' : 'TransactionController.deleteTransaction',


};
