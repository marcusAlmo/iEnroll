import React from "react";
import MainNav from "./admin/components/MainNav";
import PricingList from "./admin/components/PricingList";
import ContactSection from "./admin/components/ContactSection";

const Home: React.FC = () => {
  return (
    <div>
    <MainNav/>
    <div className="w-full min-h-screen flex flex-col items-center text-center text-primary font-semibold relative">
      <h1 className="text-3xl md:text-4xl mt-20">
        Pick your perfect plan
      </h1>
      <p className="text-sm font-normal max-w-xl mx-auto px-6 mt-4">
        Get started in complete confidence. We offer a 30-day trial and a money-back guarantee, meaning it’s risk-free.
      </p>
    
      <PricingList/>
      
      <div className="w-full mt-12">
        <ContactSection />
      </div>
    </div>
    </div>
  );
};

export default Home;
