import { View, TouchableWithoutFeedback, ScrollView } from "react-native";
import React from "react";
import { rem, em } from "../../../components/stylings/responsiveSize";
import theme from "../../../components/CustomTheme";
import { default as Text } from "../../../components/CustomText";

import { Button, Checkbox, PaperProvider } from "react-native-paper";
import { useRouter } from "expo-router";

import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import BoldText from "../../../components/BoldText";

import Animated, {
  SlideInDown,
  SlideInUp,
  SlideOutUp,
} from "react-native-reanimated";
import SoundButton from "../../../components/SoundButton";

const Conditions = ({ navigation }) => {
  const router = useRouter();
  const [checked, setChecked] = React.useState(false);
  return (
    <PaperProvider theme={theme}>
      <Animated.View
        entering={SlideInDown}
        exiting={SlideOutUp}
        className="flex-1 p-2"
      >
        <View style={{ position: "absolute", top: 20, left: 20 }}>
          <TouchableWithoutFeedback
            onPress={() => {
              router.back();
            }}
          >
            <AntDesign name="arrowleft" size={24} color="black" />
          </TouchableWithoutFeedback>
        </View>

        <View className="flex-1 mt-16">
          <Text className="p-3" style={{ fontSize: rem(20) }}>
            Terms and Condition
          </Text>
          <ScrollView>
            <View>
              <Text>
                1. Acceptance of Terms {"\n\n"} By accessing or using Pathfinder
                ("the App"), you agree to be bound by these Terms and Conditions
                ("Terms"). If you do not agree to these Terms, you must not use
                the App. Your continued use of the App constitutes acceptance of
                any modifications to these Terms. {"\n\n"}
              </Text>
              <Text>
                2. Description of Service Pathfinder {"\n\n"} provides users
                with quiz-based assessments to suggest potential counseling
                types. The recommendations provided are for informational
                purposes only and do not constitute medical, psychological, or
                professional advice. Users are responsible for consulting a
                qualified professional before making any decisions based on the
                recommendations.
                {"\n\n"}
              </Text>
              <Text>
                3. User Eligibility {"\n\n"} You must be at least 18 years old
                to use the App, or have the permission of a parent or legal
                guardian if you are under 18. By using the App, you affirm that
                you meet these eligibility requirements.
                {"\n\n"}
              </Text>
              <Text>
                4. User Account and Security {"\n\n"} Some features may require
                account registration. You are responsible for maintaining the
                confidentiality of your account credentials and for all
                activities that occur under your account. We reserve the right
                to suspend or terminate accounts that violate these Terms.
                {"\n\n"}
              </Text>
              <Text>
                5. Data Collection and Privacy Pathfinder {"\n\n"} collects and
                processes personal data in accordance with our Privacy Policy.
                By using the App, you consent to the collection, storage, and
                processing of your data as described in our Privacy Policy.
                {"\n\n"}
              </Text>
              <Text>
                6. Limitations of Liability {"\n\n"}Pathfinder and its
                developers are not liable for any direct, indirect, incidental,
                or consequential damages arising from your use of the App,
                including reliance on counseling recommendations. The App is
                provided on an "as-is" basis without any warranties of accuracy,
                fitness for a particular purpose, or reliability{"\n\n"}
              </Text>
              <Text>
                7. Third-Party Links and Services {"\n\n"} The App may include
                links to third-party websites or services. We do not endorse or
                assume responsibility for any third-party content, products, or
                services. Your interactions with third parties are at your own
                risk.{"\n\n"}
              </Text>
              <Text>
                8. Modifications to the App and Terms {"\n\n"} We reserve the
                right to modify or discontinue the App, including any features,
                at any time without notice. We may also update these Terms
                periodically, and your continued use of the App signifies your
                acceptance of any changes.{"\n\n"}
              </Text>
              <Text>
                9. Termination of Use {"\n\n"} We reserve the right to suspend
                or terminate your access to the App at our sole discretion if we
                believe you have violated these Terms or engaged in unlawful or
                harmful behavior.{"\n\n"}
              </Text>
              <View style={{ marginVertical: 50 }}></View>
            </View>
          </ScrollView>
        </View>

        <View
          className="flex-row justify-around w-full p-5"
          style={{
            position: "absolute",
            bottom: 0,
            borderWidth: 1,
            borderColor: "gray",
            backgroundColor: "white",
            width: "105%",
          }}
        >
          <Button mode="outlined" onPress={() => router.back()}>
            <Feather name="x" size={16} color="#FFA69E" /> Decline
          </Button>
          <SoundButton
            mode="contained"
            onPress={() =>
              navigation.navigate("Quiz", { animationEnabled: false })
            }
          >
            <AntDesign name="check" size={16} color="white" /> Agree and
            Continue
          </SoundButton>
        </View>
      </Animated.View>
    </PaperProvider>
  );
};

export default Conditions;
