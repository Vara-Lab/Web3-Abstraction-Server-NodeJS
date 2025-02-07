// import { Sails } from "sails-js";
// import { KeyringPair } from '@polkadot/keyring/types';

// export const commandGreen = (sails: Sails, signer: KeyringPair): Promise<any> => {
//     return new Promise(async (resolve, reject) => {
//         const transaction = await sails
//             .services // function to get services
//             .TrafficLight // Service selected (TrafficLight)
//             .functions // Get the functions from the service (commands - change state)
//             .Green() // Command selected from service, if there are arguments, they are put here
//             .withAccount(signer) // Set the account that will sign the message
//             .calculateGas(); // Calculate gas fees for extrinsic
        
//         // Sign the message, and get the blockhash and the "async" response
//         const { blockHash, response } = await transaction.signAndSend();
    
//         // Print the block hash
//         console.log(`Block hash: ${blockHash}`);

//         try {
//             // Waiting for response from contract
//             const contractResponse = await response();

//             // return response 
//             resolve(contractResponse);
//         } catch (e) {
//             reject(e);
//         }
//     }); 
// };

// export const commandYellow = (sails: Sails, signer: KeyringPair): Promise<any> => {
//     return new Promise(async (resolve, reject) => {
//         const transaction = await sails
//             .services // function to get services
//             .TrafficLight // Service selected (TrafficLight)
//             .functions // Get the functions from the service (commands - change state)
//             .Yellow() // Command selected from service, if there are arguments, they are put here
//             .withAccount(signer) // Set the account that will sign the message
//             .calculateGas(); // Calculate gas fees for extrinsic
        
//         // Sign the message, and get the blockhash and the "async" response
//         const { blockHash, response } = await transaction.signAndSend();
    
//         // Print the block hash
//         console.log(`Block hash: ${blockHash}`);

//         try {
//             // Waiting for response from contract
//             const contractResponse = await response();

//             // return response 
//             resolve(contractResponse);
//         } catch (e) {
//             reject(e);
//         }
//     }); 
// };

// export const commandRed = (sails: Sails, signer: KeyringPair): Promise<any> => {
//     return new Promise(async (resolve, reject) => {
//         const transaction = await sails
//             .services // function to get services
//             .TrafficLight // Service selected (TrafficLight)
//             .functions // Get the functions from the service (commands - change state)
//             .Red() // Command selected from service, if there are arguments, they are put here
//             .withAccount(signer) // Set the account that will sign the message
//             .calculateGas(); // Calculate gas fees for extrinsic
        
//         // Sign the message, and get the blockhash and the "async" response
//         const { blockHash, response } = await transaction.signAndSend();
    
//         // Print the block hash
//         console.log(`Block hash: ${blockHash}`);

//         try {
//             // Waiting for response from contract
//             const contractResponse = await response();

//             // return response 
//             resolve(contractResponse);
//         } catch (e) {
//             reject(e);
//         }
//     }); 
// };