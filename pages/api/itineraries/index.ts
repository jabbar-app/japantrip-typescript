import type { NextApiRequest, NextApiResponse } from 'next';
import { getConnection } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

// Helper untuk mengelompokkan destinasi berdasarkan day
const groupDestinationsByDay = (destinations: any[]) => {
  const grouped: Record<string, any[]> = {};

  destinations.forEach((dest) => {
    const day = dest.day || 'Day 1';
    if (!grouped[day]) grouped[day] = [];
    grouped[day].push(dest);
  });

  return grouped;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = await getConnection();

  if (req.method === 'GET') {
    try {
      // Ambil seluruh itinerary dengan relasi relasi-nya (join manual)
      const [itineraries]: any = await db.query(`
        SELECT * FROM itineraries ORDER BY createdAt DESC
      `);

      for (const itinerary of itineraries) {
        const [days]: any = await db.query(
          `SELECT * FROM itinerary_days WHERE itineraryId = ? ORDER BY dayNumber ASC`,
          [itinerary.id]
        );

        for (const day of days) {
          const [itineraryDestinations]: any = await db.query(
            `SELECT d.*, idest.recommendedVisitTime, idest.\`order\`
             FROM itinerary_destinations AS idest
             JOIN destinations AS d ON d.id = idest.destinationId
             WHERE idest.itineraryDayId = ?
             ORDER BY idest.\`order\` ASC`,
            [day.id]
          );

          day.itineraryDestinations = itineraryDestinations;
        }

        itinerary.itineraryDays = days;
      }

      return res.status(200).json(itineraries);
    } catch (error: any) {
      console.error('Error fetching itineraries:', error);
      return res.status(500).json({ error: `Failed to fetch itineraries: ${error.message}` });
    }
  }

  if (req.method === 'POST') {
    try {
      const { title, itineraryDays, destinations, userId } = req.body;

      if (!title) {
        return res.status(400).json({ error: 'Invalid request data: "title" is required.' });
      }

      if (!userId) {
        return res.status(400).json({ error: 'Invalid request data: "userId" is required.' });
      }

      let daysData;

      if (Array.isArray(itineraryDays)) {
        daysData = itineraryDays;
      } else if (Array.isArray(destinations)) {
        const grouped = groupDestinationsByDay(destinations);

        daysData = Object.keys(grouped)
          .map((day) => ({
            dayNumber: parseInt(day.split(' ')[1]),
            destinations: grouped[day].map((dest) => ({
              id: dest.id,
              recommendedVisitTime: dest.recommendedVisitTime,
            })),
          }))
          .sort((a, b) => a.dayNumber - b.dayNumber);
      } else {
        return res.status(400).json({
          error:
            'Invalid request data: Provide either "itineraryDays" or "destinations" (as an array).',
        });
      }

      const itineraryId = uuidv4();

      // Insert itinerary
      await db.query(
        'INSERT INTO itineraries (id, title, days, userId, createdAt) VALUES (?, ?, ?, ?, NOW())',
        [itineraryId, title, daysData.length, userId]
      );

      // Insert each day & its destinations
      for (const day of daysData) {
        const dayId = uuidv4();
        await db.query(
          'INSERT INTO itinerary_days (id, itineraryId, dayNumber) VALUES (?, ?, ?)',
          [dayId, itineraryId, day.dayNumber]
        );

        for (let i = 0; i < day.destinations.length; i++) {
          const dest = day.destinations[i];
          await db.query(
            `INSERT INTO itinerary_destinations (
              id, itineraryDayId, destinationId, \`order\`, recommendedVisitTime
            ) VALUES (?, ?, ?, ?, ?)`,
            [uuidv4(), dayId, dest.id, i + 1, dest.recommendedVisitTime]
          );
        }
      }

      return res.status(201).json({ message: 'Itinerary saved successfully', itineraryId });
    } catch (error: any) {
      console.error('Error saving itinerary:', error);
      return res.status(500).json({ error: `Failed to save itinerary: ${error.message}` });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ message: 'Method not allowed' });
}
