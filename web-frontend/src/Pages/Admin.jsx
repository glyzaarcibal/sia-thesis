import React, { useEffect, useState, useRef } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";
import axiosInstance from "../Utils/axiosInstance";
import { motion } from "framer-motion";

const COLORS = [
  "#2E8B57",
  "#20B2AA",
  "#3CB371",
  "#228B22",
  "#9ACD32",
  "#6B8E23",
  "#32CD32",
  "#8FBC8F",
];
const GENDER_COLORS = {
  Male: "#2E8B57",
  Female: "#9ACD32",
  "Non-binary": "#3CB371",
  Other: "#6B8E23",
};

// Mock data generation
const generateMockData = () => {
  // Mock counseling data
  const counselingTypes = [
    "Stress Management",
    "Depression",
    "Anxiety",
    "Relationship Issues",
    "Career Counseling",
    "Grief & Loss",
    "Trauma Recovery",
    "Addiction Support",
  ];

  const mockCounselingData = counselingTypes.map((type) => ({
    name: type,
    value: Math.floor(Math.random() * 80) + 20, // Random value between 20-100
  }));

  // Mock gender distribution
  const mockGenderData = [
    { name: "Male", value: Math.floor(Math.random() * 200) + 100 },
    { name: "Female", value: Math.floor(Math.random() * 200) + 100 },
    { name: "Non-binary", value: Math.floor(Math.random() * 40) + 10 },
    { name: "Other", value: Math.floor(Math.random() * 20) + 5 },
  ];

  // Mock sleep data (past 30 days)
  const mockSleepData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return {
      date: date.toISOString().slice(0, 10),
      hours: Math.random() * 4 + 4, // Random sleep hours between 4-8
    };
  });

  // Mock mood data
  const mockMoodData = [
    { mood: "Happy", count: Math.floor(Math.random() * 100) + 50 },
    { mood: "Sad", count: Math.floor(Math.random() * 50) + 20 },
    { mood: "Anxious", count: Math.floor(Math.random() * 80) + 30 },
    { mood: "Calm", count: Math.floor(Math.random() * 70) + 40 },
    { mood: "Frustrated", count: Math.floor(Math.random() * 60) + 30 },
    { mood: "Energetic", count: Math.floor(Math.random() * 40) + 20 },
  ];

  // Mock breathing session data
  const mockBreathingData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return {
      date: date.toISOString().slice(0, 10),
      duration: Math.floor(Math.random() * 15) + 5, // Random duration between 5-20 minutes
    };
  });

  // Mock user stats
  const mockUniqueUsers = Math.floor(Math.random() * 300) + 200;
  const mockRepeatedSubmissions = Math.floor(Math.random() * 200) + 100;
  const mockTotalSubmissions = mockUniqueUsers + mockRepeatedSubmissions;

  return {
    // counselingData: mockCounselingData,
    percentageCounselingData: mockCounselingData.map((item) => ({
      ...item,
      value:
        (item.value / mockCounselingData.reduce((sum, i) => sum + i.value, 0)) *
        100,
    })),
    genderData: mockGenderData,
    sleepData: mockSleepData,
    moodData: mockMoodData,
    breathingData: mockBreathingData,
    userStats: {
      totalSubmissions: mockTotalSubmissions,
      uniqueUsers: mockUniqueUsers,
      repeatedSubmissions: mockRepeatedSubmissions,
    },
  };
};

// Real data transformation functions
const transformCounselingData = (apiData) => {
  // Get all the counseling type keys (excluding non-counseling fields)
  const counselingTypes = Object.keys(apiData[0]).filter(
    (key) =>
      key !== "id" &&
      key !== "created_at" &&
      key !== "user" &&
      key.includes("counseling")
  );

  // Calculate average values for each counseling type across all entries
  return counselingTypes.map((type) => {
    // Calculate average value (and convert to percentage)
    const average =
      (apiData.reduce((sum, entry) => sum + entry[type], 0) / apiData.length) *
      100;

    // Format the counseling type name for display (convert from snake_case to Title Case)
    const formattedName = type
      .replace(/_counseling$/, "") // Remove the _counseling suffix
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return {
      name: formattedName,
      value: parseFloat(average.toFixed(1)), // Round to 1 decimal place
    };
  });
};

