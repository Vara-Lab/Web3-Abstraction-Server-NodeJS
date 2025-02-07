import { INITIAL_BLOCKS_FOR_VOUCHER, INITIAL_VOUCHER_TOKENS } from "../consts.js";
import { HexString } from "@gear-js/api/types";
import { Request, Response } from "express";
import { sailscalls } from "../config/sailsCalls.js";
import { dataFromJWT, encryptString } from "../utils.js";
import { decodeAddress } from '../utils.js';
import keyringModel from "../models/keyringModel.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import z from "zod";

dotenv.config();

interface JWTData {
    username: string,
    password: string,
    iat: number,
    exp: number
};

const secretKey = process.env.JWT_SECRET as string;

const userDataSchema = z.object({
    username: z.string(),
    password: z.string()
});

const userKeyringAddress = async (req: Request, res: Response) => {
    if (!sailscalls) {
        res.status(500).send('SailsCalls is not ready');
        return;
    }

    const token = req.cookies.token;
    const data = await dataFromJWT(token) as JWTData;

    const hashedUsername = encryptString(data.username);

    const userKeyringAddress = await keyringModel.userKeyringAddress(hashedUsername);

    res.json({ userKeyringAddress });
}

const logoutUser = async (req: Request, res: Response) => {
    res.clearCookie('token');
    res.send('User logged out');
}

const loginUser = async (req: Request, res: Response) => {
    if (!sailscalls) {
        res.status(500).send('SailsCalls is not ready');
        return;
    }

    const data = req.body;
    const result = userDataSchema.safeParse(data);

    if (!result.success) {
        const response = {
            message: 'bad parameters',
            expected: '{ username: string, password: string }',
        };

        res.status(400).send(response);
        return;
    }

    const { username, password } = result.data;

    const hashedUsername = encryptString(username);
    const hashedPassword = encryptString(password);

    const userKeyringAddress = await keyringModel.userKeyringAddress(hashedUsername);

    if (!userKeyringAddress) {
        res.status(401).send('User is not registered');
        return;
    }

    const formatedKeyringData = await keyringModel.userKeyringData(userKeyringAddress as HexString);
    let lockedKeyringData;

    try {
        lockedKeyringData = sailscalls.formatContractSignlessData(
            formatedKeyringData,
            username
        );
        sailscalls.unlockKeyringPair(
            lockedKeyringData,
            hashedPassword
        );

    } catch(e) {
        res.status(401).send({
            message: "Bad credentials"
        });
        return;
    }

    const vouchersId = await sailscalls.vouchersInContract(userKeyringAddress as HexString);

    const token = jwt.sign(
        { 
            username, 
            keyringAddress: userKeyringAddress,
            keyringVoucherId: vouchersId[0], 
            lockedKeyringData,
            password: hashedPassword 
        }, 
        secretKey, 
        { expiresIn: '1h' }
    );

    res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });

    res.send('user logged in successfully');
};

const registerUser = async (req: Request, res: Response) => {
    if (!sailscalls) {
        res.status(500).json({ message: 'SailsCalls is not ready' });
        return;
    }

    const data = req.body;
    const result = userDataSchema.safeParse(data);

    if (!result.success) {
        const response = {
            message: 'bad parameters',
            expected: '{ username: string, password: string }',
        };

        res.status(400).send(response);
        return;
    }

    const { username, password } = result.data;

    const hashedUsername = encryptString(username); //await bcrypt.hash(username, sailsRounds);
    const hashedPassword = encryptString(password); //await bcrypt.hash(password, sailsRounds);

    const userKeyringAddress = await keyringModel.userKeyringAddress(hashedUsername);

    if (userKeyringAddress) {
        res.status(400).json({ message: 'User already exists' });
        return;
    }

    const newKeyringPair = await sailscalls.createNewKeyringPair(username);
    const lockedSignlessAccount = await sailscalls.lockkeyringPair(
        newKeyringPair,
        hashedPassword
    );
    const formatedLockedSignlessAccount = sailscalls.modifyPairToContract(lockedSignlessAccount);
    
    let keyringVoucherId = '';
    try {
        keyringVoucherId = await sailscalls.createVoucher({
            userAddress: decodeAddress(newKeyringPair.address),
            initialExpiredTimeInBlocks: INITIAL_BLOCKS_FOR_VOUCHER,
            initialTokensInVoucher: INITIAL_VOUCHER_TOKENS,
            callbacks: {
                onLoad() { console.log('Issue voucher to signless account...') },
                onSuccess() { console.log('Voucher created for signless account!') },
                onError() { console.log('Error while issue voucher to signless') }
            }
        });
    } catch(e) {
        console.log('Error while issue a voucher to a singless account!');
        console.log(e);
        res.status(500).json({ mesagge: 'Error while issue a voucher to a singless account!' });
        return;
    }

    const response = await keyringModel.registerUser(
        newKeyringPair,
        keyringVoucherId as HexString,
        hashedUsername,
        formatedLockedSignlessAccount
    );

    const token = jwt.sign(
        { 
            username, 
            keyringAddress: decodeAddress(newKeyringPair.address),
            keyringVoucherId, 
            lockedKeyringData: lockedSignlessAccount,
            password: hashedPassword 
        }, 
        secretKey, 
        { expiresIn: '1h' }
    );

    res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });

    res.send('User registered');
};

export default {
    userKeyringAddress,
    loginUser,
    logoutUser,
    registerUser
};