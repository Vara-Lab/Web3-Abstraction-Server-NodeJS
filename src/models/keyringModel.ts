import { sailscalls } from "../config/sailsCalls.js";
import type { IKeyringPair } from "@polkadot/types/types";
import type { ICommandResponse, IFormatedKeyring } from "sailscalls";
import { HexString } from "@gear-js/api/types";

const registerUser = async (signer: IKeyringPair, voucherId: HexString, userCodedName: string, data: IFormatedKeyring): Promise<ICommandResponse> => {
    return new Promise(async (resolve, reject) => {
        if (!sailscalls) {
            reject('SailsCalls is not ready');
            return;
        }
        try {
            const response = await sailscalls.command({
                signerData: signer,
                voucherId,
                serviceName: 'Keyring',
                methodName: 'BindKeyringDataToUserCodedName',
                callArguments: [
                    userCodedName,
                    data
                ]
            }); 
            console.log('Lo que se obtuvo:');
            console.log(response);  
            resolve(response);
        } catch(e) {
            console.log(e);
            reject(JSON.stringify(e));
        }    
    });
};

const userKeyringAddress = async (userCodedName: string): Promise<string | null> => {
    return new Promise(async (resolve, reject) => {
        if (!sailscalls) {
            reject('SailsCalls is not ready');
            return;
        }

        try {
            const response = await sailscalls.query({
                serviceName: 'Keyring',
                methodName: 'KeyringAddressFromUserCodedName',
                callArguments: [
                    userCodedName
                ]
            });

            console.log('Lo que se obtuvo:');
            console.log(response);

            const { signlessAccountAddress } = response;

            resolve(signlessAccountAddress);
        } catch (e) {
            console.log(e);
            reject(JSON.stringify(e));
        }
    });
};

const userKeyringData = async (keyringAddress: HexString): Promise<IFormatedKeyring> => {
    return new Promise(async (resolve, reject) => {
        if (!sailscalls) {
            reject('SailsCalls is not ready');
            return;
        }
        
        try {
            const response = await sailscalls.query({
                serviceName: 'Keyring',
                methodName: 'KeyringAccountData',
                callArguments: [
                    keyringAddress
                ]
            });

            console.log('user keyring data:');
            console.log(response);

            resolve(response.signlessAccountData);
        } catch (e) {
            console.log(e);
            reject(JSON.stringify(e));
        }
    });
}

export default {
    registerUser,
    userKeyringAddress,
    userKeyringData
};