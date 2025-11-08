import { TouchableWithoutFeedback } from "react-native";
import React from "react";
import Feather from "@expo/vector-icons/Feather";
import { default as Text } from "../CustomText";

import { rem } from "../stylings/responsiveSize";

const ElevatedButton = ({ text, search, elevation = 5 }) => {
  return (
    <TouchableWithoutFeedback>
      <Text
        style={{
          elevation: elevation,
          backgroundColor: "white",
          borderRadius: 32,
          padding: rem(10),
          paddingVertical: rem(15),
          textAlign: "center",
          fontSize: rem(13),
          fontWeight: 700,
        }}
      >
        {search ? (
          <>
            <Feather
              style={{ marginHorizontal: rem(5) }}
              name="search"
              size={13}
              color="black"
            />
            &nbsp; &nbsp;
          </>
        ) : null}
        {text}
      </Text>
    </TouchableWithoutFeedback>
  );
};

export default ElevatedButton;
