import type { NextApiRequest, NextApiResponse } from 'next';
import { getConnection } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const db = await getConnection();

    const [rows]: any = await db.query('SELECT COUNT(*) AS count FROM destinations');
    const count = rows[0]?.count || 0;

    res.status(200).json({ count });
  } catch (error: any) {
    console.error('Failed to count destinations:', error);
    res.status(500).json({ error: 'Failed to fetch destination count' });
  }
}
