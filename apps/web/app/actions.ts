'use server';

import { Event } from '../types/event.types';

export interface EventFilters {
    category?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
    sortDirection?: 'ASC' | 'DESC';
}

export async function fetchEvents(filters?: EventFilters): Promise<Event[]> {
    try {
        const queryParams = new URLSearchParams();
        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value) queryParams.append(key, value);
            });
        }

        const response = await fetch(`http://localhost:8000/api/events?${queryParams}`);
        if (!response.ok) throw new Error('Failed to fetch events');

        return await response.json();
    } catch (error) {
        console.error('Error fetching events:', error);
        return [];
    }
}

export async function deleteEvent(id: string): Promise<boolean> {
    try {
        const response = await fetch(`http://localhost:8000/api/events/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) throw new Error('Failed to delete event');
        return true;
    } catch (error) {
        console.error('Error deleting event:', error);
        return false;
    }
}

export async function createEvent(eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Promise<Event | null> {
    try {
        const response = await fetch('http://localhost:8000/api/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(eventData),
        });

        if (!response.ok) throw new Error('Failed to create event');

        return await response.json();
    } catch (error) {
        console.error('Error creating event:', error);
        return null;
    }
}

export async function updateEvent(id: string, eventData: Partial<Omit<Event, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Event | null> {
    try {
        console.log('UPDATE')
        const response = await fetch(`http://localhost:8000/api/events/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(eventData),
        });

        if (!response.ok) throw new Error('Failed to update event');

        return await response.json();
    } catch (error) {
        console.error('Error updating event:', error);
        return null;
    }
}

export async function getEventById(id: string): Promise<Event | null> {
    try {
        const response = await fetch(`http://localhost:8000/api/events/${id}`);

        if (!response.ok) throw new Error('Failed to fetch event');

        return await response.json();
    } catch (error) {
        console.error('Error fetching event:', error);
        return null;
    }
}

export async function findSimilarEvents(id: string): Promise<Event[]> {
    try {
        const response = await fetch(`http://localhost:8000/api/events/${id}/similar`);

        if (!response.ok) throw new Error('Failed to fetch similar events');

        return await response.json();
    } catch (error) {
        console.error('Error fetching similar events:', error);
        return [];
    }
}