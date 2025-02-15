import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { CreateEventDto, QueryEventDto, UpdateEventDto } from '@repo/types';

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

        // Category filter
        if (query.category) {
            queryBuilder.andWhere('event.category = :category', { category: query.category });
        }

        // Date range filter
        if (query.startDate) {
            queryBuilder.andWhere('event.date >= :startDate', {
                startDate: query.startDate
            });
        }

        if (query.endDate) {
            queryBuilder.andWhere('event.date <= :endDate', {
                endDate: query.endDate
            });
        }

        // Search filter
        if (query.search) {
            queryBuilder.andWhere(
                '(LOWER(event.title) LIKE LOWER(:search) OR LOWER(event.description) LIKE LOWER(:search))',
                { search: `%${query.search}%` },
            );
        }

        // Sort by date
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

    async findSimilarEvents(id: string) {
        const event = await this.findOne(id);
        const queryBuilder = this.eventsRepository.createQueryBuilder('event');

        // First try to find events by proximity (within 10km) and same category
        const radiusInKm = 10;
        const proximityEvents = await queryBuilder
            .where('event.id != :id', { id })
            .andWhere('event.category = :category', { category: event.category })
            .andWhere(
                `ST_DistanceSphere(
                ST_MakePoint(CAST(event.location ->> 'longitude' AS FLOAT), 
                            CAST(event.location ->> 'latitude' AS FLOAT)),
                ST_MakePoint(:longitude, :latitude)
            ) <= :distance`,
                {
                    longitude: event.location.longitude,
                    latitude: event.location.latitude,
                    distance: radiusInKm * 1000 // Convert km to meters
                }
            )
            .orderBy(
                `ST_DistanceSphere(
                ST_MakePoint(CAST(event.location ->> 'longitude' AS FLOAT), 
                            CAST(event.location ->> 'latitude' AS FLOAT)),
                ST_MakePoint(:longitude, :latitude)
            )`,
                'ASC'
            )
            .limit(5)
            .getMany();

        // If no nearby events found, fall back to category matching
        if (!proximityEvents.length) {
            return await queryBuilder
                .where('event.id != :id', { id })
                .andWhere('event.category = :category', { category: event.category })
                .orderBy('event.date', 'ASC')
                .limit(5)
                .getMany();
        }

        return proximityEvents;
    }
}