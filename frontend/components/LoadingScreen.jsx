import React, { useEffect } from "react";
import { View } from "react-native";
import { Image } from "expo-image";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from "react-native-reanimated";
import loading from "../assets/loading.gif";

const LoadingScreen = ({ isVisible }) => {
  // Animation values
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);

  // Effect when visibility changes
  useEffect(() => {
    if (isVisible) {
      opacity.value = withTiming(1, { duration: 300 });
      scale.value = withSpring(1, { damping: 8, stiffness: 100 });
    } else {
      opacity.value = withTiming(0, { duration: 300 });
      scale.value = withTiming(0.5, { duration: 300 });
    }
  }, [isVisible]);

  // Animated styles
  const animatedContainerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const animatedImageStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
          width: "100%",
          height: "100%",
          zIndex: 1000,
        },
        animatedContainerStyle,
      ]}
    >
      <Animated.View style={animatedImageStyle}>
        <Image source={loading} style={{ width: 70, height: 70 }} />
      </Animated.View>
    </Animated.View>
  );
};

export default LoadingScreen;
