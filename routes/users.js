const { Router } = require("express");
const multer=require('multer');

const userController = require("../controllers/userController");
const { validate } = require("../middleware/userValidations");
const { authenticated } = require("../middleware/auth");
const { pValidate } = require("../middleware/profileValidation");

const router = new Router();
const upload=multer()

//POST /users/register
router.post("/register", validate, userController.createUser);

//POST /users/login
router.post("/login", userController.handleLogin);

//POST /users/change-pass
router.post("/change-pass", authenticated, userController.changePassword);

//POST /users/edit-profile
router.post(
  "/edit-profile",
  authenticated,
  pValidate,
  userController.editProfile
);

//POST /users/upload-photo
router.post("/upload-photo", authenticated,userController.uploadProfilePhoto);

module.exports = router;
