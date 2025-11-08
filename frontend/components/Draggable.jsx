import React, { useRef, useState, useEffect } from "react";
import { View, Animated, PanResponder } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { default as Text } from "./CustomText";

const Draggable = ({ onValueChange }) => {
  const [containerWidth, setContainerWidth] = useState(0);
  const pan = useRef(new Animated.ValueXY()).current;
  const valueRef = useRef(1); // Store value without triggering re-renders
  const handleWidth = 30;

  // Convert position to 1-10 range
  const getScaledValue = (xPosition) => {
    const maxX = (containerWidth - handleWidth) / 2;
    const value = Math.round(((xPosition + maxX) / (maxX * 2)) * 9 + 1);
    return Math.max(1, Math.min(10, value));
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      pan.setOffset({ x: pan.x._value, y: 0 });
      pan.setValue({ x: 0, y: 0 });
    },
    onPanResponderMove: (_, gesture) => {
      const maxX = (containerWidth - handleWidth) / 2;
      const newX = Math.max(-maxX, Math.min(maxX, pan.x._offset + gesture.dx));
      pan.x.setValue(newX - pan.x._offset);

      // Update valueRef without triggering re-renders
      const newValue = getScaledValue(newX);
      if (valueRef.current !== newValue) {
        valueRef.current = newValue;
        onValueChange?.(newValue); // Call callback if provided
      }
    },
    onPanResponderRelease: () => {
      pan.flattenOffset();
    },
  });

  return (
    <View
      style={{
        height: 30,
        width: "100%",
        // backgroundColor: "#E0E0E0",
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
      }}
      onLayout={(event) => setContainerWidth(event.nativeEvent.layout.width)}
    >
      <LinearGradient
        colors={["#0cdfc6", "red"]} // Gradient from Red to Blue
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          height: 10,
          width: "100%",
          borderRadius: 5,
          alignItems: "center",
          justifyContent: "center",
        }}
      />
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          {
            transform: [{ translateX: pan.x }],
            height: handleWidth,
            width: handleWidth,
            backgroundColor: "white",
            borderRadius: handleWidth / 2,
            elevation: 5,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            position: "absolute",
          },
        ]}
      />
    </View>
  );
};

export default Draggable;
