import type React from "react"
import { useState, useEffect } from "react"
import { MapPin } from "lucide-react"
import { Button } from "./button"

type Location = {
  lat: number
  lng: number
}

type MapSelectorProps = {
  onLocationSelect?: (location: Location) => void
  location?: Location
  setLocation?: (location: Location) => void
  readOnly?: boolean
  error?: string
}

export function MapSelector({ 
  onLocationSelect, 
  location, 
  setLocation, 
  readOnly = false,
  error
}: MapSelectorProps) {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)

  // Sync with external location if provided
  useEffect(() => {
    if (location && location.lat !== 0 && location.lng !== 0) {
      setSelectedLocation(location)
    }
  }, [location])

  const handleMapClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (readOnly) return

    // In a real implementation, this would use the Google Maps API
    // For now, we'll just use the click coordinates as a simulation
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    const newLocation = {
      lat: 41 - (y / rect.height) * 2, // Simulating latitude (Istanbul is around 41°N)
      lng: 28 + (x / rect.width) * 2, // Simulating longitude (Istanbul is around 28°E)
    }

    setSelectedLocation(newLocation)
    
    // Call the appropriate callback
    if (onLocationSelect) {
      onLocationSelect(newLocation)
    }
    
    if (setLocation) {
      setLocation(newLocation)
    }
  }

  const handleUseCurrentLocation = () => {
    if (readOnly) return

    // In a real implementation, this would use the browser's geolocation API
    // For now, we'll just use a fixed location as a simulation
    const currentLocation = { lat: 41.0082, lng: 28.9784 } // Istanbul coordinates
    setSelectedLocation(currentLocation)
    
    // Call the appropriate callback
    if (onLocationSelect) {
      onLocationSelect(currentLocation)
    }
    
    if (setLocation) {
      setLocation(currentLocation)
    }
  }

  return (
    <div className="space-y-4">
      <div 
        className={`w-full h-64 bg-gray-200 relative cursor-pointer ${readOnly ? 'cursor-default' : 'cursor-pointer'} ${error ? 'border-2 border-red-500' : ''}`} 
        onClick={handleMapClick}
      >
        {/* This would be replaced with an actual Google Map */}
        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
          {readOnly ? "Seçilen Konum" : "Harita Burada Görüntülenecek"}
        </div>
        {selectedLocation && selectedLocation.lat !== 0 && selectedLocation.lng !== 0 && (
          <MapPin
            className="absolute text-red-500"
            style={{
              left: `${((selectedLocation.lng - 28) / 2) * 100}%`,
              top: `${((41 - selectedLocation.lat) / 2) * 100}%`,
            }}
          />
        )}
      </div>
      
      {!readOnly && (
        <Button onClick={handleUseCurrentLocation} variant="outline" className="w-full">
          Mevcut Konumumu Kullan
        </Button>
      )}
      
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
      
      {selectedLocation && selectedLocation.lat !== 0 && selectedLocation.lng !== 0 && (
        <p className="text-sm text-gray-600">
          Seçilen Konum: {selectedLocation.lat.toFixed(4)}°N, {selectedLocation.lng.toFixed(4)}°E
        </p>
      )}
    </div>
  )
}

