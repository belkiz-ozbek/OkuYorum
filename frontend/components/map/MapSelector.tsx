'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { MapPin } from 'lucide-react';

interface MapSelectorProps {
    action?: (location: { lat: number; lng: number }) => void;
    onLocationSelect?: (location: { lat: number; lng: number }) => void;
    initialLocation?: { lat: number; lng: number };
    height?: string;
}

export function MapSelector({ 
    action,
    onLocationSelect, 
    initialLocation = { lat: 39.9334, lng: 32.8597 }, // Ankara merkez
    height = '300px' 
}: MapSelectorProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initMap = async () => {
            const loader = new Loader({
                apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
                version: 'weekly',
            });

            try {
                const google = await loader.load();
                
                if (!mapRef.current) return;

                const mapInstance = new google.maps.Map(mapRef.current, {
                    center: initialLocation,
                    zoom: 12,
                    mapTypeControl: false,
                    streetViewControl: false,
                    fullscreenControl: false,
                });

                const markerInstance = new google.maps.Marker({
                    position: initialLocation,
                    map: mapInstance,
                    draggable: true,
                    animation: google.maps.Animation.DROP,
                });

                // Marker sürüklendiğinde konum güncelle
                markerInstance.addListener('dragend', () => {
                    const position = markerInstance.getPosition();
                    if (position) {
                        const newLocation = {
                            lat: position.lat(),
                            lng: position.lng(),
                        };
                        
                        if (action) {
                            action(newLocation);
                        }
                        
                        if (onLocationSelect) {
                            onLocationSelect(newLocation);
                        }
                    }
                });

                // Haritaya tıklandığında marker'ı taşı
                mapInstance.addListener('click', (e: google.maps.MapMouseEvent) => {
                    if (e.latLng) {
                        markerInstance.setPosition(e.latLng);
                        const newLocation = {
                            lat: e.latLng.lat(),
                            lng: e.latLng.lng(),
                        };
                        
                        if (action) {
                            action(newLocation);
                        }
                        
                        if (onLocationSelect) {
                            onLocationSelect(newLocation);
                        }
                    }
                });

                setIsLoading(false);

                // İlk konum seçimini bildir
                const initialLocationObj = {
                    lat: initialLocation.lat,
                    lng: initialLocation.lng
                };
                
                if (action) {
                    action(initialLocationObj);
                }
                
                if (onLocationSelect) {
                    onLocationSelect(initialLocationObj);
                }
            } catch (error) {
                console.error('Google Maps yüklenirken hata:', error);
                setIsLoading(false);
            }
        };

        initMap();
    }, [initialLocation, action, onLocationSelect]);

    return (
        <div className="relative w-full" style={{ height }}>
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <MapPin className="h-5 w-5 animate-bounce" />
                        <span>Harita yükleniyor...</span>
                    </div>
                </div>
            )}
            <div ref={mapRef} className="h-full w-full" />
        </div>
    );
} 