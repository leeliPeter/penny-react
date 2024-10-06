import React, { useState, useEffect, useRef } from "react";
import { setIsLogin } from "../../redux/isLoginSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

import { useNavigate } from "react-router-dom";
import url from "../../type/constant";
import "./Member.css";

const Member: React.FC = () => {
  const isLogin = useAppSelector((state) => state.isLogin);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isRegisterActive, setIsRegisterActive] = useState(false);
  const [isLoginActive, setIsLoginActive] = useState(true);
  const signUpRef = useRef<HTMLDivElement>(null);
  const signInRef = useRef<HTMLDivElement>(null);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [emailReminder, setEmailReminder] = useState("");
  const [loginReminder, setLoginReminder] = useState("");
  const [loginEmail, setLoginEmail] = useState(""); // State for login email
  const [loginPassword, setLoginPassword] = useState(""); // State for login password
  const [regEmail, setRegEmail] = useState(""); // State for registration email
  const [regPassword, setRegPassword] = useState(""); // State for registration password
  const [isLengthValid, setIsLengthValid] = useState(false);
  const [isContentValid, setIsContentValid] = useState(false);

  useEffect(() => {
    if (signUpRef.current && signInRef.current) {
      if (isRegisterActive) {
        signUpRef.current.style.left = `calc(50% - ${
          signUpRef.current.offsetWidth / 2
        }px)`;
        signUpRef.current.style.opacity = "1";
        signInRef.current.style.right = "-800px";
        signInRef.current.style.opacity = "0";
      } else if (isLoginActive) {
        signInRef.current.style.right = `calc(50% - ${
          signInRef.current.offsetWidth / 2
        }px)`;
        signInRef.current.style.opacity = "1";
        signUpRef.current.style.left = "-800px";
        signUpRef.current.style.opacity = "0";
      }
    }
  }, [isRegisterActive, isLoginActive]);

  const handlePasswordFocus = () => {
    setIsPasswordFocused(true);
  };

  const handlePasswordBlur = () => {
    setIsPasswordFocused(false);
  };

  const handleLoginPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setLoginPassword(value);

    // Validate password
    const lengthValid = value.length >= 8;
    const contentValid = /[A-Za-z]/.test(value) && /\d/.test(value);

    setIsLengthValid(lengthValid);
    setIsContentValid(contentValid);
  };

  const handleRegPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRegPassword(value);

    // Validate password
    const lengthValid = value.length >= 8;
    const contentValid = /[A-Za-z]/.test(value) && /\d/.test(value);

    setIsLengthValid(lengthValid);
    setIsContentValid(contentValid);
  };

  // Handle form submission for sign-in
  const isEmailValid = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(`${url}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
        credentials: "include", // Ensure credentials like cookies are sent
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Login successful:", data);
        setLoginReminder(""); // Clear login reminder on success
        dispatch(setIsLogin(true)); // Update Redux state
        navigate("/"); // Redirect to home page
      } else {
        setLoginReminder(data.message);
        console.error("Login failed:", data.message);
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission

    // Check email validity before sending request
    if (!isEmailValid(regEmail)) {
      setEmailReminder("Invalid email format. Please enter a valid email.");
      return; // Stop further execution
    }

    // Check password validity before sending request
    if (!isLengthValid || !isContentValid) {
      setEmailReminder("Please enter a valid password.");
      return; // Stop further execution
    }

    try {
      const response = await fetch(`${url}/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: regEmail, password: regPassword }), // Send email and password to the backend
        credentials: "include", // Ensure credentials are sent
      });

      const data = await response.json();
      if (response.ok) {
        dispatch(setIsLogin(true)); // Update Redux state
        navigate("/");

        // Clear email reminder on success
        setEmailReminder("");
      } else {
        console.error("Registration failed:", data.message);
        // Handle registration failure (e.g., show an error message)
        if (data.message.includes("Email already in use")) {
          setEmailReminder("Email has already been used.");
        } else {
          setEmailReminder(data.message); // Generic error message
        }
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setEmailReminder("An error occurred. Please try again.");
    }
  };

  return (
    <div className="membership">
      <div className="container">
        <div className="logo">
          <img src="./images/Penny.png" alt="Logo" />
        </div>
        <nav>
          <div
            className={`register ${isRegisterActive ? "active" : ""}`}
            onClick={() => {
              setIsRegisterActive(true);
              setIsLoginActive(false);
            }}
            style={{
              border: isRegisterActive
                ? "var(--active-border) 1px solid"
                : "none",
              backgroundColor: isRegisterActive
                ? "var(--active-color)"
                : "var(--bg-color)",
            }}
          >
            Register
          </div>
          <div
            className={`login ${isLoginActive ? "active" : ""}`}
            onClick={() => {
              setIsLoginActive(true);
              setIsRegisterActive(false);
            }}
            style={{
              border: isLoginActive ? "var(--active-border) 1px solid" : "none",
              backgroundColor: isLoginActive
                ? "var(--active-color)"
                : "var(--bg-color)",
            }}
          >
            Login
          </div>
        </nav>

        <div className="signIn" ref={signInRef}>
          <form onSubmit={handleSignIn}>
            <div>
              <label htmlFor="login-email">Email address</label>
              <input
                type="email"
                name="login-email"
                required
                value={loginEmail} // Controlled component
                onChange={(e) => setLoginEmail(e.target.value)} // Update email state
              />
            </div>
            <div>
              <label htmlFor="login-password">Password</label>
              <input
                type="password"
                name="login-password"
                required
                value={loginPassword} // Controlled component
                onChange={handleLoginPasswordChange}
              />
              <div
                className="login-reminder"
                style={{
                  height: loginReminder ? "17px" : "0",
                }}
              >
                <p>{loginReminder}</p>
              </div>
            </div>
            <button type="submit">Sign In</button>
          </form>
        </div>

        <div className="signUp" ref={signUpRef}>
          <form onSubmit={handleSignUp}>
            <div>
              <label htmlFor="reg-email">Email address</label>
              <input
                type="email"
                name="reg-email"
                required
                value={regEmail} // Controlled component
                onChange={(e) => setRegEmail(e.target.value)} // Update registration email state
              />
              {emailReminder && (
                <div className="email-reminder">
                  <p>{emailReminder}</p>
                </div>
              )}
            </div>
            <div>
              <label htmlFor="reg-password">Password</label>
              <input
                className="password-input"
                type="password"
                name="reg-password"
                required
                onFocus={handlePasswordFocus}
                onBlur={handlePasswordBlur}
                onChange={handleRegPasswordChange}
                value={regPassword} // Ensure the input reflects the state
              />
              <div className={`reminder ${isPasswordFocused ? "visible" : ""}`}>
                <ul>
                  <li
                    style={{
                      color: isLengthValid
                        ? "rgb(44, 183, 44)"
                        : "rgb(218, 1, 1)",
                    }}
                  >
                    Must be at least 8 characters
                  </li>
                  <li
                    style={{
                      color: isContentValid
                        ? "rgb(44, 183, 44)"
                        : "rgb(218, 1, 1)",
                    }}
                  >
                    Include both letters and numbers
                  </li>
                </ul>
              </div>
            </div>
            <button type="submit">Sign Up</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Member;
