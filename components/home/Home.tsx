import React, { forwardRef } from "react";

interface HomeProps {
  mapSectionRef: React.RefObject<HTMLElement | null>;
}

const Home = forwardRef<HTMLElement, HomeProps>(({ mapSectionRef }, ref) => {
  const scrollToMap = () => {
    if (mapSectionRef.current) {
      mapSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section ref={ref} className="min-h-screen">
      {/* Hero Section */}
      <section className="h-[calc(100vh-80px)] flex items-center justify-center">
        <div className="relative w-full h-full rounded-[32px] overflow-hidden m-4 bg-gray-100">
          {/* Background image placeholder */}
          <div className="absolute inset-0 bg-cover bg-center bg"></div>

          {/* Overlay */}
          <div className="absolute inset-0 bg-cover bg-center bg-[url(@/public/background-image.jpg)]"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent"></div>

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-16 max-w-[700px]">
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white leading-tight mb-6 lg:w-[700px]">
              Fuel Your Body<br />With Healthy<br />Choices
            </h2>
            <button 
              className="green-button text-white px-6 py-3 rounded-full text-lg font-medium w-fit hover:brightness-110 transition"
              onClick={scrollToMap}
            >
              Explore the places
            </button>
          </div>  
        </div>
      </section>
    </section>
  );
});

Home.displayName = "Home";
export default Home;
