import express from 'express';
import {registerController, signinController, testController, forgotPasswordController} from '../controllers/authController.js';
import { requireSignin, isAdmin } from '../middlewares/authMidlleware.js';

//router
const router = express.Router()

//routes
//Register (POST)
router.post('/register', registerController);

//Signin (POST)
router.post('/signin', signinController);

//Forget password (POST)
router.post('/forgotPassword', forgotPasswordController);

//test routes (token, user, admin)
router.get('/test', requireSignin, isAdmin, testController);

//private or protected user auth route
router.get('/user-auth', requireSignin, (req, res) => {
    res.status(200).send({ok: true});
});

//admin auth
router.get('/admin-auth', requireSignin, isAdmin, (req, res) => {
    res.status(200).send({ok: true});
});

export default router;