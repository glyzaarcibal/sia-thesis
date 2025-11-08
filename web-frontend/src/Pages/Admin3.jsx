import React, { useState, useEffect } from "react";
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
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts";
import _ from "lodash";

// Import questions data
// import questionsData from "../Data/Questions";

// Mock questions data structure
const mockQuestionsData = [
  {
    id: "q1",
    text: "How often do you feel overwhelmed by your work responsibilities?",
    category: "Career Counseling",
    type: "likert",
    options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
    weight: 1.2,
  },
  {
    id: "q2",
    text: "Do you find it difficult to make career decisions?",
    category: "Career Counseling",
    type: "likert",
    options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
    weight: 1.0,
  },
  {
    id: "q3",
    text: "How satisfied are you with your current career path?",
    category: "Career Counseling",
    type: "likert",
    options: [
      "Very Dissatisfied",
      "Dissatisfied",
      "Neutral",
      "Satisfied",
      "Very Satisfied",
    ],
    weight: 1.5,
  },
  {
    id: "q4",
    text: "How often do you experience anxiety or worry?",
    category: "Mental Health Support",
    type: "likert",
    options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
    weight: 1.3,
  },
  {
    id: "q5",
    text: "Do you have trouble sleeping due to stress or worry?",
    category: "Mental Health Support",
    type: "likert",
    options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
    weight: 1.1,
  },
  {
    id: "q6",
    text: "How would you rate your overall mental well-being?",
    category: "Mental Health Support",
    type: "likert",
    options: ["Poor", "Fair", "Good", "Very Good", "Excellent"],
    weight: 1.4,
  },
  {
    id: "q7",
    text: "How confident are you in your academic abilities?",
    category: "Academic Guidance",
    type: "likert",
    options: ["Not at all", "Slightly", "Moderately", "Very", "Extremely"],
    weight: 1.0,
  },
  {
    id: "q8",
    text: "How often do you struggle with time management for studies?",
    category: "Academic Guidance",
    type: "likert",
    options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
    weight: 1.2,
  },
  {
    id: "q9",
    text: "How satisfied are you with your relationship with your partner?",
    category: "Relationship Advice",
    type: "likert",
    options: [
      "Very Dissatisfied",
      "Dissatisfied",
      "Neutral",
      "Satisfied",
      "Very Satisfied",
    ],
    weight: 1.3,
  },
  {
    id: "q10",
    text: "How often do you argue with your partner?",
    category: "Relationship Advice",
    type: "likert",
    options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
    weight: 1.1,
  },
  {
    id: "q11",
    text: "How comfortable are you with your current financial situation?",
    category: "Financial Planning",
    type: "likert",
    options: ["Not at all", "Slightly", "Moderately", "Very", "Extremely"],
    weight: 1.4,
  },
  {
    id: "q12",
    text: "Do you regularly save money for the future?",
    category: "Financial Planning",
    type: "likert",
    options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
    weight: 1.2,
  },
];

