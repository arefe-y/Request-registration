const { Router } = require("express");

const userController = require("../controllers/UserController");
const { validate } = require("../middleware/UserValidations");
const { authenticated } = require("../middleware/Auth");
const { pValidate } = require("../middleware/ProfileValidation");

const router = new Router();

//POST /users/register
router.post("/register", validate, userController.createUser);

//POST /users/login
router.post("/login", userController.handleLogin);

//PUT /users/change-pass
router.put("/change-pass", authenticated, userController.changePassword);

//PUT /users/edit-profile
router.put(
  "/edit-profile",
  authenticated,
  pValidate,
  userController.editProfile
);

//POST /users/upload-photo
router.post("/upload-photo", authenticated,userController.uploadProfilePhoto);

//POST /users/forget-password
router.post("/forget-password",userController.forgetPassword)

//POST /users/reset-password/:token
router.post("/reset-password/:token",userController.resetPassword)

//PUT /users/reset-password/:id
router.put("/reset-pass/:id",userController.handleResetPassword)

module.exports = router;
