const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { formatDate } = require("../utils/Moment");
const multer = require("multer");
const sharp = require("sharp");
const shortId = require("shortid");

const User = require("../models/User");
const { fileFilter } = require("../utils/Multer");

exports.createUser = async (req, res, next) => {
  try {
    const { fullname, phone, password } = req.body;

    const user = await User.findOne({ phone });

    if (user) {
      const error = new Error(
        "کاریری با این شماره موبایل در پایگاه داده موجود است"
      );
      error.statusCode = 422;
      throw error;
    } else {
      await User.create({
        fullname,
        phone,
        password,
      });
      res.status(201).json({ message: "عضویت موفقیت آمیز بود" });
    }
  } catch (err) {
    next(err);
  }
};

exports.handleLogin = async (req, res, next) => {
  const { phone, password } = req.body;

  try {
    const user = await User.findOne({ phone });

    if (!user) {
      const error = new Error("کاربری با این شماره موبایل یافت نشد");
      error.statusCode = 404;
      throw error;
    }

    const isEqual = await bcrypt.compare(password, user.password);

    if (isEqual) {
      const token = jwt.sign(
        {
          user: {
            userId: user._id.toString(),
            fullname: user.fullname,
            phone: user.phone,
            role:user.role
          },
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );
      res.status(200).json({ token });
    } else {
      const error = new Error("شماره تلفن یا رمز عبور اشتباه است");
      error.statusCode = 422;
      throw error;
    }
  } catch (err) {
    next(err);
  }
};

exports.changePassword = async (req, res, next) => {
  let { oldPass, newPass } = req.body;
  try {
    const user = await User.findOne({ _id: req.payload.userId });

    const isEqual = await bcrypt.compare(oldPass, user.password);

    if (isEqual) {
      const hashedPassword = await new Promise((resolve, reject) => {
        bcrypt.hash(newPass, 10, function (err, hash) {
          if (err) reject(err);
          resolve((newPass = hash));
        });
      });

      await user.updateOne({ password: hashedPassword });

      res.status(200).json({ message: "بازیابی رمز عبور با موفقیت انجام شد" });
    } else {
      const error = new Error("رمز فعلی درست نمیباشد");
      error.statusCode = 402;
      throw error;
    }
  } catch (err) {
    next(err);
  }
};

exports.editProfile = async (req, res, next) => {
  let userBirthDay;
  try {
    const user = await User.findOne({ _id: req.payload.userId });

    const { fullname, email, nationalCode, birthDate } = req.body;

    if (birthDate) {
      userBirthDay = formatDate(birthDate);
    }

    user.fullname = fullname;
    user.email = email;
    user.birthDate = userBirthDay;
    user.nationalCode = nationalCode;

    await user.updateOne({ email, fullname, birthDate, nationalCode });

    res.status(200).json({ message: "حساب کاربری شما با موفقیت ویرایش شد" });
  } catch (err) {
    next(err);
  }
};

exports.uploadProfilePhoto = async (req, res, next) => {
  let fileName;
  const upload = multer({
    limits: { fileSize: 4000000 },
    fileFilter,
  }).single("image");

  upload(req, res, async (err) => {
    console.log(req.file);
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      if (req.file) {
        fileName = `${shortId.generate()}_${req.file.originalname}`;
        await sharp(req.file.buffer)
          .jpeg({
            quality: 60,
          })
          .toFile(`./public/uploads/${fileName}`)
          .catch((err) => console.log(err));
        res
          .status(200)
          .json({ image: `http://localhost:3000/uploads/${fileName}` });
      } else {
        res.status(400).json({ error: "جهت آپلود باید عکسی انتخاب کنید" });
      }
    }
  });

  try {
    const user = await User.findOne({ _id: req.payload.userId });

    await user.updateOne({ profilePhoto: fileName });
  } catch (err) {
    next(err);
  }
};

exports.forgetPassword = async (req, res, next) => {
  try {
    const { phone } = req.body;

    const user = await User.findOne({ phone });

    if (!user) {
      res.status(406).json({
        error: "کاربری با این شماره موبایل در پایگاه داده وجود ندارد",
      });
    } else {
      const token = jwt.sign(
        {
          user: {
            userId: user._id.toString(),
          },
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      const resetLink = `http://localhost:3000/users/reset-password/${token}`;

      res.status(200).json({ resetLink });
    }
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = (req, res, next) => {
  const token = req.params.token;
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  if (!decodedToken) {
    res.status(404).json({ error: "404" });
  } else {
    const id = decodedToken.user.userId;
    const resetLink = `http://localhost:3000/users/reset-pass/${id}`;
    res.status(200).json({ resetLink });
  }
};

exports.handleResetPassword = async (req, res) => {
  const { password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    res.status(406).json({ error: "کلمه های عبور یکسان نیستند" });
  }

  const user = await User.findOne({ _id: req.params.id });

  if (!user) {
    res.status(404).json({ error: "404" });
  }

  user.password = password;
  await user.save();

  res.status(200).json({ error: "پسوورد شما با موفقیت بروزرسانی شد" });
};
