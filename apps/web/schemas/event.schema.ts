import { z } from 'zod';
import { EventCategory } from '../types/event-category.type';

export const EventSchema = z.object({
    id: z.string().uuid().optional(),
    title: z.string({
        required_error: "Title is required",
        invalid_type_error: "Title must be a string"
    }).min(3, { message: "Title must be at least 3 characters long" })
        .max(100, { message: "Title cannot exceed 100 characters" }),

    description: z.string({
        required_error: "Description is required",
        invalid_type_error: "Description must be a string"
    }).min(10, { message: "Description must be at least 10 characters long" })
        .max(1000, { message: "Description cannot exceed 1000 characters" }),

    date: z.string().datetime({
        message: "Invalid date format. Please use a valid ISO datetime"
    }),

    location: z.object({
        address: z.string({
            required_error: "Address is required",
            invalid_type_error: "Address must be a string"
        }),
        latitude: z.number({
            required_error: "Latitude is required",
            invalid_type_error: "Latitude must be a number"
        }).min(-90, { message: "Latitude must be between -90 and 90" })
            .max(90, { message: "Latitude must be between -90 and 90" }),
        longitude: z.number({
            required_error: "Longitude is required",
            invalid_type_error: "Longitude must be a number"
        }).min(-180, { message: "Longitude must be between -180 and 180" })
            .max(180, { message: "Longitude must be between -180 and 180" }),
    }),

    category: z.nativeEnum(EventCategory, {
        required_error: "Category is required",
        invalid_type_error: "Invalid category selected"
    }),

    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});

export type Event = z.infer<typeof EventSchema>;