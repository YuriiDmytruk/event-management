import { z } from 'zod';
import { EventSchema } from '../schemas/event.schema';

export type CreateEventDto = z.infer<typeof EventSchema>;