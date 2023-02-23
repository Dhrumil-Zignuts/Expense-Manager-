/**
 * Account.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  // tableName : 'account',
  attributes: {
    
    creatorId : {
      model : 'user'
    },
    accountName:{
      type : 'string',
      required : true,
      minLength: 5,
      maxLength: 25
    },
    totleUsers : {
      collection : 'user',
      via : 'userHavingAccounts'
    },
    totalTransactions:{
      collection : 'transaction',
      via : 'accountId'
    },
    users :{
          type : 'json',
          required : true,
          columnType: 'array'
      }
  
  },

};

