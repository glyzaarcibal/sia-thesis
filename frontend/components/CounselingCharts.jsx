import React from "react";
import { View, Dimensions, StyleSheet } from "react-native";
import { BarChart, PieChart } from "react-native-chart-kit";
import { default as Text } from "./CustomText";
import BoldText from "./BoldText";

const CounselingCharts = ({ analysisData }) => {
  // Format labels for readability
  const formatLabel = (label) => {
    return label
      .replace("_counseling", "")
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Format data for pie chart
  const pieData = Object.entries(analysisData)
    .filter(([key]) => !["id", "created_at", "user"].includes(key))
    .map(([key, value], index) => {
      // Define colors for the pie segments
      const colors = [
        "#3498db", // Blue
        "#2ecc71", // Green
        "#e74c3c", // Red
        "#f39c12", // Orange
        "#9b59b6", // Purple
        "#1abc9c", // Teal
        "#34495e", // Dark Blue
        "#d35400", // Dark Orange
      ];

      return {
        name: formatLabel(key),
        population: value * 100, // Convert to percentage
        color: colors[index % colors.length],
        legendFontColor: "#7F7F7F",
        legendFontSize: 12,
      };
    });

  // Format data for bar chart
  const barData = {
    labels: Object.keys(analysisData)
      .filter((key) => !["id", "created_at", "user"].includes(key))
      .map((key) => formatLabel(key).substring(0, 6) + "..."), // Truncate for space
    datasets: [
      {
        data: Object.values(analysisData)
          .filter(
            (_, index) =>
              !["id", "created_at", "user"].includes(
                Object.keys(analysisData)[index]
              )
          )
          .map((value) => value * 100), // Convert to percentage
      },
    ],
  };

  // Width for both charts
  const screenWidth = Dimensions.get("window").width - 32; // Account for padding

  // Common chart configuration
  const chartConfig = {
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(108, 186, 176, ${opacity})`, // Match app theme color
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForLabels: {
      fontSize: 10,
    },
  };

  return (
    <View style={styles.container}>
      {/* Pie Chart Section */}
      <View style={styles.chartContainer}>
        <BoldText style={styles.chartTitle}>Counseling Distribution</BoldText>
        <PieChart
          data={pieData}
          width={screenWidth - 50}
          height={200}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="10"
          absolute
        />
      </View>

      {/* Bar Chart Section */}
      <View style={styles.chartContainer}>
        <BoldText style={styles.chartTitle}>Counseling Percentages</BoldText>
        <BarChart
          data={barData}
          width={screenWidth - 50}
          height={220}
          chartConfig={chartConfig}
          verticalLabelRotation={45}
          fromZero={true}
          showValuesOnTopOfBars={true}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    paddingHorizontal: 16,
  },
  chartContainer: {
    marginBottom: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  chartTitle: {
    textAlign: "center",
    marginBottom: 10,
    fontSize: 16,
    color: "#6cbab0", // Match app theme color
  },
});

export default CounselingCharts;
