"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import Image from "next/image";

const LeafletMap = dynamic(() => import("@/components/LeafletMap"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-300 animate-pulse rounded" />,
});

interface Place {
  fsq_id: string;
  name: string;
  geocodes: {
    main: {
      latitude: number;
      longitude: number;
    };
  };
}

export default function Home() {
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [locationInput, setLocationInput] = useState("");
  const [initialLoading, setInitialLoading] = useState(true);

  const fetchCoords = async (locationName: string) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}`
      );
      const firstResult = response.data[0];
      return firstResult
        ? {
            lat: parseFloat(firstResult.lat),
            lon: parseFloat(firstResult.lon),
          }
        : null;
    } catch (error) {
      console.error("Geocoding error:", error);
      return null;
    }
  };

  const fetchPlaces = async (coords: { lat: number; lon: number }) => {
    try {
      const response = await axios.get(
        `https://api.foursquare.com/v3/places/search?ll=${coords.lat},${coords.lon}&query=healthy`,
        {
          headers: {
            Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY || "",
          },
        }
      );
      setPlaces(response.data.results || []);
    } catch (error) {
      console.error("Foursquare error:", error);
      setPlaces([]);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    const coordinates = await fetchCoords(locationInput);
    if (coordinates) {
      setCoords(coordinates);
      await fetchPlaces(coordinates);
    }
    setLoading(false);
  };

  useEffect(() => {
    const loadDefault = async () => {
      const defaultLocation = "Jakarta, Indonesia";
      const coordinates = await fetchCoords(defaultLocation);
      if (coordinates) {
        setCoords(coordinates);
        await fetchPlaces(coordinates);
      }
      setInitialLoading(false);
    };
    loadDefault();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="bg-gray-700 text-white px-6 py-4 flex items-center">
        <Image src="/LOGO.png" alt="Logo" width={60} height={60} />
      </header>

      {/* Title & subtitle */}
      <section className="text-center mt-8">
        <h1 className="text-3xl font-semibold">Sehat Food</h1>
        <p className="text-gray-500 mt-1">Find healthy food places near you</p>
      </section>

      {/* Main layout */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 p-8 max-w-6xl mx-auto w-full">
        {/* Left Column */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {/* Input Box */}
          <div className="bg-gray-200 p-4 rounded shadow text-center">
            <input
              type="text"
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              placeholder="Enter a location"
              className="w-full p-2 border rounded mb-3"
            />
            <button
              onClick={handleSearch}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
            >
              Search
            </button>
          </div>

          {/* Results Box */}
          <div className="bg-gray-200 p-4 rounded shadow h-64 overflow-y-auto">
            {loading || initialLoading ? (
              <div className="space-y-3 animate-pulse">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="bg-white h-6 rounded"></div>
                ))}
              </div>
            ) : places.length > 0 ? (
              <ul className="space-y-2">
                {places.map((place) => (
                  <li key={place.fsq_id} className="bg-white p-2 rounded shadow">
                    {place.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-600">No places found.</p>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 bg-gray-200 p-4 rounded shadow h-[400px]">
          {coords && !loading ? (
            <LeafletMap coords={coords} places={places} />
          ) : (
            <div className="w-full h-full bg-gray-300 animate-pulse rounded flex items-center justify-center text-gray-500">
              Loading map...
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
