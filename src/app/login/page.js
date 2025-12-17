'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

export default function LoginPage() {
  const [email, setEmail] = useState("admin@cms.com");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    // Use /api/auth/login to match the pattern used in other endpoints (/api/news, /api/users, etc.)
    const loginUrl = `${API_BASE_URL}/api/auth/login`;
    
    try {
      // Validate API_BASE_URL
      if (!API_BASE_URL) {
        setError("API base URL is not configured. Please set NEXT_PUBLIC_API_BASE_URL in your environment variables.");
        setLoading(false);
        return;
      }
      
      console.log('Login attempt:', { url: loginUrl, email });
      
      const res = await axios.post(loginUrl, { email, password });
      
      console.log('Login response:', res.data);
      
      // Handle different response structures
      const token = res.data?.token || res.data?.data?.token;
      const user = res.data?.user || res.data?.data?.user;
      
      if (!token) {
        setError("Login failed: No token received from server.");
        setLoading(false);
        return;
      }
      
      localStorage.setItem("token", token);
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }
      
      // Redirect to admin panel
      router.push("/admin");
    } catch (err) {
      console.error('Login error:', err);
      
      // Handle different error structures
      let errorMessage = "Login failed. Please check your credentials.";
      
      if (err.response) {
        // Server responded with error
        if (err.response.status === 404) {
          errorMessage = `Login endpoint not found (404). The API endpoint "${loginUrl}" does not exist. ` +
                        `Please verify your API server is running and the endpoint path is correct. ` +
                        `Common endpoints: /api/auth/login, /api/login, /auth/login`;
        } else {
          errorMessage = err.response.data?.message || 
                        err.response.data?.error || 
                        `Server error: ${err.response.status} ${err.response.statusText}`;
        }
      } else if (err.request) {
        // Request made but no response
        errorMessage = `Unable to connect to server at ${API_BASE_URL}. Please check if the API server is running.`;
      } else {
        // Error setting up request
        errorMessage = err.message || "An unexpected error occurred.";
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Background Image */}
      <div className="background-image"></div>

      {/* Login Card */}
      <div className="login-card">
        {/* Header Section */}
        <div className="login-header">
          <div className="lock-icon">
            <svg className="lock-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="login-title">Admin Login</h2>
          <p className="login-subtitle">Welcome back! Please sign in to continue.</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            <svg className="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span className="error-text">{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">Email</label>
            <div className="input-container">
              <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                placeholder="admin@cms.com"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-container">
              <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                placeholder="••••••••••"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
                disabled={loading}
              >
                {showPassword ? (
                  <svg className="eye-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg className="eye-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="submit-button"
          >
            {loading ? (
              <div className="loading-content">
                <svg className="loading-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="loading-circle" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="loading-path" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>

      {/* Custom CSS */}
      <style jsx>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          padding: 20px;
        }

        .background-image {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: url('/images/1691144315.png');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          z-index: 1;
        }

        .login-card {
          position: relative;
          z-index: 2;
          background: white;
          border-radius: 12px;
          padding: 40px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 400px;
          margin: 0 auto;
        }

        .login-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .lock-icon {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #8B5CF6, #6366F1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
        }

        .lock-svg {
          width: 24px;
          height: 24px;
          color: white;
        }

        .login-title {
          font-size: 24px;
          font-weight: 700;
          color: #374151;
          margin: 0 0 8px 0;
        }

        .login-subtitle {
          font-size: 14px;
          color: #6B7280;
          margin: 0;
        }

        .error-message {
          background: #FEF2F2;
          border: 1px solid #FECACA;
          border-radius: 8px;
          padding: 12px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .error-icon {
          width: 20px;
          height: 20px;
          color: #EF4444;
          flex-shrink: 0;
        }

        .error-text {
          color: #DC2626;
          font-size: 14px;
          font-weight: 500;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-label {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
        }

        .input-container {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 12px;
          width: 20px;
          height: 20px;
          color: #9CA3AF;
          z-index: 1;
        }

        .form-input {
          width: 100%;
          padding: 12px 12px 12px 44px;
          border: 1px solid #D1D5DB;
          border-radius: 8px;
          font-size: 16px;
          color: #374151;
          background: white;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .form-input:focus {
          outline: none;
          border-color: #8B5CF6;
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
        }

        .form-input:disabled {
          background: #F9FAFB;
          color: #9CA3AF;
          cursor: not-allowed;
        }

        .password-toggle {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          color: #9CA3AF;
          transition: color 0.2s;
        }

        .password-toggle:hover {
          color: #6B7280;
        }

        .password-toggle:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }

        .eye-icon {
          width: 20px;
          height: 20px;
        }

        .submit-button {
          width: 100%;
          padding: 12px;
          background: linear-gradient(135deg, #8B5CF6, #6366F1);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          margin-top: 10px;
        }

        .submit-button:hover:not(:disabled) {
          background: linear-gradient(135deg, #7C3AED, #5B21B6);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
        }

        .submit-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .loading-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .loading-spinner {
          width: 20px;
          height: 20px;
          animation: spin 1s linear infinite;
        }

        .loading-circle {
          opacity: 0.25;
        }

        .loading-path {
          opacity: 0.75;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Responsive Design */
        @media (max-width: 480px) {
          .login-container {
            padding: 10px;
          }

          .login-card {
            padding: 30px 20px;
            border-radius: 8px;
          }

          .login-title {
            font-size: 20px;
          }

          .lock-icon {
            width: 50px;
            height: 50px;
            margin-bottom: 15px;
          }

          .lock-svg {
            width: 20px;
            height: 20px;
          }

          .form-input {
            font-size: 16px; /* Prevents zoom on iOS */
          }
        }

        @media (max-width: 320px) {
          .login-card {
            padding: 20px 15px;
          }

          .login-title {
            font-size: 18px;
          }

          .login-subtitle {
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  );
}
