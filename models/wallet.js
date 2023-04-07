const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
    Amount: {
        type: Number,
        default: 0
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
})


module.exports = mongoose.model("wallet", walletSchema)