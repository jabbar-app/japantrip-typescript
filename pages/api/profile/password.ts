import type { NextApiRequest, NextApiResponse } from 'next'
import { getConnection } from '@/lib/db'
import bcrypt from 'bcryptjs'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const db = await getConnection()
  const { currentPassword, newPassword } = req.body

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Missing fields' })
  }

  try {
    // Ganti userId sesuai sumber datamu (dari cookies/localStorage/JWT, dsb)
    const userId = req.cookies.userId || 'your-default-user-id'

    const [rows] = await db.query('SELECT password FROM users WHERE id = ?', [userId])
    const user = (rows as { password: string }[])[0]

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password)
    if (!isMatch) {
      return res.status(400).json({ error: 'Current password is incorrect' })
    }

    const hashed = await bcrypt.hash(newPassword, 10)
    await db.query('UPDATE users SET password = ? WHERE id = ?', [hashed, userId])

    return res.status(200).json({ message: 'Password updated successfully' })
  } catch (error: any) {
    console.error('Password update error:', error)
    return res.status(500).json({ error: 'Failed to update password' })
  }
}
