import { getAccountController } from "../../../controllers/db_lending_account"
import { error } from 'console';

export default async function handler(req, res) {
    if(req.method === 'GET') {
        const wallet_address = req.query.wallet_address;
        
        if (!wallet_address) {
            return res.status(400).json({ error: 'wallet_address parameter is missing' });
        }

        try {
            const response = await getAccountController(wallet_address);

            if(response.length > 0) {
              res.status(200).json({
                data: response[0]
              });
            } else {
              throw error('Account not found');
            }
        } catch (error) {
            // Handle file not found or other errors
            return res.status(404).json({ error: error });
        }
    }
}