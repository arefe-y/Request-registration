const { userValidation } = require("../models/secure/UserValidation");
const {
  phoneNumberValidator,
  isPersian,
} = require("@persian-tools/persian-tools");

exports.validate = async (req, res, next) => {
  const errors = [];
  try {


    const validationOfPhoneNumber = phoneNumberValidator(req.body.phone);
    if (validationOfPhoneNumber == false) {
      const error = new Error("شماره تلفن همراه معتبر نمیباشد");
      error.statusCode = 406;
      const message=error.message
      errors.push({message})
    }
    const validationOffullName = isPersian(req.body.fullname);
    if (validationOffullName == false) {
      const error = new Error(
        "نام و نام خانوادگی را به زبان فارسی وارد نمایید"
      );
      error.statusCode = 406;
      const message=error.message
      errors.push({message})
    }
    await userValidation.validate(req.body, { abortEarly: false });
    
    if(errors.length>0){
      const error = new Error("خطا در اعتبارسنجی");
      error.statusCode = 422;
      error.data = errors;
      next(error);
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
    const error = new Error("خطا در اعتبارسنجی");
    error.statusCode = 422;
    error.data = errors;
    next(error);
  }
};
