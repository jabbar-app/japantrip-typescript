import {
  mysqlTable,
  varchar,
  text,
  int,
  float,
  boolean,
  timestamp,
} from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

// Users Table
export const users = mysqlTable('users', {
  id: varchar('id', { length: 36 }).primaryKey().notNull(), 
  name: varchar('name', { length: 100 }).notNull(),
  email: varchar('email', { length: 100 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
});

// Destinations Table
export const destinations = mysqlTable('destinations', {
  id: varchar('id', { length: 36 }).primaryKey().notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  city: varchar('city', { length: 100 }).notNull(),
  description: text('description').notNull(),
  imageUrl: varchar('imageUrl', { length: 255 }).notNull(),
  visitDurationHours: float('visitDurationHours').notNull(),
  rating: float('rating').notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  recommendedTime: varchar('recommendedTime', { length: 100 }).notNull(),
  priority: int('priority').notNull(),
  isIndoor: boolean('isIndoor').notNull(),
  hasTicket: boolean('hasTicket').notNull(),
  ticketPriceYen: int('ticketPriceYen').notNull(),
  openHour: varchar('openHour', { length: 20 }).notNull(),
  closeHour: varchar('closeHour', { length: 20 }).notNull(),
  link_gmaps: varchar('link_gmaps', { length: 255 }).notNull(),
  suitableForKids: boolean('suitableForKids').notNull(),
  estimatedWalkMinutesFromPrevious: int('estimatedWalkMinutesFromPrevious').notNull(),
});

// Itineraries Table
export const itineraries = mysqlTable('itineraries', {
  id: varchar('id', { length: 36 }).primaryKey().notNull(),
  userId: varchar('userId', { length: 36 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  days: int('days').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
});

// ItineraryDays Table
export const itineraryDays = mysqlTable('itinerary_days', {
  id: varchar('id', { length: 36 }).primaryKey().notNull(),
  dayNumber: int('dayNumber').notNull(),
  itineraryId: varchar('itineraryId', { length: 36 }).notNull(),
});

// ItineraryDestinations Table
export const itineraryDestinations = mysqlTable('itinerary_destinations', {
  id: varchar('id', { length: 36 }).primaryKey().notNull(),
  itineraryDayId: varchar('itineraryDayId', { length: 36 }).notNull(),
  destinationId: varchar('destinationId', { length: 36 }).notNull(),
  order: int('order').notNull(),
  recommendedVisitTime: varchar('recommendedVisitTime', { length: 100 }).notNull(),
});

// User -> Itineraries
export const usersRelations = relations(users, ({ many }) => ({
  itineraries: many(itineraries),
}));

// Itinerary -> User & ItineraryDays
export const itinerariesRelations = relations(itineraries, ({ one, many }) => ({
  user: one(users, {
    fields: [itineraries.userId],
    references: [users.id],
  }),
  itineraryDays: many(itineraryDays),
}));

// ItineraryDay -> Itinerary & Destinations
export const itineraryDaysRelations = relations(itineraryDays, ({ one, many }) => ({
  itinerary: one(itineraries, {
    fields: [itineraryDays.itineraryId],
    references: [itineraries.id],
  }),
  destinations: many(itineraryDestinations),
}));

export const itineraryDestinationsRelations = relations(itineraryDestinations, ({ one }) => ({
  itineraryDay: one(itineraryDays, {
    fields: [itineraryDestinations.itineraryDayId],
    references: [itineraryDays.id],
  }),
  destination: one(destinations, {
    fields: [itineraryDestinations.destinationId],
    references: [destinations.id],
  }),
}));