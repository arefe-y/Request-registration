const Yup = require("yup");

exports.profileValidation = Yup.object().shape({
  fullname: Yup.string().min(5, "نام و نام خانوادگی نباید کمتر از 5 کاراکتر باشد").max(50, "نام و نام خانوادگی نباید بیشتر از 50 کاراکتر باشد"),

  email: Yup.string().email("ایمیل معتبر نمیباشد"),
  birthDate: Yup.date(),
  profilePhoto: Yup.object().shape({
    name: Yup.string(),
    size: Yup.number().max(3000000, "عکس نباید بیشتر از 3 مگابایت باشد"),
    mimetype: Yup.mixed().oneOf(
      ["image/jpeg", "image/png"],
      "تنها پسوندهای png و jpeg پشتیبانی می شوند"
    ),
  }),
});
