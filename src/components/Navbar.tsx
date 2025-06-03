import { Link, useNavigate } from "react-router-dom";
import useUserStore from "../store";
import axios from "axios";
import { BACKEND_URL } from "../constant";

const Navbar = () => {
  const user = useUserStore((state) => state.user);
  const deleteUser = useUserStore((state) => state.deleteUser);
  
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(`${BACKEND_URL}/logout`, {}, { withCredentials: true });
      deleteUser();
      navigate("/login", { replace: true });
    } catch (error) {
      console.log(error, 'Error during logout');
    }
  };

  return (
    <nav className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Stock Image Platform</h1>

        {user && user.isVerified ? (
          <div className="flex items-center space-x-4">
            <Link
              to="/profile"
              className="hover:text-gray-300 bg-gray-600 px-4 py-2 rounded-full text-white"
            >
              {user?.username
                ? user.username.charAt(0).toUpperCase() + user.username.slice(1)
                : ""}
            </Link>
            <button
              onClick={() => handleLogout()}
              className="hover:text-gray-300 px-4 py-2 rounded-full text-white"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-1">
            <Link to="/login">
              <button className="mr-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-900 transition">
                Log In
              </button>
            </Link>
            <Link to="/signup">
              <button className="px-4 py-2 bg-black text-white rounded hover:bg-gray-900 transition">
                Sign Up
              </button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
