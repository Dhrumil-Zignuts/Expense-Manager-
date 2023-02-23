const jwt = require('jsonwebtoken')


module.exports = {

    getAllTransaction : async (req,res)=>{
        const accountId = req.params.accountId

        try{
            // Get Transaction by Descending Order
            const getAllTransaction = await Transaction.find({accountId : accountId}).populate('userId').sort('createdAt DESC')

            // Get Transaction with Transaction Type 'Expense' 
            const Expanse = await Transaction.find({accountId : accountId, transactionType : 'Expanse'})
            const totalExpanse = TotalExpanse(Expanse)

            // Get Transaction with Transaction Type 'Income'
            const Income = await Transaction.find({accountId: accountId, transactionType : 'Income'})
            const totalIncome = TotalIncome(Income)

            // Get Current Account Detail 
            const accountDetails = await Account.findOne({ id: accountId })

            // Get All Users
            const allUsers = await User.find({})


            const addeduser = await Account.findOne({ id: accountId }).populate('totleUsers')
            res.view('pages/openedAccount', { 
                account: accountDetails, 
                users: allUsers, 
                transactions: getAllTransaction, 
                addedUser : addeduser.totleUsers, 
                totleExpanse : totalExpanse, 
                totalIncome : totalIncome 
            })
        }catch(err){
            res.status(500).json({message: `These are all Transaction`,error : err})
        }

        // Calculate Total Expense
        function TotalExpanse(data){
            let expanse = 0;
            for(let i = 0; i < data.length; i ++){
                expanse = parseInt(expanse) + parseInt(data[i].amount) 
            }
            return expanse
        }

        // Calculate Total Income
        function TotalIncome(data){
            let income = 0;
            for(let i = 0; i < data.length; i ++){
                income = parseInt(income) + parseInt(data[i].amount) 
            }
            return income
        }
    },

    // Get Current Account Transactions filterd by Users names
    getTransactionsByUsers : async (req,res)=>{
        const accountId = req.params.accountId
        try{
            // Get All User who are added in Current Account
            const getAllUsersinAccount = await Account.findOne({id : accountId}).populate('totleUsers')
            const creatorId = getAllUsersinAccount.creatorId ; 

            // Get User's Details who is Admin of Current Account
            const findUser = await User.findOne({id: creatorId})

            
            const getAllUserInfo = await Transaction.find({accountId : accountId}).populate('userId').sort('createdAt DESC')

            res.view('pages/transactionsByUser',{ 
                transaction : getAllUserInfo, 
                users : getAllUsersinAccount.totleUsers, 
                user : findUser, 
                accountId : req.params.accountId
            })
        }catch(err){
            res.status(500).json({message: `These are not all Transaction`,error : err})
        }
    },

    // Add Transction In Account 
    addTransaction : async (req,res)=>{

        const userId = req.userId
        const accountId = req.params.accountId

        // Data formate in which we want to store the data
        const data = {
            accountId: accountId,
            userId : userId,
            transactionType: req.body.transactionType,
            amount: req.body.amount,
            description: req.body.description,
        }

        try{
            const addTransaction = await Transaction.create(data).fetch()
            res.redirect(`/openedAccount/${accountId}`)
        }catch(err){
            res.status(500).json({message : `Transaction not Added In DB`, error : err})
        }
    },
    
    deleteTransaction : async (req,res)=>{
        const userId = req.userId
        const transactionId = req.params.transactionId 
        const accountId = req.params.accountId
        try{
            const accountInfo = await Account.findOne({id : accountId})

            // Condition Admin can Delete Transaction 
            if(accountInfo.creatorId == userId){
                const deletedTransaction = await Transaction.destroy({id : transactionId })
                res.redirect(`/openedAccount/${accountId}`)
            }else{
                // User can delete his created Transaction
                const deletedTransaction = await Transaction.destroy({id : transactionId, userId : userId })
            }
        }catch(err){
            res.status(500).json({message : `You Don't have Access to Delete Transaction`, error : err})
        }
    },
    

    // Edit Transactions
    editTransaction : async (req,res)=>{
        const userId = req.userId
        console.log(req.body);
        const accountId = req.params.accountId
        const transactionId = req.params.transactionId

        // new Data 
        const updatedData = {
            transactionType: req.body.transactionType,
            amount: req.body.amount,
            description: req.body.description,
        }
        try{
            const accountInfo = await Account.findOne({id : accountId})

            // Condition Admin can Upate Transaction
            if(accountInfo.creatorId == userId){
                const updateData = await Transaction.updateOne({id : transactionId}).set(updatedData)
                res.redirect(`/openedAccount/${accountId}`)
            }else{

                // User can edit transaction which are creted by him/her
                const updateData = await Transaction.updateOne({id : transactionId, userId : userId}).set(updatedData)
                res.redirect(`/openedAccount/${accountId}`)
            }
        }catch(err){
            res.status(500).json({message : `You dont have access to Edit the Transaction`, error : err})
        }
    }

};

