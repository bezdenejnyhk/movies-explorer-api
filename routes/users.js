const userRouter = require('express').Router();
const { editProfileDataValid } = require('../utils/validation');

const { getMe, editProfile } = require('../controllers/users');

// запрос моего пользователя
userRouter.get('/me', getMe);

// запрос на изменение данных пользователя
userRouter.patch('/me', editProfileDataValid, editProfile);

module.exports = userRouter;
