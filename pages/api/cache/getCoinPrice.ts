import { NextApiRequest, NextApiResponse } from 'next';
import { getPriceService } from "../../../controllers/db_cmc_services"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    if(req.method === 'GET') {
        const coinName = req.query.name as string;
        const response = await getPriceService(coinName)
        res.status(200).json({data: response})
    }
} 