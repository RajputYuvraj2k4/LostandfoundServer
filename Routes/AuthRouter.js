const { signup } = require('../Controllers/AuthController');
const { signupValidation } = require('../Middlewares/AuthValidations');
const { login } = require('../Controllers/AuthController');
const { loginValidation } = require('../Middlewares/AuthValidations');

const router = require('express').Router();

router.post('/login', loginValidation, login);
router.post('/signup', signupValidation, signup);

module.exports = router;