var express = require('express');
var router = express.Router();

const userController = require("../controllers/user_controller");

/* User Routes */
// Signup route
router.post('/signup', userController.signup);

// Signin route
router.post('/signin', userController.signin);

module.exports = router;
