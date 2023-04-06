const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { formatDate } = require("../utils/moment");
const multer = require("multer");
const sharp = require("sharp");
const shortId = require("shortid");

const User = require("../models/User");
const { fileFilter } = require("../utils/multer");

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

exports.uploadProfilePhoto = (req, res) => {
  const upload = multer({
    limits: { fileSize: 4000000 },
    fileFilter,
  }).single("image");

  upload(req, res, async(err) => {
    console.log(req.file);
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      if (req.file) {
        const fileName = `${shortId.generate()}_${req.file.originalname}`;
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
};
