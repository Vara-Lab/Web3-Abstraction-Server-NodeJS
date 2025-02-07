import keyringController from '../controllers/keyringController.js';
import jwtMiddleware from '../middleware/jwtMiddleware.js';
import express from 'express';

export const router = express.Router();

router.get('/keyringAddress', jwtMiddleware.verifyExistingJWT, keyringController.userKeyringAddress);

// Path to login the user with user and password
router.post('/login', jwtMiddleware.userIsAlreadyLoggedIn, keyringController.loginUser); 

router.post('/register', jwtMiddleware.userIsAlreadyLoggedIn, keyringController.registerUser);

router.post('/logout', jwtMiddleware.verifyExistingJWT, keyringController.logoutUser);

router.get('/info', async (req, res) => {
    res.send('Account info');
});