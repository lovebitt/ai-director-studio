import SocketHandler from '../../../lib/socket/server';

export default function handler(req, res) {
  if (req.method === 'GET' || req.method === 'POST') {
    SocketHandler(req, res);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}