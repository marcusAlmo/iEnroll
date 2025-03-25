import React from "react";
import Smiley from "../../../assets/images/Smiley.svg";

const ContactSection: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center min-h-[50vh] sm:min-h-[60vh] lg:min-h-[70vh] text-center px-4 sm:px-8 my-28">
      <div className="flex items-center justify-center text-5xl sm:text-7xl md:text-8xl font-bold">
        <span className="text-accent">i</span>
        <span className="text-primary">Enr</span>
        <img className="w-12 h-10 sm:w-16 sm:h-14 md:w-20 md:h-16" src={Smiley} alt="Smiley"/>
        <span className="text-primary">ll</span>
      </div>

      <h2 className="text-2xl sm:text-3xl font-bold mt-6 sm:mt-8">
        Finally selected a plan that suits you?
      </h2>

      <p className="text-base sm:text-lg mt-6 sm:mt-12">Reach out to us through:</p>

      <div className="flex flex-col sm:flex-row justify-center items-center text-sm mx-4 sm:mx-8 gap-4 sm:gap-5 mt-6 sm:mt-8">
        <a href="mailto:uprenroll@gmail.com" className="bg-accent text-white py-2 px-5 sm:px-6 rounded-lg hover:bg-opacity-80 transition">
          uprenroll@gmail.com
        </a>
        <a href="tel:09124567893" className="bg-accent text-white py-2 px-6 sm:px-8 rounded-lg hover:bg-opacity-80 transition">
          0912-456-7893
        </a>
      </div>
    </div>
  );
};

export default ContactSection;