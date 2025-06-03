import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BACKEND_URL } from '../constant';
import axios from 'axios';
import useUserStore from '../store';

interface loginForm {
    email: string;
    password: string;
}

const Login: React.FC = () => {
  const [loginDetails, setLoginDetails] = useState<loginForm>({
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      const response = await axios.post(`${BACKEND_URL}/login`, loginDetails, { withCredentials: true });
      if(response.status === 200) {
        if (response.data.user) {
          useUserStore.getState().setUser(response.data.user);
          navigate('/');
        }
      }
    } catch (error) {
      console.log(error, 'Error during login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Login</h2>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="text"
              id="email"
              className="mt-1 w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Email"
              onChange={(e) => setLoginDetails({ ...loginDetails, email: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              onChange={(e) => setLoginDetails({ ...loginDetails, password: e.target.value })}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-950 text-white font-semibold py-2 rounded-xl hover:bg-blue-900 transition duration-200"
          >
            Sign In
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          Don't have an account? <Link to={"/signup"} className="text-blue-500 hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
