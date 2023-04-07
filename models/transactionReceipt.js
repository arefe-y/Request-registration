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
        ref: "wallet",
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "order",
    },
})


module.exports = mongoose.model("transactionReceipt", TreceiptSchema)