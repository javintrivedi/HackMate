import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import mainbg from "../assets/mainbg.png";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Step 1: Signup Init
  const handleSignupInit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "https://hackmate-ybgv.onrender.com/auth/signup-init",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        console.log("OTP sent:", data);
        setStep(2);
      } else {
        setError(data.message || "Signup failed. Please try again.");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "https://hackmate-ybgv.onrender.com/auth/verify-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        console.log("Signup successful:", data);

        // ✅ Save only what you need
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        navigate("/get-started");
      } else {
        setError(data.message || data.error || "OTP verification failed.");
      }
    } catch (err) {
      console.error("Verify OTP error:", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="h-screen flex flex-col justify-center items-center bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${mainbg})` }}
    >
      <div className="flex flex-col items-center -mt-10 w-full max-w-md px-6">
        <h1 className="text-6xl mb-10 text-[#395EAA] font-['Lexend_Exa'] font-bold">
          Sign Up
        </h1>

        {error && (
          <div className="w-full mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-xl">
            {error}
          </div>
        )}

        {step === 1 ? (
          <form className="w-full flex flex-col gap-4" onSubmit={handleSignupInit}>
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
              className="w-full py-3 bg-[#4A6CB3] text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center"
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
              className="w-full py-3 bg-[#4A6CB3] text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              {loading ? "Verifying OTP..." : "Verify & Signup"}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
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
