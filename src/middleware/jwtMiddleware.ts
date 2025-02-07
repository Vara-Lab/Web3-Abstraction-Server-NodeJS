import { Request, Response, NextFunction } from "express";
import { dataFromJWT } from "../utils.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const secretKey = process.env.JWT_SECRET as string;

const userIsAlreadyLoggedIn = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;

    if (token) {
        const data = await dataFromJWT(token);

        console.log(data);
        
        if (data) {
            res.clearCookie('token');
            res.status(400).json({ message: 'user is already logged in' });
            return;
        }
    }

    next();
}

const userIsLoggedIn = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;

    if (!token) {
        res.status(401).json({ message: 'user is not logged in' });
        return;
    }

    console.log('Token: ', token);
    next();
};

const verifyExistingJWT = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;

    if (token) {
        const tokenValue = await dataFromJWT(token);

        if (tokenValue) {
            next();
            return;
        }
    } 

    res.status(401).json({ message: 'user is not logged in' });
};

export default {
    userIsLoggedIn,
    userIsAlreadyLoggedIn,
    verifyExistingJWT
}