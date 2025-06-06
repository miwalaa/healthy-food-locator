"use client";

import { useRef } from "react";
import Navbar from "@/components/common/Navbar";
import Home from "@/components/home/Home";
import HealthyCategories from "@/components/map/HealthyCategories";
import Recipe from "@/components/generator/RecipeGenerator"

export default function Page() {
  const homeRef = useRef<HTMLElement | null>(null);
  const mapRef = useRef<HTMLElement | null>(null);

  return (
    <>
      <Navbar homeSectionRef={homeRef} mapSectionRef={mapRef} />
      <Home ref={homeRef} mapSectionRef={mapRef} />
      <HealthyCategories ref={mapRef} />
      <Recipe />
    </>
  );
}
