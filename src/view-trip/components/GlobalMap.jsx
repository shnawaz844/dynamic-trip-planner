import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const GlobalMap = ({ tripData, selectedLocation }) => {
    const mapContainerRef = useRef(null);
    const map = useRef(null);
    const [zoom, setZoom] = useState(1);
    const [userLocation, setUserLocation] = useState(null);

    // Get token from env
    const mapboxToken = import.meta.env.VITE_MAPBOX_API_KEY || import.meta.env.NEXT_PUBLIC_MAPBOX_API_KEY;

    // Get user location
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                setUserLocation({
                    lng: position.coords.longitude,
                    lat: position.coords.latitude
                });
            });
        }
    }, []);

    useEffect(() => {
        if (!mapboxToken) return;
        if (map.current) return; // initialize map only once

        mapboxgl.accessToken = mapboxToken;

        map.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [55.3686, 25.3610], // Default to Sharjah (or trip center)
            zoom: zoom,
            projection: 'globe'
        });

        // Add Navigation
        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

        map.current.on('load', () => {
            // Add source for the dotted line
            map.current.addSource('route', {
                'type': 'geojson',
                'data': {
                    'type': 'Feature',
                    'properties': {},
                    'geometry': {
                        'type': 'LineString',
                        'coordinates': []
                    }
                }
            });

            // Add layer for the dotted line
            map.current.addLayer({
                'id': 'route',
                'type': 'line',
                'source': 'route',
                'layout': {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                'paint': {
                    'line-color': '#8b5cf6', // violet-500 to match place markers
                    'line-width': 3,
                    'line-dasharray': [2, 2] // Make it dotted
                }
            });
        });
    }, [mapboxToken]);

    const markers = useRef({}); // Store markers by coordinates/name to avoid duplicates and access them

    // Fly to selected location and show popup
    useEffect(() => {
        if (map.current && selectedLocation && userLocation) {
            const coords = typeof selectedLocation === 'string'
                ? selectedLocation
                : selectedLocation.coordinates;
            const name = typeof selectedLocation === 'object' ? selectedLocation.name : '';
            const photoUrl = typeof selectedLocation === 'object' ? selectedLocation.photoUrl : null;

            const [latStr, lngStr] = coords.split(',');
            const destLat = parseFloat(latStr);
            const destLng = parseFloat(lngStr);

            if (!isNaN(destLat) && !isNaN(destLng)) {
                // Update Path
                if (map.current.getSource('route')) {
                    map.current.getSource('route').setData({
                        'type': 'Feature',
                        'properties': {},
                        'geometry': {
                            'type': 'LineString',
                            'coordinates': [
                                [userLocation.lng, userLocation.lat],
                                [destLng, destLat]
                            ]
                        }
                    });
                }

                map.current.flyTo({
                    center: [destLng, destLat],
                    zoom: 15, // Zoom in closer for specific places
                    essential: true,
                    duration: 2000
                });

                // Show rich popup
                const popupContent = `
                    <div class="p-2 min-w-[150px]">
                        ${photoUrl ? `<img src="${photoUrl}" class="w-full h-24 object-cover rounded-lg mb-2 shadow-sm" />` : ''}
                        <h3 class="font-bold text-sm text-neutral-800">${name || 'Selected Place'}</h3>
                    </div>
                `;

                new mapboxgl.Popup({ offset: 35, closeButton: true, closeOnClick: true })
                    .setLngLat([destLng, destLat])
                    .setHTML(popupContent)
                    .addTo(map.current);
            }
        }
    }, [selectedLocation, userLocation]);

    // Add Markers (Hotels and Itinerary Places)
    useEffect(() => {
        if (!map.current || !tripData) return;

        // Clean up old markers if needed, though mapbox handles it if we recreat the map
        // For simplicity, we just add once. But tripData might update.

        const bounds = new mapboxgl.LngLatBounds();
        let hasCoords = false;

        // 1. Add Hotel Markers (Red)
        const hotels = tripData?.tripData?.hotels || [];
        hotels.forEach(hotel => {
            if (hotel.geoCoordinates) {
                const [latStr, lngStr] = hotel.geoCoordinates.split(',');
                const latitude = parseFloat(latStr);
                const longitude = parseFloat(lngStr);

                if (!isNaN(latitude) && !isNaN(longitude)) {
                    hasCoords = true;
                    new mapboxgl.Marker({ color: '#ef4444' }) // red-500
                        .setLngLat([longitude, latitude])
                        .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(
                            `<div class="p-1">
                                <h3 class="font-bold">${hotel.hotelName}</h3>
                                <p class="text-xs text-neutral-600">${hotel.description}</p>
                             </div>`
                        ))
                        .addTo(map.current);
                    bounds.extend([longitude, latitude]);
                }
            }
        });

        // 2. Add Itinerary Place Markers (Purple/Violet)
        const itinerary = tripData?.tripData?.itinerary || [];
        itinerary.forEach(day => {
            const places = day.plan || day.activities || [];
            places.forEach(place => {
                if (place.geoCoordinates) {
                    const [latStr, lngStr] = place.geoCoordinates.split(',');
                    const latitude = parseFloat(latStr);
                    const longitude = parseFloat(lngStr);

                    if (!isNaN(latitude) && !isNaN(longitude)) {
                        hasCoords = true;
                        new mapboxgl.Marker({ color: '#8b5cf6' }) // violet-500
                            .setLngLat([longitude, latitude])
                            .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(
                                `<div class="p-1">
                                    <h3 class="font-bold">${place.placeName}</h3>
                                    <p class="text-xs text-neutral-600">${place.timeToTravel || ''}</p>
                                 </div>`
                            ))
                            .addTo(map.current);
                        bounds.extend([longitude, latitude]);
                    }
                }
            });
        });

        if (hasCoords) {
            map.current.fitBounds(bounds, { padding: 100, maxZoom: 1.3 });
        }
    }, [tripData, mapboxToken]);

    return (
        <div className="w-full h-full rounded-xl overflow-hidden relative ">
            <div ref={mapContainerRef} className="w-full h-full" />
        </div>
    )
}

export default GlobalMap;