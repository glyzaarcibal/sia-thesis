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
import Toast from "../utils/toast";
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [test, setTest] = useState("Test");

  const [user, setUser] = useState({
    username: "",
    id: "",
    first_name: "",
    last_name: "",
    email: "",
    role: "",
    isAdmin: false,
  });

  // ✅ CHECK IF USER IS ALREADY LOGGED IN ON APP START
  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      console.log("🔍 Checking if user is already logged in...");
      
      const savedToken = await AsyncStorage.getItem('token');
      const savedUserStr = await AsyncStorage.getItem('user');
      
      if (savedToken && savedUserStr) {
        const savedUser = JSON.parse(savedUserStr);
        console.log("✅ Found saved login:", savedUser);
        
        setAccessToken(savedToken);
        
        dispatch(setId(savedUser.id));
        dispatch(setName(savedUser.username));
        dispatch(setEmail(savedUser.email));
        dispatch(setFirstName(savedUser.first_name));
        dispatch(setLastName(savedUser.last_name));
        dispatch(toggleLogin());
        
        setUser({
          username: savedUser.username,
          id: savedUser.id,
          first_name: savedUser.first_name,
          last_name: savedUser.last_name,
          email: savedUser.email,
          role: savedUser.role,
          isAdmin: savedUser.isAdmin || savedUser.is_staff,
        });
        
        setIsAuthenticated(true);
        setIsAdmin(savedUser.isAdmin || savedUser.is_staff);
        
        console.log("✅ User automatically logged in!");
      } else {
        console.log("ℹ️ No saved login found");
      }
    } catch (error) {
      console.error("❌ Error checking login status:", error);
    } finally {
      setLoading(false);
    }
  };

  const axiosInstanceWithBearer = axios.create({
    baseURL: "http://10.206.175.143:5000",
    timeout: 20000,
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });

  axiosInstanceWithBearer.interceptors.request.use(
    (config) => {
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

  axiosInstanceWithBearer.interceptors.response.use(
    (response) => {
      console.log('✅ Response:', response.status, response.config.url);
      return response;
    },
    (error) => {
      if (error.response) {
        console.error('❌ Server Error:', error.response.status);
        console.error('❌ Error Data:', error.response.data);
        
        if (error.response.status === 401) {
          console.log("⚠️ Unauthorized - Logging out...");
          onLogout();
        }
      } else if (error.request) {
        console.error('❌ No Response from Server');
      } else {
        console.error('❌ Error:', error.message);
      }
      return Promise.reject(error);
    }
  );

  // ✅ MODIFIED: Return user data instead of just true/false
  const login = async (username, password, setError) => {
    console.log("🔐 Attempting to login with:", username);
    try {
      const result = await axiosInstance.post(`/api/auth/login`, {
        email: username,
        password,
      });

      console.log("✅ Login API successful:", result.data);

      // Create user object
      const userData = {
        username: result.data.user.username,
        id: result.data.user.id,
        first_name: result.data.user.first_name,
        last_name: result.data.user.last_name,
        email: result.data.user.email,
        role: result.data.user.role,
        isAdmin: result.data.user.isAdmin || result.data.user.is_staff,
      };

      // ✅ STEP 1: Save to AsyncStorage
      await AsyncStorage.setItem('token', result.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      console.log('💾 Saved to AsyncStorage');

      // ✅ STEP 2: Save to Redux
      dispatch(setId(userData.id));
      dispatch(setName(userData.username));
      dispatch(setEmail(userData.email));
      dispatch(setFirstName(userData.first_name));
      dispatch(setLastName(userData.last_name));
      dispatch(toggleLogin());
      console.log('💾 Saved to Redux');

      // ✅ STEP 3: Save to local state
      setAccessToken(result.data.token);
      setIsAuthenticated(true);
      setIsAdmin(userData.isAdmin);
      setUser(userData);

      console.log("✅ Login successful - User:", {
        username: userData.username,
        role: userData.role,
        isAdmin: userData.isAdmin,
      });

      // ✅ RETURN USER DATA (not just true) - THIS IS THE FIX!
      const returnValue = { success: true, user: userData };
      console.log("🔙 Returning from login:", returnValue);
      return returnValue;
    } catch (error) {
      if (error.response) {
        console.log("❌ Response Error:", error.response.data);
        console.log("❌ Status Code:", error.response.status);
        if (error.response.status === 401) {
          console.log("❌ Invalid username or password");
          Toast.showWithGravity(
            "Please check your Username or Password.",
            5,
            Toast.CENTER
          );
          setError("Invalid username or password");
        }
      } else if (error.request) {
        console.log("❌ Request Error: No response received from server");
        Toast.showWithGravity(
          "Cannot connect to server. Please check your internet connection.",
          5,
          Toast.CENTER
        );
      } else {
        console.log("❌ Error Message:", error.message);
      }
      
      // ✅ Return error object
      return { success: false, user: null };
    }
  };

  const register = async (user, setErrors) => {
    try {
      const result = await axiosInstance.post(`/api/auth/register`, {
        username: user.email,
        email: user.email,
        password: user.password,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
      });
      console.log("✅ Register successful:", result.data);
      
      // ✅ Return the login result properly
      return await login(user.email, user.password, () => {});
    } catch (error) {
      if (error.response) {
        console.log("❌ Response Error:", error.response.data);
        console.log("❌ Status Code:", error.response.status);
        
        if (error.response.data.errors) {
          const errors = error.response.data.errors;
          
          if (errors.userAlreadyExists) {
            console.log("❌ User already exists");
            Toast.showWithGravity(
              "Email already exists. Please use a different email.",
              5,
              Toast.CENTER
            );
            setErrors((prev) => ({
              ...prev,
              userAlreadyExists: true,
            }));
          }
        }
        
        if (
          error.response.data.username &&
          error.response.data.username.includes(
            "A user with that username already exists."
          )
        ) {
          console.log("❌ User already exists");
          Toast.showWithGravity(
            "Username already exists. Please use a different username.",
            5,
            Toast.CENTER
          );
          setErrors((prev) => ({
            ...prev,
            userAlreadyExists: true,
          }));
        }
      } else if (error.request) {
        console.log("❌ Request Error: No response received from server");
        Toast.showWithGravity(
          "Cannot connect to server. Please check your internet connection.",
          5,
          Toast.CENTER
        );
      } else {
        console.log("❌ Error Message:", error.message);
      }
    }

    return { success: false, user: null };
  };

  const fetchUserProfile = async (token) => {
    try {
      const response = await axiosInstance.get("api/user/profile/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("✅ User profile fetched:", response.data);
      
      dispatch(setId(response.data.id));
      dispatch(setName(response.data.username));
      dispatch(setEmail(response.data.email));
      dispatch(setFirstName(response.data.first_name));
      dispatch(setLastName(response.data.last_name));
      
      setUser((prev) => ({
        ...prev,
        username: response.data.username,
        id: response.data.id,
        first_name: response.data.first_name,
        last_name: response.data.last_name,
        email: response.data.email,
        role: response.data.role,
        isAdmin: response.data.is_staff,
      }));
      
      const userData = {
        id: response.data.id,
        username: response.data.username,
        email: response.data.email,
        first_name: response.data.first_name,
        last_name: response.data.last_name,
        role: response.data.role,
        isAdmin: response.data.is_staff,
      };
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      
      setIsAuthenticated(true);
    } catch (error) {
      console.error("❌ Error fetching user profile:", error);
      setIsAuthenticated(false);
    }
  };

  const onLogout = async () => {
    try {
      console.log("🚪 Logging out...");
      
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      console.log('🗑️ Cleared AsyncStorage');
      
      dispatch(setName(""));
      dispatch(setEmail(""));
      dispatch(setFirstName(""));
      dispatch(setLastName(""));
      dispatch(setId(""));
      dispatch(toggleLogin());
      console.log('🗑️ Cleared Redux');
      
      setUser({
        username: "",
        id: "",
        first_name: "",
        last_name: "",
        email: "",
        role: "",
        isAdmin: false,
      });
      setAccessToken("");
      setIsAuthenticated(false);
      setIsAdmin(false);
      
      console.log("✅ Logout successful");
      
      Toast.showWithGravity(
        "You have been logged out successfully",
        3,
        Toast.CENTER
      );
    } catch (error) {
      console.error("❌ Error during logout:", error);
    }
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
        fetchUserProfile,
      }}
    >
      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: '#fff' }}
        >
          <ActivityIndicator size="large" color="#8b5cf6" />
        </View>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);