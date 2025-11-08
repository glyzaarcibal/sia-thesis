import { View } from "react-native";
import React, { useState, useEffect } from "react";
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
} from "react-native-reanimated";

import Happy from "../assets/svg/happy.svg";
import Sad from "../assets/svg/sad.svg";
import Cry from "../assets/svg/cry.svg";
import Med from "../assets/svg/confused.svg";
import Happy2 from "../assets/svg/happy-2.svg";
import { rem } from "./stylings/responsiveSize";

const FaceIndicator = ({ valueRef }) => {
  const [answerValue, setAnswerValue] = useState(valueRef.current);
  const [previousFace, setPreviousFace] = useState(null);
  const scale = useSharedValue(1);

  useEffect(() => {
    const interval = setInterval(() => {
      if (valueRef.current !== answerValue) {
        const newFace = getFaceComponent(valueRef.current);

        // Only trigger animation if face actually changes
        if (newFace !== previousFace) {
          setAnswerValue(valueRef.current);
          setPreviousFace(newFace);

          // Apply animation
          scale.value = 1.3;
          scale.value = withSpring(1, { damping: 5, stiffness: 150 });
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [valueRef, answerValue, previousFace]);

  const getFaceComponent = (value) => {
    if (value < 2) return "Happy2";
    if (value >= 2 && value < 4) return "Happy";
    if (value >= 4 && value < 6) return "Med";
    if (value >= 6 && value < 9) return "Sad";
    return "Cry";
  };

  const renderFace = () => {
    switch (getFaceComponent(answerValue)) {
      case "Cry":
        return <Cry height={70} width={70} strokeWidth={5} />;
      case "Sad":
        return <Sad height={70} width={70} />;
      case "Med":
        return <Med height={70} width={70} />;
      case "Happy":
        return <Happy height={70} width={70} />;
      case "Happy2":
        return <Happy2 height={70} width={70} />;
      default:
        return null;
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View
      style={{
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: rem(15),
      }}
    >
      <Animated.View
        style={[
          {
            padding: rem(20),
            justifyContent: "center",
            alignItems: "center",
          },
          animatedStyle,
        ]}
      >
        {renderFace()}
      </Animated.View>
    </View>
  );
};

export default FaceIndicator;
