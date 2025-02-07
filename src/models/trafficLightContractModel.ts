import { HexString } from "@gear-js/api/types";
import { sailscalls } from "../config/sailsCalls.js";
import type { IKeyringPair } from "@polkadot/types/types";

const sendGreen = (userCodedName: string, voucherId: HexString, signer: IKeyringPair) => {
    return new Promise(async (resolve, reject) => {
        if (!sailscalls) {
            reject('SailsCalls is not ready');
            return;
        }

        try {
            const response = await sailscalls.command({
                signerData: signer,
                voucherId,
                serviceName: 'TrafficLight',
                methodName: 'Green',
                callArguments: [
                    userCodedName
                ]
            });

            console.log('Lo que se obtuvo:');
            console.log(response);

            resolve(response);
        } catch (e) {
            console.log(e);
            reject(JSON.stringify(e));
        }
    });
};

const sendYellow = (userCodedName: string, voucherId: HexString, signer: IKeyringPair) => {
    return new Promise(async (resolve, reject) => {
        if (!sailscalls) {
            reject('SailsCalls is not ready');
            return;
        }

        try {
            const response = await sailscalls.command({
                signerData: signer,
                voucherId,
                serviceName: 'TrafficLight',
                methodName: 'Yellow',
                callArguments: [
                    userCodedName
                ]
            });

            console.log('Lo que se obtuvo:');
            console.log(response);

            resolve(response);
        } catch (e) {
            console.log(e);
            reject(JSON.stringify(e));
        }
    });
};

const sendRed = (userCodedName: string, voucherId: HexString, signer: IKeyringPair) => {
    return new Promise(async (resolve, reject) => {
        if (!sailscalls) {
            reject('SailsCalls is not ready');
            return;
        }

        try {
            const response = await sailscalls.command({
                signerData: signer,
                voucherId,
                serviceName: 'TrafficLight',
                methodName: 'Red',
                callArguments: [
                    userCodedName
                ]
            });

            console.log('Lo que se obtuvo:');
            console.log(response);

            resolve(response);
        } catch (e) {
            console.log(e);
            reject(JSON.stringify(e));
        }
    });
};

const readState = async () => {
    return new Promise(async (resolve, reject) => {
        if (!sailscalls) {
            reject('SailsCalls is not ready');
            return;
        }

        try {
            const response = await sailscalls.query({
                serviceName: 'TrafficLight',
                methodName: 'TrafficLight'
            });

            resolve(response);
        } catch(e) {

        }
    });
}

export default {
    sendGreen,
    sendYellow,
    sendRed,
    readState
};