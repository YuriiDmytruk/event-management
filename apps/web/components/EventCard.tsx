'use client';

import React from 'react';
import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Button,
    IconButton,
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { Event } from '../types/event.types';

interface EventCardProps {
    event: Event;
    onDeleteClick: (id: string) => void;
}

export default function EventCard({ event, onDeleteClick }: EventCardProps) {
    const router = useRouter();

    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                    {event.title}
                </Typography>
                <Typography color="text.secondary" gutterBottom>
                    {new Date(event.date).toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {event.location.address}
                </Typography>
                <Typography variant="body2" sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical'
                }}>
                    {event.description}
                </Typography>
            </CardContent>
            <CardActions>
                <Button
                    size="small"
                    onClick={() => router.push(`/${event.id}`)}
                >
                    View
                </Button>
                <IconButton
                    size="small"
                    onClick={() => router.push(`/${event.id}/edit`)}
                    aria-label="edit"
                >
                    <EditIcon />
                </IconButton>
                <IconButton
                    size="small"
                    color="error"
                    onClick={() => onDeleteClick(event.id!)}
                    aria-label="delete"
                >
                    <DeleteIcon />
                </IconButton>
            </CardActions>
        </Card>
    );
}