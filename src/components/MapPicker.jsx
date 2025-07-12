import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { LocateFixed } from 'lucide-react'

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
})

function LocationMarker({ onPositionChange, initialLat, initialLng }) {
    const [position, setPosition] = useState(
        initialLat && initialLng ? L.latLng(initialLat, initialLng) : null
    )

    const map = useMap()

    useEffect(() => {
        if (initialLat && initialLng) {
            const newPos = L.latLng(initialLat, initialLng);
            setPosition(newPos);
            map.flyTo(newPos, 15);
        }
    }, [initialLat, initialLng, map]);

    useMapEvents({
        click(e) {

            const newPos = e.latlng;
            setPosition(newPos);

            onPositionChange(newPos);

            map.flyTo(newPos, map.getZoom())
        },
    })

    if (!position) {
        return null
    }

    return <Marker position={position}></Marker>
}


const MapPicker = ({ onLocationSelect, initialLat, initialLng }) => {
    const defaultPosition = [-2.5489, 118.0149]

    const [isLocating, setIsLocating] = useState(false)
    const [locationError, setLocationError] = useState('')

    // const [currentPos, setCurrentPos] = useState({ lat: initialLat, lng: initialLng })

    const handleGetMyLocation = () => {
        if (!navigator.geolocation) {
            setLocationError('Geolocation is not supported by your browser.')
            return
        }

        setIsLocating(true)
        setLocationError('')

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords
                
                // setCurrentPos({ lat: latitude, lng: longitude })

                onLocationSelect(latitude, longitude)
                
                setIsLocating(false)
            },
            (error) => {
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        setLocationError('You denied the request for location access.')
                        break;
                    case error.POSITION_UNAVAILABLE:
                        setLocationError('Location information is unavailable.')
                        break;
                    case error.TIMEOUT:
                        setLocationError('The request to get your location timed out.')
                        break;
                    default:
                        setLocationError('An unknown error occurred while retrieving your location.')
                        break;
                }
                setIsLocating(false);
            }
        )
    }

    const handlePositionChange = (latlng) => {
        // setCurrentPos({ lat: latlng.lat, lng: latlng.lng })
        onLocationSelect(latlng.lat, latlng.lng)
    }

    const mapCenter = initialLat && initialLng ? [initialLat, initialLng] : defaultPosition
    // const mapCenter = currentPos.lat && currentPos.lng ? [currentPos.lat, currentPos.lng] : defaultPosition

    const initialZoom = initialLat && initialLng ? 15 : 5
    // const initialZoom = currentPos.lat && currentPos.lng ? 15 : 5

    return (
        <div className="h-64 w-full rounded-md overflow-hidden border relative">
            <button
                type="button"
                onClick={handleGetMyLocation}
                disabled={isLocating}
                className="absolute top-2 right-2 z-[1000] bg-white p-2 rounded-md shadow-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Use My Location"
            >
                {isLocating 
                    ? <div className="animate-spin h-5 w-5 border-2 border-t-transparent border-gray-700 rounded-full" /> 
                    : <LocateFixed size={20} />
                }
            </button>

            <MapContainer center={mapCenter} zoom={initialZoom} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker
                    onPositionChange={handlePositionChange}
                    initialLat={initialLat} 
                    initialLng={initialLng}
                />
                {/* <LocationMarker
                    onPositionChange={handlePositionChange}
                    initialLat={currentPos.lat}
                    initialLng={currentPos.lng}
                /> */}
            </MapContainer>
        </div>
    );
};

export default MapPicker