import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function AuthSlider() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-blue-800 px-4">
      <div className="relative w-full max-w-4xl h-[550px] rounded-2xl shadow-2xl overflow-hidden">
        {/* Slide Container */}
        <div
          className={`absolute top-0 left-0 h-full w-[200%] flex transition-transform duration-700 ease-in-out ${
            isLogin ? "translate-x-0" : "-translate-x-1/2"
          }`}
        >
          {/* Login Form */}
          <div className="w-1/2 bg-white flex flex-col justify-center items-center p-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Login</h2>
            <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
              <div>
                <Label>Email</Label>
                <Input type="email" placeholder="you@example.com" required />
              </div>
              <div>
                <Label>Password</Label>
                <Input type="password" placeholder="••••••••" required />
              </div>
              <Button
                type="submit"
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full"
              >
                Login
              </Button>
            </form>
          </div>

          {/* Signup Form */}
          <div className="w-1/2 bg-white flex flex-col justify-center items-center p-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Sign Up</h2>
            <form onSubmit={handleSignup} className="w-full max-w-sm space-y-4">
              <div>
                <Label>Full Name</Label>
                <Input type="text" placeholder="John Doe" required />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" placeholder="you@example.com" required />
              </div>
              <div>
                <Label>Password</Label>
                <Input type="password" placeholder="••••••••" required />
              </div>
              <div>
                <Label>Confirm Password</Label>
                <Input type="password" placeholder="••••••••" required />
              </div>
              <Button
                type="submit"
                className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full"
              >
                Sign Up
              </Button>
            </form>
          </div>
        </div>

        {/* Overlay Sliding Welcome Panel */}
        <div
          className={`absolute top-0 h-full w-1/2 flex flex-col justify-center items-center text-white p-10 transition-all duration-700 ease-in-out z-20 ${
            isLogin ? "left-1/2 bg-indigo-600" : "left-0 bg-blue-600"
          }`}
        >
          <h2 className="text-4xl font-bold mb-4">
            {isLogin ? "Welcome Back!" : "Hello, Friend!"}
          </h2>
          <p className="text-center text-sm mb-6 max-w-xs">
            {isLogin
              ? "To keep connected with us, please login with your credentials."
              : "Enter your personal details and start your journey with us."}
          </p>
          <Button
            onClick={() => setIsLogin(!isLogin)}
            className="bg-white text-blue-700 font-semibold px-6 py-2 rounded-full shadow hover:bg-gray-100 transition"
          >
            {isLogin ? "Sign Up" : "Login"}
          </Button>
        </div>
      </div>
    </div>
  );
}
