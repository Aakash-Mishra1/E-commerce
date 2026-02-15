import React, { useState, useEffect } from "react";
import AppWrapper from "../components/layout/AppWrapper";
import ProductCard from "../components/product/ProductCard";
import { ClockIcon, FireIcon } from "@heroicons/react/24/solid";

const DealPage = () => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    	// Set deadline to midnight of the next day for demo purposes
		const now = new Date();
		const tomorrow = new Date(now);
		tomorrow.setDate(tomorrow.getDate() + 1);
		tomorrow.setHours(0, 0, 0, 0);
		
		const difference = +tomorrow - +now;
		
		let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const dealProducts = [
    {
      id: 101,
      name: "Razer BlackWidow V3",
      category: "Keyboards",
      price: 8999,
      oldPrice: 14999,
      rating: 4.8,
      reviews: 342,
      discount: 40,
      image: "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 102,
      name: "Logitech G Pro X",
      category: "Headsets",
      price: 12499,
      oldPrice: 18999,
      rating: 4.7,
      reviews: 128,
      discount: 35,
      image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 103,
      name: "HyperX Pulsefire fps",
      category: "Mice",
      price: 2499,
      oldPrice: 4999,
      rating: 4.5,
      reviews: 89,
      discount: 50,
      image: "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 104,
      name: "Asus ROG Swift 360Hz",
      category: "Monitors",
      price: 45999,
      oldPrice: 65999,
      rating: 4.9,
      reviews: 56,
      discount: 30,
      image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <AppWrapper>
      <div className="bg-navy/20 min-h-screen py-10">
        {/* Header Section with Timer */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
            <div className="bg-gradient-to-r from-brandBlue to-cyan-600 rounded-3xl p-8 md:p-12 text-white shadow-[0_0_50px_rgba(26,115,232,0.3)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
                    <div className="text-center md:text-left">
                        <div className="inline-flex items-center gap-2 bg-black/20 px-4 py-2 rounded-full mb-4 backdrop-blur-sm border border-white/10">
                            <FireIcon className="w-5 h-5 text-yellow-300 animate-pulse" />
                            <span className="font-bold text-yellow-300 tracking-wider text-sm uppercase">Flash Sale Ends In</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black font-poppins mb-2">DEAL OF THE DAY</h1>
                        <p className="text-xl md:text-2xl text-white/90 font-medium">Up to <span className="text-yellow-300 font-bold">50% OFF</span> on Premium Gear</p>
                    </div>

                    {/* Timer */}
                    <div className="flex gap-4">
                        {Object.keys(timeLeft).length > 0 && ['hours', 'minutes', 'seconds'].map((interval) => (
                            <div key={interval} className="flex flex-col items-center">
                                <div className="w-20 h-20 md:w-24 md:h-24 bg-black/30 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-xl">
                                    <span className="text-3xl md:text-4xl font-mono font-bold">{timeLeft[interval] < 10 ? `0${timeLeft[interval]}` : timeLeft[interval]}</span>
                                </div>
                                <span className="text-xs uppercase tracking-widest mt-2 font-medium opacity-80">{interval}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        {/* Products Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
                <ClockIcon className="w-6 h-6 text-saleRed" />
                <h2 className="text-2xl font-bold text-white">Live Deals</h2>
                <div className="h-px bg-white/10 flex-1 ml-4"></div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {dealProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
      </div>
    </AppWrapper>
  );
};

export default DealPage;
