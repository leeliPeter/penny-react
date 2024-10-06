import React, { useState, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setIsLogin } from "../../redux/isLoginSlice";
import { clearUser } from "../../redux/userSlice";
import { IoIosLogOut } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import url from "../../type/constant";
import "./header.css"; // Assuming the styles are in this file

const Header: React.FC = () => {
  // State to manage user menu visibility
  const user = useAppSelector((state) => state.user);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const dispatch = useAppDispatch();

  // Ref for user menu container to check against clicks
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  // Function to handle clicking on the user icon
  const handleUserIconClick = () => {
    setIsMenuVisible((prev) => !prev); // Toggle visibility on icon click
  };

  // Function to handle clicking the exit button
  const handleExitClick = () => {
    setIsMenuVisible(false);
  };

  const handleSignOut = async () => {
    try {
      const response = await fetch(`${url}/user/logout`, {
        method: "POST",
        credentials: "include", // Important for sending cookies
      });

      if (response.ok) {
        console.log("Sign-out successful");
        // Update the Redux state to reflect that the user is logged out
        dispatch(setIsLogin(false));
        dispatch(clearUser());
        // Optionally, redirect or perform additional cleanup
      } else {
        console.error("Failed to sign out");
      }
    } catch (error) {
      console.error("Error during sign-out:", error);
    } finally {
      setIsMenuVisible(false); // Close the menu regardless of the outcome
    }
  };

  // print user
  useEffect(() => {
    console.log("user:", user);
  }, [user]);

  // Handle clicks outside the user menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        isMenuVisible &&
        userMenuRef.current &&
        !userMenuRef.current.contains(target) &&
        !target.closest(".userIcon")
      ) {
        setIsMenuVisible(false);
      }
    };

    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, [isMenuVisible]);

  return (
    <header>
      <div className="container">
        <div className="icon">
          <img src="./images/icon.png" alt="Icon" />
        </div>
        <div className="email">{user.email}</div>
        <div className="userIcon" onClick={handleUserIconClick}>
          {user.icon ? (
            <img src={user.icon} alt="Icon" />
          ) : (
            <img src="./images/usericon.jpg" alt="Icon" />
          )}
        </div>
      </div>
      <div className={`userMenu-container ${isMenuVisible ? "visible" : ""}`}>
        <div
          className={`userMenu ${isMenuVisible ? "visible" : ""}`}
          ref={userMenuRef} // Attach ref to the user menu
        >
          <div className="header">
            <div>
              <div className="second-userIcon">
                {/* <img src="./images/usericon.jpg" alt="User Icon" /> */}
                {user.icon ? (
                  <img src={user.icon} alt="Icon" />
                ) : (
                  <img src="./images/usericon.jpg" alt="Icon" />
                )}
              </div>
              <div className="email">{user.email}</div>
            </div>
            <div className="exit" onClick={handleExitClick}>
              <IoClose style={{ fontSize: "23px" }} />
            </div>
          </div>
          <div className="menu">
            <ul>
              <li onClick={handleSignOut}>
                {" "}
                <IoIosLogOut className="icon" />
                <div>Sign-out</div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
