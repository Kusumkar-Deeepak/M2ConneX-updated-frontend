import React from "react";
import College from "../assets/college.png";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative w-full h-screen">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={College}
          alt="College Background"
          className="w-full h-full object-cover brightness-75"
        />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl text-white pl-8 md:pl-12 lg:pl-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Marathwada Mitra Mandal's College of Engineering
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl mb-8">
              Make connections that last a lifetime
            </p>
            <button
              className="text-white text-xl font-semibold px-6 py-3 rounded-md hover:bg-primary-dark transition-all duration-300 transform hover:scale-105 shadow-lg"
              style={{
                background: "linear-gradient(to right, #2563eb, #60a5fa)",
              }}
              onClick={() => navigate("/auth")}
            >
              Get Started
              <i className="fas fa-arrow-right ml-3"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      {/* <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-center items-center gap-8">
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-bold">15+</p>
              <p className="text-lg md:text-xl">Years of Excellence</p>
            </div>
            <div className="hidden md:block border-r-2 border-white border-opacity-50 h-16"></div>
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-bold">15000+</p>
              <p className="text-lg md:text-xl">Students</p>
            </div>
          </div>
        </div>
      </div> */}

      {/* Quick Links */}
      {/* <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 w-11/12 max-w-6xl">
        <div className="bg-gray-900 rounded-lg shadow-xl p-6 grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { icon: "book", text: "Alumni Directory" },
            { icon: "handshake", text: "Your Connections" },
            { icon: "pen-to-square", text: "Write a Testimonial" },
            { icon: "trophy", text: "Find Opportunities" },
            { icon: "images", text: "Memories" },
          ].map((item, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="bg-gray-700 w-12 h-12 rounded-full flex items-center justify-center mb-2">
                <i className={`fa-solid fa-${item.icon} text-white`}></i>
              </div>
              <p className="text-white text-sm text-center">{item.text}</p>
            </div>
          ))}
        </div>
      </div> */}
    </section>
  );
};

export default Hero;
