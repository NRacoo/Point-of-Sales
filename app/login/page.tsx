"use client";
 
import { SunIcon as Sunburst } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

 
export default function FullScreenSignup () {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
 
  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value.trim());
  };
 
  const validatePassword = (value: string) => {
    return value.length >= 8;
  };
 
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setEmailError("");
    setPasswordError("");

    let valid = true;

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      valid = false;
    }

    if (!validatePassword(password)) {
      setPasswordError("Please enter a password with at least 8 characters.");
      valid = false;
    }

    if (!valid) return;

    setLoading(true);

    try {
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Login failed");
        return;
      }

      router.replace("/")
      router.refresh

    } catch (err) {
      setError("Unexpected error");
    } finally {
      setLoading(false);
    }
  
  };
 
  return (
    <div className="min-h-screen  flex items-center justify-center overflow-hidden p-4">
      <div className=" w-full relative rounded-3xl max-w-5xl overflow-hidden flex flex-col md:flex-row shadow-xl">
        <div className="w-full h-full z-2 absolute bg-linear-to-t from-transparent to-black"></div>
        <div className="flex absolute z-2  overflow-hidden backdrop-blur-2xl ">
          <div className="h-160 z-2 w-16 bg-linear-90 from-[#ffffff00] via-[#000000] via-69% to-[#ffffff30] opacity-30 overflow-hidden"></div>
          <div className="h-160 z-2 w-16 bg-linear-90 from-[#ffffff00] via-[#000000] via-69% to-[#ffffff30]  opacity-30 overflow-hidden"></div>
          <div className="h-160 z-2 w-16 bg-linear-90 from-[#ffffff00] via-[#000000] via-69% to-[#ffffff30]  opacity-30 overflow-hidden"></div>
          <div className="h-160 z-2 w-16 bg-linear-90 from-[#ffffff00] via-[#000000] via-69% to-[#ffffff30]  opacity-30 overflow-hidden"></div>
          <div className="h-160 z-2 w-16 bg-linear-90 from-[#ffffff00] via-[#000000] via-69% to-[#ffffff30]  opacity-30 overflow-hidden"></div>
          <div className="h-160 z-2 w-16 bg-linear-90 from-[#ffffff00] via-[#000000] via-69% to-[#ffffff30]  opacity-30 overflow-hidden"></div>
        </div>
        <div className="w-60 h-60 bg-orange-500 absolute z-1 rounded-full bottom-0"></div>
        <div className="w-32 h-20 bg-white absolute z-1 rounded-full bottom-0"></div>
        <div className="w-32 h-20 bg-white absolute z-1 rounded-full bottom-0"></div>
 
        <div className="bg-black text-white p-8 md:p-12 md:w-1/2 relative rounded-bl-3xl  overflow-hidden">
          <h1 className="text-2xl md:text-3xl font-medium leading-tight z-10 tracking-tight relative">
            Run Your Store Smarter
          </h1>
          <p className="mt-4 text-lg md:text-xl leading-tight tracking-tight z-10 font-light relative"> Manage sales, track transactions, and keep your business moving — all in one point of sale system.</p>
        </div>
 
        <div className="p-8 md:p-12 md:w-1/2 flex flex-col bg-secondary z-99 text-secondary-foreground ">
          <div className="flex flex-col items-left mb-8">
            <div className="text-orange-500 mb-4">
              <Sunburst className="h-10 w-10" />
            </div>
            <h2 className="text-3xl font-medium mb-2 tracking-tight">
              Access Your POS Dashboard
            </h2>
            <p className="text-left opacity-80">
              Enter your credentials to access the system.
            </p>
          </div>
 
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit}
            noValidate
          >
            <div>
              <label htmlFor="text" className="block text-sm mb-2">
                Email
              </label>
              <input
                type="text"
                id="Email"
                placeholder="Enter your Email"
                className={`text-sm w-full py-2 px-3 border rounded-lg focus:outline-none focus:ring-1 bg-white text-black focus:ring-orange-500 ${
                  emailError ? "border-red-500" : "border-gray-300"
                }`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={!!emailError}
                aria-describedby="Email-error"
              />
              {emailError && (
                <p id="usetrname-error" className="text-red-500 text-xs mt-1">
                  {emailError}
                </p>
              )}
            </div>
 
            <div>
              <label htmlFor="password" className="block text-sm mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                className={`text-sm w-full py-2 px-3 border rounded-lg focus:outline-none focus:ring-1 bg-white text-black focus:ring-orange-500 ${
                  passwordError ? "border-red-500" : "border-gray-300"
                }`}
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={!!passwordError}
                aria-describedby="password-error"
              />
              {passwordError && (
                <p id="password-error" className="text-red-500 text-xs mt-1">
                  {passwordError}
                </p>
              )}
            </div>
 
            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            > {loading ? "Signing in..." : "Sign In"}
            </button>
            <div className="text-center text-gray-600 text-sm">
              Forgot your password? please contact your administrator
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
 
