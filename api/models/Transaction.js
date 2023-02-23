/**
 * Transaction.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    accountId : {
      model:'account'
    },
    userId:{
      model:'user'
    },
    transactionType : {
      type: 'string',
      required : true
    },
    amount:{
      type : 'number',
      required: true,
      min : 1,
      max : 10000000
    },
    description:{
      type : 'string',
      required : true,
      minLength: 3,
      maxLength: 25
    }
  },

};

