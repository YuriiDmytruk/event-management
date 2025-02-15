'use client';

import React from 'react';
import { Grid } from '@mui/material';
import { Event } from '../types/event.types';
import EventCard from './EventCard';

interface ListViewProps {
    events: Event[];
    onDeleteClick: (id: string) => void;
}

export default function ListView({ events, onDeleteClick }: ListViewProps) {
    return (
        <Grid container spacing={3}>
            {events.map((event) => (
                <Grid item key={event.id} xs={12} sm={6} md={4}>
                    <EventCard
                        event={event}
                        onDeleteClick={onDeleteClick}
                    />
                </Grid>
            ))}
        </Grid>
    );
}