import type { NextApiRequest, NextApiResponse } from 'next'
import { getConnection } from '@/lib/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const db = await getConnection()
  const { id, name, email } = req.body

  if (!id || !name || !email) {
    return res.status(400).json({ error: 'Missing fields' })
  }

  try {
    await db.query(`UPDATE users SET name = ?, email = ? WHERE id = ?`, [name, email, id])
    return res.status(200).json({ message: 'Profile updated successfully' })
  } catch (error) {
    console.error('Update profile error:', error)
    return res.status(500).json({ error: 'Failed to update profile' })
  }
}
