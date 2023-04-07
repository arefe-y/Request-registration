const mongoose = require('mongoose');

const countereSchema = new mongoose.Schema({

    counter: {
        type: Number,
        default:30000
    }
})


module.exports = mongoose.model("Counter", countereSchema)