import { NextApiRequest, NextApiResponse } from 'next';
import { startCMCService } from '../../../controllers/cmc_listener_controller';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  startCMCService();
  res.status(200).json({ message: 'CMC listener started.' });
} 