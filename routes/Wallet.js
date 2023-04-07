const { Router } = require('express');

const walletController = require('../controllers/WalletController');
const { authenticated } = require('../middleware/Auth');

const router = Router()

//GET /wallet/report
router.get('/report', authenticated, walletController.walletReport)

//POST /wallet/charge
router.post("/charge", authenticated, walletController.chargeWallet)

module.exports = router