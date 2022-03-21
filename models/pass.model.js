const mongoose = require('mongoose')

const Pass = new mongoose.Schema({
        name: { type: String, required: true },
        url: { type: String, required: true },
        user: { type: String, required: true },
        pass: { type: String, required: true },
        owner: { type: String, required: true},
        folder: { type: String, required: true }
    },
{ collection: 'pass-data'})

const model = mongoose.model('PassData', Pass)

module.exports = model