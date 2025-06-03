import { useEffect } from "react";
import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import Signup from "./pages/signup";
import OtpVerification from "./pages/otpVerification";
import useUserStore from "./store";
import axios from "axios";
import { BACKEND_URL } from "./constant";
import Profile from "./pages/Profile";

const createRouter = (user: any) => {
  return createBrowserRouter([
    {
      path: "/",
      element: <Home />,
      children: [],
    },
    {
      path: "/login",
      element: user.email ? <Navigate to="/" replace /> : <Login />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: "/verify-otp",
      element: <OtpVerification />,
    },
    {
      path: "/profile",
      element: user.isVerified ? <Profile /> : <Navigate to="/login" replace />,
    }
  ]);
};

function App() {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  const getUser = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/get-user`, { withCredentials: true });
      if (response.status === 200 && response.data.user) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.log("Error fetching user", error);
    }
  };

  useEffect(() => {
    if (!user || !user.email) {
      getUser();
    }
  }, [user]);

  // Create router only once per render based on user
  const router = createRouter(user);

  return <RouterProvider router={router} />;
}

export default App;
