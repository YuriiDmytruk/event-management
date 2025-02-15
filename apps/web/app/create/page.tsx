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
import { EventForm } from '../../components/EventForm';
import { createEvent } from '../actions';
import { z } from 'zod';
import { EventSchema } from '../../schemas/event.schema';

export default function CreateEventPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (formData: z.infer<typeof EventSchema>) => {
        try {
            setError(null);
            const result = await createEvent(formData);

            if (result) {
                router.push(`/${result.id}`);
            } else {
                setError('Failed to create event. Please try again.');
            }
        } catch (err) {
            if (err instanceof z.ZodError) {
                throw err;
            }
            console.error('Error creating event:', err);
            setError('An unexpected error occurred. Please try again.');
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
                    Create New Event
                </Typography>

                {error && (
                    <Box sx={{ width: '100%', mb: 2 }}>
                        <Alert severity="error">{error}</Alert>
                    </Box>
                )}

                <EventForm onSubmit={handleSubmit} />

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