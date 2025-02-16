import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

interface LocationPickerMapProps {
    initialLocation?: {
        lat: number;
        lng: number;
    };
    onLocationChange: (location: { latitude: number; longitude: number }) => void;
    externalLocation?: {
        lat: number;
        lng: number;
    };
}

const LocationPickerMap: React.FC<LocationPickerMapProps> = ({
    initialLocation = { lat: 40.7128, lng: -74.0060 },
    onLocationChange,
    externalLocation
}) => {
    const containerStyle = {
        width: '100%',
        height: '400px',
    };

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    });

    const [markerPosition, setMarkerPosition] = useState({
        lat: initialLocation.lat,
        lng: initialLocation.lng
    });

    useEffect(() => {
        if (externalLocation) {
            setMarkerPosition({
                lat: externalLocation.lat,
                lng: externalLocation.lng
            });
        }
    }, [externalLocation]);

    const handleMarkerDrag = useCallback((event: google.maps.MapMouseEvent) => {
        if (event.latLng) {
            const newPosition = {
                lat: event.latLng.lat(),
                lng: event.latLng.lng()
            };
            setMarkerPosition(newPosition);
            onLocationChange({
                latitude: newPosition.lat,
                longitude: newPosition.lng
            });
        }
    }, [onLocationChange]);

    const handleMapClick = useCallback((event: google.maps.MapMouseEvent) => {
        if (event.latLng) {
            const newPosition = {
                lat: event.latLng.lat(),
                lng: event.latLng.lng()
            };
            setMarkerPosition(newPosition);
            onLocationChange({
                latitude: newPosition.lat,
                longitude: newPosition.lng
            });
        }
    }, [onLocationChange]);

    if (!isLoaded) return <div>Loading...</div>;

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={markerPosition}
            zoom={13}
            onClick={handleMapClick}
        >
            <Marker
                position={markerPosition}
                draggable={true}
                onDragEnd={handleMarkerDrag}
            />
        </GoogleMap>
    );
};

export default LocationPickerMap;