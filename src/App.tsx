import { useEffect } from "react";
import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from 'react';
import useUserStore from "./store";
import axios from "axios";
import { BACKEND_URL } from "./constant";
import ShimmerFallback from "./components/Shimmer";


const Home = lazy(() => import('./pages/home'));
const Login = lazy(() => import('./pages/login'));
const Signup = lazy(() => import('./pages/signup'));
const OtpVerification = lazy(() => import('./pages/otpVerification'));
const Profile = lazy(() => import('./pages/Profile'));

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
      console.error("Failed to fetch user:", error);
      // Optionally handle error, e.g., setUser(null) or show a toast
    }
  };

  useEffect(() => {
    if (!user || !user.email) {
      getUser();
    }
  }, [user]);
  
  return (
    <Suspense fallback={<ShimmerFallback />}>
      <RouterProvider router={createRouter(user)} />
    </Suspense>
  );
}

export default App;
