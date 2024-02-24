import { getPriceService } from "../../../controllers/db_cmc_services"

export default async function handler(req, res) {
    if(req.method === 'GET') {
        const coinName = req.query.name;
        const response = await getPriceService(coinName)
        res.status(200).json({data: response})
    }
}