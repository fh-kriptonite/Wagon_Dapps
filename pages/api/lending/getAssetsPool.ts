import { NextApiRequest, NextApiResponse } from 'next';
import { getAssetsPoolService } from "../../../controllers/db_lending_services"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    if(req.method === 'GET') {
        const pool_id = req.query.pool_id as string;
        const response = await getAssetsPoolService(pool_id)
        res.status(200).json({data: response})
    }
} 