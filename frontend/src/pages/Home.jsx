import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import logo from "../assets/logo.png";

const Home = ({ setUser }) => {
  const handleLoginSuccess = async (credentialResponse) => {
    try {
      const googleToken = credentialResponse.credential;

      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: googleToken }),
      });

      if (!res.ok) throw new Error("Login failed");

      const data = await res.json();

      // store backend JWT
      localStorage.setItem("token", data.token);
      
      // Store user with token included
      const userWithToken = { ...data.user, token: data.token };
      localStorage.setItem("user", JSON.stringify(userWithToken));

      setUser(userWithToken);

    } catch (err) {
      console.error(err);
      alert("Login failed. Try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-cyan-50 via-cyan-100 to-sky-50 px-4">
      {/* Logo/Brand */}
      <div className="mb-12 text-center">
        <div className="inline-flex items-center justify-center w-1/3 h-1/3 mb-6 ">
          <img src={logo} alt="JustNotepad logo" />
        </div>
        
        <h1 className="text-5xl font-bold bg-linear-to-r from-cyan-300 to-sky-500 bg-clip-text text-transparent mb-3">
          JustNotepad
        </h1>
        
        <p className="text-lg text-gray-600 max-w-md mx-auto">
          Simple notes, beautifully organized
        </p>
      </div>

      {/* Google Sign In */}
      <div className="flex flex-col items-center gap-6">
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onError={() => alert("Login Failed")}
          theme="outline"
          size="large"
          text="continue_with"
        />
        
        <p className="text-sm text-gray-500">
          Sign in to start taking notes
        </p>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
    </div>
  );
};

export default Home;