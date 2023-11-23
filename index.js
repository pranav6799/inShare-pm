const express = require('express')
const dotenv = require('dotenv').config()
const app = express()
const connectDB = require('./config/db')
const ejs = require('ejs')
const path = require('path')

const PORT = process.env.PORT || 7001
app.use(express.static('public'))
app.use(express.json())

connectDB()



app.set('views',path.join(__dirname,'/views'))
app.set('view engine', 'ejs')

//Routes 
app.use('/api/files',require('./routes/file'))
app.use('/files',require('./routes/show'))
app.use('/files/download',require('./routes/download'))

app.listen(PORT, () => {
  console.log(`Server running on port:${PORT}`)
})