import React, { ReactNode } from 'react';
import Vector from "../../../assets/images/Vector.svg";
import { Link } from 'react-router';

function PricingList() {
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
        {label: "10,000 Image Uploads", icon: Vector},
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
    <div>
        <div className="w-full grid grid-cols-1 md:grid-cols-4 p-4 gap-x-3 mt-10 h-screen font-inter text-primary overflow-x-hidden">
            <div className="bg-card rounded-xl shadow-md border-2 h-[537px] max-h-auto mt-10">
                <h1 className=" mt-5 -mb-5 font-bold font-inter text-5xl">
                FREE TRIAL
                </h1>
            <div className=" mt-8 inline-flex items-center box-content rounded-full bg-badge1 text-xs font-inter font-bold text-primary1">
                <span className="p-1 px-3 ">
                For 1 Month
                </span>
            </div>
            <div className="text-sm font-regular  text-center inline-block px-12 py-8 p-2 mt-7 ">
                Explore the platform with limited features. Perfect for getting started and experiencing the basics.
            </div>
            <div>
                <Link className=" text-accent border-2 border-accent text-base py-2 px-16 rounded-lg shadow-lg" to={'ContactSection'}>
                    Claim Free Trial
                </Link>
            </div>
            <div className="flex justify-center">
                <span className="border w-full mx-12 my-8"></span>
            </div>
            <div>
                <ul className="text-sm font-medium flex-col mx-9 space-y-2 my-2">
                    {Perks.map((item) => (
                        <li className="flex items-center gap-3">
                        <><img src={item.icon} alt={item.label} /><span>{item.label}</span></>
                        </li>
                        )
                    )}
                </ul>
            </div>
            </div>
            <div className="bg-card rounded-xl shadow-lg border-2 box-border h-[590px] w-full">
                <div className="bg-accent rounded-full  m-4">
                    <h1 className="text-sm p-1 text-background ">
                        MOST POPULAR
                    </h1>
                </div>
                <div className=" mt-4 mx-10 text-left w-full">
                    <h1 className="font-semibold text-xl">
                        Center Plan
                    </h1>
                    <h1 className= "text-xs font-regular ">
                        Ideal for individual centers.
                    </h1>
                </div>
                <div className="flex mx-10 text-sm gap-6 mt-16">
                  <h1 className="line-through font-normal">
                      ₱ 3,500.00
                   </h1>
                   <h1 className="rounded-full bg-badge1 text-primary px-3">
                      SAVE 15%
                   </h1> 
                </div>
                <div className="flex mx-9 mt-4">
                    <h1 className="font-bold text-5xl ">
                        ₱ 3,000
                    </h1> 
                    <h1 className="font-normal text-lg mt-4">
                        /mo
                    </h1>
                </div>
                <div className="my-11">
                    <button className=" text-background bg-accent text-base px-20 py-2 rounded-lg">
                        Choose Plan
                    </button>
                </div>
                <div>
                    <ul className="text-sm font-medium flex-col mx-12 space-y-2 -mt-4">
                        {Perks_1.map((item) => (
                            <li className="flex items-center gap-3">
                            <><img src={item.icon} alt={item.label} /><span>{item.label}</span></>
                            </li>
                            )
                        )}
                    </ul>
                </div>
                <div className="flex justify-center">
                    <span className="border w-full mx-12 my-8"></span>
                </div>
            </div>
            <div className="bg-card rounded-xl shadow-md border-2 h-[537px] max-h-auto mt-10">
                <div className=" mt-4 mx-10 text-left w-full">
                    <h1 className="font-semibold text-xl">
                        School Plan
                    </h1>
                    <h1 className= "text-xs font-regular ">
                        Designed for Schools.
                    </h1>
                </div>
                <div className="flex mx-12 text-sm gap-6 mt-16">
                  <h1 className="line-through font-normal">
                      ₱ 10,000.00
                   </h1>
                   <h1 className="rounded-full bg-badge1 text-primary px-3">
                      SAVE 25%
                   </h1> 
                </div>
                <div className="flex mx-11 mt-4">
                    <h1 className="font-bold text-5xl ">
                        ₱ 7,500
                    </h1> 
                    <h1 className="font-normal text-lg mt-4">
                        /mo
                    </h1>
                </div>
                <div className="mt-12">
                    <button className=" text-accent border-2 border-accent text-base py-2 px-20 rounded-lg shadow-lg">
                        Choose Plan
                    </button>
                </div>
                <div className="flex justify-center">
                    <span className="border w-full mx-12 my-8"></span>
                </div>
                <div>
                    <ul className="text-sm font-medium flex-col mx-12 space-y-2 -mt-4">
                        {Perks_2.map((item) => (
                            <li className="flex items-center gap-3">
                            <><img src={item.icon} alt={item.label} /><span>{item.label}</span></>
                            </li>
                            )
                        )}
                    </ul>
                </div>
            </div>
            <div className="bg-card rounded-xl shadow-md border-2 h-[537px] max-h-auto mt-10">
                <div className=" mt-4 mx-10 text-left w-full">
                    <h1 className="font-semibold text-xl">
                        Institutional Plan
                    </h1>
                    <h1 className= "text-xs font-regular mr-10">
                        Unlock all features, maximum capacity, and dedicated support
                    </h1>
                </div>
                <div className="flex mx-8 text-sm gap-6 mt-12">
                  <h1 className="line-through font-normal">
                      ₱ 20,000.00
                   </h1>
                   <h1 className="rounded-full bg-badge1 text-primary px-3">
                      SAVE 25%
                   </h1> 
                </div>
                <div className="flex mx-8 mt-4">
                    <h1 className="font-bold text-5xl ">
                        ₱ 15,000
                    </h1> 
                    <h1 className="font-normal text-lg mt-4">
                        /mo
                    </h1>
                </div>
                <div className="mt-12">
                    <button className=" text-accent border-2 border-accent text-base py-2 px-20 rounded-lg shadow-lg">
                        Choose Plan
                    </button>
                </div>
                <div className="flex justify-center">
                    <span className="border w-full mx-12 my-8"></span>
                </div>
                <div>
                    <ul className="text-sm font-medium flex-col mx-12 space-y-2 -mt-4">
                        {Perks_3.map((item) => (
                            <li className="flex items-center gap-3">
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