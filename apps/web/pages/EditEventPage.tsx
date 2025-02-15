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
import { updateEvent } from '../app/actions';
import { EventForm } from '../components/EventForm';


export default function EditEventClient({
    initialData
}: {
    initialData: Event
}) {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const formattedInitialData = {
        ...initialData,
        date: new Date(initialData.date).toISOString().slice(0, 16)
    };

    const handleSubmit = async (formData: {
        title: string;
        description: string;
        date: string;
        location: {
            address: string;
            latitude: number;
            longitude: number;
        };
        category: EventCategory;
    }) => {
        try {
            setError(null);

            if (!initialData.id) return

            const result = await updateEvent(initialData.id, formData);

            if (result) {
                router.push(`/${result.id}`);
            } else {
                setError('Failed to update event. Please try again.');
            }
        } catch (err) {
            console.error('Error updating event:', err);
            setError('An unexpected error occurred');
        }
    };

    const handleCancel = () => {
        router.push('/');
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
                >
                    Cancel
                </Button>
            </Box>
        </Container >
    );
}