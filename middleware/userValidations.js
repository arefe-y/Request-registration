const {userValidation } = require("../models/secure/userValidation");
const {
  phoneNumberValidator,
  isPersian,
} = require("@persian-tools/persian-tools");

exports.validate = async (req, res, next) => {
  const errors = [];
  try {
    await userValidation.validate(req.body, { abortEarly: false });

    const validationOfPhoneNumber=phoneNumberValidator(req.body.phone)
    if(validationOfPhoneNumber==false){
      const error=new Error("شماره تلفن همراه معتبر نمیباشد")
      error.statusCode=406
      throw error
    }
    const validationOffullName=isPersian(req.body.fullname)
    if(validationOffullName==false){
      const error=new Error("نام و نام خانوادگی را به زبان فارسی وارد نمایید")
      error.statusCode=406
      throw error
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
    const error=new Error()
    error.statusCode=406
    error.data=errors
    next(error)

    return res.render("register", {
      pageTitle: "ثبت نام کاربر",
      path: "/register",
      errors,
    });
  }
};
