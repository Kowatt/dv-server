const mongoose = require('mongoose')

const Folder = new mongoose.Schema({
        name: { type: Object, required: true },
        owner: { type: String, required: true},
    },
{ collection: 'folder-data'})

const model = mongoose.model('FolderData', Folder)

module.exports = model