// Function to calculate user statistics from API data
const calculateUserStats = (apiData) => {
  const uniqueUsers = new Set(apiData.map((entry) => entry.user)).size;
  const totalSubmissions = apiData.length;
  const repeatedSubmissions = totalSubmissions - uniqueUsers;

  return {
    uniqueUsers,
    totalSubmissions,
    repeatedSubmissions,
  };
};

const Admin = () => {
  // Add mock data toggle state
  const [useMockData, setUseMockData] = useState(true);

  const [data, setData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [genderData, setGenderData] = useState([]);
  const [totalSubmissions, setTotalSubmissions] = useState(0);
  const [uniqueUsers, setUniqueUsers] = useState(0);
  const [repeatedSubmissions, setRepeatedSubmissions] = useState(0);
  const [sleepData, setSleepData] = useState([]);
  const [moodData, setMoodData] = useState([]);
  const [breathingData, setBreathingData] = useState([]);
  const [isPrintMode, setIsPrintMode] = useState(false);

  // Ref for the content to be printed
  const printRef = useRef(null);

  // Load mock data when useMockData changes
  useEffect(() => {
    if (useMockData) {
      const mockData = generateMockData();
      fetchCounselingData();
      // setData(mockData.percentageCounselingData);
      // setPieData(mockData.counselingData);
      setGenderData(mockData.genderData);
      setSleepData(mockData.sleepData);
      setMoodData(mockData.moodData);
      setBreathingData(mockData.breathingData);
      setTotalSubmissions(mockData.userStats.totalSubmissions);
      // setUniqueUsers(mockData.userStats.uniqueUsers);
      // setRepeatedSubmissions(mockData.userStats.repeatedSubmissions);
    } else {
      // Fetch real counseling data
    }
  }, [useMockData]);

  // Function to fetch real counseling data
  const fetchCounselingData = async () => {
    try {
      const response = await axiosInstance.get("/api/all-counseling-analyses/");
      console.log("Counseling Data Response:", response.data);

      // Transform the data
      const transformedData = transformCounselingData(response.data);
      setData(transformedData);
      setPieData(transformedData);

      // Calculate user statistics
      const userStats = calculateUserStats(response.data);
      setUniqueUsers(userStats.uniqueUsers);
      setTotalSubmissions(userStats.totalSubmissions);
      setRepeatedSubmissions(userStats.repeatedSubmissions);
    } catch (error) {
      console.error("Error fetching counseling data:", error);
    }
  };

  const transformSleepData = (apiData) => {
    return apiData.map((entry) => ({
      date: entry.date, // Keep the same date
      hours: calculateSleepHours(entry.sleep_time, entry.wake_time), // Convert duration
    }));
  };

  // Function to calculate hours between sleep and wake time
  const calculateSleepHours = (sleepTime, wakeTime) => {
    const sleepDate = new Date(`2025-03-28 ${sleepTime}`);
    const wakeDate = new Date(`2025-03-28 ${wakeTime}`);

    let diff = (wakeDate - sleepDate) / (1000 * 60 * 60); // Convert milliseconds to hours

    if (diff < 0) {
      diff += 24; // Adjust if sleep time is PM and wake time is AM
    }

    return diff;
  };

  useEffect(() => {
    if (useMockData) {
      const fetchSleepData = async () => {
        try {
          const response = await axiosInstance.get("/sleep-tracker-all/");
          console.log("Sleep Data Response:", response.data);
          setSleepData(transformSleepData(response.data));
        } catch (error) {
          console.error("Error fetching sleep data:", error);
        }
      };

      fetchSleepData();
    }
  }, [useMockData]);

  useEffect(() => {
    if (useMockData) {
      const fetchMoodData = async () => {
        try {
          const response = await axiosInstance.get("/api/all-mood-entries/");
          console.log("Mood Data Response:", response.data);

          // Transform the data to count occurrences of each mood
          const moodCounts = {};

          response.data.forEach((entry) => {
            if (moodCounts[entry.mood]) {
              moodCounts[entry.mood]++;
            } else {
              moodCounts[entry.mood] = 1;
            }
          });

          // Convert to the required format
          const transformedData = Object.keys(moodCounts).map((mood) => ({
            mood: mood,
            count: moodCounts[mood],
          }));

          setMoodData(transformedData);
        } catch (error) {
          console.error("Error fetching mood data:", error);
        }
      };

      fetchMoodData();
    }
  }, [useMockData]);

  useEffect(() => {
    if (!useMockData) {
      const fetchBreathingData = async () => {
        try {
          const response = await axiosInstance.get("/breathing-session/");
          setBreathingData(response.data);
        } catch (error) {
          console.error("Error fetching breathing data:", error);
        }
      };

      fetchBreathingData();
    }
  }, [useMockData]);

  useEffect(() => {
    if (!useMockData) {
      const fetchGenderData = async () => {
        try {
          const response = await axiosInstance.get("/api/users-with-profiles/");
          const genderCounts = processGenderData(response.data);
          setGenderData(genderCounts);
        } catch (error) {
          console.error("Error fetching user profile data:", error);
        }
      };

      fetchGenderData();
    }
  }, [useMockData]);

  const processGenderData = (userData) => {
    const genderMap = {};

    userData.forEach((user) => {
      const gender = user.gender || "Not Specified";

      if (genderMap[gender]) {
        genderMap[gender]++;
      } else {
        genderMap[gender] = 1;
      }
    });

    const genderData = Object.keys(genderMap).map((gender) => ({
      name: gender,
      value: genderMap[gender],
    }));

    return genderData;
  };

  const userStatsData = [
    { name: "Unique Users", value: uniqueUsers },
    { name: "Repeated Submissions", value: repeatedSubmissions },
  ];

  // Handle print function
  const handlePrint = () => {
    setIsPrintMode(true);
    setTimeout(() => {
      window.print();
      setTimeout(() => {
        setIsPrintMode(false);
      }, 500);
    }, 500);
  };

  // Convert data to CSV and download
  const exportToCSV = () => {
    // Prepare all data as objects
    const allData = {
      counselingData: data,
      genderDistribution: genderData,
      sleepTracking: sleepData,
      moodTracking: moodData,
      breathingSessions: breathingData,
      userStats: userStatsData,
    };

    // Convert to CSV content
    let csvContent = "data:text/csv;charset=utf-8,";

    // Add header row
    csvContent += "Data Type,Category,Value\r\n";

    // Add counseling data
    data.forEach((item) => {
      csvContent += `Counseling Distribution,${item.name},${item.value}\r\n`;
    });

    // Add gender data
    genderData.forEach((item) => {
      csvContent += `Gender Distribution,${item.name},${item.value}\r\n`;
    });

    // Add sleep data (simplified)
    sleepData.forEach((item) => {
      csvContent += `Sleep Tracking,${item.date},${item.hours}\r\n`;
    });

    // Add mood data (simplified)
    moodData.forEach((item) => {
      csvContent += `Mood Tracking,${item.mood},${item.count}\r\n`;
    });

    // Add breathing data (simplified)
    breathingData.forEach((item) => {
      csvContent += `Breathing Sessions,${item.date},${item.duration}\r\n`;
    });

    // Add user stats
    userStatsData.forEach((item) => {
      csvContent += `User Statistics,${item.name},${item.value}\r\n`;
    });

    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "admin_dashboard_data.csv");
    document.body.appendChild(link);

    // Trigger download
    link.click();
    document.body.removeChild(link);
  };

  // Export to Excel format (XLSX)
  const exportToExcel = () => {
    // For Excel, we'll use a library like SheetJS in a real implementation
    // But for simplicity, we'll just convert to CSV for now
    // In a real app, you'd want to import * as XLSX from 'xlsx'
    alert(
      "Excel export functionality would be implemented with SheetJS in a production environment. Using CSV export for now."
    );
    exportToCSV();
  };

  return (
    <div className={`${isPrintMode ? "print-mode" : ""}`}>
      <style>
        {`
          @media print {
            body { 
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .no-print { 
              display: none !important;
            }
            .print-section {
              break-inside: avoid;
              margin-bottom: 20px;
            }
            .print-header {
              text-align: center;
              margin-bottom: 20px;
            }
            @page {
              size: portrait;
              margin: 0.5in;
            }
          }
        `}
      </style>

      <div ref={printRef} className="p-8 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <motion.h2
            className="text-3xl font-bold"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            📊 User Analysis Overview
          </motion.h2>

          {/* Export, Print, and Mock Data Toggle Buttons */}
          <div className="flex space-x-4 no-print">
            <button
              onClick={() => setUseMockData(!useMockData)}
              className={`px-4 py-2 text-white rounded-lg transition-colors flex items-center ${
                useMockData
                  ? "bg-purple-600 hover:bg-purple-700"
                  : "bg-gray-600 hover:bg-gray-700"
              }`}
            >
              <span className="mr-2">🔄</span>
              {useMockData ? "Using Mock Data" : "Use Mock Data"}
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <span className="mr-2">🖨️</span> Print Report
            </button>
            <button
              onClick={exportToCSV}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
            >
              <span className="mr-2">📄</span> Export CSV
            </button>
            <button
              onClick={exportToExcel}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center"
            >
              <span className="mr-2">📊</span> Export Excel
            </button>
          </div>
        </div>

        {/* Print-only header */}
        <div className="hidden print:block print-header">
          <h1 className="text-3xl font-bold text-center">
            User Analysis Dashboard Report
          </h1>
          <p className="text-center">
            Generated on: {new Date().toLocaleDateString()} at{" "}
            {new Date().toLocaleTimeString()}
          </p>
          {useMockData && (
            <p className="text-center text-red-500 font-bold mt-2">
              [MOCK DATA FOR TESTING PURPOSES ONLY]
            </p>
          )}
        </div>

        {/* Statistics Section */}
        <motion.div
          className="mb-6 p-4 bg-gray-100 rounded-lg shadow-md text-gray-800 print-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-lg">
            📊 <strong>Total Submissions:</strong> {totalSubmissions}
          </p>
          <p className="text-lg">
            👤 <strong>Unique Users:</strong> {uniqueUsers}
          </p>
          <p className="text-lg">
            🔁 <strong>Repeated Submissions:</strong> {repeatedSubmissions}
          </p>
          {useMockData && (
            <p className="text-red-500 text-sm mt-2">
              Using mock data for demonstration purposes
            </p>
          )}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <motion.div
            className="bg-white p-6 rounded-xl shadow-lg print-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Gender Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={genderData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {genderData.map((entry) => (
                    <Cell
                      key={`cell-${entry.name}`}
                      fill={GENDER_COLORS[entry.name] || "#228B22"}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            className="bg-white p-6 rounded-xl shadow-lg print-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Sleep Hours Tracking
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={sleepData}>
                <XAxis dataKey="date" />
                <YAxis dataKey="hours" />
                <Tooltip />
                <Line type="monotone" dataKey="hours" stroke="#FFA07A" />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            className="bg-white p-6 rounded-xl shadow-lg print-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Mood Tracking
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={moodData}>
                <XAxis dataKey="mood" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#FFA07A" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Bar Chart for Counseling Type Distribution */}
          <motion.div
            className="bg-white p-6 rounded-xl shadow-lg print-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Counseling Type Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={pieData} layout="vertical">
                <XAxis type="number" domain={[0, 100]} />
                <YAxis type="category" dataKey="name" width={200} />
                <Tooltip />
                <Bar dataKey="value" fill="#32CD32" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            className="bg-white p-6 rounded-xl shadow-lg print-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Breathing Session Data
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={breathingData}>
                <XAxis dataKey="date" />
                <YAxis dataKey="duration" />
                <Tooltip />
                <Line type="monotone" dataKey="duration" stroke="#FF4500" />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Bar Chart for Unique Users & Repeated Submissions */}
          <motion.div
            className="bg-white p-6 rounded-xl shadow-lg print-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Unique Users vs Repeated Submissions
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userStatsData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#1E90FF" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Overall Analysis Below */}
        <motion.div
          className="bg-white p-6 rounded-xl shadow-lg mt-8 print-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Overall Analysis
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${entry.name}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Insights Section - Shows in print version */}
        <motion.div
          className="bg-white p-6 rounded-xl shadow-lg mt-8 print-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Key Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border p-4 rounded-lg">
              <h4 className="font-medium text-green-700 mb-2">
                Gender Distribution Insights
              </h4>
              <p className="text-gray-700">
                {genderData.length > 0
                  ? `The most represented gender is ${
                      genderData.sort((a, b) => b.value - a.value)[0]?.name
                    } 
                   with ${
                     genderData.sort((a, b) => b.value - a.value)[0]?.value
                   } users (${(
                      (genderData.sort((a, b) => b.value - a.value)[0]?.value /
                        genderData.reduce((sum, item) => sum + item.value, 0)) *
                      100
                    ).toFixed(1)}%).`
                  : "No gender data available."}
              </p>
            </div>

            <div className="border p-4 rounded-lg">
              <h4 className="font-medium text-blue-700 mb-2">
                Counseling Distribution Insights
              </h4>
              <p className="text-gray-700">
                {data.length > 0
                  ? `The most common counseling focus is ${
                      data.sort((a, b) => b.value - a.value)[0]?.name
                    } 
                   with an average score of ${data
                     .sort((a, b) => b.value - a.value)[0]
                     ?.value.toFixed(1)}%.`
                  : "No counseling data available."}
              </p>
            </div>

            <div className="border p-4 rounded-lg">
              <h4 className="font-medium text-orange-700 mb-2">
                User Engagement Insights
              </h4>
              <p className="text-gray-700">
                {`There are ${uniqueUsers} unique users with ${repeatedSubmissions} repeat submissions. 
                 The average submissions per user is ${(
                   totalSubmissions / (uniqueUsers || 1)
                 ).toFixed(1)}.`}
              </p>
            </div>

            <div className="border p-4 rounded-lg">
              <h4 className="font-medium text-purple-700 mb-2">
                Health Tracking Insights
              </h4>
              <p className="text-gray-700">
                {sleepData.length > 0
                  ? `Average sleep hours: ${(
                      sleepData.reduce((sum, item) => sum + item.hours, 0) /
                      sleepData.length
                    ).toFixed(1)} hours per night.`
                  : "No sleep data available."}
                {breathingData.length > 0
                  ? ` Average breathing session: ${(
                      breathingData.reduce(
                        (sum, item) => sum + item.duration,
                        0
                      ) / breathingData.length
                    ).toFixed(1)} minutes.`
                  : ""}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Print Footer */}
        <div className="hidden print:block mt-8 text-center text-gray-500 border-t pt-4">
          <p>
            Confidential: This report contains sensitive user data. For
            authorized personnel only.
          </p>
          <p>
            Generated from User Analysis Dashboard on{" "}
            {new Date().toLocaleString()}
          </p>
          {useMockData && (
            <p className="text-red-500 font-bold">
              THIS REPORT CONTAINS MOCK DATA FOR TESTING PURPOSES ONLY
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
