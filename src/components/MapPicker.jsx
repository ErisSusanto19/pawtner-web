// src/components/MapPicker.js

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
})

function LocationMarker({ onPositionChange }) {
    const [position, setPosition] = useState(null);

    const map = useMapEvents({
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


const MapPicker = ({ onLocationSelect }) => {
    const defaultPosition = [-2.5489, 118.0149]

    const handlePositionChange = (latlng) => {
        onLocationSelect(latlng.lat, latlng.lng)
    }

    return (
        <div className="h-64 w-full rounded-md overflow-hidden border">
            <MapContainer center={defaultPosition} zoom={5} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker onPositionChange={handlePositionChange} />
            </MapContainer>
        </div>
    );
};

export default MapPicker