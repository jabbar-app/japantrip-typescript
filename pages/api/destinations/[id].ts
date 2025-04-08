import type { NextApiRequest, NextApiResponse } from 'next';
import { getConnection } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid destination ID' });
  }

  const db = await getConnection();

  try {
    if (req.method === 'GET') {
      const [rows]: any = await db.query('SELECT * FROM destinations WHERE id = ?', [id]);

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Destination not found' });
      }

      return res.status(200).json(rows[0]);
    }

    if (req.method === 'PUT') {
      const fields = req.body;
      const keys = Object.keys(fields);
      const values = Object.values(fields);

      if (keys.length === 0) {
        return res.status(400).json({ error: 'No data provided to update' });
      }

      const updates = keys.map(key => `${key} = ?`).join(', ');
      await db.query(`UPDATE destinations SET ${updates} WHERE id = ?`, [...values, id]);

      return res.status(200).json({ message: 'Destination updated successfully' });
    }

    if (req.method === 'DELETE') {
      const [result]: any = await db.query('DELETE FROM destinations WHERE id = ?', [id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Destination not found or already deleted' });
      }

      return res.status(200).json({ message: 'Destination deleted successfully' });
    }

    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error: any) {
    console.error(`Error handling ${req.method} /destinations/${id}:`, error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
