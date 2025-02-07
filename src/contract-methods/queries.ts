// import { Sails } from "sails-js";

// export const queryTrafficLight = (sails: Sails, userAddress: string): Promise<any> => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             const response = await sails
//                 .services // function to get services
//                 .TrafficLight // Service selected (TrafficLight)
//                 .queries // Get the queries from the service (queries - no changes state)
//                 .TrafficLight(userAddress); // Query selected from the service

//             // Return the response
//             resolve(response);
//         } catch(e) {
//             reject(e);
//         }
//     });
// }