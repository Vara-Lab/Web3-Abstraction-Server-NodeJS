import { Request, Response } from "express";
import { dataFromJWT, encryptString } from "../utils.js";
import { sailscalls } from "../config/sailsCalls.js";
import type { HexString } from "@gear-js/api/types";
import type { KeyringPair$Json } from '@polkadot/keyring/types';
import trafficLightContractModel from "../models/trafficLightContractModel.js";

interface JWTData {
    username: string,
    keyringAddress: HexString,
    keyringVoucherId: string,
    lockedKeyringData: KeyringPair$Json,
    password: string,
    iat: number,
    exp: number
}   

const sendGreen = async (req: Request, res: Response) => {
    if (!sailscalls) {
        res.status(500).send('SailsCalls is not ready');
        return;
    }

    const token = req.cookies.token;
    const userData = await dataFromJWT(token) as JWTData;

    try {
        const voucherBalance = await sailscalls.voucherBalance(userData.keyringVoucherId as HexString);

        if (voucherBalance < 1) {
            await sailscalls.addTokensToVoucher({
                userAddress: userData.keyringAddress,
                voucherId: userData.keyringVoucherId,
                numOfTokens: 1
            });
        }
    } catch(e) {
        res.status(500).send('Error while trying to add tokens to voucher: ' + JSON.stringify(e));
        return;
    }

    try {
        const voucherIsExpired = await sailscalls.voucherIsExpired(userData.keyringAddress, userData.keyringVoucherId as HexString);

        if (voucherIsExpired) {
            await sailscalls.renewVoucherAmountOfBlocks({
                userAddress: userData.keyringAddress,
                voucherId: userData.keyringVoucherId,
                numOfBlocks: 1_200
            });
        }
    } catch (e) {
        res.status(500).send('Error while renewing voucher: ' + JSON.stringify(e));
        return;
    }

    const unlockKeyringData = sailscalls.unlockKeyringPair(userData.lockedKeyringData, userData.password);

    const response = await trafficLightContractModel.sendGreen(encryptString(userData.username), userData.keyringVoucherId as HexString, unlockKeyringData)

    res.send('Response: ' + JSON.stringify(response));
};

const sendYellow = async (req: Request, res: Response) => {
    if (!sailscalls) {
        res.status(500).send('SailsCalls is not ready');
        return;
    }

    const token = req.cookies.token;
    const userData = await dataFromJWT(token) as JWTData;

    try {
        const voucherBalance = await sailscalls.voucherBalance(userData.keyringVoucherId as HexString);

        if (voucherBalance < 1) {
            await sailscalls.addTokensToVoucher({
                userAddress: userData.keyringAddress,
                voucherId: userData.keyringVoucherId,
                numOfTokens: 1
            });
        }
    } catch(e) {
        res.status(500).send('Error while trying to add tokens to voucher: ' + JSON.stringify(e));
        return;
    }

    try {
        const voucherIsExpired = await sailscalls.voucherIsExpired(userData.keyringAddress, userData.keyringVoucherId as HexString);

        if (voucherIsExpired) {
            await sailscalls.renewVoucherAmountOfBlocks({
                userAddress: userData.keyringAddress,
                voucherId: userData.keyringVoucherId,
                numOfBlocks: 1_200
            });
        }
    } catch (e) {
        res.status(500).send('Error while renewing voucher: ' + JSON.stringify(e));
        return;
    }

    const unlockKeyringData = sailscalls.unlockKeyringPair(userData.lockedKeyringData, userData.password);

    const response = await trafficLightContractModel.sendYellow(encryptString(userData.username), userData.keyringVoucherId as HexString, unlockKeyringData)

    res.send('Response: ' + JSON.stringify(response));
}

const sendRed = async (req: Request, res: Response) => {
    if (!sailscalls) {
        res.status(500).send('SailsCalls is not ready');
        return;
    }

    const token = req.cookies.token;
    const userData = await dataFromJWT(token) as JWTData;

    try {
        const voucherBalance = await sailscalls.voucherBalance(userData.keyringVoucherId as HexString);

        if (voucherBalance < 1) {
            await sailscalls.addTokensToVoucher({
                userAddress: userData.keyringAddress,
                voucherId: userData.keyringVoucherId,
                numOfTokens: 1
            });
        }
    } catch(e) {
        res.status(500).send('Error while trying to add tokens to voucher: ' + JSON.stringify(e));
        return;
    }

    try {
        const voucherIsExpired = await sailscalls.voucherIsExpired(userData.keyringAddress, userData.keyringVoucherId as HexString);

        if (voucherIsExpired) {
            await sailscalls.renewVoucherAmountOfBlocks({
                userAddress: userData.keyringAddress,
                voucherId: userData.keyringVoucherId,
                numOfBlocks: 1_200
            });
        }
    } catch (e) {
        res.status(500).send('Error while renewing voucher: ' + JSON.stringify(e));
        return;
    }

    const unlockKeyringData = sailscalls.unlockKeyringPair(userData.lockedKeyringData, userData.password);

    const response = await trafficLightContractModel.sendRed(encryptString(userData.username), userData.keyringVoucherId as HexString, unlockKeyringData)

    res.send('Response: ' + JSON.stringify(response));
}

const readState = async (req: Request, res: Response) => {
    const response = await trafficLightContractModel.readState();

    res.send('Response: ' + JSON.stringify(response));
}

export default {
    sendGreen,
    sendYellow,
    sendRed,
    readState
};