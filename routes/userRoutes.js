import express from 'express';
import {  UserRegistrationController, changePassword, loggedUser, loginController, resetPasswordthrougEmail } from '../controllers/userAuthController.js';
import { userAuth } from '../middleware/authMiddleware.js';
const router  = express.Router();

router.use('/changepassword',userAuth)
router.use('/loggeduser',userAuth)

router.post('/regsister',UserRegistrationController);
router.post('/login',loginController);
router.post('/changepassword',changePassword)
router.get('/loggeduser',loggedUser)
router.post('/send-reset-password-email',resetPasswordthrougEmail)
export default router