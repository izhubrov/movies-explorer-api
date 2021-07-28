const router = require('express').Router();
const celebrateValidation = require('../helpers/celebrateValidation');

const {
  readCurrentUserInfo, setUserInfo,
} = require('../controllers/users');

router.get('/me', readCurrentUserInfo);
router.patch('/me', celebrateValidation({ body: { email: null, name: null } }), setUserInfo);
module.exports = router;
