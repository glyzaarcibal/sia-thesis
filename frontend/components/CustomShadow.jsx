import React from "react";
import { View, Platform, StyleSheet } from "react-native";

const TopShadowBox = ({ children, style }) => {
  return <View style={[styles.container, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    // iOS shadow
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: -3, // Negative value for top shadow
        },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      // Android elevation doesn't support direction,
      // so we need to use a different approach
      android: {
        elevation: 5,
        position: "relative",
      },
    }),
  },
  // For Android, we create an additional shadow element
  androidTopShadow: {
    ...Platform.select({
      android: {
        position: "absolute",
        top: -20, // Adjust based on desired shadow position
        left: 0,
        right: 0,
        height: 5,
        backgroundColor: "#000",
        elevation: 5,
      },
    }),
  },
});

// Enhanced version with customizable shadow properties
const CustomShadowBox = ({
  children,
  style,
  shadowColor = "#000",
  shadowOffset = { width: 0, height: -3 },
  shadowOpacity = 0.2,
  shadowRadius = 3,
  elevation = 5,
}) => {
  const customStyles = {
    container: {
      backgroundColor: "white",
      ...Platform.select({
        ios: {
          shadowColor,
          shadowOffset,
          shadowOpacity,
          shadowRadius,
        },
        android: {
          elevation,
          position: "relative",
        },
      }),
    },
  };

  return (
    <View style={[customStyles.container, style]}>
      {Platform.OS === "android" && (
        <View
          style={[
            styles.androidTopShadow,
            {
              backgroundColor: shadowColor,
              height: Math.abs(shadowOffset.height),
              top: shadowOffset.height,
            },
          ]}
        />
      )}
      {children}
    </View>
  );
};

export { TopShadowBox, CustomShadowBox };
