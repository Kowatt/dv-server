const express = require("express")
const app = express()
const cors = require("cors")
const mongoose = require("mongoose")
const User = require("./models/user.model")
const Folder = require("./models/folder.model")
const Card = require("./models/card.model")
const Pass = require("./models/pass.model")
const Note = require("./models/note.model")
const jwt = require("jsonwebtoken")
const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcrypt')
const crypto = require("./crypto/crypto")

const saltRounds = 10
const key = "apvnjapciajjhl986556"

app.use(cors())
app.use(express.json())

mongoose.connect('mongodb://localhost/datavault')

app.post('/api/register', async (req, res) => {
    try {

        const uuid = uuidv4()
        const uniqueCheck = await User.findOne({ username: req.body.username })
        if (uniqueCheck) {
            res.json( {status: 'error', error: 'Duplicate username' })
            return
        }

        bcrypt.hash(req.body.password, saltRounds, async function(err, res) {
            const user = await User.create({
                username: req.body.username,
                password: res,
                uuid: crypto.encrypt(uuid, req.body.password)
            })
        })
        res.json( { status: 'ok' })
    } catch (err) {
        res.json( { status: 'error', error: 'Unknown error'})
    }

})

app.post('/api/login', async (req, res) => {
    const user = await User.findOne({
        username: req.body.username
    })

    if (user) {

        const match = await bcrypt.compare(req.body.password, user.password)

        if (!match) return res.json({ status: 'error', user: false })

        const token = jwt.sign({
            username: user.username,
            id: user._id,
            uuid: crypto.decrypt(user.uuid, req.body.password)
        }, key)

        return res.json({ status: 'ok', user: token })
    } else {
        return res.json({ status: 'error', user: false })
    }

})

app.post('/api/add/folder', async (req, res) => {
    const token = req.headers['x-access-token']

    try {
        const decoded = jwt.verify(token, key)
        const ownerId = decoded.id
        const uuid = decoded.uuid
        const folder = await Folder.create({
            name: crypto.encrypt(req.body.name, uuid),
            owner: ownerId
        })
        res.json({ status: 'ok' })
    } catch (error) {
        res.json( { status: 'error', error: 'Duplicate folder name'})
    }
    
})

app.post('/api/remove/folder', async (req, res) => {
    
    const folderId = req.body['folderId']

    try {
        const folder = await Folder.findByIdAndRemove(folderId)
        res.json({ status: 'ok' })
    } catch (error) {
        console.log(error)
    }
})

app.post('/api/remove/data/card', async (req, res) => {
    const cardId = req.body.cardId

    try {
        const card = await Card.findByIdAndRemove(cardId)
        res.json({ status: 'ok' })
    } catch (error) {
        console.log(error)
    }
})

app.post('/api/remove/data/pass', async (req, res) => {
    const passId = req.body.passId

    try {
        const pass = await Pass.findByIdAndRemove(passId)
        res.json({ status: 'ok' })
    } catch (error) {
        console.log(error)
    }
})

app.post('/api/remove/data/note', async (req, res) => {
    const noteId = req.body.noteId

    try {
        const note = await Note.findByIdAndRemove(noteId)
        res.json({ status: 'ok' })
    } catch (error) {
        console.log(error)
    }
})

app.post('/api/get/folders', async (req, res) => {

    const token = req.headers['x-access-token']

    try {
        const decoded = jwt.verify(token, key)
        const ownerId = decoded.id
        const uuid = decoded.uuid

        const folders = await Folder.find({ owner: ownerId })
        for (let folder of folders) {
            folder.name = crypto.decrypt(folder.name, uuid)
        }
        res.json(folders)
    } catch (error) {
        console.log(error)
    }
    
})


app.post('/api/add/data/card', async (req, res) => {

    const token = req.headers['x-access-token']

    try {
        const decoded = jwt.verify(token, key)
        const uuid = decoded.uuid
        const card = await Card.create({
            name: crypto.encrypt(req.body.name, uuid),
            number: crypto.encrypt(req.body.number, uuid),
            date: crypto.encrypt(req.body.date, uuid),
            ccv: crypto.encrypt(req.body.ccv, uuid),
            owner: decoded.id,
            folder: req.body.folder
        })
        res.json({ status: 'ok' })
    } catch (error) {
        res.json({ status: 'error', error: error })
    }
})

