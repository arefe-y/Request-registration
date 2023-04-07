const mongoose = require('mongoose');

const TreceiptSchema = new mongoose.Schema({
    Amount: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ["successful", "failed"],
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    wallet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Wallet",
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
    },
})


module.exports = mongoose.model("TransactionReceipt", TreceiptSchema)