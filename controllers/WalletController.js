const Wallet = require('../models/Wallet');

exports.chargeWallet = async (req, res, next) => {
    const { Amount } = req.body
    try {

        const wallet = await Wallet.findOne({ user: req.payload.userId })

        if (!wallet) {
            await Wallet.create({ Amount, user: req.payload.userId })
            res.status(200).json({ message: "شارژ حساب با موفقیت انجام شد" })
        } else {
            const amount = wallet.Amount + Amount
            await wallet.updateOne({ Amount: amount })
            res.status(200).json({ message: "شارژ حساب با موفقیت انجام شد" })
        }

    } catch (err) {
        next(err)
    }

}

exports.walletReport = async (req, res) => {

    const wallet = await Wallet.findOne({ user: req.payload.userId })
    const walletAmount = wallet.Amount

    if (walletAmount < 100000) {
        const result = `موجودی کیف پول شما ${walletAmount} لطفا نسبت به شارژ کیف پول خود اقدام نمایید `
        res.status(200).json({ result })
    }

    const result = `موجودی کیف پول شما ${walletAmount}`
    res.status(200).json({ result })
}