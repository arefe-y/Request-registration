const { orderValidation } = require("../models/secure/OrderValidation");
const {isPersian} = require("@persian-tools/persian-tools");

exports.orderValidate = async (req, res, next) => {
  const errors = [];
  try {
    await orderValidation.validate(req.body, { abortEarly: false });

    const validationOfTitle= isPersian(req.body.title);
    if (validationOfTitle == false) {
      const error = new Error(
        "عنوان را به زبان فارسی وارد کنید "
      );
      error.statusCode = 406;
      throw error;
    }

    const validationOfDescription = isPersian(req.body.description);
    if (validationOfDescription == false) {
      const error = new Error("توضیحات را به زبان فارسی وارد کنید");
      error.statusCode = 406;
      throw error;
    }

    next();
  } catch (err) {
    console.log(err);
    err.errors.forEach((e) => {
      errors.push({
        name: e.path,
        message: e,
      });
    });
    const error = new Error();
    error.statusCode = 406;
    error.data = errors;
    next(error);
  }
};
