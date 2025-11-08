import React, { createContext, useContext, useState, useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import axiosInstance from "./axiosInstance";
import axios from "axios";
import { useDispatch } from "react-redux";
import { toggleLogin } from "../redux/authSlice";
import {
  setName,
  setEmail,
  setFirstName,
  setLastName,
  setId,
} from "../redux/userSlice";
import { useRouter } from "expo-router";
import Toast from "react-native-simple-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [test, setTest] = useState("Test");

  const [user, setUser] = useState({
    username: "",
    id: "",
    first_name: "",
    last_name: "",
    email: "",
  });

  // Create axios instance WITHOUT the Authorization header in initial config
  const axiosInstanceWithBearer = axios.create({
    baseURL: "http://192.168.100.129:5000",
    // baseURL: "http://192.168.1.47:8000",
    // baseURL: "http://192.168.28.101:8000",
    timeout: 20000,
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });

  // Add request interceptor to dynamically inject the token on each request
  axiosInstanceWithBearer.interceptors.request.use(
    (config) => {
      // This function runs on every request, so it always gets the current token
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      console.log('📤 Request:', config.method?.toUpperCase(), config.url);
      console.log('📤 Token present:', !!accessToken);
      return config;
    },
    (error) => {
      console.error('❌ Request interceptor error:', error);
      return Promise.reject(error);
    }
  );

  // Add response interceptor for debugging
  axiosInstanceWithBearer.interceptors.response.use(
    (response) => {
      console.log('✅ Response:', response.status, response.config.url);
      return response;
    },
    (error) => {
      if (error.response) {
        console.error('❌ Server Error:', error.response.status);
        console.error('❌ Error Data:', error.response.data);
        console.error('❌ URL:', error.config?.url);
      } else if (error.request) {
        console.error('❌ No Response from Server');
        console.error('❌ Check if backend is running');
      } else {
        console.error('❌ Error:', error.message);
      }
      return Promise.reject(error);
    }
  );

  const login = async (username, password, setError) => {
    console.log("Attempting to login with:", username, password);
    try {
      // Changed from /api/token/ to /api/auth/login for Node.js backend
      const result = await axiosInstance.post(`/api/auth/login`, {
        email: username, // Backend expects 'email' field for username/email
        password,
      });

      // Store the token from the response
      setAccessToken(result.data.token);
      
      // Set user data directly from login response (no need to fetch profile again)
      dispatch(setId(result.data.user.id));
      dispatch(setName(result.data.user.username));
      dispatch(setEmail(result.data.user.email));
      dispatch(setFirstName(result.data.user.first_name));
      dispatch(setLastName(result.data.user.last_name));
      dispatch(toggleLogin());
      setIsAuthenticated(true);
      setUser({
        username: result.data.user.username,
        id: result.data.user.id,
        first_name: result.data.user.first_name,
        last_name: result.data.user.last_name,
        email: result.data.user.email,
      });

      console.log("Login successful");
      return true;
    } catch (error) {
      if (error.response) {
        console.log("Response Error:", error.response.data);
        console.log("Status Code:", error.response.status);
        if (error.response.status === 401) {
          console.log("Invalid username or password");
          Toast.showWithGravity(
            "Please check your Username or Password.",
            5,
            Toast.CENTER
          );
          setError("Invalid username or password");
        }
      } else if (error.request) {
        console.log(
          "Request Error: No response received from server",
          error.request
        );
      } else {
        console.log("Error Message:", error.message);
      }
    }

    return false;
  };

  const register = async (user, setErrors) => {
    try {
      // Use email as both username and email
      const result = await axiosInstance.post(`/api/auth/register`, {
        username: user.email, // Using email as username
        email: user.email,    // Also sending as email
        password: user.password,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
      });
      console.log("Register successful:", result.data);
      
      // Login with email (which is also the username)
      const isLoggedIn = await login(user.email, user.password, () => {});

      return isLoggedIn;
    } catch (error) {
      if (error.response) {
        console.log("Response Error:", error.response.data);
        console.log("Status Code:", error.response.status);
        
        // Handle the error response from your Node.js backend
        if (error.response.data.errors) {
          const errors = error.response.data.errors;
          
          // Check for userAlreadyExists error from backend
          if (errors.userAlreadyExists) {
            console.log("User already exists");
            setErrors((prev) => ({
              ...prev,
              userAlreadyExists: true,
            }));
          }
        }
        
        // Also handle the old Django format if needed
        if (
          error.response.data.username &&
          error.response.data.username.includes(
            "A user with that username already exists."
          )
        ) {
          console.log("User already exists (Django format)");
          setErrors((prev) => ({
            ...prev,
            userAlreadyExists: true,
          }));
        }
      } else if (error.request) {
        console.log(
          "Request Error: No response received from server",
          error.request
        );
      } else {
        console.log("Error Message:", error.message);
      }
    }

    return false;
  };

  const fetchUserProfile = async (token) => {
    try {
      const response = await axiosInstance.get("api/user/profile/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("User profile fetched:", response.data);
      dispatch(setId(response.data.id));
      dispatch(setName(response.data.username));
      dispatch(setEmail(response.data.email));
      dispatch(setFirstName(response.data.first_name));
      dispatch(setLastName(response.data.last_name));
      dispatch(toggleLogin());
      setIsAuthenticated(true);
      setUser((prev) => ({
        ...prev,
        username: response.data.username,
        id: response.data.id,
        first_name: response.data.first_name,
        last_name: response.data.last_name,
        email: response.data.email,
      }));
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setIsAuthenticated(false);
    }
  };

  const onLogout = () => {
    dispatch(setName(""));
    dispatch(setEmail(""));
    dispatch(toggleLogin());
    setUser({
      username: "",
      id: "",
      first_name: "",
      last_name: "",
      email: "",
    });
    setAccessToken("");
    setIsAuthenticated(false);
    // router.push("pages/auth/Welcome");
  };

  return (
    <AuthContext.Provider
      value={{
        test,
        setTest,
        isAuthenticated,
        loading,
        isAdmin,
        login,
        register,
        user,
        setUser,
        onLogout,
        axiosInstanceWithBearer,
        accessToken,
      }}
    >
      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" />
        </View>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);