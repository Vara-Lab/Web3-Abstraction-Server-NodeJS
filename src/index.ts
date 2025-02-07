import { 
    CONTRACT_ID, 
    IDL, 
    NETWORK, 
    SPONSOR_MNEMONIC, 
    SPONSOR_NAME
} from "./consts.js";
import { keyringRoutes, trafficLightContractRoutes } from "./paths/index.js";
import { SailsCalls } from "sailscalls";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import express from "express";

dotenv.config();

// Specify the port
const PORT = 3000;
// Create express instance
const app = express();

const startServer = async () => {
    try {
        // Middleware and paths
        app.use(express.json()); // Accept JSON
        app.use(cookieParser()); // Set the cookie parser
        // Path for traffic light contract methods
        app.use('/trafficlight', trafficLightContractRoutes);
        // Path for keyring methods
        app.use('/keyring', keyringRoutes);
        // Set the root path
        app.get('/', (_, res) => {
            res.send('Hello, Sails!');
        });

        // Start de server with express and set the server variable, 
        // to handle when the sserver is closed.
        const server = app.listen(PORT, () => {
            console.log('Server listening in http://localhost:3000');
        });

        // Set the process when the dev close the server
        process.on('SIGINT', async () => {
            console.log('C\nlosing server...');
            // Disconnect from vara network
            await app.locals.sailscalls.disconnectGearApi();
            // Close the server
            server.close(() => {
                console.log('Server was closed!');
            });
        });
    } catch(e) {
        console.log('Error while starting the server!');
        throw e;
    }
}

startServer().catch(error => {
    console.log('Error in server!');
    throw error;
});