const mongoose = require('mongoose')

const Card = new mongoose.Schema({
        name: { type: Object, required: true },
        number: { type: Object, required: true },
        date: { type: Object, required: true },
        ccv: { type: Object, required: true },
        owner: { type: String, required: true},
        folder: { type: String, required: true }
    },
{ collection: 'card-data'})

const model = mongoose.model('CardData', Card)

module.exports = model