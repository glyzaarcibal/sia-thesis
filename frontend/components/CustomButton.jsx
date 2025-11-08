import { View, TouchableWithoutFeedback } from "react-native";
import React from "react";
import { default as Text } from "./CustomText";

const CustomButton = ({ text, onPress, style }) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View
        style={
          ([style],
          {
            // borderWidth: 1,
            elevation: 5,
            paddingVertical: 15,
            borderRadius: 24,
            justifyContent: "center",
            backgroundColor: "white",
          })
        }
      >
        <Text style={{ textAlign: "center" }}>{text}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default CustomButton;
