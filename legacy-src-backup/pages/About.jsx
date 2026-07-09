import React from "react";

const About = () => {
  return (
    <div className="w-full">
      <div className="relative w-full h-56 sm:h-72 md:h-96">
        <img
          src="https://images.unsplash.com/photo-1524492449090-1a0636b2e3f4?auto=format&fit=crop&w=1350&q=80"
          alt="Pakistan Mountains"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white text-center">
            About Tourist Guide
          </h1>
        </div>
      </div>

      <div className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto bg-white rounded-lg shadow-md -mt-10 relative z-10">
        <p className="text-gray-700 leading-relaxed mb-4">
          Discover the beauty of Pakistan through its diverse <strong>regions</strong> and <strong>categories of attractions</strong>. From the breathtaking mountains of the north to the cultural heritage of historic cities, this guide helps you explore everything Pakistan has to offer.
        </p>

        <p className="text-gray-700 leading-relaxed mb-4">
          With this Tourist Guide, you can easily <strong>search</strong> and <strong>filter places</strong>, view detailed descriptions with images, ratings, and the best time to visit. You can also explore <strong>recommended tours</strong> that connect multiple destinations into unforgettable journeys.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mb-3">Key Features</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
          <li>🌍 Interactive Maps to visualize tours and routes</li>
          <li>📅 Easy Tour Booking for local and foreign visitors</li>
          <li>💬 Tourist Feedback System to share and read experiences</li>
        </ul>

        <p className="text-gray-700 leading-relaxed">
          Built with <strong>React</strong>, <strong>React Router</strong>, and <strong>Tailwind CSS</strong>, the Tourist Guide app is designed to provide a modern, user-friendly, and engaging travel experience.
        </p>
      </div>
    </div>
  );
};

export default About;
