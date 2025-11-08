import React from "react";
import { StyleSheet } from "react-native";
// import { Text } from 'react-native-paper';
import { default as Text } from "./CustomText";
import theme from "./../core/theme";

export default function Header(props) {
  const colorStyle = props.secondary
    ? styles.secondaryHeader
    : styles.primaryHeader;

  return <Text style={[styles.header, colorStyle]} {...props} />;
}

const styles = StyleSheet.create({
  header: {
    fontSize: 22,
    textAlign: "center",
    fontWeight: "bold",
    paddingVertical: 12,
  },
  primaryHeader: {
    color: theme?.colors?.primary || "#560CCE", // Fallback to black
  },
  secondaryHeader: {
    color: theme?.colors?.secondary || "#414757", // Fallback to gray
  },
});
