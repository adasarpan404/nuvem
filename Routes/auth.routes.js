const {Router} = require('express')
const {signup, login} = require('../Service/auth.service')
const router = Router();
router.post('/signup', signup)
router.post('/login', login)

module.exports = router