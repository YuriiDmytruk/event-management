import React, { useState } from 'react';
import { z } from 'zod';
import {
    TextField,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Grid,
    Box,
    Typography
} from '@mui/material';
import { EventSchema } from '../schemas/event.schema';
import { EventCategory } from '../types/event-category.type';
import { SelectChangeEvent } from '@mui/material/Select';

interface EventFormProps {
    initialData?: z.TypeOf<typeof EventSchema>;
    onSubmit: (data: z.infer<typeof EventSchema>) => Promise<void>;
}

export const EventForm: React.FC<EventFormProps> = ({ initialData, onSubmit }) => {
    const [formData, setFormData] = useState<z.infer<typeof EventSchema>>(initialData || {
        title: '',
        description: '',
        date: '',
        location: {
            address: '',
            latitude: 0,
            longitude: 0,
        },
        category: EventCategory.OTHER,
    });
    const [errors, setErrors] = useState<z.ZodError | null>(null);



    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }> |
            SelectChangeEvent<EventCategory>
    ) => {
        const targetName = 'name' in e.target ? e.target.name : undefined;
        const targetValue = 'value' in e.target ? e.target.value : undefined;

        // Ensure name is a string before using it
        if (typeof targetName !== 'string') return;

        // Handle nested location fields
        if (targetName.startsWith('location.')) {
            const locationField = targetName.split('.')[1];

            // Use type assertion to resolve computed property name issue
            setFormData(prev => ({
                ...prev,
                location: {
                    ...prev.location,
                    [locationField as keyof typeof prev.location]:
                        locationField === 'latitude' || locationField === 'longitude'
                            ? Number(targetValue)
                            : targetValue
                }
            }));
            return;
        }

        setFormData(prev => ({
            ...prev,
            [targetName]:
                targetName === 'category'
                    ? targetValue as EventCategory
                    : targetValue
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Ensure the date is in ISO datetime format
            const formDataWithProperDate = {
                ...formData,
                date: new Date(formData.date).toISOString()
            };

            // Validate the form data
            const validatedData = EventSchema.parse(formDataWithProperDate);

            // Clear any previous errors
            setErrors(null);

            // Call the onSubmit prop with validated data
            await onSubmit(validatedData);
        } catch (error) {
            if (error instanceof z.ZodError) {
                setErrors(error);
            } else {
                console.error('Submission error:', error);
            }
        }
    };

    // Helper function to get error message for a specific field
    const getErrorMessage = (fieldPath: string) => {
        if (!errors) return null;

        const error = errors.errors.find(
            err => err.path.join('.') === fieldPath
        );

        return error ? error.message : null;
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: 600, margin: 'auto' }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        id="title"
                        name="title"
                        label="Title"
                        value={formData.title}
                        onChange={handleChange}
                        error={!!getErrorMessage('title')}
                        helperText={getErrorMessage('title')}
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        id="description"
                        name="description"
                        label="Description"
                        multiline
                        rows={4}
                        value={formData.description}
                        onChange={handleChange}
                        error={!!getErrorMessage('description')}
                        helperText={getErrorMessage('description')}
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        id="date"
                        name="date"
                        label="Date"
                        type="datetime-local"
                        InputLabelProps={{ shrink: true }}
                        value={formData.date
                            ? new Date(formData.date).toISOString().slice(0, 16)
                            : ''
                        }
                        onChange={handleChange}
                        error={!!getErrorMessage('date')}
                        helperText={getErrorMessage('date')}
                    />
                </Grid>

                <Grid item xs={12}>
                    <FormControl fullWidth error={!!getErrorMessage('category')}>
                        <InputLabel id="category-label">Category</InputLabel>
                        <Select
                            labelId="category-label"
                            id="category"
                            name="category"
                            value={formData.category || ''}
                            label="Category"
                            onChange={handleChange}
                        >
                            {Object.values(EventCategory).map(category => (
                                <MenuItem key={category} value={category}>
                                    {category}
                                </MenuItem>
                            ))}
                        </Select>
                        {getErrorMessage('category') && (
                            <Typography color="error" variant="caption">
                                {getErrorMessage('category')}
                            </Typography>
                        )}
                    </FormControl>
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        id="location.address"
                        name="location.address"
                        label="Address"
                        value={formData.location.address}
                        onChange={handleChange}
                        error={!!getErrorMessage('location.address')}
                        helperText={getErrorMessage('location.address')}
                    />
                </Grid>

                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        id="location.latitude"
                        name="location.latitude"
                        label="Latitude"
                        type="number"
                        value={formData.location.latitude}
                        onChange={handleChange}
                        inputProps={{ step: "0.000001" }}
                        error={!!getErrorMessage('location.latitude')}
                        helperText={getErrorMessage('location.latitude')}
                    />
                </Grid>

                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        id="location.longitude"
                        name="location.longitude"
                        label="Longitude"
                        type="number"
                        value={formData.location.longitude}
                        onChange={handleChange}
                        inputProps={{ step: "0.000001" }}
                        error={!!getErrorMessage('location.longitude')}
                        helperText={getErrorMessage('location.longitude')}
                    />
                </Grid>

                <Grid item xs={12}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                    >
                        {initialData ? 'Update Event' : 'Create Event'}
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};