app.post('/api/get/data/cards', async (req, res) => {
    const token = req.headers['x-access-token']

    try {
        const decoded = jwt.verify(token, key)
        const uuid = decoded.uuid
        const cards = await Card.find( { owner: decoded.id, folder: req.body.folder } )
        for (let card of cards) {
            card.name = crypto.decrypt(card.name, uuid),
            card.number = crypto.decrypt(card.number, uuid),
            card.date = crypto.decrypt(card.date, uuid),
            card.ccv = crypto.decrypt(card.ccv, uuid)
        }
        res.json(cards)
    } catch (error) {
        res.json({ status: 'error', error: error })
    }
})

app.post('/api/add/data/pass', async (req, res) => {
    const token = req.headers['x-access-token']
    try {
        const decoded = jwt.verify(token, key)
        const uuid = decoded.uuid
        const pass = await Pass.create({
            name: crypto.encrypt(req.body.name, uuid),
            url:  crypto.encrypt(req.body.url, uuid),
            user: crypto.encrypt(req.body.user, uuid),
            pass:  crypto.encrypt(req.body.pass, uuid),
            owner: decoded.id,
            folder: req.body.folder
        })

        res.json({status : 'ok'})
    } catch (error) {
        res.json({status: 'error', error: error})
    }
})


app.post('/api/get/data/pass', async (req, res) => {
    const token = req.headers['x-access-token']

    try {
        const decoded = jwt.verify(token, key)
        const uuid = decoded.uuid
        const pass = await Pass.find( { owner: decoded.id, folder: req.body.folder } )
        for (let pas of pass) {
            pas.name = crypto.decrypt(pas.name, uuid),
            pas.url = crypto.decrypt(pas.url, uuid),
            pas.user = crypto.decrypt(pas.user, uuid),
            pas.pass = crypto.decrypt(pas.pass, uuid)
        }
        res.json(pass)
    } catch (error) {
        res.json({status: "error", error: error})
    }
})

app.post('/api/add/data/note', async (req, res) => {
    const token = req.headers['x-access-token']
    try {
        const decoded = jwt.verify(token, key)
        const uuid = decoded.uuid
        const note = await Note.create({
            name: crypto.encrypt(req.body.name, uuid),
            title: crypto.encrypt(req.body.title, uuid),
            note: crypto.encrypt(req.body.note, uuid),
            owner: decoded.id,
            folder: req.body.folder
        })

        res.json({status : 'ok'})
    } catch (error) {
        res.json({status: 'error', error: error})
    }
})

app.post('/api/get/data/notes', async (req, res) => {
    const token = req.headers['x-access-token']

    try {
        const decoded = jwt.verify(token, key)
        const uuid = decoded.uuid
        const note = await Note.find( { owner: decoded.id, folder: req.body.folder} )
        for (let not of note) {
            not.name = crypto.decrypt(not.name, uuid),
            not.title = crypto.decrypt(not.title, uuid),
            not.note = crypto.decrypt(not.note, uuid)
        }
        res.json(note)
    } catch (error) {
        res.json({status: 'error', error: error})
    }
})

app.post('/api/edit/data/card', async (req, res) => {
    const token = req.headers['x-access-token']

    try {
        const decoded = jwt.verify(token, key)
        const uuid = decoded.uuid
        const card = await Card.findOneAndUpdate({_id : req.body.id}, {
            name: crypto.encrypt(req.body.name, uuid),
            number: crypto.encrypt(req.body.number, uuid),
            date: crypto.encrypt(req.body.date, uuid),
            ccv: crypto.encrypt(req.body.ccv, uuid)
        })
        res.json({status: 'ok'})
    } catch (error) {
        res.json({status: 'error', error: error})
    }
})

app.post('/api/edit/data/pass', async (req, res) => {
    const token = req.headers['x-access-token']

    try {
        const decoded = jwt.verify(token, key)
        const uuid = decoded.uuid
        const card = await Pass.findOneAndUpdate({_id : req.body.id}, {
            name: crypto.encrypt(req.body.name, uuid),
            url: crypto.encrypt(req.body.url, uuid),
            user: crypto.encrypt(req.body.user, uuid),
            pass: crypto.encrypt(req.body.pass, uuid)
        })
        res.json({status: 'ok'})
    } catch (error) {
        res.json({status: 'error', error: error})
    }
})

app.post('/api/edit/data/note', async (req, res) => {
    const token = req.headers['x-access-token']

    try {
        const decoded = jwt.verify(token, key)
        const uuid = decoded.uuid
        const card = await Note.findOneAndUpdate({_id : req.body.id}, {
            name: crypto.encrypt(req.body.name, uuid),
            title: crypto.encrypt(req.body.title, uuid),
            note: crypto.encrypt(req.body.note, uuid),
        })
        res.json({status: 'ok'})
    } catch (error) {
        res.json({status: 'error', error: error})
    }
})

app.listen(4000, () => {
    console.log("Server start on port 4000")
})