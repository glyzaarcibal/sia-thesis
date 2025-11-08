import { View, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import React, { useEffect, useState } from "react";
import { rem } from "./stylings/responsiveSize";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import { useStoreRootState } from "expo-router/build/global-state/router-store";
import { default as Text } from "./CustomText";
import BoldText from "./BoldText";

const ChatLogBar = ({
  chatLogNum,
  date,
  pressOutside,
  handleDelete,
  handlePress,
}) => {
  const [showTools, setShowTools] = useState(false);

  const handleOutsideClick = () => {
    if (showTools) {
      setShowTools(false);
    }
  };

  useEffect(() => {
    handleOutsideClick();
  }, [pressOutside]);

  return (
    <TouchableWithoutFeedback
      className="flex-1"
      style={{ position: "absolute", flex: 1 }}
      onPress={handlePress}
    >
      <View
        className="elevation-md w-full p-4 flex-row"
        style={{
          borderRadius: 32,
          height: rem(100),
          backgroundColor: "white",
        }}
      >
        <View className="flex-1 w-3/4">
          <View className="h-1/2">
            <View className="flex-row">
              <BoldText style={{ fontSize: rem(12) }}>Chat Log #:</BoldText>
              <Text
                className="font-bold"
                style={{ fontSize: rem(12), color: "#0cdfc6" }}
              >
                {" "}
                {chatLogNum}
              </Text>
            </View>
            <Text>{date}</Text>
          </View>
          <View className="items-end">
            <Text>
              Preview: This is where the first message will be displayed.
            </Text>
          </View>
        </View>
        <View className="w-1/4">
          <TouchableWithoutFeedback
            onPress={(e) => {
              e.stopPropagation();
              if (showTools == true) {
                setShowTools(false);
              } else {
                setShowTools(true);
              }
            }}
          >
            <View
              className="justify-end text-right items-end"
              // style={{ borderWidth: 1 }}
            >
              <Entypo
                className="text-right"
                style={{ textAlign: "right" }}
                name="dots-three-vertical"
                size={24}
                color="black"
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
        {showTools && (
          <TouchableWithoutFeedback
            onPress={(e) => {
              e.stopPropagation();
              handleDelete(chatLogNum);
            }}
          >
            <View
              className="elevation-lg flex-row justify-center items-center"
              style={{
                position: "absolute",
                right: 10,
                top: 50,
                backgroundColor: "white",
                padding: rem(10),
                paddingHorizontal: rem(20),
              }}
            >
              <Feather name="trash" size={24} color="black" />
              <Text>{"  "}Delete</Text>
            </View>
          </TouchableWithoutFeedback>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ChatLogBar;
