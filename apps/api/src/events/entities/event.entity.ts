import { EventCategory } from '@repo/types';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('events')
export class Event {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false })
    title: string;

    @Column({ type: 'text', nullable: false })
    description: string;

    @Column({ type: 'timestamp', nullable: false })
    date: Date;

    @Column({
        type: 'jsonb',
        nullable: false
    })
    location: {
        address: string;
        latitude: number;
        longitude: number;
    };

    @Column({
        type: 'enum',
        enum: EventCategory,
        nullable: false
    })
    category: EventCategory;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}