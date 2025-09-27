const multer  = require('multer')
const path =require('path')
const { v4:uuidv4 } = require('uuid')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname)
    const newName = `${uuidv4()}${ext}`
    cb(null, newName)
  }
})

const upload = multer({ storage: storage })

module.exports=upload