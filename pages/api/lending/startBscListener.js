// pages/api/startEthereumListener.js

import { startService } from '../../../controllers/lending_listener_controllers';

export default function handler(req, res) {
  startService();
  res.status(200).json({ message: 'BSC listener started.' });
}
