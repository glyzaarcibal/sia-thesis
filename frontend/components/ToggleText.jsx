import { View, TouchableWithoutFeedback } from "react-native";
import React, { useState } from "react";
import { rem } from "./stylings/responsiveSize";
import { default as Text } from "./CustomText";

const ToggleText = ({ state, toggler }) => {
  return (
    <View style={{ flexDirection: "row", elevation: 10, borderRadius: 12 }}>
      <TouchableWithoutFeedback onPress={() => toggler("English")}>
        <Text
          style={{
            padding: rem(10),
            paddingLeft: rem(12),
            borderRadius: 12,
            borderBottomRightRadius: 0,
            borderTopRightRadius: 0,
            backgroundColor: state == "English" ? "#0cdfc6" : "#fff",
          }}
        >
          English
        </Text>
      </TouchableWithoutFeedback>
      <View style={{ borderRightWidth: 1, borderColor: "#dedede" }}></View>
      <TouchableWithoutFeedback onPress={() => toggler("Tagalog")}>
        <Text
          style={{
            padding: rem(10),
            paddingRight: rem(12),
            borderRadius: 12,
            borderBottomLeftRadius: 0,
            borderTopLeftRadius: 0,
            backgroundColor: state == "Tagalog" ? "#0cdfc6" : "#fff",
          }}
        >
          Tagalog
        </Text>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default ToggleText;
