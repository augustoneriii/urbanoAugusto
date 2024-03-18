const router = require('express').Router()

const PacoteController = require('../controllers/PacoteController')

// middlewares
const verifyToken = require('../helpers/check-token')

router.post('/create', verifyToken, PacoteController.create);
router.get('/', PacoteController.getAll)
router.get('/:id', PacoteController.getById)
router.patch('/update/:id', verifyToken, PacoteController.update)
router.delete('/delete/:id', verifyToken, PacoteController.delete)
router.get('/getbyname/:name', PacoteController.getByName)

module.exports = router 