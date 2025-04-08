import { NextApiRequest, NextApiResponse } from 'next';
import { getPoolService } from "../../../controllers/db_lending_services"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    if(req.method === 'GET') {
        const id = req.query.id as string;
        const response = await getPoolService(Number(id))
        res.status(200).json({data: response})
    }
} 