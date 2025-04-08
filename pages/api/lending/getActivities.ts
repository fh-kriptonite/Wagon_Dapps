import { NextApiRequest, NextApiResponse } from 'next';
import { getPoolActivitiesService } from "../../../controllers/db_lending_services"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    if(req.method === 'GET') {
        const id = req.query.id as string;
        const network = req.query.network as string;
        const response = await getPoolActivitiesService(id, network)
        res.status(200).json({data: response})
    }
} 