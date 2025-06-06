"use client";

import dynamic from "next/dynamic";
import { Place } from "./HealthyCategories"

const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
});

interface MyComponentProps {
    coords: { lat: number; lon: number } | null
    places: Place[]
}

const MapSection: React.FC<MyComponentProps> = ({ coords, places }) => {
    return (
        <div className="w-full h-[350px] sm:h-[450px] md:h-[600px] lg:h-full bg-white shadow-md p-4 rounded-lg">
          <div className="w-full h-full rounded-xl overflow-hidden shadow-md bg-gray-100">
            {coords && <LeafletMap coords={coords} places={places} />}
          </div>
        </div>
    )
}

export default MapSection