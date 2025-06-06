"use client";

import React, { useEffect, useState, forwardRef } from "react";
import axios from "axios";
import Image from "next/image";
import { MapSection } from "./index";

export interface Place {
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

const HealthyCategories = forwardRef<HTMLElement>((_props, ref) => {
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
          } as Place;
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
      const defaultLocation = "Sukabumi, Indonesia";
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
    <section
      ref={ref}
      className="min-h-screen py-12 px-4 sm:px-6 md:px-12 lg:px-20 bg-[#f9f9f9]"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-start">
        {/* Left Column */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-gray-900">
            Find Healthy Places Near You
          </h2>
          <div className="bg-white shadow-md rounded-lg py-2 px-4 mb-4">
            <p className="mb-1 text-gray-700 text-sm sm:text-base leading-relaxed">
              Search by city or neighborhood to discover nearby healthy food places.
            </p>

            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <input
                type="text"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                placeholder="Enter a location"
                className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                onClick={handleSearch}
                className="green-button text-white px-8 py-3 rounded-full hover:brightness-110 transition w-full sm:w-auto"
              >
                Search
              </button>
            </div>
          </div>

          {/* Cards Section */}
          <div>
            <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">
              Best Categories We Have
            </h3>
            <div className="bg-white shadow-md p-4 rounded-lg grid grid-cols-1 sm:grid-cols-2 gap-5 overflow-auto">
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
                            : "/default-place.png"
                        }
                        alt={place.name}
                        width={80}
                        height={80}
                        className="rounded-md object-cover"
                        style={{ height: "auto" }} // ✅ FIX HERE
                      />
                      <div>
                        <h3 className="font-semibold text-sm sm:text-base text-gray-900">
                          {place.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {place.location?.formatted_address || "Unknown location"}
                        </p>
                        <p className="text-yellow-500 text-xs sm:text-sm">
                          {"★".repeat(place.rating || 4)}{" "}
                          <span className="text-gray-500">({place.rating || 4})</span>
                        </p>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </div>

        {/* Right Column - Map */}
        <MapSection coords={coords} places={places} />
      </div>
    </section>
  );
});

HealthyCategories.displayName = "HealthyCategories";

export default HealthyCategories;
