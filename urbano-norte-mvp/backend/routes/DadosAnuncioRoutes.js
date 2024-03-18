const router = require('express').Router()

const DadosAnuncioController = require('../controllers/DadosAnuncioController')

// middlewares
const verifyToken = require('../helpers/check-token')

router.post('/create', verifyToken, DadosAnuncioController.create);
router.get('/', verifyToken, DadosAnuncioController.getAll)
router.get('/:id', verifyToken, DadosAnuncioController.getById)
router.patch('/update/:id', verifyToken, DadosAnuncioController.update)
router.delete('/delete/:id', verifyToken, DadosAnuncioController.delete)
router.patch('/incrementview/:id', verifyToken, DadosAnuncioController.incrementView)

module.exports = router