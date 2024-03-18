const multer = require('multer')
const path = require('path')


const imageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        let folder = '' //folder é pasta

        if (req.baseUrl.includes('users')) {
            folder = 'users'
        } else if (req.baseUrl.includes('anuncio')) {
            folder = 'anuncio'
        }

        cb(null, `public/image/${folder}`)
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const imageUpload = multer({
    storage: imageStorage,
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg|mp4|jpeg|bpm|gif|webp|mp4)$/)) {
            return cb(new Error('Por favor, envie apenas png|jpg|mp4|jpeg|bpm|gif|webp'))
        }
        cb(null, true)
    }
})

module.exports = imageUpload 
