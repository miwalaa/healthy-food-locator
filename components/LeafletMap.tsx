"use client";

import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import MapUpdater from "./MapUpdater";

const healthyIcon = new L.Icon({
  iconUrl: "/assets/healthy-icon.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

interface LeafletMapProps {
  coords: { lat: number; lon: number };
  places: {
    fsq_id: string;
    name: string;
    geocodes: { main: { latitude: number; longitude: number } };
  }[];
}

const LeafletMap = ({ coords, places }: LeafletMapProps) => {
  return (
    <MapContainer
      center={[coords.lat, coords.lon]}
      zoom={13}
      scrollWheelZoom={false}
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapUpdater coords={coords} />
      <Marker icon={healthyIcon} position={[coords.lat, coords.lon]}>
        <Popup>Your Location</Popup>
      </Marker>
      {places.map((place) => (
        <Marker
          key={place.fsq_id}
          position={[
            place.geocodes.main.latitude,
            place.geocodes.main.longitude,
          ]}
          icon={healthyIcon}
        >
          <Popup>{place.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default LeafletMap;
