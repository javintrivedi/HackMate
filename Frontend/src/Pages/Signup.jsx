import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import mainbg from '../assets/mainbg.png';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Signup successful:', data);
        
        // Store user data in localStorage (optional)
        localStorage.setItem('user', JSON.stringify(data));
        
        // Navigate to dashboard on successful signup
        navigate('/dashboard');
      } else {
        // Handle error response
        const errorData = await response.json();
        setError(errorData.message || 'Signup failed. Please try again.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-cover bg-center bg-no-repeat relative"
         style={{ backgroundImage: `url(${mainbg})` }}>
      <div className="flex flex-col items-center -mt-10 w-full max-w-md px-6">
        <h1 className="text-6xl mb-10 text-[#395EAA] font-['Lexend_Exa'] font-bold">Sign Up</h1>
        
        {error && (
          <div className="w-full mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-xl">
            {error}
          </div>
        )}
        
        <form className="w-full flex flex-col gap-4" onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-inner"
            required
            disabled={loading}
          />
          <input
            type="email"
            placeholder="SRM NetID (Email)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-inner"
            required
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-inner"
            required
            disabled={loading}
            minLength="6"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-inner"
            required
            disabled={loading}
            minLength="6"
          />
          <button
            type="submit"
            className="w-full py-3 bg-[#4A6CB3] text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-[#395EAA] hover:underline font-semibold"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;