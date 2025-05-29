import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Stock Image Platform</h1>
        <div>
          <Link to="/login">
            <button className="mr-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-900 transition">
              Login
            </button>
          </Link>
          <Link to="/signup">
            <button className="px-4 py-2 bg-black text-white rounded hover:bg-gray-900 transition">
              Sign Up
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;