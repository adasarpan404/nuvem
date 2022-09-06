const {Router} = require('express')
const {signup} = require('../Service/auth.service')
const router = Router();
router.get('/signup', signup)

module.exports = router