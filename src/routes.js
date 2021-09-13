const express = require('express')
const routes = express.Router()

routes.get('/', (req, res) => {
    res.sendFile(__dirname + "/views/index.html");
    // return res.send("OIE")
})

routes.get('/index.html', (req, res) => {
    res.redirect('/')
})


module.exports = routes