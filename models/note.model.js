const mongoose = require('mongoose')

const Note = new mongoose.Schema({
        name: { type: String, required: true },
        title: { type: String, required: true },
        note: { type: String, required: true },
        owner: { type: String, required: true}
    },
{ collection: 'note-data'})

const model = mongoose.model('NoteData', Note)

module.exports = model