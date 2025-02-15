import { z } from 'zod';
import { EventSchema } from '../schemas/event.schema';

export type UpdateEventDto = Partial<z.infer<typeof EventSchema>>;