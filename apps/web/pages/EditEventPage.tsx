'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Container,
    Typography,
    Box,
    Alert,
    Button
} from '@mui/material';
import { Event } from '../types/event.types';
import { EventCategory } from '../types/event-category.type';
import { EventForm } from '../components/EventForm';
import { z } from 'zod';
import { EventSchema } from '../schemas/event.schema';
import { updateEvent } from '../actions/events';

interface EditEventClientProps {
    initialData: Event;
}

export default function EditEventClient({ initialData }: EditEventClientProps) {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const formattedInitialData = {
        title: initialData.title,
        description: initialData.description,
        date: initialData.date,
        location: {
            address: initialData.location.address,
            latitude: initialData.location.latitude,
            longitude: initialData.location.longitude,
        },
        category: initialData.category as EventCategory,
    };

    const handleSubmit = async (formData: z.infer<typeof EventSchema>) => {
        try {
            setError(null);

            if (!initialData.id) {
                setError('Event ID is missing');
                return;
            }

            const result = await updateEvent(initialData.id, formData);

            if (result) {
                router.push(`/${result.id}`);
            } else {
                setError('Failed to update event. Please try again.');
            }
        } catch (err) {
            console.error('Error in handleSubmit:', err);
            if (err instanceof z.ZodError) {
                throw err; // Let EventForm handle validation errors
            }
            setError('An unexpected error occurred. Please try again.');
        }
    };

    const handleCancel = () => {
        router.back();
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                py: 4,
                gap: 2,
            }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Edit Event
                </Typography>

                {error && (
                    <Box sx={{ width: '100%', mb: 2 }}>
                        <Alert severity="error">{error}</Alert>
                    </Box>
                )}

                <EventForm
                    initialData={formattedInitialData}
                    onSubmit={handleSubmit}
                />

                <Button
                    type="button"
                    variant="outlined"
                    color="secondary"
                    fullWidth
                    onClick={handleCancel}
                    sx={{ mt: 2 }}
                >
                    Cancel
                </Button>
            </Box>
        </Container>
    );
}