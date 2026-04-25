import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Recycle, PackagePlus, Wallet, ArrowRight } from "lucide-react";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-24 sm:py-32 lg:flex lg:items-center lg:gap-x-10 lg:px-8 lg:py-40">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:flex-auto">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <div className="flex">
                <div className="relative flex items-center gap-x-4 rounded-full px-4 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                  <span className="font-semibold text-primary">Give your e-waste a new purpose.</span>
                  <span className="h-4 w-px bg-gray-900/10" aria-hidden="true" />
                  <a href="#" className="flex items-center gap-x-1">
                    <span className="absolute inset-0" aria-hidden="true" />
                    Learn more
                  </a>
                </div>
              </div>
              <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                The Smart Way to Recycle & Resell Electronics
              </h1>
              <p className="mt-6 text-lg leading-8 text-secondary">
                Turn your clutter into cash. GreenCycle provides a secure and profitable platform for managing your e-waste, connecting sellers with buyers who see value in used electronics.
              </p>
              <div className="mt-10 flex items-center gap-x-6">
                <motion.button onClick={() => navigate("/register")} className="rounded-md bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                  Get Started <ArrowRight className="inline" size={16} />
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* How it works Section */}
      <div className="py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">A Simple, Secure Process</h2>
            <p className="mt-4 text-lg leading-8 text-secondary">Three easy steps to turn your e-waste into value.</p>
          </div>
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-xl bg-primary text-white mx-auto">
                <PackagePlus size={32} />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">1. List Your Item</h3>
              <p className="mt-2 text-secondary">Easily add your product with a description and photos. Our system is simple and fast.</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-xl bg-primary text-white mx-auto">
                <Recycle size={32} />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">2. Find a Buyer</h3>
              <p className="mt-2 text-secondary">Our platform connects you with interested buyers, ensuring your electronics get a second life.</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-xl bg-primary text-white mx-auto">
                <Wallet size={32} />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">3. Get Paid</h3>
              <p className="mt-2 text-secondary">Secure transactions mean you get paid quickly and safely once your item is sold.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing;