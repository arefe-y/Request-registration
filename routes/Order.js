const { Router } = require('express');

const { authenticated } = require('../middleware/Auth');
const { orderValidate } = require('../middleware/OrderValidations')
const orderController = require('../controllers/OrderController');

const router = new Router()

//GET /orders/report
router.get("/report", authenticated, orderController.recieptReport)

//POST /orders/new-order
router.post("/new-order", authenticated, orderValidate, orderController.newOrder)

module.exports = router