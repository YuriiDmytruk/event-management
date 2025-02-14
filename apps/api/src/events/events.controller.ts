import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { EventSchema } from '../../../../shared/events/schemas/event.schema'
import { CreateEventDto } from '../../../../shared/events/dto/create-event.dto'
import { UpdateEventDto } from '../../../../shared/events/dto/update-event.dto'

@Controller('events')
export class EventsController {
    constructor(private readonly eventsService: EventsService) { }

    @Post()
    create(@Body(new ZodValidationPipe(EventSchema)) createEventDto: CreateEventDto) {
        return this.eventsService.create(createEventDto);
    }

    @Get()
    findAll(
        @Query('category') category?: string,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
        @Query('search') search?: string,
    ) {
        return this.eventsService.findAll({
            category,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
            search,
        });
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.eventsService.findOne(id);
    }

    @Get(':id/similar')
    findSimilarEvents(@Param('id') id: string) {
        return this.eventsService.findSimilarEvents(id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body(new ZodValidationPipe(EventSchema.partial())) updateEventDto: UpdateEventDto,
    ) {
        return this.eventsService.update(id, updateEventDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.eventsService.remove(id);
    }
}