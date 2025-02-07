import { CONTRACT_ID, IDL, NETWORK, SPONSOR_MNEMONIC, SPONSOR_NAME } from "../consts.js";
import { SailsCalls } from "sailscalls";

export let sailscalls: SailsCalls | null = null;

const initSailsCalls = async () => {
    sailscalls = await SailsCalls.new({
        network: NETWORK,
        voucherSignerData: {
            sponsorMnemonic: SPONSOR_MNEMONIC,
            sponsorName: SPONSOR_NAME
        },
        newContractsData: [
            {
                contractName: 'traffic_light',
                address: CONTRACT_ID,
                idl: IDL
            }
        ]
    });
};

initSailsCalls();