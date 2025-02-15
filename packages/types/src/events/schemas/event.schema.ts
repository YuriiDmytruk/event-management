import { z } from 'zod';
import { EventCategory } from '../types/event-category.type';

export const EventSchema = z.object({
    id: z.string().uuid().optional(),
    title: z.string().min(3).max(100),
    description: z.string().min(10).max(1000),
    date: z.string().datetime(),
    location: z.object({
        address: z.string(),
        latitude: z.number(),
        longitude: z.number(),
    }),
    category: z.nativeEnum(EventCategory),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});

export type Event = z.infer<typeof EventSchema>;