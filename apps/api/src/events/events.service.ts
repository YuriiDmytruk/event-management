import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './event.entity';
import { CreateEventDto } from '../../../../shared/events/dto/create-event.dto'
import { UpdateEventDto } from '../../../../shared/events/dto/update-event.dto'
import { QueryEventDto } from '../../../../shared/events/dto/query-event.dto'

@Injectable()
export class EventsService {
    constructor(
        @InjectRepository(Event)
        private eventsRepository: Repository<Event>,
    ) { }

    async create(createEventDto: CreateEventDto) {
        const event = this.eventsRepository.create(createEventDto);
        return await this.eventsRepository.save(event);
    }

    async findAll(query: QueryEventDto) {
        const queryBuilder = this.eventsRepository.createQueryBuilder('event');

        if (query.category) {
            queryBuilder.andWhere('event.category = :category', { category: query.category });
        }

        if (query.startDate) {
            queryBuilder.andWhere('event.date >= :startDate', { startDate: query.startDate });
        }

        if (query.endDate) {
            queryBuilder.andWhere('event.date <= :endDate', { endDate: query.endDate });
        }

        if (query.search) {
            queryBuilder.andWhere(
                '(event.title ILIKE :search OR event.description ILIKE :search)',
                { search: `%${query.search}%` },
            );
        }

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

    async findSimilarEvents(id: string) {
        const event = await this.findOne(id);
        const queryBuilder = this.eventsRepository.createQueryBuilder('event');

        return await queryBuilder
            .where('event.id != :id', { id })
            .andWhere('event.category = :category', { category: event.category })
            .andWhere('ABS(EXTRACT(EPOCH FROM event.date) - EXTRACT(EPOCH FROM :date)) <= :timeFrame', {
                date: event.date,
                timeFrame: 7 * 24 * 60 * 60, // 7 days in seconds
            })
            .orderBy('event.date', 'ASC')
            .limit(5)
            .getMany();
    }
}