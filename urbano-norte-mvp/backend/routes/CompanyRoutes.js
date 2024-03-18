const route = require('express').Router();
const verifyToken = require('../helpers/check-token')
const CompanyController = require('../controllers/CompanyController');

route.post('/create', verifyToken, CompanyController.create);
route.get('/', verifyToken, CompanyController.getAll);
route.get('/:id', verifyToken, CompanyController.getById);
route.get('/getbyname/:name', verifyToken, CompanyController.getByName);
route.patch('/update/:id', verifyToken, CompanyController.update);
route.delete('/delete/:id', verifyToken, CompanyController.delete);


module.exports = route;