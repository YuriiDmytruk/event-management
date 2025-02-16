import React, { useState, useCallback, useMemo } from 'react';
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
    Typography,
    Autocomplete,
    CircularProgress
} from '@mui/material';
import { EventSchema } from '../schemas/event.schema';
import { EventCategory } from '../types/event-category.type';
import { SelectChangeEvent } from '@mui/material/Select';
import LocationPickerMap from './LocationPickerMap';
import { AddressSuggestion } from '../types/address-suggestion';
import { fetchAddressFromCoordinatesAction, fetchAddressSuggestionsAction } from '../actions/geocoding';

interface EventFormProps {
    initialData?: z.TypeOf<typeof EventSchema>;
    onSubmit: (data: z.infer<typeof EventSchema>) => Promise<void>;
}

export const EventForm: React.FC<EventFormProps> = ({ initialData, onSubmit }) => {
    const [formData, setFormData] = useState<z.infer<typeof EventSchema>>(initialData || {
        title: '',
        description: '',
        date: new Date().toISOString(),
        location: {
            address: '',
            latitude: 40.7128,
            longitude: -74.0060,
        },
        category: EventCategory.OTHER,
    });

    const [errors, setErrors] = useState<z.ZodError | null>(null);
    const [addressSuggestions, setAddressSuggestions] = useState<AddressSuggestion[]>([]);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
    const [isLoadingReverseGeo, setIsLoadingReverseGeo] = useState(false);

    const debounce = <F extends (...args: any[]) => void>(func: F, delay: number) => {
        let timeoutId: NodeJS.Timeout;
        return (...args: Parameters<F>) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func(...args), delay);
        };
    };

    const fetchAddressSuggestions = useCallback(async (input: string) => {
        setIsLoadingSuggestions(true);
        try {
            const suggestions = await fetchAddressSuggestionsAction(input);
            setAddressSuggestions(suggestions);
        } catch (error) {
            console.error('Error fetching address suggestions:', error);
            setAddressSuggestions([]);
        } finally {
            setIsLoadingSuggestions(false);
        }
    }, []);

    const debouncedFetchAddressSuggestions = useMemo(
        () => debounce(fetchAddressSuggestions, 500),
        [fetchAddressSuggestions]
    );

    const fetchAddressFromCoordinates = useCallback(async (lat: number, lon: number) => {
        setIsLoadingReverseGeo(true);
        try {
            const address = await fetchAddressFromCoordinatesAction(lat, lon);
            if (address) {
                setFormData(prev => ({
                    ...prev,
                    location: {
                        ...prev.location,
                        address
                    }
                }));
            }
        } catch (error) {
            console.error('Error fetching address from coordinates:', error);
        } finally {
            setIsLoadingReverseGeo(false);
        }
    }, []);

    const handleLocationChange = useCallback((location: { latitude: number; longitude: number }) => {
        setFormData(prev => ({
            ...prev,
            location: {
                ...prev.location,
                latitude: location.latitude,
                longitude: location.longitude
            }
        }));

        fetchAddressFromCoordinates(location.latitude, location.longitude);
    }, [fetchAddressFromCoordinates]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }> |
            SelectChangeEvent<EventCategory>
    ) => {
        const targetName = 'name' in e.target ? e.target.name : undefined;
        const targetValue = 'value' in e.target ? e.target.value : undefined;

        if (typeof targetName !== 'string') return;

        if (targetName === 'location.address') {
            const addressValue = targetValue as string;
            setFormData(prev => ({
                ...prev,
                location: {
                    ...prev.location,
                    address: addressValue
                }
            }));

            debouncedFetchAddressSuggestions(addressValue);
            return;
        }

        if (targetName.startsWith('location.')) {
            const locationField = targetName.split('.')[1];

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

    const handleAddressSelect = (
        _event: React.SyntheticEvent,
        value: AddressSuggestion | null
    ) => {
        if (value) {
            setFormData(prev => ({
                ...prev,
                location: {
                    ...prev.location,
                    address: value.label,
                    latitude: value.latitude,
                    longitude: value.longitude
                }
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const formDataWithProperDate = {
                ...formData,
                date: new Date(formData.date).toISOString()
            };

            const validatedData = EventSchema.parse(formDataWithProperDate);

            setErrors(null);

            await onSubmit(validatedData);
        } catch (error) {
            if (error instanceof z.ZodError) {
                setErrors(error);
            } else {
                console.error('Submission error:', error);
            }
        }
    };

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
                    <Typography variant="h6" gutterBottom>
                        Select Event Location
                    </Typography>
                    <LocationPickerMap
                        initialLocation={{
                            lat: formData.location.latitude,
                            lng: formData.location.longitude
                        }}
                        onLocationChange={handleLocationChange}
                        externalLocation={{
                            lat: formData.location.latitude,
                            lng: formData.location.longitude
                        }}
                    />
                </Grid>

                <Grid item xs={12}>
                    <Autocomplete
                        fullWidth
                        options={addressSuggestions}
                        loading={isLoadingSuggestions}
                        getOptionLabel={(option) => option.label}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                id="location.address"
                                name="location.address"
                                label="Address"
                                value={formData.location.address}
                                onChange={handleChange}
                                error={!!getErrorMessage('location.address')}
                                helperText={getErrorMessage('location.address')}
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <>
                                            {isLoadingSuggestions ? <CircularProgress color="inherit" size={20} /> : null}
                                            {params.InputProps.endAdornment}
                                        </>
                                    ),
                                }}
                            />
                        )}
                        value={{
                            label: formData.location.address,
                            latitude: formData.location.latitude,
                            longitude: formData.location.longitude
                        }}
                        onChange={handleAddressSelect}
                        onInputChange={(_, newInputValue) => {
                            setFormData(prev => ({
                                ...prev,
                                location: {
                                    ...prev.location,
                                    address: newInputValue
                                }
                            }));
                        }}
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
                        InputProps={{
                            endAdornment: isLoadingReverseGeo ? <CircularProgress size={20} /> : null
                        }}
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
                        InputProps={{
                            endAdornment: isLoadingReverseGeo ? <CircularProgress size={20} /> : null
                        }}
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

export default EventForm;