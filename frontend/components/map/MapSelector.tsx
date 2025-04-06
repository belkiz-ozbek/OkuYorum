'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { MapPin } from 'lucide-react';

interface Location {
    lat: number;
    lng: number;
}

interface MapSelectorProps {
    action?: (location: Location) => void;
    onLocationSelect?: (location: Location) => void;
    initialLocation?: Location;
    height?: string;
}

interface GeolocationError {
    code: number;
    message: string;
}

export function MapSelector({ 
    action,
    onLocationSelect, 
    initialLocation = { lat: 39.9334, lng: 32.8597 }, // Ankara merkez
    height = '300px' 
}: MapSelectorProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(true);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const [markerInstance, setMarkerInstance] = useState<google.maps.Marker | null>(null);

    const handleUseCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const currentLocation: Location = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };

                    if (mapInstance && markerInstance) {
                        mapInstance.setCenter(currentLocation);
                        markerInstance.setPosition(currentLocation);
                        
                        if (action) {
                            action(currentLocation);
                        }
                        
                        if (onLocationSelect) {
                            onLocationSelect(currentLocation);
                        }
                    }
                },
                (error: GeolocationError) => {
                    console.error('Konum alınamadı:', error.message);
                }
            );
        }
    };

    useEffect(() => {
        const initMap = async () => {
            const loader = new Loader({
                apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
                version: 'weekly',
            });

            try {
                const google = await loader.load();
                
                if (!mapRef.current) return;

                const map = new google.maps.Map(mapRef.current, {
                    center: initialLocation,
                    zoom: 12,
                    mapTypeControl: false,
                    streetViewControl: false,
                    fullscreenControl: false,
                });

                const marker = new google.maps.Marker({
                    position: initialLocation,
                    map: map,
                    draggable: true,
                    animation: google.maps.Animation.DROP,
                });

                setMapInstance(map);
                setMarkerInstance(marker);

                // Marker sürüklendiğinde konum güncelle
                marker.addListener('dragend', () => {
                    const position = marker.getPosition();
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
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                map.addListener('click', (e: google.maps.MapMouseEvent) => {
                    if (e.latLng) {
                        marker.setPosition(e.latLng);
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
        <div className="space-y-4">
            <div className="relative w-full" style={{ height }}>
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <MapPin className="h-5 w-5 animate-bounce" />
                            <span>Harita yükleniyor...</span>
                        </div>
                    </div>
                )}
                <div ref={mapRef} className="h-full w-full rounded-lg" />
            </div>
            
            <button
                onClick={handleUseCurrentLocation}
                className="w-full py-2 px-4 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors duration-200 flex items-center justify-center gap-2"
            >
                <MapPin className="h-4 w-4" />
                Mevcut Konumumu Kullan
            </button>
        </div>
    );
} 