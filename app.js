const express = require('express')
const morgan = require("morgan")
const expressValidator = require("express-validator");
const dotenv = require('dotenv')
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
var cookieParser = require('cookie-parser')
const cors = require('cors')
const fs = require('fs')

const app = express()

dotenv.config()

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true}).then(() => {
    console.log("DB connected")
})

mongoose.connection.on('error', err => {
    console.log(`DB connection error: ${err.message}`)
})

const postRoutes = require(__dirname+"/routes/post")
const authRoutes = require(__dirname+"/routes/auth")
const userRoutes = require(__dirname+"/routes/user")

app.get('/', (req, res) => {
    fs.readFile("docs/apiDocs.json", (err, data) => {
        if(err) {
            res.status(400).json({
                err
            })
        }
        const docs = JSON.parse(data)
        res.json(docs)
    })
})

app.use(morgan("dev"))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(expressValidator())
app.use(cors())
app.use("/", postRoutes)
app.use("/", authRoutes)
app.use("/", userRoutes)
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({error: 'Unauthorized !'})
    }
})

const port = process.env.PORT || 8080
app.listen(port, ()=>{
    console.log("A node js api is start server !")
})