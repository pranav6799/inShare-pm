const express = require('express')
const router = express.Router()
const File = require('../model/file')


router.get('/:uuid', async (req, resp) => {
  try {
    const file = await File.findOne({
      uuid: req.params.uuid
    })
    if (!file) return resp.render('download', {
      error: 'Link has expired'
    })

    resp.render('download', {
      uuid: file.uuid,
      fileName: file.fileName,
      fileSize: file.size,
      downloadLink: `${process.env.APP_BASE_URL}/files/download/${file.uuid}`
    })


  } catch (err) {
    return resp.render('download', {
      error: 'Something went wrong'
    })
  }


})

module.exports = router