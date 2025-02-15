'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Container,
    Typography,
    Box,
    Alert,
    Button,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import { Event } from '../types/event.types';
import { deleteEvent } from '../app/actions';

export default function EventDetailPage({
    initialData
}: {
    initialData: Event
}) {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleBack = () => {
        router.push('/');
    };

    const handleEdit = () => {
        router.push(`/${initialData.id}/edit`);
    };

    const handleDeleteClick = () => {
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            setIsLoading(true);
            if (!initialData.id) return;

            const result = await deleteEvent(initialData.id);

            if (result) {
                router.push('/events');
            } else {
                setError('Failed to delete event. Please try again.');
            }
        } catch (err) {
            console.error('Error deleting event:', err);
            setError('An unexpected error occurred');
        } finally {
            setIsLoading(false);
            setDeleteDialogOpen(false);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
    };

    return (
        <Container maxWidth="md">
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                py: 4
            }}>
                {error && (
                    <Box sx={{ width: '100%', mb: 2 }}>
                        <Alert severity="error">{error}</Alert>
                    </Box>
                )}

                <Typography variant="h4" component="h1" gutterBottom>
                    {initialData.title}
                </Typography>

                <Box sx={{ width: '100%', mb: 2 }}>
                    <Typography variant="body1" paragraph>
                        <strong>Description:</strong> {initialData.description}
                    </Typography>

                    <Typography variant="body1">
                        <strong>Date:</strong> {new Date(initialData.date).toLocaleString()}
                    </Typography>

                    <Typography variant="body1">
                        <strong>Category:</strong> {initialData.category}
                    </Typography>

                    <Typography variant="body1">
                        <strong>Location:</strong> {initialData.location.address}
                    </Typography>

                    <Typography variant="body1">
                        <strong>Coordinates:</strong> {initialData.location.latitude}, {initialData.location.longitude}
                    </Typography>
                </Box>

                <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item xs={4}>
                        <Button
                            variant="outlined"
                            color="secondary"
                            fullWidth
                            onClick={handleBack}
                        >
                            Back to Events
                        </Button>
                    </Grid>
                    <Grid item xs={4}>
                        <Button
                            variant="outlined"
                            color="primary"
                            fullWidth
                            onClick={handleEdit}
                        >
                            Edit Event
                        </Button>
                    </Grid>
                    <Grid item xs={4}>
                        <Button
                            variant="contained"
                            color="error"
                            fullWidth
                            onClick={handleDeleteClick}
                        >
                            Delete Event
                        </Button>
                    </Grid>
                </Grid>

                <Dialog
                    open={deleteDialogOpen}
                    onClose={handleDeleteCancel}
                >
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogContent>
                        Are you sure you want to delete this event?
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDeleteCancel} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleDeleteConfirm}
                            color="error"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Deleting...' : 'Delete'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Container>
    );
}