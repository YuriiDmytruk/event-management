import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { QueryEventDto } from './dto/query-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventSchema } from './schemas/event.schema';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
  ) {}

  async create(createEventDto: CreateEventDto) {
    const event = this.eventsRepository.create(createEventDto);
    return await this.eventsRepository.save(event);
  }

  async findAll(query: QueryEventDto) {
    const queryBuilder = this.eventsRepository.createQueryBuilder('event');

    if (query.category) {
      queryBuilder.andWhere('event.category = :category', {
        category: query.category,
      });
    }

    if (query.startDate) {
      queryBuilder.andWhere('event.date >= :startDate', {
        startDate: query.startDate,
      });
    }

    if (query.endDate) {
      queryBuilder.andWhere('event.date <= :endDate', {
        endDate: query.endDate,
      });
    }

    if (query.search) {
      queryBuilder.andWhere(
        '(LOWER(event.title) LIKE LOWER(:search) OR LOWER(event.description) LIKE LOWER(:search))',
        { search: `%${query.search}%` },
      );
    }

    queryBuilder.orderBy('event.date', query.sortDirection || 'ASC');

    return await queryBuilder.getMany();
  }

  async findOne(id: string) {
    const event = await this.eventsRepository.findOne({ where: { id } });
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return event;
  }

  async update(id: string, updateEventDto: UpdateEventDto) {
    const event = await this.findOne(id);
    Object.assign(event, updateEventDto);
    return await this.eventsRepository.save(event);
  }

  async remove(id: string) {
    const event = await this.findOne(id);
    await this.eventsRepository.remove(event);
    return { id };
  }

  async findSimilarEvents(id: string): Promise<Event[]> {
    const baseEvent = await this.eventsRepository.findOne({
      where: { id },
    });

    if (!baseEvent) {
      throw new Error('Event not found');
    }

    const parsedBaseEvent = EventSchema.parse(baseEvent);

    const tenDaysBefore = new Date(parsedBaseEvent.date);
    tenDaysBefore.setDate(tenDaysBefore.getDate() - 10);

    const tenDaysAfter = new Date(parsedBaseEvent.date);
    tenDaysAfter.setDate(tenDaysAfter.getDate() + 10);

    const similarEvents = await this.eventsRepository
      .createQueryBuilder('event')
      .where('event.id != :id', { id })
      .andWhere('event.category = :category', {
        category: parsedBaseEvent.category,
      })
      .andWhere('event.date BETWEEN :startDate AND :endDate', {
        startDate: tenDaysBefore.toISOString(),
        endDate: tenDaysAfter.toISOString(),
      })
      .orderBy('event.date', 'ASC')
      .take(5)
      .getMany();

    return similarEvents;
  }
}
