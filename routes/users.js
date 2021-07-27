const router = require('express').Router();
const celebrateValidation = require('../helpers/celebrateValidation');

const {
  readUsers, readUserInfo, readCurrentUserInfo, setUserInfo, setUserAvatar,
} = require('../controllers/users');

router.get('/', readUsers);
router.get('/me', readCurrentUserInfo);
router.get('/:userId', celebrateValidation({ params: { userId: null } }), readUserInfo);
router.patch('/me', celebrateValidation({ body: { name: null, about: null } }), setUserInfo);
router.patch('/me/avatar', celebrateValidation({ body: { avatar: null } }), setUserAvatar);

module.exports = router;
