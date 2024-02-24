// pages/api/startEthereumListener.js

import { startCMCService } from '../../../controllers/cmc_listener_controller';

export default function handler(req, res) {
  startCMCService();
  res.status(200).json({ message: 'CMC listener started.' });
}
