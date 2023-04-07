const mongoose = require('mongoose');

const walletHistorySchema = new mongoose.Schema({
    totalNmberOfTransactions: {
        type: Number,
        default: 0
    },
    numberOfSuccessfulTransactions:{
        type: Number,
        default: 0
    },
    numberOfFailedTransactions:{
        type: Number,
        default: 0
    },
    totalAmountOfSuccessfulTransactions:{
        type: Number,
        default: 0
    },
    wallet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Wallet",
    },

})


module.exports = mongoose.model("WalletHistory", walletHistorySchema)