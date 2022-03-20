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


app.use(cors())
app.use(express.json())

mongoose.connect('mongodb://localhost/datavault')

app.post('/api/register', async (req, res) => {
    try {

        const uniqueCheck = await User.findOne({ username: req.body.username })
        if (uniqueCheck) {
            res.json( {status: 'error', error: 'Duplicate username' })
            return
        }

        const user = await User.create({
            username: req.body.username,
            password: req.body.password
        })
        res.json( { status: 'ok' })
    } catch (err) {
        res.json( { status: 'error', error: 'Unknown error'})
    }

})

app.post('/api/login', async (req, res) => {
    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    })

    if (user) {

        const token = jwt.sign({
            username: user.username,
            id: user._id
        }, 'secret')

        return res.json({ status: 'ok', user: token })
    } else {
        return res.json({ status: 'error', user: false })
    }
})

app.post('/api/add/folder', async (req, res) => {
    const token = req.headers['x-access-token']

    try {
        const decoded = jwt.verify(token, 'secret')
        const ownerId = decoded.id
        const folder = await Folder.create({
            name: req.body.name,
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

app.post('/api/get/folders', async (req, res) => {

    const token = req.headers['x-access-token']

    try {
        const decoded = jwt.verify(token, 'secret')
        const ownerId = decoded.id

        const folders = await Folder.find({ owner: ownerId })
        res.json(folders)
    } catch (error) {
        console.log(error)
    }
    
})


app.post('/api/add/data/card', async (req, res) => {

    const token = req.headers['x-access-token']

    try {
        const decoded = jwt.verify(token, 'secret')
        const ownerId = decoded.id
        const name = req.body.name
        const number = req.body.number
        const date = req.body.date
        const ccv = req.body.ccv
        const folder = req.body.folder
        const card = await Card.create({
            name: name,
            number: number,
            date: date,
            ccv: ccv,
            owner: ownerId,
            folder: folder
        })
        res.json({ status: 'ok' })
    } catch (error) {
        res.json({ status: 'error', error: error })
    }
})

app.post('/api/add/data/pass', async (req, res) => {

})

app.post('/api/add/data/note', async (req, res) => {

})



app.listen(4000, () => {
    console.log("Server start on port 4000")
})