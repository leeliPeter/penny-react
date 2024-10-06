// hooks/useFetchUserProfile.ts
import { useAppDispatch } from "../redux/hooks";
import { setUser, clearUser } from "../redux/userSlice";
import url from "../type/constant"; // Make sure the URL points to your backend

const afterUpload = () => {
  const dispatch = useAppDispatch();

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`${url}/user/getData`, {
        method: "GET",
        credentials: "include", // Include session cookies for authentication
      });

      if (response.ok) {
        const data = await response.json();
        const updatedUser = data.user;
        dispatch(setUser(updatedUser)); // Update Redux with the fetched user data
        console.log("User profile fetched:", updatedUser);
      } else {
        dispatch(clearUser()); // Clear user data if fetching fails
        console.error("Failed to fetch user profile");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      dispatch(clearUser()); // Clear user data on error
    }
  };

  return { fetchUserProfile }; // Return fetch function to be used in other components
};

export default afterUpload;
