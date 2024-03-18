const router = require('express').Router()

const AnuncioController = require('../controllers/AnuncioController')

// middlewares
const verifyToken = require('../helpers/check-token')
const imageUpload = require('../helpers/image-upload')

router.post('/create', verifyToken, imageUpload.array('images'), AnuncioController.create);
router.get('/', AnuncioController.getAll)
router.get('/myads', AnuncioController.getAllUserAd)
router.get('/getbyid/:id', AnuncioController.getAdById)
router.delete('/delete/:id', verifyToken, AnuncioController.removeAdById)
router.patch('/:id', verifyToken, imageUpload.array('images'), AnuncioController.updateAnuncio)

module.exports = router
