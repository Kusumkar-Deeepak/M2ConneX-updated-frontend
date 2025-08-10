import React from "react";

const TopStories = () => {
  return (
    <div className="w-full">
      {/* First Section - Blue Gradient with Content */}
      <section
        className="w-full py-12 px-6 md:px-12 lg:px-24"
        style={{
          background: "linear-gradient(to right, #2563eb, #60a5fa)",
          minHeight: "500px",
        }}
      >
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          {/* Left Side - Text Content */}
          <div className="lg:w-1/2 text-white">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              Guide and Help Students Shape their Future
            </h2>
            <p className="text-lg md:text-xl leading-relaxed mb-8 text-white/90">
              Connect with fellow alumni, share experiences, and guide the next
              generation of engineers. Our platform enables meaningful
              mentorship opportunities that help students navigate their career
              paths with confidence and support from experienced professionals.
            </p>
            <button className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-lg">
              Learn More
            </button>
          </div>

          {/* Right Side - Image */}
          <div className="lg:w-1/2 flex justify-center">
            <div className="w-full max-w-md h-80 bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden border border-white/20 shadow-xl">
              {/* Placeholder for image - replace with actual image */}
              <div className="w-full h-full bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center">
                <div className="text-center text-white">
                  <i className="fas fa-graduation-cap text-6xl mb-4 opacity-80"></i>
                  <p className="text-lg font-medium">Mentorship Program</p>
                  <p className="text-sm opacity-80">
                    Connecting Alumni with Students
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Second Section - Talent Community */}
      <section className="w-full bg-gray-50 py-16 px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Join Our Alumni Network
          </h2>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Join our Alumni Network today and stay connected with opportunities,
            events, and fellow graduates as they continue to become available!
          </p>
          <button className="bg-blue-600 text-black px-10 py-3 rounded-lg font-bold hover:bg-blue-700 hover:scale-105 transition-all duration-300 shadow-lg">
            JOIN NETWORK
          </button>
        </div>
      </section>

      {/* Enhanced Top Stories Section */}
      {/* <section className="w-full py-16 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Stories
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover inspiring stories from our alumni community and stay
              updated with the latest news
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            
            <div className="col-span-1 md:col-span-2 lg:col-span-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="h-64 bg-gradient-to-br from-blue-500/80 to-purple-600/80 flex items-end p-6">
                <div className="text-white">
                  <h3 className="text-xl font-bold mb-2">
                    Alumni Success Story
                  </h3>
                  <p className="text-white/90">
                    How our graduates are making impact in tech industry
                  </p>
                </div>
              </div>
            </div>

            
            <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="h-64 bg-gradient-to-br from-green-500/80 to-teal-600/80 flex items-end p-6">
                <div className="text-white">
                  <h3 className="text-lg font-bold mb-2">Innovation Hub</h3>
                  <p className="text-white/90 text-sm">
                    Latest research projects
                  </p>
                </div>
              </div>
            </div>

            
            <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="h-64 bg-gradient-to-br from-orange-500/80 to-red-600/80 flex items-end p-6">
                <div className="text-white">
                  <h3 className="text-lg font-bold mb-2">Campus Events</h3>
                  <p className="text-white/90 text-sm">Upcoming activities</p>
                </div>
              </div>
            </div>

            
            <div className="col-span-1 md:col-span-2 lg:col-span-2 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="h-40 bg-gradient-to-br from-indigo-500/80 to-blue-600/80 flex items-center justify-center p-6">
                <div className="text-white text-center">
                  <h3 className="text-xl font-bold mb-2">
                    Career Opportunities
                  </h3>
                  <p className="text-white/90">
                    Explore job openings from our partner companies
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <a
              href="/feed"
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold px-8 py-3 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg"
            >
              View Your Feed
              <i className="fa-solid fa-arrow-right ml-3"></i>
            </a>
          </div>
        </div>
      </section> */}
    </div>
  );
};

export default TopStories;
