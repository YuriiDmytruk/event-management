'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  AppBar,
  Toolbar,
  Typography,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Grid,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Add as AddIcon,
  ViewList as ListIcon,
  Map as MapIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { EventCategory } from '../types/event-category.type';
import { Event } from '../types/event.types';
import ListView from '../components/ListView';
import MapView from '../components/MapView';
import { deleteEvent, fetchEvents } from '../actions/events';

type ViewMode = 'list' | 'map';

interface EventFilters {
  search: string;
  category: string;
  sortDirection: 'ASC' | 'DESC';
}

export default function EventsPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<EventFilters>({
    search: '',
    category: '',
    sortDirection: 'ASC'
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  useEffect(() => {
    loadEvents();
  }, [filters]);

  const loadEvents = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchEvents(filters);
      setEvents(data);
    } catch (err) {
      setError('Failed to load events');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewChange = (_: React.MouseEvent<HTMLElement>, newView: ViewMode | null) => {
    if (newView !== null) {
      setViewMode(newView);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, search: event.target.value }));
  };

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setFilters(prev => ({ ...prev, category: event.target.value }));
  };

  const handleDeleteClick = (id: string) => {
    setSelectedEventId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedEventId) {
      setIsLoading(true);
      try {
        const success = await deleteEvent(selectedEventId);
        if (success) {
          await loadEvents();
        } else {
          setError('Failed to delete event');
        }
      } catch (err) {
        setError('Failed to delete event');
        console.error(err);
      } finally {
        setIsLoading(false);
        setDeleteDialogOpen(false);
        setSelectedEventId(null);
      }
    }
  };

  return (
    <Box>
      <AppBar position="static">
        <Toolbar
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: { xs: 'space-between', md: 'flex-start' },
            alignItems: 'center',
            gap: { xs: 2, md: 5 }
          }}
        >
          <Typography variant="h6">
            Events
          </Typography>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewChange}
          >
            <ToggleButton value="list" aria-label="list view">
              <ListIcon />
            </ToggleButton>
            <ToggleButton value="map" aria-label="map view">
              <MapIcon />
            </ToggleButton>
          </ToggleButtonGroup>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddIcon />}
            onClick={() => router.push('/create')}
            sx={{
              borderRadius: { xs: '50%', sm: '4px' },
              minWidth: { xs: '40px', sm: 'auto' },
              width: { xs: '40px', sm: 'auto' },
              height: { xs: '40px', sm: 'auto' },
              padding: { xs: '8px', sm: '6px 16px' },
              '& .MuiButton-startIcon': {
                margin: { xs: 0, sm: '0 8px 0 -4px' }
              }
            }}
          >
            <Typography
              sx={{
                display: { xs: 'none', sm: 'block' },
                fontSize: '0.875rem'
              }}
            >
              Add Event
            </Typography>
          </Button>
        </Toolbar>
      </AppBar>

      <Container
        maxWidth="lg"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          marginY: 2,
          gap: 2,
        }}
      >
        <Box>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search events..."
                value={filters.search}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={filters.category}
                  onChange={handleCategoryChange}
                  label="Category"
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {Object.values(EventCategory).map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        {error && (
          <Alert severity="error">
            {error}
          </Alert>
        )}

        {isLoading ? (
          <Box>
            <CircularProgress />
          </Box>
        ) : viewMode === 'list' ? (
          <ListView
            events={events}
            onDeleteClick={handleDeleteClick}
          />
        ) : (
          <MapView
            events={events}
            onDeleteClick={handleDeleteClick}
            selectable
          />
        )}
      </Container>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this event?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}