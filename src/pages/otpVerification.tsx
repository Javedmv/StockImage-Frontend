import React, { useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { BACKEND_URL } from '../constant';
import axios from 'axios';
import { toast } from 'react-toastify';

const OtpVerification: React.FC = () => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const email = searchParams.get('email');

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('text').slice(0, 4).split('');
    if (pasted.every((char) => /^\d$/.test(char))) {
      setOtp(pasted);
      inputRefs.current[3]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otp.join('');

    if (enteredOtp.length < 4) {
      setError('Please enter all 4 digits of the OTP');
      return;
    }

    // TODO: Replace with real API call
    const response = await verifyOtp(email, enteredOtp);
    if (!response?.data.isVerified) {
      setError('Something went wrong. Please try again.');
      return;
    }
    if (response.data.isVerified === true) {
      toast.success('OTP Verified!');
      navigate('/login');
    } else {
      setError('Invalid OTP. Please try again.');
    }
  };

  const verifyOtp = async (email: string | null, otp: string) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/verify-otp`, { email, otp });
      console.log(response,"from otp verification true or false")
      return response
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || "Failed to verify OTP. Please try again later.";
        toast.error(message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-center mb-6">OTP Verification</h2>
        <p className="text-center text-sm text-gray-600 mb-4">
          Enter the 4-digit OTP sent to <strong>{email || 'your email'}</strong>
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-between gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                className="w-14 h-14 text-center text-xl border border-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                ref={(el) => {
                    inputRefs.current[index] = el;
                  }}                  
              />
            ))}
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition duration-200"
          >
            Verify OTP
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          Didn’t receive the code? <button className="text-blue-500 hover:underline">Resend OTP</button>
        </p>
      </div>
    </div>
  );
};

export default OtpVerification;
