const mongoose = require('mongoose')

const fileSchema = mongoose.Schema({
  fileName:{
    type:String,
    required:true
  },
  path:{
    type:String,
    required:true
  },
  size:{
    type:Number,
    required:true
  },
  uuid:{
    type:String,
    required:true
  },
  sender:{
    type:String
  },
  receiver:{
    type:String
  },

},
{timeStamps:true})


const File = mongoose.model('File',fileSchema)

module.exports = File