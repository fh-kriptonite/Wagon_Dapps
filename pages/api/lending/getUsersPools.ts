import { NextApiRequest, NextApiResponse } from 'next';
import { getUserPoolsService } from "../../../controllers/db_lending_services"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    if(req.method === 'GET') {
        const address = req.query.address as string;
        const response = await getUserPoolsService(address)
        res.status(200).json({data: response})
    }
} 