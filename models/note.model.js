const mongoose = require('mongoose')

const Note = new mongoose.Schema({
        name: { type: Object, required: true },
        title: { type: Object, required: true },
        note: { type: Object, required: true },
        owner: { type: String, required: true},
        folder: { type: String, required: true }
    },
{ collection: 'note-data'})

const model = mongoose.model('NoteData', Note)

module.exports = model