"use client";

import React from "react";
import { useState } from "react";
import Image from "next/image"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import MapUpdater from "@/components/MapUpdater";
import L from "leaflet";
import Navbar from "@/components/Navbar";
import axios from "axios";

interface FoursquarePlace {
  fsq_id: string;
  name: string;
  geocodes: {
    main: {
      latitude: number;
      longitude: number;
    };
  };
  categories: { name: string }[];
  location: {
    address?: string;
    locality?: string;
  };
  photos?: Array<{
    id: string;
    prefix: string;
    suffix: string;
  }>;
  rating?: number;
}

const healthyIcon = new L.Icon({
  iconUrl: "/assets/healthy-icon.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

export default function Home() {
  const [location, setLocation] = useState("");
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [places, setPlaces] = useState<FoursquarePlace[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchNearbyHealthyPlaces(lat: number, lng: number): Promise<FoursquarePlace[]> {
    const url = `https://api.foursquare.com/v3/places/search`;
    const config = {
      headers: {
        Accept: "application/json",
        Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY || "",
      },
      params: {
        ll: `${lat},${lng}`,
        radius: 2000,
        query: "healthy food",
        limit: 10,
      },
    };

    try {
      const response = await axios.get(url, config);
      return response.data.results;
    } catch (error) {
      console.error("Error fetching Foursquare places", error);
      return [];
    }
  }

  async function fetchPlaceDetails(fsq_id: string) {
    try {
      const detailRes = await axios.get(`https://api.foursquare.com/v3/places/${fsq_id}`, {
        headers: {
          Accept: "application/json",
          Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY || "",
        },
      });
      return detailRes.data;
    } catch (error) {
      console.error(`Error fetching details for place ${fsq_id}`, error);
      return null;
    }
  }

  const handleSearch = async () => {
    setError("");
    setCoords(null);
    setPlaces([]);
    setLoading(true);

    if (!location.trim()) {
      setError("Please enter a location name.");
      setLoading(false);
      return;
    }

    try {
      // Get coordinates from location name using Nominatim
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`,
        {
          headers: {
            "User-Agent": "HealthyFoodLocator/1.0 (miwalaksmanaanthony@gmail.com)",
          },
        }
      );

      const data = await res.json();

      if (data.length === 0) {
        setError("Location not found.");
        setLoading(false);
        return;
      }

      const lat = parseFloat(data[0].lat);
      const lon = parseFloat(data[0].lon);

      setCoords({ lat, lon });

      // Fetch nearby places from Foursquare
      const nearbyPlaces = await fetchNearbyHealthyPlaces(lat, lon);

      // Fetch details (photos, rating) for each place
      const placesWithDetails = await Promise.all(
        nearbyPlaces.map(async (place) => {
          const details = await fetchPlaceDetails(place.fsq_id);
          return {
            ...place,
            photos: details?.photos || [],
            rating: details?.rating || null,
          };
        })
      );

      setPlaces(placesWithDetails);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch location or places.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-green-50 px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-green-800 mb-6">
          Healthy Food Locator
        </h1>

        <div className="max-w-xl mx-auto space-y-4">
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded"
            placeholder="Enter a location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <button
            onClick={handleSearch}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>
          {error && <p className="text-red-500">{error}</p>}
        </div>

        <div className="mt-8 max-w-4xl mx-auto">
          {coords ? (
            <div className="h-[400px] w-full rounded overflow-hidden shadow">
              <MapContainer
                center={[coords.lat, coords.lon]}
                zoom={13}
                scrollWheelZoom={false}
                className="h-full w-full"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
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
            </div>
          ) : (
            <p className="text-center text-gray-600 mt-6">
              Enter a location to see it on the map
            </p>
          )}
        </div>

        {/* Places cards */}
        {places.length > 0 && (
          <div className="max-w-4xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            {places.map((place) => {
              const photoUrl =
                place.photos && place.photos.length > 0
                  ? place.photos[0].prefix + "300x300" + place.photos[0].suffix
                  : "/assets/default-photo.png"; // fallback photo you should add to public/assets

              return (
                <div
                  key={place.fsq_id}
                  className="bg-white rounded shadow p-4 flex space-x-4"
                >
                  <Image
                    src={photoUrl}
                    alt="default"
                    width={300}    // set to your desired dimensions
                    height={200}
                    className="rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-green-800">
                      {place.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {place.location.address || "Address not available"}
                    </p>
                    <p className="text-sm mt-2">
                      Rating:{" "}
                      <span className="font-bold">
                        {typeof place.rating === "number" ? place.rating.toFixed(1) : "N/A"}
                      </span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
