import React, { useState, useCallback } from 'react';
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';
import { Event } from '../types/event.types';
import EventCard from './EventCard';

interface MapViewProps {
    events: Event[];
    onDeleteClick: (id: string) => void;
    selectable?: boolean;
}

const MapView: React.FC<MapViewProps> = ({ events, onDeleteClick, selectable }) => {
    const defaultCenter = events.length > 0 && events[0]?.location
        ? {
            lat: events[0].location.latitude,
            lng: events[0].location.longitude
        }
        : { lat: 40.7128, lng: -74.0060 };

    const containerStyle = {
        width: '100%',
        height: '600px',
    }

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    })

    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [mapCenter, setMapCenter] = useState(defaultCenter);

    const [map, setMap] = useState<google.maps.Map | null>(null);

    const handleMarkerClick = useCallback((event: Event) => {
        setSelectedEvent(event);
        const newCenter = {
            lat: event.location.latitude,
            lng: event.location.longitude
        };
        setMapCenter(newCenter);
        if (map) {
            map.panTo(newCenter);
        }
    }, [map]);
    const onMapLoad = useCallback((mapInstance: google.maps.Map) => {
        setMap(mapInstance);
    }, []);

    if (!isLoaded) return <div>Loading...</div>

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={mapCenter}
            zoom={10}
            onLoad={onMapLoad}
        >
            {events.map((event) => (
                <Marker
                    key={event.id}
                    position={{
                        lat: event.location.latitude,
                        lng: event.location.longitude
                    }}
                    label={{
                        text: event.title,
                        color: '#FFFFFF',
                        fontWeight: 'bold',
                        fontSize: '12px'
                    }}
                    onClick={() => { if (selectable) handleMarkerClick(event) }}
                />
            ))}
            {selectedEvent && (
                <InfoWindow
                    position={{
                        lat: selectedEvent.location.latitude,
                        lng: selectedEvent.location.longitude
                    }}
                    onCloseClick={() => {
                        setSelectedEvent(null);
                    }}
                >
                    <EventCard event={selectedEvent} onDeleteClick={onDeleteClick} />
                </InfoWindow>
            )}
        </GoogleMap>
    );
};

export default MapView;