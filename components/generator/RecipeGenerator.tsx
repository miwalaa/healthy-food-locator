import React, { forwardRef } from "react";

const RecipeGenerator = forwardRef<HTMLElement>((_, ref) => {
  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="h-screen py-12 px-4 sm:px-6 md:px-12 lg:px-20 bg-[#f9f9f9]"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-start">
        {/* Left Column */}
        <div className="flex flex-col gap-4 h-full">
          {/* Input Box */}
          <div className="bg-white shadow-lg rounded-md p-4">
            <h2 className="text-xl font-medium mb-2">Enter 4 Ingredients</h2>
            <div className="flex flex-col sm:flex-row items-stretch gap-2 mb-4">
              <input
                type="text"
                placeholder="e.g. tomato, egg, cheese"
                className="border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 flex-1"
              />
              <button className="green-button hover:brightness-110 text-white px-4 py-2 rounded-full">
                Generate recipe
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
            </div>
          </div>

          {/* Background Image with Overlay */}
          <div className="relative w-full h-60 lg:h-full rounded-md overflow-hidden shadow-lg">
            <div className="absolute inset-0 bg-[url('/vegetables.jpg')] bg-cover bg-center" />
            <div className="absolute inset-0 bg-green-950/95" />
            <div className="relative flex flex-col justify-center h-full z-10 p-6 text-white text-center">
              <h2 className="text-2xl md:text-4xl lg:text-6xl font-bold mb-2 text-left">Eat Smarter. Feel Better. 
                Let AI Create a Healthy Recipe for You.</h2>
              <p className="text-sm md:text-base lg:text-xl text-left">
                {"Whether you're plant-based, protein-packed, or just eating clean — get a personalized recipe in seconds."}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full h-[300px] lg:h-[48rem] overflow-auto bg-white shadow-lg rounded-md p-4">
        </div>
      </div>
    </section>
  );
});

RecipeGenerator.displayName = "RecipeGenerator";

export default RecipeGenerator;