// Mock response data
const generateMockResponseData = (questions) => {
  const responseCount = 500; // Total number of mock responses
  const responses = [];

  for (let i = 0; i < responseCount; i++) {
    const userResponse = {
      userId: `user${100 + Math.floor(Math.random() * 100)}`,
      timestamp: new Date(
        Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
      answers: {},
      responseTime: {},
    };

    // Generate random answers and response times for each question
    questions.forEach((question) => {
      // For likert questions, generate a random answer index (0-4)
      const answerIndex = Math.floor(Math.random() * 5);
      userResponse.answers[question.id] = answerIndex;

      // Generate a random response time between 3 and 60 seconds
      userResponse.responseTime[question.id] =
        Math.floor(Math.random() * 57) + 3;
    });

    responses.push(userResponse);
  }

  return responses;
};

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

const QuestionsAnalytics = () => {
  const [questionsData, setQuestionsData] = useState(mockQuestionsData);
  const [responseData, setResponseData] = useState([]);
  const [questionMetrics, setQuestionMetrics] = useState([]);
  const [categoryMetrics, setCategoryMetrics] = useState([]);
  const [correlationData, setCorrelationData] = useState([]);
  const [responseDistribution, setResponseDistribution] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  // Calculate metrics for questions
  useEffect(() => {
    // In a real app, this would fetch data from an API
    const mockResponses = generateMockResponseData(questionsData);
    setResponseData(mockResponses);

    // Calculate metrics for each question
    const metrics = questionsData.map((question) => {
      // Get all responses for this question
      const answers = mockResponses.map(
        (response) => response.answers[question.id]
      );
      const times = mockResponses.map(
        (response) => response.responseTime[question.id]
      );

      // Calculate average response
      const averageResponse =
        answers.reduce((sum, val) => sum + val, 0) / answers.length;

      // Calculate average time
      const averageTime =
        times.reduce((sum, val) => sum + val, 0) / times.length;

      // Calculate distribution of responses
      const distribution = Array(5).fill(0);
      answers.forEach((answer) => {
        distribution[answer]++;
      });

      // Calculate response percentages
      const percentages = distribution.map(
        (count) => (count / answers.length) * 100
      );

      // Calculate skew (how much the responses lean toward one end)
      const weightedSum = answers.reduce((sum, val) => sum + (val - 2), 0);
      const skew = weightedSum / answers.length;

      // Calculate standard deviation (measure of consensus)
      const variance =
        answers.reduce(
          (sum, val) => sum + Math.pow(val - averageResponse, 2),
          0
        ) / answers.length;
      const stdDev = Math.sqrt(variance);

      // Calculate completion rate
      const completionRate =
        (answers.filter((a) => a !== undefined).length / answers.length) * 100;

      return {
        id: question.id,
        text:
          question.text.length > 40
            ? question.text.substring(0, 40) + "..."
            : question.text,
        fullText: question.text,
        category: question.category,
        averageResponse,
        averageTime,
        distribution,
        percentages,
        skew,
        stdDev,
        completionRate,
        weight: question.weight,
        responseCount: answers.length,
        options: question.options,
      };
    });

    setQuestionMetrics(metrics);

    // Calculate category-level metrics
    const categories = [...new Set(questionsData.map((q) => q.category))];
    const catMetrics = categories.map((category) => {
      const categoryQuestions = metrics.filter((q) => q.category === category);

      return {
        name: category,
        questionCount: categoryQuestions.length,
        averageTime:
          categoryQuestions.reduce((sum, q) => sum + q.averageTime, 0) /
          categoryQuestions.length,
        averageResponse:
          categoryQuestions.reduce((sum, q) => sum + q.averageResponse, 0) /
          categoryQuestions.length,
        averageStdDev:
          categoryQuestions.reduce((sum, q) => sum + q.stdDev, 0) /
          categoryQuestions.length,
        completionRate:
          categoryQuestions.reduce((sum, q) => sum + q.completionRate, 0) /
          categoryQuestions.length,
      };
    });

    setCategoryMetrics(catMetrics);

    // Calculate correlations between questions
    const correlations = [];
    for (let i = 0; i < questionsData.length; i++) {
      for (let j = i + 1; j < questionsData.length; j++) {
        const q1 = questionsData[i].id;
        const q2 = questionsData[j].id;

        // Calculate Pearson correlation coefficient
        const answers1 = mockResponses.map((r) => r.answers[q1]);
        const answers2 = mockResponses.map((r) => r.answers[q2]);

        const mean1 =
          answers1.reduce((sum, val) => sum + val, 0) / answers1.length;
        const mean2 =
          answers2.reduce((sum, val) => sum + val, 0) / answers2.length;

        let numerator = 0;
        let denom1 = 0;
        let denom2 = 0;

        for (let k = 0; k < answers1.length; k++) {
          const diff1 = answers1[k] - mean1;
          const diff2 = answers2[k] - mean2;

          numerator += diff1 * diff2;
          denom1 += diff1 * diff1;
          denom2 += diff2 * diff2;
        }

        const correlation = numerator / (Math.sqrt(denom1) * Math.sqrt(denom2));

        if (!isNaN(correlation) && correlation !== 0) {
          correlations.push({
            question1: q1,
            question2: q2,
            correlation: correlation,
            absCorrelation: Math.abs(correlation),
            q1Text: questionsData[i].text.substring(0, 20) + "...",
            q2Text: questionsData[j].text.substring(0, 20) + "...",
            q1Category: questionsData[i].category,
            q2Category: questionsData[j].category,
          });
        }
      }
    }

    // Sort by absolute correlation value, descending
    correlations.sort((a, b) => b.absCorrelation - a.absCorrelation);

    // Take top correlations
    setCorrelationData(correlations.slice(0, 20));

    // Calculate response distribution data for visualization
    const distData = [];
    questionsData.forEach((question) => {
      const options = question.options;
      const qAnswers = mockResponses.map((r) => r.answers[question.id]);

      const counts = Array(5).fill(0);
      qAnswers.forEach((answer) => counts[answer]++);

      options.forEach((option, index) => {
        distData.push({
          question: question.id,
          questionText:
            question.text.length > 30
              ? question.text.substring(0, 30) + "..."
              : question.text,
          option: option,
          count: counts[index],
          percentage: (counts[index] / qAnswers.length) * 100,
          category: question.category,
        });
      });
    });

    setResponseDistribution(distData);
    setIsLoading(false);
  }, []);

  // Filter metrics based on selected category
  const filteredMetrics =
    selectedCategory === "All"
      ? questionMetrics
      : questionMetrics.filter((q) => q.category === selectedCategory);

  // Filter distribution data based on selected category
  const filteredDistribution =
    selectedCategory === "All"
      ? responseDistribution
      : responseDistribution.filter((d) => d.category === selectedCategory);

  if (isLoading) {
    return <div className="p-4">Loading question analytics...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Question Analytics Dashboard</h2>

      {/* Category selector */}
      <div className="mb-6">
        <label htmlFor="category-select" className="font-medium mr-2">
          Filter by Category:
        </label>
        <select
          id="category-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border rounded p-2"
        >
          <option value="All">All Categories</option>
          {categoryMetrics.map((cat) => (
            <option key={cat.name} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Overview section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow-md">
          <h3 className="font-semibold mb-2">Total Questions</h3>
          <p className="text-3xl font-bold">
            {selectedCategory === "All"
              ? questionsData.length
              : questionsData.filter((q) => q.category === selectedCategory)
                  .length}
          </p>
        </div>
        <div className="bg-white p-4 rounded shadow-md">
          <h3 className="font-semibold mb-2">Total Responses</h3>
          <p className="text-3xl font-bold">{responseData.length}</p>
        </div>
        <div className="bg-white p-4 rounded shadow-md">
          <h3 className="font-semibold mb-2">Avg. Completion Rate</h3>
          <p className="text-3xl font-bold">
            {filteredMetrics.length > 0
              ? (
                  filteredMetrics.reduce(
                    (sum, q) => sum + q.completionRate,
                    0
                  ) / filteredMetrics.length
                ).toFixed(1) + "%"
              : "N/A"}
          </p>
        </div>
        <div className="bg-white p-4 rounded shadow-md">
          <h3 className="font-semibold mb-2">Avg. Response Time</h3>
          <p className="text-3xl font-bold">
            {filteredMetrics.length > 0
              ? (
                  filteredMetrics.reduce((sum, q) => sum + q.averageTime, 0) /
                  filteredMetrics.length
                ).toFixed(1) + "s"
              : "N/A"}
          </p>
        </div>
      </div>

      {/* Categories Overview */}
      {selectedCategory === "All" && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-2">Categories Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Questions Count by Category */}
            <div className="bg-white p-4 rounded shadow-md">
              <h4 className="font-medium mb-2">Questions per Category</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryMetrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={70}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="questionCount" fill="#4F46E5" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Average Response Time by Category */}
            <div className="bg-white p-4 rounded shadow-md">
              <h4 className="font-medium mb-2">
                Avg. Response Time by Category
              </h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryMetrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={70}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="averageTime" fill="#FF6B6B" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Response Distribution */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Response Distribution</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={filteredDistribution}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 100,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="questionText"
              angle={-45}
              textAnchor="end"
              height={100}
              interval={0}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" name="Response Count" fill="#4F46E5" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Question Response Time Analysis */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Question Response Time</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={filteredMetrics}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 100,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="text"
              angle={-45}
              textAnchor="end"
              height={100}
              interval={0}
            />
            <YAxis
              label={{
                value: "Response Time (seconds)",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip formatter={(value) => `${value.toFixed(1)} seconds`} />
            <Bar dataKey="averageTime" fill="#FF9F43">
              {filteredMetrics.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Question Difficulty (Standard Deviation) */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">
          Question Consensus Level (Lower StdDev = Higher Consensus)
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={filteredMetrics}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 100,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="text"
              angle={-45}
              textAnchor="end"
              height={100}
              interval={0}
            />
            <YAxis
              label={{
                value: "Standard Deviation",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip formatter={(value) => value.toFixed(2)} />
            <Bar dataKey="stdDev" fill="#6BCB77">
              {filteredMetrics.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Response Distribution Stacked Bar Chart */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">
          Answer Distribution per Question
        </h3>
        <ResponsiveContainer width="100%" height={450}>
          <BarChart
            data={filteredMetrics}
            layout="vertical"
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" domain={[0, 100]} />
            <YAxis dataKey="text" type="category" width={150} />
            <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
            <Legend />
            {[0, 1, 2, 3, 4].map((index) => (
              <Bar
                key={index}
                dataKey={`percentages[${index}]`}
                stackId="a"
                fill={COLORS[index % COLORS.length]}
                name={
                  filteredMetrics.length > 0 && filteredMetrics[0].options
                    ? filteredMetrics[0].options[index]
                    : `Option ${index + 1}`
                }
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Response Time vs. Standard Deviation */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">
          Response Time vs. Consensus Level
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart
            margin={{
              top: 20,
              right: 20,
              bottom: 10,
              left: 10,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              dataKey="averageTime"
              name="Response Time"
              label={{
                value: "Response Time (seconds)",
                position: "insideBottomRight",
                offset: -5,
              }}
              domain={["dataMin - 1", "dataMax + 1"]}
            />
            <YAxis
              type="number"
              dataKey="stdDev"
              name="Standard Deviation"
              label={{
                value: "Standard Deviation",
                angle: -90,
                position: "insideLeft",
              }}
              domain={["dataMin - 0.1", "dataMax + 0.1"]}
            />
            <ZAxis type="number" range={[100, 200]} />
            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white p-2 border border-gray-300 shadow-md rounded">
                      <p className="text-sm mb-1">
                        <strong>{data.fullText}</strong>
                      </p>
                      <p className="text-xs">Category: {data.category}</p>
                      <p className="text-xs">
                        Avg. Response Time: {data.averageTime.toFixed(1)}s
                      </p>
                      <p className="text-xs">
                        Standard Deviation: {data.stdDev.toFixed(2)}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            {categoryMetrics.map((category, index) => {
              const categoryQuestions = filteredMetrics.filter(
                (q) => q.category === category.name
              );
              return (
                <Scatter
                  key={category.name}
                  name={category.name}
                  data={categoryQuestions}
                  fill={COLORS[index % COLORS.length]}
                />
              );
            })}
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Question Correlations */}
      {selectedCategory === "All" && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-2">
            Top Question Correlations
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Question 1</th>
                  <th className="py-2 px-4 border-b">Question 2</th>
                  <th className="py-2 px-4 border-b">Correlation</th>
                  <th className="py-2 px-4 border-b">Relationship</th>
                </tr>
              </thead>
              <tbody>
                {correlationData.map((corr, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    <td className="py-2 px-4 border-b">
                      <div className="font-medium">{corr.q1Text}</div>
                      <div className="text-xs text-gray-500">
                        {corr.q1Category}
                      </div>
                    </td>
                    <td className="py-2 px-4 border-b">
                      <div className="font-medium">{corr.q2Text}</div>
                      <div className="text-xs text-gray-500">
                        {corr.q2Category}
                      </div>
                    </td>
                    <td className="py-2 px-4 border-b font-medium">
                      <span
                        className={
                          corr.correlation > 0
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {corr.correlation.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-2 px-4 border-b">
                      {corr.correlation > 0.7
                        ? "Strong Positive"
                        : corr.correlation > 0.3
                        ? "Moderate Positive"
                        : corr.correlation > 0
                        ? "Weak Positive"
                        : corr.correlation > -0.3
                        ? "Weak Negative"
                        : corr.correlation > -0.7
                        ? "Moderate Negative"
                        : "Strong Negative"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Questions Table with Metrics */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Question Metrics</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Question</th>
                <th className="py-2 px-4 border-b">Category</th>
                <th className="py-2 px-4 border-b">Avg. Time (s)</th>
                <th className="py-2 px-4 border-b">Avg. Response</th>
                <th className="py-2 px-4 border-b">Std. Dev.</th>
                <th className="py-2 px-4 border-b">Skew</th>
                <th className="py-2 px-4 border-b">Completion %</th>
                <th className="py-2 px-4 border-b">Weight</th>
              </tr>
            </thead>
            <tbody>
              {filteredMetrics.map((question, index) => (
                <tr
                  key={question.id}
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td
                    className="py-2 px-4 border-b font-medium"
                    title={question.fullText}
                  >
                    {question.text}
                  </td>
                  <td className="py-2 px-4 border-b">{question.category}</td>
                  <td className="py-2 px-4 border-b">
                    {question.averageTime.toFixed(1)}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {question.averageResponse.toFixed(2)}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {question.stdDev.toFixed(2)}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <span
                      className={
                        question.skew > 0 ? "text-green-600" : "text-red-600"
                      }
                    >
                      {question.skew.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b">
                    {question.completionRate.toFixed(1)}%
                  </td>
                  <td className="py-2 px-4 border-b">{question.weight}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default QuestionsAnalytics;
