// // hooks/useFetchUserProfile.ts
// import { useEffect, useState } from "react";
// import { useAppDispatch,useAppSelector } from "../redux/hooks";
// import { setIsLogin } from "../redux/isLoginSlice";
// import { setUser, clearUser } from "../redux/userSlice";
// import { User } from "../type/constant";
// import url from "../type/constant";

// const useFetchUserProfile = () => {
//   const dispatch = useAppDispatch();
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const isLogin = useAppSelector((state) => state.isLogin);
//   const [user, setUserData] = useState<User | null>(null); // Store user data

//   const fetchUserProfile = async () => {
//     setLoading(true);
//     setError(""); // Clear previous errors
//     try {
//       const response = await fetch(`${url}/user/getData`, {
//         method: "GET",
//         credentials: "include",
//       });

//       if (response.ok) {
//         const data = await response.json();
//         const user: User = data.user;
//         console.log("get user:", user);
//         setUserData(user); // Store user data
//         dispatch(setUser(user));
//         dispatch(setIsLogin(true));
//       } else {
//         dispatch(clearUser());
//         dispatch(setIsLogin(false));
//       }
//     } catch (error) {
//       console.error("Failed to fetch user profile:", error);
//       setError("Failed to fetch user profile."); // Set error message
//       dispatch(clearUser());
//       dispatch(setIsLogin(false));
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUserProfile();
//   }, [dispatch,isLogin]);

//   return { loading, error, user }; // Return values
// };

// export default useFetchUserProfile;
