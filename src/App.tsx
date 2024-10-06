import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Member from "./component/member/Member";
import Header from "./component/header/Header";
import Nav from "./component/nav/Nav";
import Upload from "./component/upload/Upload";
import Calendar from "./component/calendar/Calendar";
import ShowImage from "./component/showImage/ShowImage";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { setIsLogin } from "./redux/isLoginSlice";
import { setUser, clearUser } from "./redux/userSlice";
import { User } from "./type/constant";
import url from "./type/constant";

export default function App() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(""); // Error state
  const [user, setUserData] = useState<User | null>(null); // User data state
  const isLogin = useAppSelector((state) => state.isLogin); // Get login status from Redux

  const fetchUserProfile = async () => {
    setLoading(true);
    setError(""); // Clear previous errors

    try {
      const response = await fetch(`${url}/user/getData`, {
        method: "GET",
        credentials: "include", // Include credentials for session management
      });

      if (response.ok) {
        const data = await response.json();
        const user: User = data.user;
        console.log("Fetched user:", user);
        setUserData(user); // Store user data locally
        dispatch(setUser(user)); // Store user data in Redux
        dispatch(setIsLogin(true)); // Set login status in Redux
      } else {
        dispatch(clearUser()); // Clear user data in Redux
        dispatch(setIsLogin(false)); // Update login status
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      setError("Failed to fetch user profile."); // Set error message
      dispatch(clearUser()); // Clear user data
      dispatch(setIsLogin(false)); // Update login status
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Fetch user profile on component mount and when login status changes
  useEffect(() => {
    fetchUserProfile();
  }, [dispatch, isLogin]);

  // Loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // If no user is found, render the Member component
  if (!isLogin) {
    return <Member />;
  }

  // Render error if any
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <Header />
      <Nav />
      <Routes>
        <Route path="/" element={<ShowImage />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/calendar" element={<Calendar />} />
      </Routes>
    </>
  );
}
