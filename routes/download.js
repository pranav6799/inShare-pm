const express = require('express')
const router = express.Router()
const File = require('../model/file')
const path = require('path')
const {v4: uuid4 } = require('uuid')


router.get('/:uuid', async (req,resp)=>{
  const file = await File.findOne({uuid:req.params.uuid})
   
  if(!file) return resp.render('download', {error:'File not found'})

  const filePath = `${__dirname}/../${file.path}`

  resp.download(filePath)
})



module.exports = router