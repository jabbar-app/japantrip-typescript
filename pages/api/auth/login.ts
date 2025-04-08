// /pages/api/auth/login.ts

import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import { serialize } from 'cookie'
import { getConnection } from '@/lib/db'
import type { RowDataPacket } from 'mysql2'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    const db = await getConnection()

    // Query user by email
    type UserRow = RowDataPacket & {
      id: string
      name: string
      email: string
      password: string
    }

    const [rows] = await db.query<UserRow[]>(
      'SELECT * FROM users WHERE email = ? LIMIT 1',
      [email]
    )

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const user = rows[0]

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Generate token
    const token = sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: '1d' }
    )

    // Set token cookie
    res.setHeader('Set-Cookie', serialize('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24
    }))

    return res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    })
  } catch (error) {
    console.error('[LOGIN ERROR]', error)
    return res.status(500).json({ error: 'Something went wrong' })
  }
}
