const Order = require('../models/order');
const TransactionReceipt = require('../models/TransactionReceipt');
const Wallet = require('../models/Wallet');
const Counter = require('../models/Counter');


exports.newOrder = async (req, res, next) => {
    const { title, description,amount } = req.body
    let dbcounter = []

    try {
        const wallet = await Wallet.findOne({ user: req.payload.userId })
        if (!wallet) {
            return res.status(400).json({ error: "لطفا ابتدا کیف پول خود را شارژ نمایید" })
        } else {
            if (wallet.Amount >= amount) {
                const updateAmount = wallet.Amount - amount

                const date = new Date()
                const year = date.getFullYear()
                const month = ("0" + (date.getMonth() + 1)).slice(-2);

                dbcounter = await Counter.find()
                if (dbcounter.length <= 0) {
                    await Counter.create({ counter: 30000 })
                    dbcounter = await Counter.find()
                }
                const code = `${year}-${month}-${dbcounter[0].counter}`



                await wallet.updateOne({ Amount: updateAmount })

                const createNewOrder = await Order.create({
                    title,
                    description,
                    uniqueCode: code,
                    user: req.payload.userId
                })

                const orderReciept = await TransactionReceipt.create({
                    Amount: amount,
                    status: "successful",
                    wallet: wallet._id,
                    order: createNewOrder._id
                })

                await dbcounter[0].updateOne({ counter: (dbcounter[0].counter) + 1 })

                res.status(200).json({ message: "درخواست شما با موفقیت ثبت شد" })
            } else {
                res.status(406).json({ message: "موجودی کیف پول شما برای ثبت درخواست کافی نمیباشد لطفا نسبت به شارژ کیف پول خود اقدام نمایید " })
            }

        }




    } catch (err) {
        next(err)
    }
}

exports.recieptReport = async (req, res) => {
    let result=[];
    const wallet = await Wallet.findOne({ user: req.payload.userId })
    const TReciepts = await TransactionReceipt.find({ $and: [{ wallet: wallet._id }, { status: "successful" }] })

    if (TReciepts.length > 0) {
        TReciepts.forEach(Treciept => {
            result.push(Treciept.Amount)
            result.push(Treciept.status)
            result.push(Treciept.date)

        });
        res.status(200).json({ result })

    } else {
        res.status(403).json({ message: "رسیدی در پایگاه داده برای شما وجود ندارد" })
    }
}