const mongoose = require('mongoose')

const Pass = new mongoose.Schema({
        name: { type: Object, required: true },
        url: { type: Object, required: true },
        user: { type: Object, required: true },
        pass: { type: Object, required: true },
        owner: { type: String, required: true},
        folder: { type: String, required: true }
    },
{ collection: 'pass-data'})

const model = mongoose.model('PassData', Pass)

module.exports = model