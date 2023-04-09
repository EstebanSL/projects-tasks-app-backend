import express from 'express';
import {
  confirmToken,
  getProfile,
  loginUser,
  registerUser,
  resetPassword,
  saveNewPassword,
  verifyToken,
} from '../controller/userController.js';
import checkAuth from '../middlewares/checkauth.js';

const router = express.Router();

router.post('/', registerUser);
router.post('/login', loginUser);
router.post('/reset-password', resetPassword);
router.get('/confirm/:token', confirmToken);
router.route('/reset-password/:token').get(verifyToken).post(saveNewPassword)

router.get('/profile', checkAuth, getProfile)
export default router;
