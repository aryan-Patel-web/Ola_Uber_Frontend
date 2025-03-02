import React, { useState, useEffect } from 'react';
import { LoadScript, GoogleMap, Marker } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '100%',
};

const defaultCenter = {
    lat: -3.745,
    lng: -38.523,
};

const LiveTracking = () => {
    const [currentPosition, setCurrentPosition] = useState(defaultCenter);

    useEffect(() => {
        // Check if Geolocation is available
        if (!navigator.geolocation) {
            console.error("Geolocation is not supported by this browser.");
            return;
        }

        // Update position when available
        const updatePosition = (position) => {
            const { latitude, longitude } = position.coords;
            setCurrentPosition({
                lat: latitude,
                lng: longitude, 
            });
        };

        // Handle geolocation errors
        const handleError = (error) => {
            console.error("Error fetching geolocation:", error.message);
        };

        // Get initial position
        navigator.geolocation.getCurrentPosition(updatePosition, handleError);

        // Watch position for live updates
        const watchId = navigator.geolocation.watchPosition(updatePosition, handleError);

        // Cleanup on unmount
        return () => {
            navigator.geolocation.clearWatch(watchId);
        };
    }, []);

    return (
        <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={currentPosition}
                zoom={15}
            >
                <Marker position={currentPosition} />
            </GoogleMap>
        </LoadScript>
    );
};

export default LiveTracking;
