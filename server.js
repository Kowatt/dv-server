const express = require("express")
const app = express()
const cors = require("cors")
const mongoose = require("mongoose")
const User = require("./models/user.model")
const Folder = require("./models/folder.model")
const jwt = require("jsonwebtoken")


app.use(cors())
app.use(express.json())

mongoose.connect('mongodb://localhost/datavault')

app.post('/api/register', async (req, res) => {
    console.log(req.body)

    try {
        const user = await User.create({
            username: req.body.username,
            password: req.body.password
        })
        res.json( { status: 'ok' })
    } catch (err) {
        res.json( { status: 'error', error: 'Duplicate username'})
    }

})

app.post('/api/login', async (req, res) => {
    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    })

    if (user) {

        const token = jwt.sign({
            username: user.username
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
        const username = decoded.username
        const folder = await Folder.create({
            name: req.body.name,
            owner: username
        })
        res.json({ status: 'ok' })
    } catch (error) {
        res.json( { status: 'error', error: 'Duplicate folder name'})
    }
    
})

app.post('/api/get/folders', async (req, res) => {

    const token = req.headers['x-access-token']

    try {
        const decoded = jwt.verify(token, 'secret')
        const username = decoded.username

        const folders = await Folder.find({ owner: username })
        res.json(folders)
    } catch (error) {
        console.log(error)
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


app.listen(4000, () => {
    console.log("Server start on port 4000")
})