import { View } from "react-native";
import React from "react";
import { rem } from "./stylings/responsiveSize";
import Animated, {
  FadeInLeft,
  FadeOut,
  LinearTransition,
  Easing,
} from "react-native-reanimated";
import { default as Text } from "./CustomText";

const MessageBox = ({ text = "This is a sample message.", user = true }) => {
  return (
    <Animated.View
      entering={FadeInLeft}
      layout={LinearTransition.easing(Easing.ease)}
      exiting={FadeOut}
      className="my-2"
      style={{
        backgroundColor: user ? "#dedede" : "#FF686B",
        borderRadius: 32,
        padding: 16,
        alignSelf: user ? "flex-end" : "flex-start",
      }}
    >
      <Text
        style={{
          fontSize: rem(10),
          maxWidth: rem(250),
          color: user ? "black" : "white",
        }}
      >
        {text}
      </Text>
    </Animated.View>
  );
};

export default MessageBox;
