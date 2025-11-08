import { useState, useRef } from "react";
import { View, Image, TouchableOpacity, PanResponder } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { default as Text } from "../../../components/CustomText";
import BoldText from "../../../components/BoldText";

const images = [
  require("../../../assets/images/resources/PATHFINDER/1.png"),
  require("../../../assets/images/resources/PATHFINDER/2.png"),
  require("../../../assets/images/resources/PATHFINDER/3.png"),
  require("../../../assets/images/resources/PATHFINDER/4.png"),
];

export default function Slider3() {
  const [index, setIndex] = useState(0);
  const navigation = useNavigation();

  const nextImage = () => {
    if (index < images.length - 1) {
      setIndex((prev) => prev + 1);
    } else {
      navigation.goBack(); // Go back if at the last image
    }
  };

  const prevImage = () => setIndex((prev) => (prev > 0 ? prev - 1 : 0));

  // Swipe Gestures using PanResponder
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 50) {
          prevImage(); // Swipe Right
        } else if (gestureState.dx < -50) {
          nextImage(); // Swipe Left
        }
      },
    })
  ).current;

  return (
    <View
      {...panResponder.panHandlers}
      style={{
        flex: 1,
        backgroundColor: "#C8E6C9",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Image Display */}
      <Image
        source={images[index]}
        style={{ width: "100%", height: "100%", resizeMode: "cover" }}
      />

      {/* Navigation Buttons */}
      {index > 0 && (
        <TouchableOpacity
          onPress={prevImage}
          style={{ position: "absolute", left: 20, padding: 20 }}
        >
          <Text style={{ color: "white", fontSize: 30 }}>‹</Text>
        </TouchableOpacity>
      )}

      {index < images.length - 0 ? (
        <TouchableOpacity
          onPress={nextImage}
          style={{ position: "absolute", right: 20, padding: 20 }}
        >
          <Text style={{ color: "white", fontSize: 30 }}>›</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            position: "absolute",
            bottom: 50,
            padding: 15,
            backgroundColor: "white",
            borderRadius: 10,
          }}
        >
          <Text style={{ fontSize: 18, color: "black" }}>Back to Page</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
