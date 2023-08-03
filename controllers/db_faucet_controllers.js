import {getClaimsServiceUnder24, createClaimsService, UpdateClaimsService} from "./db_faucet_services"

module.exports = {
    isClaimableController: async (address) => {
        return new Promise(async (resolve, reject) => {
            try {
                // get the latest claim
                const results = await getClaimsServiceUnder24(address);

                // if address havent interact
                if(results.length == 0) {
                    const response = await createClaimsService(address, "100000000000000000000");
                    resolve(response.insertId);
                } else {
                    if (results[0].status == 2) {
                        const response = await createClaimsService(address, "100000000000000000000");
                        resolve(response.insertId);
                    }
                    if (results[0].status == 0 || results[0].status == 1)
                        reject("You had claimed WAG faucet under 24 hours.");
                }
                reject("Something went wrong while verifying claimable.");
            } catch (error) {
                console.log(error);
                reject(error);
            }
        });
    },
    UpdateClaimsController: async (transactionHash, status, id) => {
        return new Promise(async (resolve, reject) => {
            try {
                await UpdateClaimsService(transactionHash, status, id);
                resolve()
            } catch (error) {
                console.log(error);
                reject(error);
            }
        });
    },
}
