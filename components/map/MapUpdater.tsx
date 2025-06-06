"use client"
import { useEffect } from "react";
import { useMap } from "react-leaflet";

type Props = {
  coords: { lat: number; lon: number };
};

export default function MapUpdater({ coords }: Props) {
  const map = useMap();

  useEffect(() => {
    map.setView([coords.lat, coords.lon], 13, {
      animate: true,
    });
  }, [coords, map]);

  return null;
}
