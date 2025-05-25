"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import axios from "axios";

const LeafletMap = dynamic(() => import("@/components/LeafletMap"), {
  ssr: false,
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
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(
    null
  );
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [locationInput, setLocationInput] = useState("");

  const fetchCoords = async (locationName: string) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          locationName
        )}`
      );
      const firstResult = response.data[0];
      if (firstResult) {
        return {
          lat: parseFloat(firstResult.lat),
          lon: parseFloat(firstResult.lon),
        };
      } else {
        throw new Error("Location not found");
      }
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
    const getDefaultLocation = async () => {
      const defaultLocation = "Jakarta, Indonesia";
      const coordinates = await fetchCoords(defaultLocation);
      if (coordinates) {
        setCoords(coordinates);
        await fetchPlaces(coordinates);
      }
    };
    getDefaultLocation();
  }, []);

  return (
    <main className="flex flex-col items-center p-4 gap-4 h-screen">
      <h1 className="text-2xl font-bold">Healthy Food Locator</h1>
      <div className="flex gap-2">
        <input
          type="text"
          value={locationInput}
          onChange={(e) => setLocationInput(e.target.value)}
          placeholder="Enter a location"
          className="border px-2 py-1 rounded"
        />
        <button
          onClick={handleSearch}
          className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 transition"
        >
          Search
        </button>
      </div>

      <div className="w-full h-full rounded overflow-hidden">
        {coords ? (
          <LeafletMap coords={coords} places={places} />
        ) : loading ? (
          <p>Loading...</p>
        ) : (
          <p>Enter a location to begin.</p>
        )}
      </div>
    </main>
  );
}
