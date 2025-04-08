import { NextApiRequest, NextApiResponse } from 'next';
import { startService } from '../../../controllers/lending_listener_controllers';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  startService();
  res.status(200).json({ message: 'BSC listener started.' });
} 