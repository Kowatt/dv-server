const mongoose = require('mongoose')

const Card = new mongoose.Schema({
        name: { type: String, required: true },
        number: { type: String, required: true },
        date: { type: String, required: true },
        ccv: { type: String, required: true },
        owner: { type: String, required: true},
        folder: { type: String, required: true }
    },
{ collection: 'card-data'})

const model = mongoose.model('CardData', Card)

module.exports = model