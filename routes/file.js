const express = require('express')
const dotenv = require('dotenv').config()
const router = express.Router()
const multer = require('multer')
const path = require('path')
const File = require('../model/file')
const {v4: uuid4 } = require('uuid')

let storage = multer.diskStorage({
  destination: (req,file,cb) => cb(null,'uploads'),
  filename : (req,file,cb)=> {
    const uniqueName = `${Date.now()}-${Math.round(Math.random()*1E9)}${path.extname(file.originalname)}`
    cb(null,uniqueName)
  }
})


let upload = multer({
  storage,
  limit:{fileSize:1000000*100}
}).single('file')



router.post('/', (req,resp)=>{
//Store file
upload(req,resp,async (err) => {

//validate request
if(!req.file){
  resp.status(400).json({error:'All fields are required'})
 }


if(err) resp.status(500).send({error:err.message})

//Store file in DB
const file = new File({
  fileName: req.file.filename,
  uuid:uuid4(),
  path:req.file.path,
  size: req.file.size
})

const response = await file.save()
return resp.json({file:`${process.env.APP_BASE_URL}/files/${response.uuid}`})

})


})


router.post('/send',async(req,resp)=>{
  const {uuid,emailTo,emailFrom} = req.body
  if(!uuid || !emailTo || !emailFrom) return resp.status(422).send({error:'All Fields are required'})

//Get data from database 
const file = await File.findOne({uuid:uuid})
if(file.sender) {
  return resp.status(401).send({error:'Email already sent'})
}

file.sender = emailFrom
file.receiver = emailTo
const response = await file.save()

//Send Email
const sendEmail = require('../services/emailService')

sendEmail({
  from:emailFrom,
  to:emailTo,
  subject:'inShare file sharing',
  text:`${emailFrom} shared a file with you.`,
  html:require('../services/emailTemplate')({
    emailFrom:emailFrom,
    downloadLink:`${process.env.APP_BASE_URL}/files/${file.uuid}`,
    size: parseInt(file.size/1000)+ 'KB',
    expires:'24 hours'
  })
})

return resp.send({success:true})


})

module.exports = router