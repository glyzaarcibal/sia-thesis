import React, { useState, useEffect, useRef } from "react";
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
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

const COLORS = [
  "#4F46E5", // Indigo
  "#FF6B6B", // Red
  "#6BCB77", // Green
  "#FFD93D", // Yellow
  "#A29BFE", // Purple
  "#FF9F43", // Orange
  "#E84393", // Pink
  "#17A2B8", // Teal
];

// Print-optimized color palette - darker shades for better printing
const PRINT_COLORS = [
  "#2C3E50", // Dark Blue
  "#C0392B", // Dark Red
  "#27AE60", // Dark Green
  "#F39C12", // Dark Yellow
  "#8E44AD", // Dark Purple
  "#D35400", // Dark Orange
  "#C71585", // Dark Pink
  "#16A085", // Dark Teal
];

const IndividualUserView = () => {
  const [userId, setUserId] = useState("user123"); // Mock user ID
  const [userData, setUserData] = useState(null);
  const [userTimeline, setUserTimeline] = useState([]);
  const [questionTimeData, setQuestionTimeData] = useState([]);
  const [comparisonData, setComparisonData] = useState([]);
  const [userList, setUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPrintMode, setIsPrintMode] = useState(false);
  const [insights, setInsights] = useState({});

  // Print mode ref
  const componentRef = useRef();

  // Mock data generation function
  const generateMockData = () => {
    // Generate a list of mock users
    const mockUsers = Array.from({ length: 15 }, (_, i) => ({
      id: `user${i + 100}`,
      name: `User ${i + 1}`,
    }));
    setUserList(mockUsers);

    // Generate mock submissions for the current user
    const submissionCount = Math.floor(Math.random() * 5) + 1; // 1-5 submissions
    const mockSubmissions = [];

    // Counseling types
    const counselingTypes = [
      "Career Counseling",
      "Mental Health Support",
      "Academic Guidance",
      "Relationship Advice",
      "Financial Planning",
    ];

    // Generate submissions with timestamps spread over the last 6 months
    const now = new Date();
    for (let i = 0; i < submissionCount; i++) {
      const submissionDate = new Date(now);
      submissionDate.setMonth(now.getMonth() - i * 2 - Math.random());

      const mockAnalysisResult = {};
      const mockQuestionTimes = {};

      counselingTypes.forEach((type) => {
        // Random score between 0.1 and 0.9
        mockAnalysisResult[type] = Math.random() * 0.8 + 0.1;

        // Random time to answer questions (5-60 seconds)
        mockQuestionTimes[type] = Math.floor(Math.random() * 55) + 5;
      });

      mockSubmissions.push({
        id: `submission_${i}`,
        user: userId,
        created_at: submissionDate.toISOString(),
        analysis_result: mockAnalysisResult,
        question_times: mockQuestionTimes,
        age: 25 + Math.floor(Math.random() * 3), // Age might change slightly over time
        gender: "Female", // Keeping static for this mock
        totalScore: Object.values(mockAnalysisResult).reduce(
          (sum, value) => sum + value,
          0
        ),
      });
    }

    // Sort submissions by date
    mockSubmissions.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    // Set the latest submission as the current user data
    setUserData(mockSubmissions[0]);

    // Prepare timeline data (showing how scores changed over time)
    const timelineData = mockSubmissions.map((submission) => {
      const result = {
        date: new Date(submission.created_at).toLocaleDateString(),
        timestamp: new Date(submission.created_at).getTime(),
      };

      Object.entries(submission.analysis_result).forEach(([type, score]) => {
        result[type] = score * 100; // Convert to percentage
      });

      return result;
    });

    // Sort timeline data chronologically
    timelineData.sort((a, b) => a.timestamp - b.timestamp);
    setUserTimeline(timelineData);

    // Prepare question time data from the latest submission
    const latestQuestionTimes = mockSubmissions[0].question_times;
    const formattedQuestionTimes = Object.entries(latestQuestionTimes).map(
      ([type, time]) => ({
        name: type,
        value: time,
      })
    );
    setQuestionTimeData(formattedQuestionTimes);

    // Generate mock average data for comparison
    const mockAverageData = counselingTypes.map((type) => {
      const userScore = mockSubmissions[0].analysis_result[type] * 100;
      const avgScore = userScore * (0.8 + Math.random() * 0.4); // Random average score

      return {
        name: type,
        user: userScore,
        average: avgScore,
      };
    });
    setComparisonData(mockAverageData);

    // Generate insights
    generateInsights(mockSubmissions, mockAverageData);

    setIsLoading(false);
  };

  // Generate insights based on user data
  const generateInsights = (submissions, comparisonData) => {
    if (!submissions || submissions.length === 0) return;

    const latestSubmission = submissions[0];
    const latestScores = latestSubmission.analysis_result;

    // Top strengths (highest scores)
    const strengths = Object.entries(latestScores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([type, score]) => ({ type, score: (score * 100).toFixed(1) }));

    // Areas for improvement (lowest scores)
    const improvements = Object.entries(latestScores)
      .sort((a, b) => a[1] - b[1])
      .slice(0, 2)
      .map(([type, score]) => ({ type, score: (score * 100).toFixed(1) }));

    // Progress over time (if multiple submissions)
    let progressInsights = [];
    if (submissions.length > 1) {
      // Sort chronologically (oldest first)
      const sortedSubmissions = [...submissions].sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
      );

      const firstSubmission = sortedSubmissions[0];
      const lastSubmission = sortedSubmissions[sortedSubmissions.length - 1];

      // Compare first and last submissions
      Object.entries(lastSubmission.analysis_result).forEach(
        ([type, score]) => {
          const oldScore = firstSubmission.analysis_result[type] || 0;
          const change = ((score - oldScore) * 100).toFixed(1);

          if (Math.abs(change) >= 5) {
            // Only highlight significant changes (5% or more)
            progressInsights.push({
              type,
              change: change,
              improved: change > 0,
            });
          }
        }
      );

      // Sort by most improved
      progressInsights.sort((a, b) => Math.abs(b.change) - Math.abs(a.change));
    }

    // Response time analysis
    const responseTimes = latestSubmission.question_times;
    const avgResponseTime =
      Object.values(responseTimes).reduce((sum, time) => sum + time, 0) /
      Object.values(responseTimes).length;

    const fastestResponse = Object.entries(responseTimes).sort(
      (a, b) => a[1] - b[1]
    )[0];

    const slowestResponse = Object.entries(responseTimes).sort(
      (a, b) => b[1] - a[1]
    )[0];

    // Compare to average
    const aboveAverage = comparisonData
      .filter((item) => item.user > item.average)
      .map((item) => ({
        type: item.name,
        difference: (item.user - item.average).toFixed(1),
      }))
      .sort((a, b) => parseFloat(b.difference) - parseFloat(a.difference));

    const belowAverage = comparisonData
      .filter((item) => item.user < item.average)
      .map((item) => ({
        type: item.name,
        difference: (item.average - item.user).toFixed(1),
      }))
      .sort((a, b) => parseFloat(b.difference) - parseFloat(a.difference));

    // Overall summary
    const overallScore = ((latestSubmission.totalScore * 100) / 5).toFixed(1);
    let overallSummary = "";

    if (overallScore >= 80) {
      overallSummary = "Excellent overall performance across counseling areas.";
    } else if (overallScore >= 70) {
      overallSummary =
        "Strong overall performance with some areas for improvement.";
    } else if (overallScore >= 60) {
      overallSummary =
        "Good performance with specific areas requiring attention.";
    } else {
      overallSummary =
        "Needs significant improvement in multiple counseling areas.";
    }

    // Set insights
    setInsights({
      strengths,
      improvements,
      progressInsights,
      avgResponseTime: avgResponseTime.toFixed(1),
      fastestResponse,
      slowestResponse,
      aboveAverage,
      belowAverage,
      overallSummary,
      overallScore,
    });
  };

  // Load mock data on component mount or user change
  useEffect(() => {
    setIsLoading(true);
    // In a real app, this would be an API call with the userId
    // For now, we'll use mock data
    setTimeout(generateMockData, 500); // Simulate loading delay
  }, [userId]);

  // Change user handler
  const handleUserChange = (e) => {
    setUserId(e.target.value);
  };

  // Format the date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Handle print mode
  const handlePrint = () => {
    setIsPrintMode(true);
    setTimeout(() => {
      window.print();
      setTimeout(() => {
        setIsPrintMode(false);
      }, 500);
    }, 500);
  };

  if (isLoading) {
    return <div className="p-4">Loading user data...</div>;
  }

  // Color scheme based on print mode
  const colorScheme = isPrintMode ? PRINT_COLORS : COLORS;

  return (
    <div
      ref={componentRef}
      className={`p-4 ${isPrintMode ? "print-mode" : ""}`}
    >
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
            .page-break { 
              page-break-before: always;
            }
            .print-friendly {
              break-inside: avoid;
            }
            @page {
              size: portrait;
              margin: 0.5in;
            }
            .print-section {
              margin-bottom: 20px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f0f0f0;
            }
          }
        `}
      </style>

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold">Individual User Analysis</h2>

        <div className="flex items-center space-x-4 no-print">
          {/* User selector */}
          <div className="flex items-center space-x-2">
            <label htmlFor="user-select" className="font-medium">
              Select User:
            </label>
            <select
              id="user-select"
              value={userId}
              onChange={handleUserChange}
              className="border rounded p-2"
            >
              {userList.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          {/* Print button */}
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Print Report
          </button>
        </div>
      </div>

      {/* Report Header */}
      <div className="mb-6 p-4 bg-gray-100 rounded-lg shadow-md print-friendly">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">User Assessment Report</h1>
          <div className="text-right">
            <p className="text-gray-600">
              Report Date: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* User info card */}
      {userData && (
        <div className="mb-6 p-4 bg-gray-100 rounded-lg shadow-md print-friendly">
          <h3 className="font-semibold text-lg mb-2">User Profile</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p>
                <strong>User ID:</strong> {userData.user}
              </p>
              <p>
                <strong>Age:</strong> {userData.age}
              </p>
              <p>
                <strong>Gender:</strong> {userData.gender}
              </p>
            </div>
            <div>
              <p>
                <strong>Last Assessment:</strong>{" "}
                {formatDate(userData.created_at)}
              </p>
              <p>
                <strong>Total Assessments:</strong> {userTimeline.length}
              </p>
            </div>
            <div>
              <p>
                <strong>Overall Score:</strong>{" "}
                {((userData.totalScore * 100) / 5).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Executive Summary - New section for insights */}
      {insights && Object.keys(insights).length > 0 && (
        <div className="mb-8 print-section print-friendly">
          <h3 className="text-lg font-semibold mb-2">Executive Summary</h3>
          <div className="bg-white p-4 rounded-lg border border-gray-300">
            <p className="mb-3 text-lg">{insights.overallSummary}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              {/* Strengths */}
              <div>
                <h4 className="font-medium text-green-700 mb-2">
                  Top Strengths
                </h4>
                <ul className="list-disc pl-5">
                  {insights.strengths &&
                    insights.strengths.map((item, index) => (
                      <li key={index}>
                        <span className="font-medium">{item.type}:</span>{" "}
                        {item.score}%
                      </li>
                    ))}
                </ul>
              </div>

              {/* Areas for Improvement */}
              <div>
                <h4 className="font-medium text-red-700 mb-2">
                  Areas for Improvement
                </h4>
                <ul className="list-disc pl-5">
                  {insights.improvements &&
                    insights.improvements.map((item, index) => (
                      <li key={index}>
                        <span className="font-medium">{item.type}:</span>{" "}
                        {item.score}%
                      </li>
                    ))}
                </ul>
              </div>

              {/* Response Time Analysis */}
              <div>
                <h4 className="font-medium text-blue-700 mb-2">
                  Response Times
                </h4>
                <p className="mb-1">
                  <span className="font-medium">Average Response Time:</span>{" "}
                  {insights.avgResponseTime} seconds
                </p>
                {insights.fastestResponse && (
                  <p className="mb-1">
                    <span className="font-medium">Fastest Response:</span>{" "}
                    {insights.fastestResponse[0]} ({insights.fastestResponse[1]}{" "}
                    seconds)
                  </p>
                )}
                {insights.slowestResponse && (
                  <p className="mb-1">
                    <span className="font-medium">Slowest Response:</span>{" "}
                    {insights.slowestResponse[0]} ({insights.slowestResponse[1]}{" "}
                    seconds)
                  </p>
                )}
              </div>

              {/* Progress Insights */}
              {insights.progressInsights &&
                insights.progressInsights.length > 0 && (
                  <div>
                    <h4 className="font-medium text-purple-700 mb-2">
                      Progress Over Time
                    </h4>
                    <ul className="list-disc pl-5">
                      {insights.progressInsights
                        .slice(0, 3)
                        .map((item, index) => (
                          <li
                            key={index}
                            className={
                              item.improved ? "text-green-600" : "text-red-600"
                            }
                          >
                            <span className="font-medium">{item.type}:</span>{" "}
                            {item.improved ? "+" : ""}
                            {item.change}%
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
            </div>

            {/* Comparison to Average */}
            <div className="mt-6">
              <h4 className="font-medium text-gray-700 mb-2">
                Comparison to Average
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="text-green-600 font-medium mb-1">
                    Above Average Areas
                  </h5>
                  {insights.aboveAverage && insights.aboveAverage.length > 0 ? (
                    <ul className="list-disc pl-5">
                      {insights.aboveAverage.slice(0, 2).map((item, index) => (
                        <li key={index}>
                          <span className="font-medium">{item.type}:</span> +
                          {item.difference}%
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No areas above average.</p>
                  )}
                </div>
                <div>
                  <h5 className="text-red-600 font-medium mb-1">
                    Below Average Areas
                  </h5>
                  {insights.belowAverage && insights.belowAverage.length > 0 ? (
                    <ul className="list-disc pl-5">
                      {insights.belowAverage.slice(0, 2).map((item, index) => (
                        <li key={index}>
                          <span className="font-medium">{item.type}:</span> -
                          {item.difference}%
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No areas below average.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Latest Assessment Results - Radar Chart */}
      <div className="mb-8 print-section print-friendly">
        <h3 className="text-lg font-semibold mb-2">
          Latest Assessment Results
        </h3>
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart outerRadius={150} data={comparisonData}>
              <PolarGrid strokeDasharray="3 3" />
              <PolarAngleAxis dataKey="name" />
              <PolarRadiusAxis domain={[0, 100]} />
              <Radar
                name="User Score"
                dataKey="user"
                stroke={colorScheme[0]}
                fill={colorScheme[0]}
                fillOpacity={0.6}
              />
              <Radar
                name="Average Score"
                dataKey="average"
                stroke={colorScheme[1]}
                fill={colorScheme[1]}
                fillOpacity={0.6}
              />
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* User vs. Average Scores - Bar Chart */}
      <div className="mb-8 print-section print-friendly">
        <h3 className="text-lg font-semibold mb-2">User vs. Average Scores</h3>
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="user" name="User Score" fill={colorScheme[0]} />
              <Bar
                dataKey="average"
                name="Average Score"
                fill={colorScheme[1]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Question Response Times */}
      <div className="mb-8 print-section print-friendly page-break">
        <h3 className="text-lg font-semibold mb-2">
          Question Response Times (seconds)
        </h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={questionTimeData} layout="vertical">
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={150} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name="Response Time (s)" fill="#6BCB77">
                {questionTimeData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colorScheme[index % colorScheme.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Progress Over Time */}
      {userTimeline.length > 1 && (
        <div className="mb-8 print-section print-friendly">
          <h3 className="text-lg font-semibold mb-2">Progress Over Time</h3>
          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userTimeline}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                {Object.keys(userTimeline[0])
                  .filter((key) => key !== "date" && key !== "timestamp")
                  .map((key, index) => (
                    <Line
                      key={key}
                      type="monotone"
                      dataKey={key}
                      stroke={colorScheme[index % colorScheme.length]}
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                    />
                  ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Detailed Assessment Breakdown */}
      <div className="mb-8 print-section page-break">
        <h3 className="text-lg font-semibold mb-2">
          Assessment Score Breakdown
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Counseling Type</th>
                <th className="py-2 px-4 border-b">Score</th>
                <th className="py-2 px-4 border-b">Response Time</th>
                <th className="py-2 px-4 border-b">Compared to Average</th>
              </tr>
            </thead>
            <tbody>
              {userData &&
                Object.entries(userData.analysis_result).map(
                  ([type, score], index) => {
                    const avgScore =
                      comparisonData.find((item) => item.name === type)
                        ?.average || 0;
                    const timeTaken = userData.question_times[type] || 0;
                    const diff = (score * 100 - avgScore).toFixed(1);
                    return (
                      <tr
                        key={type}
                        className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                      >
                        <td className="py-2 px-4 border-b">{type}</td>
                        <td className="py-2 px-4 border-b">
                          {(score * 100).toFixed(1)}%
                        </td>
                        <td className="py-2 px-4 border-b">
                          {timeTaken} seconds
                        </td>
                        <td className="py-2 px-4 border-b">
                          <span
                            className={
                              diff >= 0 ? "text-green-600" : "text-red-600"
                            }
                          >
                            {diff >= 0 ? "+" : ""}
                            {diff}%
                          </span>
                        </td>
                      </tr>
                    );
                  }
                )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recommended Actions - New section */}
      <div className="mb-8 print-section print-friendly">
        <h3 className="text-lg font-semibold mb-2">Recommended Actions</h3>
        <div className="p-4 border border-gray-300 rounded bg-gray-50">
          {insights && insights.improvements && (
            <div>
              <h4 className="font-medium mb-2">Focus Areas:</h4>
              <ul className="list-disc pl-5 mb-4">
                {insights.improvements.map((item, index) => (
                  <li key={index} className="mb-1">
                    <strong>{item.type}:</strong> Consider additional training
                    and resources to improve scores.
                  </li>
                ))}
              </ul>

              {insights.slowestResponse && (
                <div className="mb-4">
                  <h4 className="font-medium mb-2">
                    Response Time Improvement:
                  </h4>
                  <p>
                    Focus on reducing response time for{" "}
                    <strong>{insights.slowestResponse[0]}</strong> (currently{" "}
                    {insights.slowestResponse[1]} seconds). Quick response times
                    are crucial for effective counseling and client
                    satisfaction.
                  </p>
                </div>
              )}

              <h4 className="font-medium mb-2">Follow-up Schedule:</h4>
              <p>
                Next assessment recommended:{" "}
                <strong>
                  {new Date(
                    new Date().setMonth(new Date().getMonth() + 3)
                  ).toLocaleDateString()}
                </strong>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Assessment History */}
      {userTimeline.length > 0 && (
        <div className="mb-8 print-section print-friendly">
          <h3 className="text-lg font-semibold mb-2">Assessment History</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Date</th>
                  {Object.keys(userTimeline[0])
                    .filter((key) => key !== "date" && key !== "timestamp")
                    .map((type) => (
                      <th key={type} className="py-2 px-4 border-b">
                        {type}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {userTimeline.map((entry, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    <td className="py-2 px-4 border-b">{entry.date}</td>
                    {Object.keys(entry)
                      .filter((key) => key !== "date" && key !== "timestamp")
                      .map((type) => (
                        <td key={type} className="py-2 px-4 border-b">
                          {entry[type].toFixed(1)}%
                        </td>
                      ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Report Footer */}
      <div className="mt-10 print-section print-friendly text-center text-gray-500 text-sm">
        <p>
          This report was generated on {new Date().toLocaleDateString()} at{" "}
          {new Date().toLocaleTimeString()}
        </p>
        <p>Confidential: For internal use only</p>
      </div>
    </div>
  );
};

export default IndividualUserView;
