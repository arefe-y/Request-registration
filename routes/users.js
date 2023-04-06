const { Router } = require("express");

const userController = require("../controllers/userController");
const { validate } = require("../middleware/userValidations");

const router = new Router();

//POST /users/register
router.post("/register", validate, userController.createUser);

//POST /users/login
router.post("/login", userController.handleLogin);

//POST /users/pass-recovery
router.post("/pass-recovery",userController.passwordRecovery)

//POST /users/profile
router.post("/profile",userController.editProfile)


module.exports = router;


