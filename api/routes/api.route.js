const express = require('express');
const router = express.Router();

router.use('/register', require('../controllers/register.controller'));
router.use('/login', require('../controllers/login.controller'));
router.use('/profile', require('../controllers/profile.controller'));
router.use('/polls', require('../controllers/poll.controller'));

module.exports = router;
