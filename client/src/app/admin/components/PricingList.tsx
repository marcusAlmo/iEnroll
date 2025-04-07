import React, { ReactNode, useRef } from 'react';
import Vector from "@/assets/images/Vector.svg";
import { Link } from 'react-router';

interface PricingListProps {
    scrollToContact: () => void;
  }
  

  const PricingList: React.FC<PricingListProps> = ({ scrollToContact }) => {
   
    const Perks = [
        {label: "10 Student", icon: Vector},
        {label: "1 Admin", icon: Vector},
        {label: "30 Days Duration", icon: Vector},
      ];
      const Perks_1 = [
        {label: "500 Students", icon: Vector},
        {label: "1 Admin", icon: Vector},
        {label: "2000 Image Uploads", icon: Vector},
        {label: "100 Form Fields", icon: Vector},
        {label: "30 Days Duration", icon: Vector},
      ];
      const Perks_2 = [
        {label: "3000 Students", icon: Vector},
        {label: "5 Admin", icon: Vector},
        {label: "15,000 Image Uploads", icon: Vector},
        {label: "100 Form Fields", icon: Vector},
        {label: "30 Days Duration", icon: Vector},
      ];
      const Perks_3 = [
        {label: "10,000 Students", icon: Vector},
        {label: "10 Admin", icon: Vector},
        {label: "50,000 Image Uploads", icon: Vector},
        {label: "100 Form Fields", icon: Vector},
        {label: "30 Days Duration", icon: Vector},
      ];
  return (
    <div className="p-4 sm:p-6 lg:p-8">
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-10 font-inter text-primary ">
            <div className="bg-container-1 rounded-xl shadow-md border-2 min-h-[537px] mt-10 px-10 ">
                <h1 className="mt-5 font-bold text-2xl md:text-4xl text-center">FREE TRIAL</h1>
                <div className=" inline-flex items-center rounded-full text-xs font-inter font-bold px-3 py-1 relative">
                    <div className="absolute inset-0 bg-accent opacity-50 rounded-full"></div>
                    <p className="text-primary relative">
                        For 1 Month
                    </p>
                </div>

                <div className="text-sm font-regular  text-center inline-block p-2 mt-8">
                    Explore the platform with limited features. Perfect for getting started and experiencing the basics.
                </div>
            
                <button className=" text-accent border-2 border-accent text-base py-2 rounded-lg mt-16 w-full cursor-pointer"
                    onClick={scrollToContact}
                >
                    Claim Free Trial
                </button> 
        
                <div className="flex justify-center">
                    <span className="border w-full my-8"></span>
                </div>
                <div>
                    <ul className="flex flex-col text-sm font-medium gap-2 my-2">
                        {Perks.map((item) => (
                            <li key={item.label} className="flex items-center gap-3 w-full lg:w-auto">
                                <img src={item.icon} alt={item.label} />
                                <span>{item.label}</span>
                            </li>
                        ))}
                    </ul>
                </div>

            </div>
            <div className="bg-container-1 rounded-xl shadow-lg border-2 box-border min-h-[577.5px] ">          
                <h1 className="text-sm p-1 text-background bg-accent rounded-full m-3">
                    MOST POPULAR
                </h1>
                <div className="w-full px-10">
                    <div className=" mt-4  text-left w-full">
                        <h1 className="font-semibold text-xl">
                            Center Plan
                        </h1>
                        <h1 className= "text-xs font-regular ">
                            Ideal for individual centers.
                        </h1>
                    </div>
                    <div className="flex  text-sm gap-4 mt-[68px] items-center">
                        <h1 className="line-through font-normal text-gray-500">₱ 3,500.00</h1>
                        <div className="relative inline-flex items-center rounded-full text-xs font-inter font-bold px-3 py-1">
                            <div className="absolute inset-0 bg-accent opacity-50 rounded-full"></div>
                            <p className="text-primary relative z-10">Save 15%</p>
                        </div> 
                    </div>

                    <div className="flex mt-4">
                        <h1 className="font-bold text-5xl ">
                            ₱ 3,000
                        </h1> 
                        <h1 className="font-normal text-lg mt-4">
                            /mo
                        </h1>
                    </div>

                    <button className=" text-background bg-accent text-base w-full py-2 rounded-lg mt-11 cursor-pointer"
                        onClick={scrollToContact}
                    >
                        Choose Plan
                    </button>
            
                    
                    <div className="flex justify-center">
                        <span className="border w-full my-8"></span>
                    </div>
                    <div>
                        <ul className="flex flex-col text-sm font-medium gap-2 my-2">
                            {Perks_1.map((item) => (
                                <li className="flex items-center gap-3">
                                <><img src={item.icon} alt={item.label} /><span>{item.label}</span></>
                                </li>
                                )
                            )}
                        </ul>
                    </div>                
                </div>
 
            </div>
            <div className="bg-container-1 rounded-xl shadow-md border-2 min-h-[537px] max-h-auto mt-10 px-10 w-full">
                <div className="mt-4 text-left w-full">
                    <h1 className="font-semibold text-xl">
                        School Plan
                    </h1>
                    <h1 className= "text-xs font-regular ">
                        Designed for Schools.
                    </h1>
                </div>
                <div className="flex text-sm gap-4 mt-[68px] items-center">
                    <h1 className="line-through font-normal text-gray-500">₱ 10,000.00</h1>
                    <div className="relative inline-flex items-center rounded-full text-xs font-inter font-bold px-3 py-1">
                        <div className="absolute inset-0 bg-accent opacity-50 rounded-full"></div>
                        <p className="text-primary relative z-10">Save 25%</p>
                    </div> 
                </div>

                <div className="flex mt-4">
                    <h1 className="font-bold text-5xl ">
                        ₱ 7,500
                    </h1> 
                    <h1 className="font-normal text-lg mt-4">
                        /mo
                    </h1>
                </div>

                <button className=" text-accent border-2 border-accent text-base py-2 rounded-lg mt-11 w-full cursor-pointer"
                    onClick={scrollToContact}
                >
                    Choose Plan
                </button>
              
                <div className="flex justify-center">
                    <span className="border w-full my-8"></span>
                </div>
                <div>
                    <ul className="flex flex-col text-sm font-medium space-y-2 my-2">
                        {Perks_2.map((item) => (
                            <li className="flex items-center gap-3">
                            <><img src={item.icon} alt={item.label} /><span>{item.label}</span></>
                            </li>
                            )
                        )}
                    </ul>
                </div>
            </div>
            <div className="bg-container-1 rounded-xl shadow-md border-2 min-h-[537px] max-h-auto mt-10 px-10 w-full">
                <div className="mt-4 text-left w-full">
                    <h1 className="font-semibold text-xl">
                        Institutional Plan
                    </h1>
                    <h1 className="text-xs font-regular mr-10">
                        Unlock all features, maximum capacity, and dedicated support
                    </h1>
                </div>
                <div className="flex  text-sm gap-4 mt-[48px] items-center">
                    <h1 className="line-through font-normal text-gray-500">₱ 20,000.00</h1>
                    <div className="relative inline-flex items-center rounded-full text-xs font-inter font-bold px-3 py-1">
                        <div className="absolute inset-0 bg-accent opacity-50 rounded-full"></div>
                        <p className="text-primary relative z-10">Save 25%</p>
                    </div> 
                </div>
                <div className="flex mt-4">
                    <h1 className="font-bold text-5xl ">
                        ₱ 15,000
                    </h1> 
                    <h1 className="font-normal text-lg mt-4">
                        /mo
                    </h1>
                </div>
               
                <button className=" text-accent border-2 border-accent text-base py-2 rounded-lg w-full mt-12 cursor-pointer"
                    onClick={scrollToContact}
                >
                    Choose Plan
                </button>
             
                <div className="flex justify-center">
                    <span className="border w-full my-8"></span>
                </div>
                <div>
                    <ul className="flex flex-col text-sm font-medium space-y-2 my-2">

                        {Perks_3.map((item) => (
                            <li key={item.label} className="flex items-center gap-3 w-full lg:w-auto">
                            <><img src={item.icon} alt={item.label} /><span>{item.label}</span></>
                            </li>
                            )
                        )}
                    </ul>
                </div>
            </div>
        </div>
    </div>
  )
}

export default PricingList