const express = require('express');
const router = express.Router();

router.all('/users', require('../controllers/users.controller'));

module.exports = router;
