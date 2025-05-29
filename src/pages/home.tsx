import React from "react";
import Navbar from "../components/Navbar";

const Home = () => {
  return (
    <div>
      <Navbar />
      <main className="p-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Welcome to Image Upload App</h1>
        <p className="text-gray-700 text-lg">
          This is the homepage. Please login or register to continue.
        </p>
      </main>
    </div>
  );
};

export default Home;
