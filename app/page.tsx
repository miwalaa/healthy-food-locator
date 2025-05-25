"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import Image from "next/image";

const LeafletMap = dynamic(() => import("@/components/LeafletMap"), {
  ssr: false,
});

interface Place {
  fsq_id: string;
  name: string;
  location: {
    formatted_address: string;
  };
  rating?: number;
  photos?: {
    prefix: string;
    suffix: string;
  }[];
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

  const fetchCoords = async (locationName: string) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}`
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
        `https://api.foursquare.com/v3/places/search?ll=${coords.lat},${coords.lon}&query=healthy&limit=6`,
        {
          headers: {
            Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY || "",
          },
        }
      );

      const enrichedPlaces: Place[] = await Promise.all(
        response.data.results.map(async (place: Partial<Place>) => {
          const details = await axios.get(
            `https://api.foursquare.com/v3/places/${place.fsq_id}`,
            {
              headers: {
                Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY || "",
              },
            }
          );
          return {
            ...place,
            rating: Math.floor(Math.random() * 2) + 4,
            photos: details.data.photos,
          };
        })
      );

      setPlaces(enrichedPlaces);
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
      setLoading(false);
    };
    getDefaultLocation();
  }, []);

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gray-700 text-white p-4 flex items-center">
        <span className="text-lg font-bold">LOGO</span>
      </header>

      {/* Title & Description */}
      <section className="text-center py-6">
        <h1 className="text-3xl font-semibold">Sehat Food</h1>
        <p className="text-gray-600">Find healthy places near you</p>
      </section>

      {/* Main Content */}
      <section className="flex flex-col lg:flex-row max-w-6xl mx-auto gap-6 px-4 pb-12">
        {/* Left: Input + Cards */}
        <div className="flex-1 space-y-4">
          {/* Input Box */}
          <div className="bg-gray-100 p-4 rounded shadow">
            <p className="mb-2 text-center font-medium">Search by city or neighborhood...</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                placeholder="Enter a location"
                className="border px-3 py-2 rounded w-full"
              />
              <button
                onClick={handleSearch}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              >
                Search
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="bg-gray-100 p-4 rounded shadow">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {loading
                ? Array.from({ length: 4 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="flex gap-3 p-3 border rounded bg-white shadow animate-pulse"
                    >
                      <div className="w-20 h-20 bg-gray-300 rounded-md" />
                      <div className="flex-1 space-y-2">
                        <div className="w-3/4 h-4 bg-gray-300 rounded" />
                        <div className="w-1/2 h-4 bg-gray-200 rounded" />
                        <div className="w-1/4 h-3 bg-gray-200 rounded" />
                      </div>
                    </div>
                  ))
                : places.map((place) => (
                    <div
                      key={place.fsq_id}
                      className="flex gap-3 p-3 border rounded bg-white shadow"
                    >
                      <Image
                        src={
                          place.photos?.[0]
                            ? `${place.photos[0].prefix}80x80${place.photos[0].suffix}`
                            : "/default-food.jpg"
                        }
                        alt={place.name}
                        width={80}
                        height={80}
                        className="rounded-md object-cover"
                      />
                      <div>
                        <h2 className="font-semibold text-base">{place.name}</h2>
                        <p className="text-sm text-gray-600">
                          {place.location?.formatted_address || "Unknown location"}
                        </p>
                        <p className="text-yellow-500 text-sm">
                          {"★".repeat(place.rating || 4)}{" "}
                          <span className="text-gray-500">({place.rating || 4})</span>
                        </p>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </div>

        {/* Right: Map */}
        <div className="flex-1 bg-gray-100 p-4 rounded shadow">
          <div className="w-full h-[400px] min-h-[300px]">
            {coords && <LeafletMap coords={coords} places={places} />}
          </div>
        </div>
      </section>
    </main>
  );
}
