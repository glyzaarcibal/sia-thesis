import { View } from "react-native";
import React from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { rem } from "./stylings/responsiveSize";
import { default as Text } from "./CustomText";

const IconBar = ({ title, sub, icon }) => {
  return (
    <View
      className="elevation-md w-full flex-row"
      style={{
        borderRadius: 32,
        height: rem(100),
        backgroundColor: "white",
      }}
    >
      <View className="justify-center p-2">
        <View
          className="p-4 my-2"
          style={{
            backgroundColor: "#FF686B",
            borderRadius: 100,
            height: 60,
          }}
        >
          <MaterialIcons name={icon} size={36} color="white" />
        </View>
      </View>
      <View className="flex-1 justify-center ml-2">
        <Text className="font-bold" style={{ fontSize: rem(12) }}>
          {title}
        </Text>
        <Text>{sub}</Text>
      </View>
    </View>
  );
};

export default IconBar;
