const Yup = require("yup");

exports.userValidation = Yup.object().shape({
  fullname: Yup.string()
    .required("نام و نام خانوادگی الزامی میباشد")
    .min(5, "نام و نام خانوادگی نباید کمتر از 5 کاراکتر باشد")
    .max(50, "نام و نام خانوادگی نباید بیشتر از 50 کاراکتر باشد"),
  phone: Yup.number().required("شماره تلفن همراه الزامی میباشد"),
  password: Yup.string()
    .required("کلمه عبور الزامی میباشد")
    .min(4, "کلمه عبور نباید کمتر از 4 کاراکتر باشد")
    .max(10, "کلمه عبور نباید بیشتر از 10 کاراکتر باشد"),
  confirmPassword: Yup.string()
    .required("تکرار کلمه عبور الزامی میباشد")
    .oneOf([Yup.ref("password"), null], "کلمه های عبور یکسان نیستند"),

  email:Yup.string().email("ایمیل معتبر نمیباشد")
});
