import {
  View,
  TextInput,
  Button,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Appbar, DefaultTheme, PaperProvider } from "react-native-paper";
import { useRouter } from "expo-router";
import { rem } from "../../../components/stylings/responsiveSize";
import { default as Text } from "../../../components/CustomText";

//Customs
import { TopShadowBox } from "../../../components/CustomShadow";
import MessageBox from "../../../components/MessageBox";
import theme from "../../../components/CustomTheme";

//Icons
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRoute } from "@react-navigation/native";
import { useAuth } from "../../../context/AuthContext";
import BoldText from "../../../components/BoldText";

const chats = [
  {
    user: true,
    text: "This is a sample message.",
  },
  {
    user: false,
    text: "This is a sample message.",
  },
];

const Chat = ({ navigation }) => {
  const { axiosInstanceWithBearer, user } = useAuth();

  const stackRouter = useRoute();
  const { isNew, chatId } = stackRouter.params;
  const [id, setId] = useState(chatId ? chatId : null);

  const router = useRouter();
  const [message, setMessage] = useState("");
  const chatRef = useRef(null);
  const [chats, setChats] = useState([]);

  const scrollToBottom = () => {
    chatRef.current?.scrollToEnd({ animated: true });
  };

  const handleMessage = async () => {
    const formData = {
      chat: id,
      from_user: true,
      message_content: message,
    };
    console.log(id);
    if (id == undefined) {
      console.log("new");
      try {
        const res = await axiosInstanceWithBearer.post(`/Chat/`, {
          user: user.id,
        });

        setId(res.data.id);
        setChats((prev) => [...prev, { user: true, text: message }]);

        const chat = await axiosInstanceWithBearer.post(`/Message/`, {
          chat: res.data.id,
          from_user: true,
          message_content: message,
        });

        setChats((prev) => [
          ...prev,
          { user: false, text: chat.data.message_content },
        ]);
      } catch (e) {
        console.log(e);
      }
    } else {
      console.log("not new");
      try {
        setChats((prev) => [...prev, { user: true, text: message }]);

        const res = await axiosInstanceWithBearer.post(`/Message/`, formData);

        setChats((prev) => [
          ...prev,
          { user: false, text: res.data.message_content },
        ]);
        console.log(res.data);
      } catch (e) {
        console.log(e);
      }
    }
  };
  const handleBack = async () => {
    try {
      const payload = chats
        .map((chat) => `[${chat.user ? "user" : "bot"}]: ${chat.text}`)
        .join(" | "); // Ensure no extra quotes

      console.log("Sending payload:", payload);

      const response = await axiosInstanceWithBearer.post(
        "https://hook.us2.make.com/ugzehb1tisa8cethbq15mga1gn3k2yui",
        payload, // Send as raw string
        {
          headers: {
            "Content-Type": "text/plain", // Ensure it's treated as plain text
          },
        }
      );

      console.log("Response from Make:", response.data);
      navigation.goBack();
    } catch (error) {
      console.error(
        "Error sending data to Make:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const sendMessage = async () => {};

  useEffect(() => {
    if (chatId) {
      retrieveMessages();
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chats]);

  const retrieveMessages = async () => {
    try {
      console.log("searching: ", id);
      const res = await axiosInstanceWithBearer.get(
        `/Message/?chat_id=${chatId}`
      );
      console.log(res.data);
      res.data.forEach((item) => {
        if (item.from_user) {
          setChats((prev) => [
            ...prev,
            { user: true, text: item.message_content },
          ]);
        } else {
          setChats((prev) => [
            ...prev,
            { user: false, text: item.message_content },
          ]);
        }
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <PaperProvider theme={theme}>
      <Appbar.Header theme={DefaultTheme}>
        <Appbar.BackAction
          onPress={() => {
            handleBack();
          }}
        />
        <Appbar.Content title="Chat" />
        {/* <Appbar.Action icon="gear" onPress={() => {}} /> */}
        {/* <Appbar.Action icon="magnify" onPress={() => {}} /> */}
      </Appbar.Header>
      <View
        className="flex-1 justify-end p-4 overflow-hidden"
        style={{ marginBottom: rem(60) }}
      >
        <ScrollView ref={chatRef} contentContainerStyle={{ flexGrow: 1 }}>
          <View className="min-h-full flex-1 justify-end flex-col">
            {chats.length == 0 && (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontFamily: "Seco", fontSize: rem(14) }}>
                  Start up a conversation. Say 'Hi'!
                </Text>
              </View>
            )}

            {chats.map((item, i) => (
              <MessageBox key={i} text={item.text} user={item.user} />
            ))}
          </View>
        </ScrollView>
      </View>
      <View
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          // borderWidth: 1,
          paddingTop: rem(10),
          elevation: 4,
        }}
      >
        <View
          className="w-full p-2 flex-row"
          style={{
            elevation: 10,
            backgroundColor: "white",
            paddingVertical: rem(15),
            textAlign: "center",
            fontSize: rem(13),
          }}
        >
          <TextInput
            className="flex-1 pl-5"
            style={{ borderWidth: 1, borderColor: "gray", borderRadius: 32 }}
            placeholder="Send a message..."
            value={message}
            onChangeText={(text) => setMessage(text)}
          />
          <View>
            {/* <Button title="Sample" /> */}
            <TouchableOpacity
              onPress={() => {
                // setChats((prev) => [...prev, { user: true, text: message }]);
                handleMessage();
                // setChats((prev) => [...prev, { user: true, text: message }]);
                // handleMessage();
                setMessage("");
              }}
            >
              <View
                className="p-1 justify-center items-center text-center"
                // style={{ borderWidth: 1 }}
              >
                <Ionicons
                  className="p-2 ml-3"
                  name="paper-plane-outline"
                  size={24}
                  color="black"
                  style={{ borderWidth: 1, borderRadius: 100 }}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </PaperProvider>
  );
};

export default Chat;
