import React, { useEffect, useState, useRef } from "react";
import {
  Button,
  Typography,
  Box,
  Paper,
  Grid,
  CircularProgress,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useReactToPrint } from "react-to-print";
import PrintIcon from "@mui/icons-material/Print";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import axiosInstance from "../Utils/axiosInstance";

const Print = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [counselingData, setCounselingData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [summaryData, setSummaryData] = useState({
    totalSubmissions: 0,
    uniqueUsers: 0,
    repeatedSubmissions: 0,
    averageAge: 0,
    genderDistribution: {},
  });
  const printRef = useRef();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.get("/analysis/");
      if (res.status === 200) {
        processAnalysisData(res.data);
      }
    } catch (error) {
      console.error("Error fetching analysis data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const processAnalysisData = (analyses) => {
    const uniqueUserIds = new Set(analyses.map((entry) => entry.user));
    const uniqueUsersCount = uniqueUserIds.size;
    const totalSubmissions = analyses.length;
    const repeatedSubmissions = totalSubmissions - uniqueUsersCount;

    const genderCounts = {};
    let totalAge = 0;
    let ageCount = 0;

    const processedUserData = analyses.reduce((acc, entry) => {
      if (!acc.some((user) => user.userId === entry.user)) {
        acc.push({
          id: entry.user,
          userId: entry.user,
          gender: entry.gender || "Not specified",
          age: entry.age || "Not specified",
        });

        if (entry.gender) {
          genderCounts[entry.gender] = (genderCounts[entry.gender] || 0) + 1;
        }
        if (entry.age) {
          totalAge += entry.age;
          ageCount++;
        }
      }
      return acc;
    }, []);

    const processedCounselingData = analyses.map((entry, index) => {
      return {
        id: index,
        userId: entry.user,
        date: new Date(entry.created_at).toLocaleDateString(),
        ...Object.fromEntries(
          Object.entries(entry.analysis_result).map(([name, value]) => [
            name,
            (value * 100).toFixed(1) + "%",
          ])
        ),
      };
    });

    setCounselingData(processedCounselingData);
    setUserData(processedUserData);
    setSummaryData({
      totalSubmissions,
      uniqueUsers: uniqueUsersCount,
      repeatedSubmissions,
      averageAge: ageCount > 0 ? (totalAge / ageCount).toFixed(1) : "N/A",
      genderDistribution: genderCounts,
    });
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "Counseling Analysis Report",
  });

  const userColumns = [
    { field: "userId", headerName: "User ID", width: 120 },
    { field: "gender", headerName: "Gender", width: 120 },
    { field: "age", headerName: "Age", width: 100 },
  ];

  const getCounselingColumns = () => {
    if (!counselingData.length) return [];
    const allKeys = Object.keys(counselingData[0]).filter(
      (key) => !["id", "userId", "date"].includes(key)
    );
    return [
      { field: "userId", headerName: "User ID", width: 120 },
      { field: "date", headerName: "Date", width: 120 },
      ...allKeys.map((type) => ({ field: type, headerName: type, width: 150 })),
    ];
  };

  return (
    <Box p={4} sx={{ backgroundColor: "#e8f5e9", minHeight: "100vh" }}>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h4" fontWeight="bold" color="#2e7d32">
          Counseling Analysis Report
        </Typography>
        <Box>
          <Button
            variant="contained"
            sx={{ backgroundColor: "#4caf50", color: "white", mr: 2 }}
            startIcon={<PrintIcon />}
            onClick={handlePrint}
          >
            Print Report
          </Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: "#388e3c", color: "white" }}
            startIcon={<PictureAsPdfIcon />}
            onClick={handlePrint}
          >
            Save as PDF
          </Button>
        </Box>
      </Box>
      <div ref={printRef}>
        <Paper sx={{ p: 3, mb: 4, backgroundColor: "#c8e6c9" }}>
          <Typography variant="h5" gutterBottom color="#1b5e20">
            Summary Statistics
          </Typography>
          <Grid container spacing={2}>
            {Object.entries(summaryData).map(
              ([key, value]) =>
                key !== "genderDistribution" && (
                  <Grid item xs={6} md={3} key={key}>
                    <Typography variant="body1" color="#2e7d32">
                      <strong>{key.replace(/([A-Z])/g, " $1").trim()}:</strong>{" "}
                      {value}
                    </Typography>
                  </Grid>
                )
            )}
          </Grid>
        </Paper>

        <Paper sx={{ p: 3, mb: 4, backgroundColor: "#a5d6a7" }}>
          <Typography variant="h5" gutterBottom color="#1b5e20">
            User Demographics
          </Typography>
          <DataGrid
            rows={userData}
            columns={userColumns}
            pageSize={5}
            disableSelectionOnClick
            autoHeight
          />
        </Paper>

        <Paper sx={{ p: 3, backgroundColor: "#81c784" }}>
          <Typography variant="h5" gutterBottom color="#1b5e20">
            Counseling Analysis Details
          </Typography>
          <DataGrid
            rows={counselingData}
            columns={getCounselingColumns()}
            pageSize={10}
            disableSelectionOnClick
            autoHeight
          />
        </Paper>
      </div>
    </Box>
  );
};

export default Print;
