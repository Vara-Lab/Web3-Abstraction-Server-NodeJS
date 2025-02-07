import { GearApi, GearKeyring } from "@gear-js/api";
import { HexString } from "@gear-js/api/types";
import { KeyringPair } from '@polkadot/keyring/types';
import { Keyring } from "@polkadot/api";
import { u8aToHex } from '@polkadot/util';
import CryptoJs from 'crypto-js';
import dotenv from 'dotenv'; 
import jwt from 'jsonwebtoken';
// import { Sails } from "sails-js";
// import { SailsIdlParser } from "sails-js-parser";

dotenv.config();
const secretKey = process.env.JWT_SECRET as string;

// Function that create a GearApi instance with the given network
export const createGearApi = (network: string): Promise<GearApi> => {
    return new Promise(async (resolve, reject) => {
        try {
            const api = await GearApi.create({
                providerAddress: network
            });

            resolve(api);
        } catch(e) {
            reject(e);
        }    
    });
}

// Function that returns the signer from wallet name and mneminic
export const gearKeyringByWalletData = (walletName: string, walletMenemonic: string): Promise<KeyringPair> => {
    return new Promise(async (resolve, reject) => {
        try {
            const signer = await GearKeyring.fromMnemonic(walletMenemonic, walletName);
            resolve(signer);
        } catch(e) {
            reject(e);
        }
    });
}

// Function that returns the signer from wallet name and mnemonic
export const keyringByWalletData = (walletName: string, walletMenemonic: string): Promise<KeyringPair> => {
    return new Promise(async (resolve, reject) => {
        try {
            const keyring = new Keyring({ type: 'sr25519', ss58Format: 42 });
            const signer = keyring.addFromMnemonic(walletMenemonic);
            resolve(signer);
        } catch(e) {
            reject(e);
        }
    });
}

export const dataFromJWT = (token: string) => {
    return new Promise((resolve) => {
        // Check the actual token
        jwt.verify(token, secretKey, (err, user) => {
            if (err) {
                // El token no es valido o expiro, se reedirecciona
                // al apartado del regiostro o inicio de sesion
                resolve(null);
                return;
                // return res.status(403).json({ message: 'Token no válido o ha expirado' });
            }

            // req.user = user; // Guardar la información del usuario
            resolve(user);
        });
    });
}

export const decodeAddress = (publicKey: string): HexString => {
    return u8aToHex(new Keyring().decodeAddress(publicKey));
}

export const encryptString = (name: string) => {
    return CryptoJs.SHA256(name).toString();
}

// Function that reuturns a Sails intance from given GearApi, network, contractId and idl
// export const sailsInstance = (api: GearApi, network: string, contractId: HexString, idl: string): Promise<Sails> => {
//     return new Promise(async (resolve, reject) => {
//         const parser = await SailsIdlParser.new();
//         const sails = new Sails(parser);

//         try {
//             sails.setApi(api);
//             sails.setProgramId(contractId);
//             sails.parseIdl(idl);

//             resolve(sails);
//         } catch (e) {
//             reject(e);
//         }
//     });
// }