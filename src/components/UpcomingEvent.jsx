import React from "react";
import Event from "./events/event";
import { useNavigate } from "react-router-dom";

const UpcomingEvent = () => {
  const navigate = useNavigate();
  // const events = [
  //   {
  //     id: "1",
  //     name: "Event 1",
  //     date: "12/12/2021",
  //     time: "12:00 PM",
  //     venue: "MMCOE",
  //     description:
  //       "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea",
  //     link: "https://www.google.com/",
  //     createdAt: "12/12/2021",
  //     images: [
  //       "https://images.unsplash.com/photo-1632836926807-4b9b9b5b9b0f?ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw0Mnx8fGVufDB8fHx8&ixlib=rb-1.2.1&w=1000&q=80",
  //     ],
  //   },
  // ];

  const involvementCards = [
    {
      title: "Find Your Alumni Chapter",
      description:
        "Arizona Alumni chapters support the deep and lasting connection we all share with the University of Arizona and help preserve the Wildcat spirit. Join your local chapter to stay connected to fellow Wildcats and the university.",
      icon: "plus",
    },
    {
      title: "Mentor Current Students",
      description:
        "Arizona Alumni chapters support the deep and lasting connection we all share with the University of Arizona and help preserve the Wildcat spirit. Join your local chapter to stay connected to fellow Wildcats and the university. ",
      icon: "plus",
    },
    {
      title: "Attend Campus Events",
      description:
        "Arizona Alumni chapters support the deep and lasting connection we all share with the University of Arizona and help preserve the Wildcat spirit. Join your local chapter to stay connected to fellow Wildcats and the university. ",
      icon: "plus",
    },
  ];

  const handleNavigate = () => {
    navigate("/auth");
  };

  return (
    <div className="w-full mx-auto my-8 px-4 sm:px-6 lg:px-8 max-w-7xl">
      {/* Upcoming Events Section */}
      {/* <section className="mb-16">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-center mb-8">
          Upcoming Events
        </h2>

        <div className="flex flex-col lg:flex-row justify-center items-center gap-8 my-8">
          {events.map((event, index) => (
            <div
              key={index}
              className="w-full lg:w-1/2 h-auto flex justify-center"
            >
              <Event event={event} />
            </div>
          ))}
        </div>

        <div className="flex justify-center items-center mt-8">
          <a
            href="/events"
            className="bg-primary hover:bg-primary-dark text-white text-xl font-semibold px-8 py-3 rounded-md transition-colors duration-300 inline-flex items-center"
          >
            View All Events
            <i className="fa-solid fa-arrow-right ml-3"></i>
          </a>
        </div>
      </section> */}

      {/* Get Involved Section */}
      <section className="mt-3">
        {/* Blue Banner */}
        <div
          className="w-full py-8 px-6 md:px-12 rounded-lg mb-12 flex flex-col md:flex-row justify-between items-center"
          style={{
            background: "linear-gradient(to right, #2563eb, #60a5fa)",
          }}
        >
          <h3 className="text-white text-2xl md:text-3xl font-bold mb-4 md:mb-0">
            Stay Connected To MMCOE for Life
          </h3>
          <button className="bg-white border-none px-6 py-2 rounded-md font-semibold hover:bg-gray-100 transition-colors duration-300">
            Get Started
          </button>
        </div>

        {/* Get Involved Content */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold uppercase text-black mb-4">
            GET INVOLVED
          </h2>
          <p className="text-gray-700 max-w-5xl mx-auto text-left md:text-center">
            2006-2025: Specialist at the Department of Biomedical Engineering,
            University of California, Irvine. 1998-2006: Researcher at the
            Department of Physics, University of Illinois at Urbana-Champaign.
            1993-1996: Scientific Employee at the Institute for Molecular
            Biology, Jena, Germany. 1992-1993: Diploma thesis at the Max Planck
            Institute for Biophysical Chemistry, Göttingen, Germany. 1988-1993:
          </p>
        </div>

        {/* Involvement Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {involvementCards.map((card, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  {card.title}
                </h3>
                <div className="bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center">
                  <i className={`fa-solid fa-${card.icon} text-gray-600`}></i>
                </div>
              </div>
              <p className="text-gray-600 mb-6">{card.description}</p>
              <button
                onClick={handleNavigate}
                className="hover:bg-primary-dark text-white px-4 py-2 rounded-md w-full transition-colors duration-300"
                style={{
                  background: "linear-gradient(to right, #2563eb, #60a5fa)",
                }}
              >
                Let's Connect
              </button>
            </div>
          ))}
        </div>

        {/* More Button */}
        <div className="flex justify-center">
          <button className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-50 transition-colors duration-300">
            More
          </button>
        </div>
      </section>
    </div>
  );
};

export default UpcomingEvent;
