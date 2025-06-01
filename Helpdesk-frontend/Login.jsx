import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const maroon = "#800000";

  const handleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      const loggedInUser = login(email, password);
      setIsLoading(false);

      if (loggedInUser) {
        setSuccess(true);
        setTimeout(() => {
          if (loggedInUser.role === "admin") {
            navigate("/admin"); 
          } else {
            navigate("/");  
          }
        }, 1500);
      } else {
        alert("Invalid credentials");
      }
    }, 800);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at top left, #3a0000 0%, #1a0000 80%)",
      }}
    >

      <div
        style={{
          position: "absolute",
          width: 300,
          height: 300,
          background:
            "radial-gradient(circle, rgba(128,0,0,0.6) 0%, transparent 70%)",
          borderRadius: "50%",
          top: -100,
          left: -100,
          filter: "blur(100px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div
        className="p-8 rounded-2xl shadow-2xl w-80 flex flex-col items-center transition-transform duration-300"
        style={{
          backdropFilter: "blur(18px)",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          zIndex: 10,
          transformStyle: "preserve-3d",
          cursor: "default",
          perspective: 1000,
        }}
        onMouseMove={(e) => {
          const card = e.currentTarget;
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          const rotateX = (-y / rect.height) * 15;
          const rotateY = (x / rect.width) * 15;
          card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "rotateX(0deg) rotateY(0deg)";
        }}
      >
        <h2
          className="text-3xl font-bold mb-6 tracking-wide"
          style={{ color: "#fff", textShadow: "0 0 8px #800000cc" }}
        >
          Login
        </h2>

        {!success ? (
          <>
            <input
              className="w-full p-3 mb-4 rounded-lg border bg-transparent transition-shadow duration-300 ease-in-out placeholder-white"
              style={{
                borderColor: maroon,
                color: "#fff",
                boxShadow: "0 0 0 0 transparent",
                outline: "none",
              }}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              autoComplete="username"
              onFocus={(e) => {
                e.target.style.boxShadow = `0 0 8px 2px ${maroon}`;
              }}
              onBlur={(e) => {
                e.target.style.boxShadow = "0 0 0 0 transparent";
              }}
            />

            <div className="relative w-full mb-6">
              <input
                className="w-full p-3 rounded-lg border bg-transparent transition-shadow duration-300 ease-in-out pr-12 placeholder-white"
                style={{
                  borderColor: maroon,
                  color: "#fff",
                  boxShadow: "0 0 0 0 transparent",
                  outline: "none",
                }}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                autoComplete="current-password"
                onFocus={(e) => {
                  e.target.style.boxShadow = `0 0 8px 2px ${maroon}`;
                }}
                onBlur={(e) => {
                  e.target.style.boxShadow = "0 0 0 0 transparent";
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                disabled={isLoading}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-maroon hover:text-maroon-dark focus:outline-none"
                style={{ cursor: isLoading ? "not-allowed" : "pointer" }}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke={maroon}
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7a6.946 6.946 0 011.565-4.292M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke={maroon}
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>

            <button
              onClick={handleLogin}
              disabled={isLoading || !email || !password}
              className="w-full py-2 rounded-lg text-white font-semibold transition-transform duration-200 shadow-md"
              style={{
                backgroundColor: isLoading ? "#b22222aa" : maroon,
                cursor: isLoading || !email || !password ? "not-allowed" : "pointer",
                boxShadow: isLoading ? "none" : `0 4px 12px ${maroon}99`,
              }}
              onMouseEnter={(e) => {
                if (!(isLoading || !email || !password))
                  e.currentTarget.style.transform = "scale(1.07)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
              aria-label="Sign In"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </>
        ) : (
          <SuccessAnimation color={maroon} />
        )}
      </div>
    </div>
  );
};

const SuccessAnimation = ({ color }) => {
  const lightMaroon = "#a05050";

  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{ color: lightMaroon }}
      aria-live="polite"
      aria-label="Login successful"
    >
      <svg
        className="w-12 h-12 mb-3 animate-fadeSlideUp"
        fill="none"
        stroke={lightMaroon}
        strokeWidth="4"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="circle"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12l2 2 4-4"
          className="check"
        />
      </svg>
      <p className="text-lg font-semibold">Login Successful!</p>

      <style>{`
        @keyframes fadeSlideUp {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeSlideUp {
          animation: fadeSlideUp 1s ease forwards;
        }
      `}</style>
    </div>
  );
};

export default Login;
