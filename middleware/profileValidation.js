const { profileValidation } = require("../models/secure/ProfileValidation");
const {
  isPersian,
  verifyIranianNationalId,
} = require("@persian-tools/persian-tools");

exports.pValidate = async (req, res, next) => {
  const errors = [];
  try {
    await profileValidation.validate(req.body, { abortEarly: false });
    

    const validationOffullName = isPersian(req.body.fullname);
    if (validationOffullName == false) {
      const error = new Error(
        "نام و نام خانوادگی را به زبان فارسی وارد نمایید"
      );
      error.statusCode = 406;
      const message=error.message
      errors.push({message})
    }

    const validationOfNationalCode = verifyIranianNationalId(
      req.body.nationalCode
    );
    if (validationOfNationalCode == false) {
      const error = new Error("کد ملی وارد شده معتبر نمیباشد");
      error.statusCode = 406;
      const message=error.message
      errors.push({message})
    }

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
