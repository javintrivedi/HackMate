import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import mainbg from "../assets/mainbg.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false); // New state for resend
  const navigate = useNavigate();
  const Backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

  const isValidSrmEmail = (email) => {
    return /^[a-zA-Z0-9._%+-]+@srmist\.edu\.in$/.test(email);
  };

  // Step 1: Signup Init
  const handleSignupInit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!isValidSrmEmail(email)) {
      toast.error("Email must be a valid SRMIST email (example@srmist.edu.in)");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${Backend}/auth/signup-init`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("OTP sent to your email!");
        setStep(2);
      } else {
        toast.error(data.message || "Signup failed. Please try again.");
      }
    } catch (err) {
      console.error("Signup error:", err);
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `${Backend}/auth/verify-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        toast.success("Signup successful!");
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/get-started");
      } else {
        toast.error(data.message || data.error || "OTP verification failed.");
      }
    } catch (err) {
      console.error("Verify OTP error:", err);
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Resend OTP
  const handleResendOtp = async () => {
    setResending(true);
    try {
      const response = await fetch(
        `${Backend}/auth/signup-init`, // or "/auth/resend-otp" if available
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        toast.success("OTP resent successfully!");
      } else {
        toast.error(data.message || "Failed to resend OTP.");
      }
    } catch (err) {
      console.error("Resend OTP error:", err);
      toast.error("Network error. Please try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div
      className="h-screen flex flex-col justify-center items-center bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${mainbg})` }}
    >
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex flex-col items-center -mt-10 w-full max-w-md px-6">
        <h1 className="text-5xl mb-10 text-[#395EAA] font-['Lexend_Exa'] font-normal">
          Sign Up
        </h1>

        {step === 1 ? (
          <form className="w-full flex flex-col gap-4 text-md" onSubmit={handleSignupInit}>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
              className="w-full px-4 py-3 rounded-xl bg-gray-100 focus:ring-2 focus:ring-blue-300 shadow-inner"
            />
            <input
              type="email"
              placeholder="SRM NetID (Email)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="w-full px-4 py-3 rounded-xl bg-gray-100 focus:ring-2 focus:ring-blue-300 shadow-inner"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="6"
              disabled={loading}
              className="w-full px-4 py-3 rounded-xl bg-gray-100 focus:ring-2 focus:ring-blue-300 shadow-inner"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength="6"
              disabled={loading}
              className="w-full px-4 py-3 rounded-xl bg-gray-100 focus:ring-2 focus:ring-blue-300 shadow-inner"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#4A6CB3] text-white rounded-xl hover:bg-blue-700 transition-colors flex text-md items-center justify-center cursor-pointer"
            >
              {loading ? "Sending OTP..." : "Create Account"}
            </button>
          </form>
        ) : (
          <form className="w-full flex flex-col gap-4" onSubmit={handleVerifyOtp}>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              disabled={loading}
              className="w-full px-4 py-3 rounded-xl bg-gray-100 focus:ring-2 focus:ring-blue-300 shadow-inner"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#4A6CB3] text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center cursor-pointer"
            >
              {loading ? "Verifying OTP..." : "Verify & Signup"}
            </button>

            {/* Resend OTP button */}
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resending}
              className="w-full py-2 bg-gray-200 text-[#395EAA] rounded-xl hover:bg-gray-300 transition-colors flex items-center justify-center cursor-pointer"
            >
              {resending ? "Resending..." : "Resend OTP"}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-[#395EAA] hover:underline font-semibold cursor-pointer"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
