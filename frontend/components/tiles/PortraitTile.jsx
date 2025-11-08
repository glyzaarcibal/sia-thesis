import { View, Image } from "react-native";
import React from "react";
import { default as Text } from "../CustomText";

import { rem } from "../stylings/responsiveSize";

const images = {
  mountain1: require("../../assets/images/bg/mountain1.png"),
  mountain2: require("../../assets/images/bg/mountain2.png"),
  sunset1: require("../../assets/images/bg/green1.png"),
  sunset2: require("../../assets/images/bg/green2.png"),
  sunset3: require("../../assets/images/bg/green3.png"),
  sunset4: require("../../assets/images/bg/green4.png"),
  sunset5: require("../../assets/images/bg/sunset5.png"),
  sunset6: require("../../assets/images/bg/sunset6.png"),
  sunset7: require("../../assets/images/bg/sunset7.png"),
  sunset8: require("../../assets/images/bg/sunset8.png"),
  sunset9: require("../../assets/images/bg/sunset9.png"),
  sunset10: require("../../assets/images/bg/sunset10.png"),
};

const PortraitTile = ({ imageKey, title = "Title Value", chips = [] }) => {
  return (
    <View
      className="relative h-full elevation-md"
      style={{
        borderRadius: 32,
        width: rem(170),
        backgroundColor: "white",
      }}
    >
      <Image
        className="absolute h-full w-full rounded-custom"
        source={images[imageKey]}
      />
      <View
        className="absolute z-10 bottom-10 border border-green-500"
        style={{ position: "absolute", bottom: 20, left: 10 }}
      >
        <Text
          style={{
            fontSize: rem(12),
            color: "white",
            fontWeight: 500,
            paddingHorizontal: 10,
          }}
        >
          {title}
        </Text>
        <View
          className="flex-1 flex-row gap-2"
          style={{ flexDirection: "row", marginTop: rem(5) }}
        >
          {chips.map((chip, i) => (
            <Text
              className="p-2 rounded-lg"
              key={i}
              style={{ backgroundColor: "rgba(0,0,0,.5)", color: "white" }}
            >
              {chip.text}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
};

export default PortraitTile;
