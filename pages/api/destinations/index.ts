import type { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';
import { getConnection } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = await getConnection();

  if (req.method === 'GET') {
    // Fetch all destinations
    try {
      const [destinations] = await db.query('SELECT * FROM destinations');
      return res.status(200).json(destinations);
    } catch (error: any) {
      console.error('Error fetching destinations:', error);
      return res.status(500).json({ error: `Failed to fetch destinations: ${error.message}` });
    }
  }

  if (req.method === 'POST') {
    // Bulk insert if body is array
    if (Array.isArray(req.body)) {
      try {
        const destinations = req.body;

        const values = destinations.map((dest) => [
          uuidv4(),
          dest.name,
          dest.city,
          dest.description,
          dest.imageUrl,
          dest.visitDurationHours,
          dest.rating,
          dest.category,
          dest.recommendedTime,
          dest.priority,
          dest.isIndoor,
          dest.hasTicket,
          dest.ticketPriceYen,
          dest.openHour,
          dest.closeHour,
          dest.link_gmaps,
          dest.suitableForKids,
          dest.estimatedWalkMinutesFromPrevious
        ]);

        const placeholders = destinations
          .map(() => '(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)')
          .join(',');

        const sql = `
          INSERT INTO destinations (
            id, name, city, description, imageUrl, visitDurationHours, rating, category,
            recommendedTime, priority, isIndoor, hasTicket, ticketPriceYen,
            openHour, closeHour, link_gmaps, suitableForKids, estimatedWalkMinutesFromPrevious
          ) VALUES ${placeholders}
        `;

        await db.query(sql, values.flat());

        return res.status(201).json({ message: `Successfully created ${destinations.length} destinations` });
      } catch (error: any) {
        console.error('Error creating destinations (bulk):', error);
        return res.status(500).json({ error: `Failed to create destinations: ${error.message}` });
      }
    } else {
      // Single insert
      try {
        const {
          name,
          city,
          description,
          imageUrl,
          visitDurationHours,
          rating,
          category,
          recommendedTime,
          priority,
          isIndoor,
          hasTicket,
          ticketPriceYen,
          openHour,
          closeHour,
          link_gmaps,
          suitableForKids,
          estimatedWalkMinutesFromPrevious
        } = req.body;

        const id = uuidv4();

        await db.query(
          `INSERT INTO destinations (
            id, name, city, description, imageUrl, visitDurationHours, rating, category,
            recommendedTime, priority, isIndoor, hasTicket, ticketPriceYen,
            openHour, closeHour, link_gmaps, suitableForKids, estimatedWalkMinutesFromPrevious
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            id, name, city, description, imageUrl, visitDurationHours, rating, category,
            recommendedTime, priority, isIndoor, hasTicket, ticketPriceYen,
            openHour, closeHour, link_gmaps, suitableForKids, estimatedWalkMinutesFromPrevious
          ]
        );

        return res.status(201).json({
          message: 'Destination created successfully',
          destination: {
            id,
            name,
            city,
            description,
            imageUrl,
            visitDurationHours,
            rating,
            category,
            recommendedTime,
            priority,
            isIndoor,
            hasTicket,
            ticketPriceYen,
            openHour,
            closeHour,
            link_gmaps,
            suitableForKids,
            estimatedWalkMinutesFromPrevious
          }
        });
      } catch (error: any) {
        console.error('Error creating destination:', error);
        return res.status(500).json({ error: `Failed to create destination: ${error.message}` });
      }
    }
  }

  // If method not allowed
  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ message: 'Method not allowed' });
}
