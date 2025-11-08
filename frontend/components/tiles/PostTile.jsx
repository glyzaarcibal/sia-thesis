import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";

import { rem } from "../stylings/responsiveSize";

import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";

const images = {
  user1: require("../../assets/images/user/user1.jpg"),
  user2: require("../../assets/images/user/user2.jpg"),
  user3: require("../../assets/images/user/user3.jpg"),
};

const PostTile = ({ title, userName, content, imageKey }) => {
  return (
    <View
      className="elevation-md w-full p-4"
      style={{
        borderRadius: 32,
        minHeight: rem(180),
        maxHeight: rem(300),
        backgroundColor: "white",
        flex: 1,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          height: rem(50),
        }}
      >
        <View style={{ minWidth: rem(50) }}>
          <Image
            className="rounded-full"
            source={images[imageKey]}
            style={{ height: "100%", width: "100%", borderRadius: 100 }}
          />
        </View>
        <View
          className="px-5 justify-center"
          style={{ flex: 1, paddingHorizontal: rem(10) }}
        >
          <Text className="font-bold">{title}</Text>
          <Text>{userName} - 1hr ago</Text>
        </View>
        <View
          className="justify-center items-center"
          style={{ minWidth: rem(50) }}
        >
          <Feather name="bookmark" size={24} color="black" />
        </View>
      </View>

      <View
        className="py-2"
        style={{
          flex: 1, // Allow the text view to grow
          minHeight: rem(30),
          maxHeight: rem(200),
          marginVertical: rem(10),
        }}
      >
        <Text style={{ flex: 1 }}>{content}</Text>
      </View>

      <View className="flex-row" style={{ minHeight: rem(30) }}>
        <TouchableOpacity
          style={{
            flex: 1,
            borderRadius: 20,
            marginHorizontal: 5,
          }}
        >
          <View
            className="flex-row justify-center items-center"
            style={{ flex: 1 }}
          >
            <AntDesign
              style={{ marginHorizontal: rem(5) }}
              name="like2"
              size={24}
              color="black"
            />
            <Text className="text-center">Like</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flex: 1,
            borderRadius: 20,
            marginHorizontal: 5,
          }}
        >
          <View
            className="flex-row justify-center items-center"
            style={{ flex: 1 }}
          >
            <Feather
              style={{ marginHorizontal: rem(5) }}
              name="message-circle"
              size={24}
              color="black"
            />
            <Text className="text-center">Replies</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flex: 1,
            borderRadius: 20,
            marginHorizontal: 5,
          }}
        >
          <View
            className="flex-row justify-center items-center"
            style={{ flex: 1 }}
          >
            <AntDesign
              style={{ marginHorizontal: rem(5) }}
              name="eyeo"
              size={24}
              color="black"
            />
            <Text className="text-center">Views</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PostTile;
