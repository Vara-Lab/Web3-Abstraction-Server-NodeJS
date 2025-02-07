import trafficLightController from '../controllers/trafficLightContractController.js';
import middlewares from '../middleware/jwtMiddleware.js';
import express from 'express';

export const router = express.Router();

router.post('/green', middlewares.userIsLoggedIn, trafficLightController.sendGreen);
router.post('/red', middlewares.userIsLoggedIn, trafficLightController.sendRed);
router.post('/yellow', middlewares.userIsLoggedIn, trafficLightController.sendYellow);
router.get('/state', trafficLightController.readState);