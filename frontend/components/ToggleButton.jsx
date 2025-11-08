import { View, Text, TouchableWithoutFeedback } from "react-native";
import React, { useState } from "react";
import { rem } from "./stylings/responsiveSize";
import Animated, { LinearTransition } from "react-native-reanimated";

const ToggleButton = ({ state, toggler }) => {
  // const [isOn, setIsOn] = useState(false);
  return (
    <TouchableWithoutFeedback onPress={toggler}>
      <View
        style={{
          position: "relative",
          backgroundColor: state ? "#0cdfc6" : "#dedede",
          height: rem(25),
          width: rem(48),
          borderRadius: 24,
          padding: rem(2),
          alignItems: state ? "flex-end" : "flex-start",
        }}
      >
        <Animated.View
          style={{
            backgroundColor: "#fff",
            height: "100%",
            width: "50%",
            borderRadius: 100,
            elevation: 5,
          }}
          layout={LinearTransition}
        ></Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ToggleButton;
