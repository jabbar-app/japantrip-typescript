import type { NextApiRequest, NextApiResponse } from 'next';
import { getConnection } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid itinerary ID' });
  }

  const db = await getConnection();

  if (req.method === 'GET') {
    try {
      const [itineraries]: any = await db.query(
        `SELECT * FROM itineraries WHERE id = ?`,
        [id]
      );

      if (itineraries.length === 0) {
        return res.status(404).json({ error: 'Itinerary not found' });
      }

      const itinerary = itineraries[0];

      const [days]: any = await db.query(
        `SELECT * FROM itinerary_days WHERE itineraryId = ? ORDER BY dayNumber ASC`,
        [id]
      );

      for (const day of days) {
        const [destinations]: any = await db.query(
          `SELECT d.*, idest.recommendedVisitTime, idest.\`order\`
           FROM itinerary_destinations AS idest
           JOIN destinations AS d ON d.id = idest.destinationId
           WHERE idest.itineraryDayId = ?
           ORDER BY idest.\`order\` ASC`,
          [day.id]
        );

        day.itineraryDestinations = destinations;
      }

      itinerary.itineraryDays = days;

      return res.status(200).json(itinerary);
    } catch (error: any) {
      console.error('Error fetching itinerary:', error);
      return res.status(500).json({ error: `Failed to fetch itinerary: ${error.message}` });
    }
  }

  if (req.method === 'DELETE') {
    try {
      // Step 1: Get all itineraryDayId based on itineraryId
      const [days]: any = await db.query(
        `SELECT id FROM itinerary_days WHERE itineraryId = ?`,
        [id]
      );

      const dayIds = days.map((day: any) => day.id);

      if (dayIds.length > 0) {
        // Step 2: Delete all related itinerary_destinations
        await db.query(
          `DELETE FROM itinerary_destinations WHERE itineraryDayId IN (${dayIds.map(() => '?').join(',')})`,
          dayIds
        );

        // Step 3: Delete itinerary_days
        await db.query(
          `DELETE FROM itinerary_days WHERE itineraryId = ?`,
          [id]
        );
      }

      // Step 4: Delete from main itinerary
      const [result]: any = await db.query(
        `DELETE FROM itineraries WHERE id = ?`,
        [id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Itinerary not found or already deleted' });
      }

      return res.status(200).json({ message: 'Itinerary deleted successfully' });
    } catch (error: any) {
      console.error('Error deleting itinerary:', error);
      return res.status(500).json({ error: `Failed to delete itinerary: ${error.message}` });
    }
  }

  res.setHeader('Allow', ['GET', 'DELETE']);
  return res.status(405).json({ message: 'Method not allowed' });
}
