import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { serialize } from 'cookie';
import { getConnection } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import type { RowDataPacket } from 'mysql2';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const db = await getConnection();

    // Check if user already exists
    type ExistingUser = RowDataPacket & {
      id: string;
    };

    const [rows] = await db.query<ExistingUser[]>(
      'SELECT id FROM users WHERE email = ? LIMIT 1',
      [email]
    );

    if (rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUserId = uuidv4();
    await db.query(
      'INSERT INTO users (id, name, email, password, createdAt) VALUES (?, ?, ?, ?, NOW())',
      [newUserId, name, email, hashedPassword]
    );

    // Generate JWT token
    const token = sign(
      { id: newUserId, email },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: '1d' }
    );

    // Set token as httpOnly cookie
    res.setHeader(
      'Set-Cookie',
      serialize('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 // 1 day
      })
    );

    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUserId,
        name,
        email
      }
    });
  } catch (error: any) {
    console.error('[REGISTER ERROR]', error.message, error)
    return res.status(500).json({ error: 'Something went wrong', details: error.message })
  }

}
