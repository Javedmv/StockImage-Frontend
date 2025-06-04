import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_URL } from '../constant';
import { toast } from 'react-toastify';

interface SignupForm {
  name: string;
  phone: string;
  email: string;
  password: string;
}

interface SignupErrors {
  name?: string;
  phone?: string;
  email?: string;
  password?: string;
}

const Signup: React.FC = () => {
  const [signupDetails, setSignupDetails] = React.useState<SignupForm>({
    name: '',
    phone: '',
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  const [errors, setErrors] = React.useState<SignupErrors>({});

  const validate = (field: keyof SignupForm, value: string) => {
    let error = '';
    switch (field) {
      case 'name':
        if (!value.trim()) error = 'Name is required';
        break;
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Invalid email address';
        break;
      case 'phone':
        if (!/^\d{10}$/.test(value)) error = 'Phone number must be 10 digits';
        break;
      case 'password':
        if (value.length < 6) error = 'Password must be at least 6 characters';
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleChange = (field: keyof SignupForm, value: string) => {
    setSignupDetails((prev) => ({ ...prev, [field]: value }));
    validate(field, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Validate all fields before submission
    const newErrors: SignupErrors = {};
    Object.entries(signupDetails).forEach(([key, value]) =>
      validate(key as keyof SignupForm, value)
    );
  
    const hasErrors = Object.values(newErrors).some(Boolean);
    if (hasErrors) {
      setErrors(newErrors);
      return;
    }
  
    try {
      const response = await axios.post(`${BACKEND_URL}/signup`, signupDetails);
      console.log('Signup success:', response);
      if(response.status !== 200) {
        throw new Error('Signup failed');
      }
      // Navigate to OTP page with email
      navigate(`/verify-otp?email=${signupDetails.email}`);
    } catch (error: any) {
      console.error('Signup error:', error);
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage = error.response.data.message || 'Signup failed. Please try again.';
        toast.error(errorMessage);
      } else {
        setErrors((prev) => ({ ...prev, email: 'An unexpected error occurred. Please try again later.' }));
        toast.error('An unexpected error occurred. Please try again later.');
      }
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Create Account</h2>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              id="name"
              className={`mt-1 w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 ${errors.name ? 'border-red-500' : 'focus:ring-blue-500'}`}
              placeholder="Full name"
              value={signupDetails.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              id="email"
              className={`mt-1 w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 ${errors.email ? 'border-red-500' : 'focus:ring-blue-500'}`}
              placeholder="you@example.com"
              value={signupDetails.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />
            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              id="phone"
              className={`mt-1 w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 ${errors.phone ? 'border-red-500' : 'focus:ring-blue-500'}`}
              placeholder="10 digit Phone Number"
              value={signupDetails.phone}
              maxLength={10}
              onInput={(e) => e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '')}
              onChange={(e) => handleChange('phone', e.target.value)}
            />
            {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              className={`mt-1 w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 ${errors.password ? 'border-red-500' : 'focus:ring-blue-500'}`}
              placeholder="••••••••"
              value={signupDetails.password}
              onChange={(e) => handleChange('password', e.target.value)}
            />
            {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-950 text-white font-semibold py-2 rounded-xl hover:bg-blue-900 transition duration-200"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account? <Link to={"/login"} className="text-blue-500 hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
