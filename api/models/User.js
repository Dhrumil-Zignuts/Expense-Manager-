/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    username: {
      type: 'string',
      required: true,
      minLength: 5,
      maxLength: 20
    },
    email: {
      type: 'string',
      required: true,
      isEmail: true,
    },
    accountsCreated:{
      collection: 'account',
      via: 'creatorId'
    },
    transactions:{
      collection : 'transaction',
      via : 'userId'
    },
    userHavingAccounts : {
      collection : 'account',
      via : 'totleUsers'
    },
    password: {
      type: 'string',
      required: true
    },
    verification: {
      type: 'string',
      minLength: 6,
      maxLength: 6
    },
    profileImage : {
      type : 'string',
      isURL: true,
    },
    mobileNumber : {
      type : 'number',
    },
    userInfo : {
      type : 'string'
    },
    location : {
      type : 'string',
    },
    facebook : {
      type : 'string',
      isURL: true, 
    },
    instagram : {
      type : 'string',
      isURL: true,
    },
  },

};

