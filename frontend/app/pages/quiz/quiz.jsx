import {
  View,
  TouchableWithoutFeedback,
  Pressable,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { default as Text } from "../../../components/CustomText";
import { useRouter } from "expo-router";
import BoldText from "../../../components/BoldText";
import Animated, {
  Keyframe,
  Easing,
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  withDelay,
  LinearTransition,
  FadeIn,
  FadeOut,
  ZoomIn,
  ZoomOut,
  SlideOutUp,
  FadeInLeft,
  BounceIn,
  BounceOut,
  FadeOutRight,
  StretchOutX,
  FlipOutEasyX,
  FlipInEasyX,
  SlideInUp,
  SlideInDown,
  FadeInUp,
  LightSpeedInLeft,
  LightSpeedOutRight,
} from "react-native-reanimated";

import AntDesign from "@expo/vector-icons/AntDesign";
import { rem } from "../../../components/stylings/responsiveSize";

import {
  Button,
  ProgressBar,
  MD3Colors,
  Modal,
  Portal,
  PaperProvider,
  MD3DarkTheme,
  ActivityIndicator,
  TextInput,
} from "react-native-paper";
import theme from "../../../components/CustomTheme";
import logo from "../../../assets/images/vera_logo.png";
import { useAuth } from "../../../context/AuthContext";

import { useSelector, useDispatch } from "react-redux";
import { setQuizResult } from "../../../redux/counterSlice";
import useAudioPlayer from "../../../hooks/useAudioPlayer";

import inthepastAudio from "../../../assets/audio/voice/inthepast.mp3";
import youroverallselfAudio from "../../../assets/audio/voice/youroverallself.mp3";
import everbeendiagnosedAudio from "../../../assets/audio/voice/everbeendiagnosed.mp3";
import downhopelesslostAudio from "../../../assets/audio/voice/downhopelesslost.mp3";
import headachesAudio from "../../../assets/audio/voice/headaches.mp3";
import bloodpressureAudio from "../../../assets/audio/voice/bloodpressure.mp3";
import sleepqualityAudio from "../../../assets/audio/voice/sleepquality.mp3";
import breathingAudio from "../../../assets/audio/voice/breathing.mp3";
import noiselevelAudio from "../../../assets/audio/voice/noiselevel.mp3";
import livingsituationAudio from "../../../assets/audio/voice/livingsituation.mp3";
import workenvironmentAudio from "../../../assets/audio/voice/workenvironment.mp3";
import adequatelymetAudio from "../../../assets/audio/voice/adequatelymet.mp3";
import academicperformanceAudio from "../../../assets/audio/voice/academicperformance.mp3";
import academicpressureAudio from "../../../assets/audio/voice/academicpressure.mp3";
import relationshipwithteachersAudio from "../../../assets/audio/voice/relationshipwithteachers.mp3";
import futurecareerAudio from "../../../assets/audio/voice/futurecareer.mp3";
import supportsystemAudio from "../../../assets/audio/voice/supportsystem.mp3";
import peerpressureAudio from "../../../assets/audio/voice/peerpressure.mp3";
import extracurricularAudio from "../../../assets/audio/voice/extracurricular.mp3";
import bullyingAudio from "../../../assets/audio/voice/bullying.mp3";
import overallstressAudio from "../../../assets/audio/voice/overallstress.mp3";
import finishedAudio from "../../../assets/audio/voice/finished.mp3";
import welcomeAudio from "../../../assets/audio/voice/welcome.mp3";
import welcomeAudioTag from "../../../assets/audio/voice/welcometagalog.mp3";
import ding from "../../../assets/audio/ding.mp3";
import wind from "../../../assets/audio/wind.mp3";
import tap from "../../../assets/audio/tap2.mp3";

import tag1 from "../../../assets/audio/tagalog/1.wav";
import tag2 from "../../../assets/audio/tagalog/2.wav";
import tag3 from "../../../assets/audio/tagalog/3.wav";
import tag4 from "../../../assets/audio/tagalog/4.wav";
import tag5 from "../../../assets/audio/tagalog/5.wav";
import tag6 from "../../../assets/audio/tagalog/6.wav";
import tag7 from "../../../assets/audio/tagalog/7.wav";
import tag8 from "../../../assets/audio/tagalog/8.wav";
import tag9 from "../../../assets/audio/tagalog/9.wav";
import tag10 from "../../../assets/audio/tagalog/10.wav";
import tag11 from "../../../assets/audio/tagalog/11.wav";
import tag12 from "../../../assets/audio/tagalog/12.wav";
import tag13 from "../../../assets/audio/tagalog/13.wav";
import tag14 from "../../../assets/audio/tagalog/14.wav";
import tag15 from "../../../assets/audio/tagalog/15.wav";
import tag16 from "../../../assets/audio/tagalog/16.wav";
import tag17 from "../../../assets/audio/tagalog/17.wav";
import tag18 from "../../../assets/audio/tagalog/18.wav";
import tag19 from "../../../assets/audio/tagalog/19.wav";
import tag20 from "../../../assets/audio/tagalog/20.wav";
import tag21 from "../../../assets/audio/tagalog/21.m4a";
import Draggable from "../../../components/Draggable";

import FaceIndicator from "../../../components/FaceIndicator";

const questionAudioMapTag = {
  "Sa nakaraang dalawang linggo, gaano kadalas mong naramdaman na sobra kang nag-aalala o kaba?":
    {
      file: tag1,
      delay: 3000,
    },
  "Paano mo irarate ang kabuuang pagpapahalaga mo sa sarili?": {
    file: tag2,
    delay: 500,
  },
  "Nadiagnose ka na ba ng isang kondisyon sa kalusugan ng isip?": {
    file: tag3,
    delay: 500,
  },
  "Sa nakaraang dalawang linggo, gaano kadalas mong naramdaman na ikaw ay malungkot, nawawalan ng pag-asa, o nawawala ang interes sa mga bagay na kinagigiliwan mo?":
    {
      file: tag4,
      delay: 500,
    },
  "Gaano kadalas kang nakakaranas ng pananakit ng ulo?": {
    file: tag5,
    delay: 500,
  },
  "Paano mo ilalarawan ang iyong presyon ng dugo?": {
    file: tag6,
    delay: 500,
  },
  "Paano mo irarate ang kabuuang kalidad ng iyong pagtulog?": {
    file: tag7,
    delay: 500,
  },
  "Gaano kadalas kang nakakaranas ng kakulangan sa paghinga o kahirapan sa paghinga?":
    {
      file: tag8,
      delay: 500,
    },
  "Paano mo irarate ang antas ng ingay sa iyong lugar ng paninirahan o pag-aaral?":
    {
      file: tag9,
      delay: 500,
    },
  "Gaano ka-komportable ang iyong kalagayan sa paninirahan?": {
    file: tag10,
    delay: 500,
  },
  "Gaano ka-ligtas ang iyong nararamdaman sa iyong lugar ng paninirahan o trabaho?":
    {
      file: tag11,
      delay: 500,
    },
  "Natutugunan ba nang sapat ang lahat ng iyong pangunahing pangangailangan (pagkain, tirahan, pangangalaga sa kalusugan)?":
    {
      file: tag12,
      delay: 500,
    },
  "Paano mo irarate ang iyong pagganap sa akademiko?": {
    file: tag13,
    delay: 500,
  },
  "Gaano kalaki ang presyur na nararanasan mo sa akademiko?": {
    file: tag14,
    delay: 500,
  },
  "Paano mo ilalarawan ang iyong relasyon sa iyong mga guro/profesor?": {
    file: tag15,
    delay: 500,
  },
  "Gaano ka-nababahala tungkol sa iyong hinaharap na karera?": {
    file: tag16,
    delay: 500,
  },
  "Gaano kalakas ang iyong sistema ng suporta mula sa lipunan (mga kaibigan, pamilya, komunidad)?":
    {
      file: tag17,
      delay: 500,
    },
  "Gaano kadalas kang nakakaranas ng presyur mula sa iyong mga kapantay na gawin ang mga bagay na hindi mo karaniwang ginagawa?":
    {
      file: tag18,
      delay: 500,
    },
  "Gaano ka-aktibo ang iyong pakikilahok sa mga extracurricular na aktibidad?":
    {
      file: tag19,
      delay: 500,
    },
  "How often have you experienced bullying?": {
    file: tag20,
    delay: 500,
  },
  "How would you rate your overall stress level?": {
    file: tag21,
    delay: 500,
  },
};

const questionAudioMap = {
  "In the past two weeks, how often have you felt excessively worried or anxious?":
    {
      file: inthepastAudio,
      delay: 3000,
    },
  "How would you rate your overall self-esteem?": {
    file: youroverallselfAudio,
    delay: 500,
  },
  "Have you ever been diagnosed with a mental health condition?": {
    file: everbeendiagnosedAudio,
    delay: 500,
  },
  "In the past two weeks, how often have you felt down, hopeless, or lost interest in things you enjoy?":
    {
      file: downhopelesslostAudio,
      delay: 500,
    },
  "How often do you experience headaches?": {
    file: headachesAudio,
    delay: 500,
  },
  "How would you describe your blood pressure?": {
    file: bloodpressureAudio,
    delay: 500,
  },
  "How would you rate your overall sleep quality?": {
    file: sleepqualityAudio,
    delay: 500,
  },
  "How often do you experience shortness of breath or breathing difficulties?":
    {
      file: breathingAudio,
      delay: 500,
    },
  "How would you rate the noise level in your living/study environment?": {
    file: noiselevelAudio,
    delay: 500,
  },
  "How comfortable is your living situation?": {
    file: livingsituationAudio,
    delay: 500,
  },
  "How safe do you feel in your living or working environment?": {
    file: workenvironmentAudio,
    delay: 500,
  },
  "Are all your basic needs (food, shelter, healthcare) adequately met?": {
    file: adequatelymetAudio,
    delay: 500,
  },
  "How would you rate your academic performance?": {
    file: academicperformanceAudio,
    delay: 500,
  },
  "How much academic pressure do you experience?": {
    file: academicpressureAudio,
    delay: 500,
  },
  "How would you describe your relationship with your teachers/professors?": {
    file: relationshipwithteachersAudio,
    delay: 500,
  },
  "How worried are you about your future career?": {
    file: futurecareerAudio,
    delay: 500,
  },
  "How strong is your social support system (friends, family, community)?": {
    file: supportsystemAudio,
    delay: 500,
  },
  "How often do you feel pressured by your peers to do things you wouldn’t normally do?":
    {
      file: peerpressureAudio,
      delay: 500,
    },
  "How actively do you participate in extracurricular activities?": {
    file: extracurricularAudio,
    delay: 500,
  },
  "How often have you experienced bullying?": {
    file: bullyingAudio,
    delay: 500,
  },
  "How would you rate your overall stress level?": {
    file: overallstressAudio,
    delay: 500,
  },
};

const Quiz = ({ navigation }) => {
  const settingsConfig = useSelector((state) => state.settings.settings);
  const quizResult = useSelector((state) => state.quizResult.quizResult);
  const dispatch = useDispatch();

  const valueRef = useRef(5);

  const handleValueChange = (newValue) => {
    valueRef.current = newValue;
    console.log("Updated Value:", newValue);
  };

  const [questions, setQuestions] = useState([
    {
      question:
        "In the past two weeks, how often have you felt excessively worried or anxious?",
      answers: ["Never", "Rarely", "Sometimes", "Often", "Almost Always"],
      input: "",
      type: "analysis",
      tagalog:
        "Sa nakaraang dalawang linggo, gaano kadalas mong naramdaman na sobra kang nag-aalala o kaba?",
    },
    {
      question: "How would you rate your overall self-esteem?",
      answers: [
        "Very Low",
        "Low",
        "Moderate",
        "High",
        "Very High",
        "Extremely High",
      ],
      input: "",
      type: "multiple choice",
      tagalog: "Paano mo irarate ang kabuuang pagpapahalaga mo sa sarili?",
    },
    {
      question: "Have you ever been diagnosed with a mental health condition?",
      answers: ["No", "Yes"],
      input: "",
      type: "multiple choice",
      tagalog: "Nadiagnose ka na ba ng isang kondisyon sa kalusugan ng isip?",
    },
    {
      question:
        "In the past two weeks, how often have you felt down, hopeless, or lost interest in things you enjoy?",
      answers: ["Never", "Rarely", "Sometimes", "Often", "Almost Always"],
      input: "",
      type: "analysis",
      tagalog:
        "Sa nakaraang dalawang linggo, gaano kadalas mong naramdaman na ikaw ay malungkot, nawawalan ng pag-asa, o nawawala ang interes sa mga bagay na kinagigiliwan mo?",
    },
    {
      question: "How often do you experience headaches?",
      answers: [
        "Never",
        "Rarely",
        "Occasionally",
        "Often",
        "Very Often",
        "Almost Daily",
      ],
      input: "",
      type: "multiple choice",
      tagalog: "Gaano kadalas kang nakakaranas ng pananakit ng ulo?",
    },
    {
      question: "How would you describe your blood pressure?",
      answers: ["Low", "Normal", "High"],
      input: "",
      type: "multiple choice",
      tagalog: "Paano mo ilalarawan ang iyong presyon ng dugo?",
    },
    {
      question: "How would you rate your overall sleep quality?",
      answers: ["Very Poor", "Poor", "Fair", "Good", "Very Good", "Excellent"],
      input: "",
      type: "analysis",
      tagalog: "Paano mo irarate ang kabuuang kalidad ng iyong pagtulog?",
    },
    {
      question:
        "How often do you experience shortness of breath or breathing difficulties?",
      answers: [
        "Never",
        "Rarely",
        "Occasionally",
        "Often",
        "Very Often",
        "Almost Daily",
      ],
      input: "",
      type: "multiple choice",
      tagalog:
        "Gaano kadalas kang nakakaranas ng kakulangan sa paghinga o kahirapan sa paghinga?",
    },
    {
      question:
        "How would you rate the noise level in your living/study environment?",
      answers: [
        "Very Quiet",
        "Quiet",
        "Moderate",
        "Noisy",
        "Very Noisy",
        "Extremely Noisy",
      ],
      input: "",
      type: "multiple choice",
      tagalog:
        "Paano mo irarate ang antas ng ingay sa iyong lugar ng paninirahan o pag-aaral?",
    },
    {
      question: "How comfortable is your living situation?",
      answers: ["Very Poor", "Poor", "Fair", "Good", "Very Good", "Excellent"],
      input: "",
      type: "multiple choice",
      tagalog: "Gaano ka-komportable ang iyong kalagayan sa paninirahan?",
    },
    {
      question: "How safe do you feel in your living or working environment?",
      answers: [
        "Very Unsafe",
        "Unsafe",
        "Neutral",
        "Safe",
        "Very Safe",
        "Extremely Safe",
      ],
      input: "",
      type: "multiple choice",
      tagalog:
        "Gaano ka-ligtas ang iyong nararamdaman sa iyong lugar ng paninirahan o trabaho?",
    },
    {
      question:
        "Are all your basic needs (food, shelter, healthcare) adequately met?",
      answers: [
        "Not at all",
        "Rarely",
        "Sometimes",
        "Most of the Time",
        "Almost Always",
        "Always",
      ],
      input: "",
      type: "multiple choice",
      tagalog:
        "Natutugunan ba nang sapat ang lahat ng iyong pangunahing pangangailangan (pagkain, tirahan, pangangalaga sa kalusugan)?",
    },
    {
      question: "How would you rate your academic performance?",
      answers: ["Very Poor", "Poor", "Fair", "Good", "Very Good", "Excellent"],
      input: "",
      type: "multiple choice",
      tagalog: "Paano mo irarate ang iyong pagganap sa akademiko?",
    },
    {
      question: "How much academic pressure do you experience?",
      answers: [
        "None",
        "Very Light",
        "Manageable",
        "Somewhat Heavy",
        "Heavy",
        "Overwhelming",
      ],
      input: "",
      type: "multiple choice",
      tagalog: "Gaano kalaki ang presyur na nararanasan mo sa akademiko?",
    },
    {
      question:
        "How would you describe your relationship with your teachers/professors?",
      answers: [
        "Very Poor",
        "Poor",
        "Neutral",
        "Good",
        "Very Good",
        "Excellent",
      ],
      input: "",
      type: "multiple choice",
      tagalog:
        "Paano mo ilalarawan ang iyong relasyon sa iyong mga guro/profesor?",
    },
    {
      question: "How worried are you about your future career?",
      answers: [
        "Not at all",
        "Slightly",
        "Somewhat",
        "Moderately",
        "Very",
        "Extremely",
      ],
      input: "",
      type: "multiple choice",
      tagalog: "Gaano ka-nababahala tungkol sa iyong hinaharap na karera?",
    },
    {
      question:
        "How strong is your social support system (friends, family, community)?",
      answers: ["None", "Weak", "Moderate", "Strong"],
      input: "",
      type: "multiple choice",
      tagalog:
        "Gaano kalakas ang iyong sistema ng suporta mula sa lipunan (mga kaibigan, pamilya, komunidad)?",
    },
    {
      question:
        "How often do you feel pressured by your peers to do things you wouldn’t normally do?",
      answers: [
        "Never",
        "Rarely",
        "Occasionally",
        "Often",
        "Very Often",
        "Almost Always",
      ],
      input: "",
      type: "multiple choice",
      tagalog:
        "Gaano kadalas kang nakakaranas ng presyur mula sa iyong mga kapantay na gawin ang mga bagay na hindi mo karaniwang ginagawa?",
    },
    {
      question:
        "How actively do you participate in extracurricular activities?",
      answers: [
        "Not at all",
        "Rarely",
        "Occasionally",
        "Regularly",
        "Very Actively",
        "Extremely Active",
      ],
      input: "",
      type: "multiple choice",
      tagalog:
        "Gaano ka-aktibo ang iyong pakikilahok sa mga extracurricular na aktibidad?",
    },
    {
      question: "How often have you experienced bullying?",
      answers: [
        "Never",
        "Rarely",
        "Occasionally",
        "Often",
        "Very Often",
        "Almost Always",
      ],
      input: "",
      type: "multiple choice",
      tagalog: "Gaano kadalas kang nakakaranas ng pambubully?",
    },
    {
      question: "How would you rate your overall stress level?",
      answers: ["Low", "Moderate", "High"],
      input: "",
      type: "analysis",
      tagalog: "Paano mo irarate ang kabuuang antas ng iyong stress?",
    },
  ]);

  const [asnwerValue, setAnswerValue] = useState(0);
  const router = useRouter();
  const size = useSharedValue(0);
  const [quizProgress, setQuizProgress] = useState(0);
  const [questionNum, setQuestionNum] = useState(0);
  const [visible, setVisible] = React.useState(false);
  const [start, setStart] = useState(false);
  const [renderQuestions, setRenderQuestions] = useState(false);
  const [renderTitle, setRenderTitle] = useState(false);
  const [isAnswering, setIsAnswering] = useState(false);
  const [finished, setFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { axiosInstanceWithBearer } = useAuth();
  const [playIntro, setPlayIntro] = useState(1);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const staggerValue = 200;

  const { playSound, stopSound, isPlaying } = useAudioPlayer();

  useEffect(() => {
    if (!start) return;
    if (!settingsConfig.quizSpeech) return;

    let currentQuestion = questions[questionNum]?.question;

    if (settingsConfig.language == "Tagalog") {
      currentQuestion = questions[questionNum]?.tagalog;
    }

    const audioData = questionAudioMap[currentQuestion];
    const audioDataTag = questionAudioMapTag[currentQuestion];
    console.log(audioDataTag);

    if (settingsConfig.language == "Tagalog") {
      console.log("tagalog audio");
      console.log("dsads", audioDataTag);
      if (audioDataTag) {
        console.log("tagalog audio2");
        setTimeout(() => {
          playSound(audioDataTag.file);
        }, audioDataTag.delay);
      }
    } else {
      if (audioData) {
        setTimeout(() => {
          playSound(audioData.file);
        }, audioData.delay);
      }
    }
  }, [questionNum, start]);

  useEffect(() => {
    if (isLoading) {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  }, [isLoading]);

  useEffect(() => {
    if (start) {
      setRenderQuestions(true);

      setTimeout(() => {
        setRenderTitle(true);
      }, 1000);

      setTimeout(() => {
        setRenderTitle(false);
      }, 3000);

      setTimeout(() => {
        setIsAnswering(true);
      }, 3500);
    }
  }, [start]);

  useEffect(() => {
    if (finished) {
      if (!settingsConfig.quizSpeech) return;
      playSound(finishedAudio);
    }
  }, [finished]);

  const handleFinish = async () => {
    const quiz_result = questions.map((q) => q.input);
    console.log(quiz_result);

    try {
      const res = await axiosInstanceWithBearer.post("/api/analysis/", {
        quiz_result,
      });

      dispatch(setQuizResult(res.data.analysis_result));
      navigation.navigate("Result");
    } catch (e) {
      console.log(e);
    }
  };

  const startBackgroundKeyframe = new Keyframe({
    0: {
      transform: [{ translateY: -1000 }],
    },
    100: {
      transform: [{ translateY: 0 }],
      easing: Easing.bezier(0.5, 1.5, 0.5, 1),
    },
  });

  const startTitleKeyframe = new Keyframe({
    0: {
      transform: [{ translateX: -1000 }, { rotate: "-30deg" }],
      opacity: 0,
    },
    100: {
      transform: [{ translateX: 0 }, { rotate: "0deg" }],
      opacity: 1,
      easing: Easing.bezier(0.5, 1.5, 0.5, 1),
    },
  })
    .duration(1000)
    .delay(1000);

  const exitTitleKeyframe = new Keyframe({
    0: {
      transform: [{ translateX: 0 }, { rotate: "0deg" }],
      opacity: 1,
    },
    100: {
      transform: [{ translateX: -1000 }, { rotate: "-30deg" }],
      opacity: 0,
      easing: Easing.bezier(0.5, 1.5, 0.5, 1),
    },
  }).duration(1000);

  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(
      1800,
      withSpring(1, {
        damping: 10,
        stiffness: 100,
      })
    );

    if (playIntro === 1) {
      if (!settingsConfig.quizSpeech) return;

      if (settingsConfig.language == "English") {
        setTimeout(() => {
          playSound(welcomeAudio);
        }, 800);
      } else {
        setTimeout(() => {
          playSound(welcomeAudioTag);
        }, 800);
      }
      setPlayIntro((prev) => prev - 1);
    }
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <PaperProvider theme={theme}>
      <Animated.View
        exiting={SlideOutUp}
        entering={startBackgroundKeyframe}
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
        }}
      >
        <Animated.View
          layout={LinearTransition.easing(Easing.bezier(0.5, 1.5, 0.5, 1))}
          style={{
            marginTop: rem(-100),
            // borderWidth: 1,
          }}
        >
          {/* <Text
            style={{
              fontFamily: "CustomFont",
              fontSize: rem(18),
              color: "white",
            }}
          >
            PathFinder
          </Text> */}
          <Image
            source={logo}
            style={{
              width: rem(200),
              resizeMode: "contain",
              height: rem(100),
              // borderWidth: 1,
            }}
          />
        </Animated.View>
        {!start && (
          <Animated.View
            entering={startTitleKeyframe}
            exiting={exitTitleKeyframe}
            style={{
              backgroundColor: "white",
              padding: rem(50),
              paddingHorizontal: rem(60),
              borderRadius: 24,
              alignItems: "center",
              overflow: "hidden",
              elevation: 5,
            }}
          >
            <Text
              style={{
                fontSize: rem(26),
                // fontWeight: 00,

                fontFamily: "SecoBold",
              }}
            >
              Let's Begin!
            </Text>

            <TouchableWithoutFeedback
              onPress={() => {
                setStart(!start);
                if (!settingsConfig.fxQuiz) return;
                playSound(tap);
              }}
            >
              <Animated.View
                style={[
                  animatedStyle,
                  {
                    backgroundColor: "#0cdfc6",
                    borderRadius: 24,
                    padding: rem(5),
                    marginTop: rem(30),
                  },
                ]}
              >
                <AntDesign
                  style={{
                    padding: rem(5),
                    borderWidth: 4,
                    borderRadius: 24,
                    borderColor: "white",
                  }}
                  name="right"
                  size={30}
                  color="white"
                />
              </Animated.View>
            </TouchableWithoutFeedback>
          </Animated.View>
        )}

        {renderQuestions && renderTitle && (
          <Animated.View entering={FadeIn} exiting={FadeOut}>
            <Text
              style={{ fontFamily: "Seco", color: "black", fontSize: rem(22) }}
            >
              Analysis
            </Text>
          </Animated.View>
        )}

        {renderQuestions && isAnswering && (
          <Animated.View
            entering={ZoomIn.easing(Easing.bezier(0.5, 1.5, 0.5, 1))}
            exiting={ZoomOut}
            style={{
              backgroundColor: "white",
              borderRadius: 24,
              height: rem(400),
              width: rem(300),
              overflow: "hidden",
              justifyContent: "center",
              alignItems: "center",
              elevation: 5,
            }}
          >
            <View style={{ marginVertical: rem(10), gap: rem(10) }}>
              <Text>
                Question {questionNum + 1} of {questions.length}
              </Text>
              <ProgressBar progress={(questionNum + 1) / questions.length} />
            </View>
            {questions.map((item, i) => {
              return questionNum === i ? (
                <Animated.View
                  entering={SlideInDown.delay(500).easing(
                    Easing.bezier(0.5, 1.5, 0.5, 1)
                  )}
                  exiting={SlideOutUp}
                  style={{
                    padding: rem(10),
                    paddingHorizontal: rem(20),
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  key={i}
                >
                  <Animated.Text
                    layout={LinearTransition.easing(
                      Easing.bezier(0.5, 1.5, 0.5, 1)
                    )}
                    style={{
                      color: "black",
                      textAlign: "center",
                      fontFamily: "Seco",
                      fontSize: rem(15),
                    }}
                  >
                    {settingsConfig.language == "English"
                      ? item.question
                      : item.tagalog}
                  </Animated.Text>
                  <View
                    style={{
                      marginTop: rem(10),

                      flexDirection: "row",
                      flexWrap: "wrap",
                      justifyContent: "space-evenly",

                      gap: rem(10),
                    }}
                  >
                    {item.type === "multiple choice" ? (
                      item.answers.map((answer, index) => {
                        const isSelected = item.input === index;

                        return (
                          <Animated.View
                            layout={LinearTransition.easing(
                              Easing.bezier(0.5, 1.5, 0.5, 1)
                            )}
                            key={index}
                            entering={BounceIn.delay(
                              1000 + staggerValue * index
                            )}
                            exiting={BounceOut}
                            style={{
                              borderWidth: 1,
                              height: rem(40),
                              width: "48%",
                              borderRadius: 24,
                              justifyContent: "center",
                              alignItems: "center",
                              backgroundColor: isSelected ? "#0cdfc6" : "white",
                            }}
                          >
                            <TouchableWithoutFeedback
                              onPress={() => {
                                const updatedQuestions = [...questions];
                                updatedQuestions[i] = {
                                  ...updatedQuestions[i],
                                  input: index,
                                };
                                setQuestions(updatedQuestions);
                                if (!settingsConfig.fxQuiz) return;
                                playSound(ding);
                              }}
                            >
                              <View
                                style={{
                                  height: "100%",
                                  width: "100%",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <Text
                                  style={{
                                    color: isSelected ? "white" : "black",
                                  }}
                                >
                                  {answer}
                                </Text>
                              </View>
                            </TouchableWithoutFeedback>
                          </Animated.View>
                        );
                      })
                    ) : (
                      <View
                        style={{
                          // borderWidth: 1,
                          width: "100%",
                          padding: rem(10),
                        }}
                      >
                        <FaceIndicator valueRef={valueRef} />
                        <Draggable onValueChange={handleValueChange} />
                        <View
                          style={{
                            width: "100%",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            backgroundColor: "white",
                          }}
                        >
                          <Text>Good</Text>
                          <Text>Bad</Text>
                        </View>

                        <Animated.View
                          entering={FadeInUp.easing(
                            Easing.bezier(0.5, 1.5, 0.5, 1)
                          )}
                          style={{
                            width: "100%",
                            flexDirection: "row",
                            marginTop: rem(20),
                          }}
                        >
                          <View
                            style={{ width: "50%", paddingHorizontal: rem(5) }}
                          >
                            {/* <Button
                            mode="elevated"
                            onPress={() => {
                              setQuestionNum((prev) => prev - 1);
                            }}
                          >
                            Previous
                          </Button> */}
                            <TouchableWithoutFeedback
                              disabled={i === 0}
                              onPress={() => setQuestionNum((prev) => prev - 1)}
                            >
                              <Text
                                style={{
                                  elevation: 5,
                                  backgroundColor: "white",
                                  borderRadius: 32,
                                  padding: rem(10),
                                  paddingVertical: rem(15),
                                  textAlign: "center",
                                  fontSize: rem(13),
                                  fontWeight: 700,
                                }}
                              >
                                <AntDesign
                                  name="left"
                                  size={24}
                                  color="#0cdfc6"
                                />
                              </Text>
                            </TouchableWithoutFeedback>
                          </View>
                          <View
                            style={{ width: "50%", paddingHorizontal: rem(5) }}
                          >
                            <TouchableWithoutFeedback
                              // disabled={i == questions.length - 1}
                              onPress={() => {
                                const updatedQuestions = [...questions];
                                updatedQuestions[i] = {
                                  ...updatedQuestions[i],
                                  input: valueRef.current * 2.1,
                                };
                                setQuestions(updatedQuestions);
                                valueRef.current = 5;
                                if (i == questions.length - 1) {
                                  setFinished(true);
                                  setIsLoading(true);
                                } else {
                                  setQuestionNum((prev) => prev + 1);
                                }

                                setTimeout(() => {
                                  if (!settingsConfig.fxQuiz) return;
                                  playSound(wind);
                                }, 0);
                              }}
                            >
                              <Text
                                style={{
                                  elevation: 5,
                                  backgroundColor: "white",
                                  borderRadius: 32,
                                  padding: rem(10),
                                  paddingVertical: rem(15),
                                  textAlign: "center",
                                  fontSize: rem(13),
                                  fontWeight: 700,
                                }}
                              >
                                <AntDesign
                                  name="right"
                                  size={24}
                                  color="#0cdfc6"
                                />
                              </Text>
                            </TouchableWithoutFeedback>
                          </View>
                        </Animated.View>
                      </View>
                    )}

                    {!(item.input === "") && !(i == questions.length - 1) && (
                      <Animated.View
                        entering={FadeInUp.easing(
                          Easing.bezier(0.5, 1.5, 0.5, 1)
                        )}
                        style={{
                          width: "100%",
                          flexDirection: "row",
                          marginTop: rem(50),
                        }}
                      >
                        <View
                          style={{ width: "50%", paddingHorizontal: rem(5) }}
                        >
                          {/* <Button
                            mode="elevated"
                            onPress={() => {
                              setQuestionNum((prev) => prev - 1);
                            }}
                          >
                            Previous
                          </Button> */}
                          <TouchableWithoutFeedback
                            disabled={i === 0}
                            onPress={() => setQuestionNum((prev) => prev - 1)}
                          >
                            <Text
                              style={{
                                elevation: 5,
                                backgroundColor: "white",
                                borderRadius: 32,
                                padding: rem(10),
                                paddingVertical: rem(15),
                                textAlign: "center",
                                fontSize: rem(13),
                                fontWeight: 700,
                              }}
                            >
                              <AntDesign
                                name="left"
                                size={24}
                                color="#0cdfc6"
                              />
                            </Text>
                          </TouchableWithoutFeedback>
                        </View>
                        <View
                          style={{ width: "50%", paddingHorizontal: rem(5) }}
                        >
                          <TouchableWithoutFeedback
                            disabled={i == questions.length - 1}
                            onPress={() => {
                              setQuestionNum((prev) => prev + 1);
                              setTimeout(() => {
                                if (!settingsConfig.fxQuiz) return;
                                playSound(wind);
                              }, 0);
                            }}
                          >
                            <Text
                              style={{
                                elevation: 5,
                                backgroundColor: "white",
                                borderRadius: 32,
                                padding: rem(10),
                                paddingVertical: rem(15),
                                textAlign: "center",
                                fontSize: rem(13),
                                fontWeight: 700,
                              }}
                            >
                              <AntDesign
                                name="right"
                                size={24}
                                color="#0cdfc6"
                              />
                            </Text>
                          </TouchableWithoutFeedback>
                        </View>
                      </Animated.View>
                    )}
                  </View>
                </Animated.View>
              ) : null;
            })}
          </Animated.View>
        )}
        <View
          style={{
            width: "100%",
            paddingTop: 20,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity onPress={() => navigation.navigate("Main")}>
            <Animated.View
              layout={LinearTransition.easing(Easing.bezier(0.5, 1.5, 0.5, 1))}
              style={{
                padding: 50,
                paddingVertical: 15,
                borderWidth: 1,
                borderRadius: 24,
                backgroundColor: "white",
                elevation: 5,
              }}
            >
              <Text style={{ color: "black" }}>End Quiz</Text>
            </Animated.View>
          </TouchableOpacity>
        </View>
      </Animated.View>
      {finished && (
        <Animated.View
          entering={FadeIn.easing(Easing.bezier(0.5, 1.5, 0.5, 1))}
          exiting={FadeOut.easing(Easing.bezier(0.5, 1.5, 0.5, 1))}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: "100%",
            zIndex: 1000,
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Animated.View
            entering={LightSpeedInLeft.easing(
              Easing.bezier(0.5, 1.5, 0.5, 1)
            ).delay(500)}
            exiting={LightSpeedOutRight.easing(
              Easing.bezier(0.5, 1.5, 0.5, 1)
            ).delay(500)}
            style={{
              backgroundColor: "white",
              height: rem(200),
              width: rem(330),
              borderRadius: 24,
              justifyContent: "center",
              alignItems: "center",
              padding: rem(10),
            }}
          >
            {!isLoading ? (
              <AntDesign
                style={{ marginBottom: rem(20) }}
                name="checkcircle"
                size={24}
                color="green"
              />
            ) : (
              <ActivityIndicator
                style={{ marginBottom: rem(20) }}
                animating={isLoading}
                color={"#0cdfc6"}
              />
            )}
            <Text>
              Congratulations! You have completed the quiz. Please wait until
              your results are processed.
            </Text>
            {!isLoading && (
              <Button
                onPress={() => {
                  console.log(questions);
                  handleFinish();
                }}
                style={{ marginTop: rem(10) }}
              >
                Continue
              </Button>
            )}
          </Animated.View>
        </Animated.View>
      )}
    </PaperProvider>
  );
};

export default Quiz;
