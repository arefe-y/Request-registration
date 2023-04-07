const Yup = require('yup');

exports.orderValidation = Yup.object().shape({
    title: Yup.string()
        .required("وارد کردن عنوان الزامی میباشد")
        .min(5, "عنوان نباید کمتر از 5 کاراکتر باشد")
        .max(50, "عنوان نباید بیشتر از 50 کاراکتر باشد"),
    description: Yup.string()
        .required("وارد کردن توضیحات الزامی میباشد")
        .min(5, "توضیحات نباید کمتر از 5 کاراکتر باشد")
        .max(255, "توضیحات نباید بیشتر از 255 کاراکتر باشد"),
});