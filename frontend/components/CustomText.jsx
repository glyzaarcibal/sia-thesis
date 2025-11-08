import React from "react";
import { Text, StyleSheet } from "react-native";

const CustomText = ({ style, children, ...rest }) => {
  return (
    <Text style={[styles.text, style]} {...rest}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: "Primary",
    fontSize: 16,
    color: "black",
  },
});

export default CustomText;
