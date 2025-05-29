import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import "./index.css"
import './App.css'
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from './pages/home';
import Login from './pages/login'
import signup from './pages/signup';
import Signup from './pages/signup'
import OtpVerification from './pages/otpVerification'


const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    children: [
    ],
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/signup",
    element : <Signup />
  },
  {
    path: "/verify-otp",
    element: <OtpVerification/>
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
