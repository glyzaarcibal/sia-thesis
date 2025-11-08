import React from "react";
import {
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Linking,
} from "react-native";
import { rem } from "../../../components/stylings/responsiveSize";
import logo from "../../../assets/images/vera.png";
import Octicons from "@expo/vector-icons/Octicons";
import { default as Text } from "../../../components/CustomText";
import BoldText from "../../../components/BoldText";

const LayoutGame = ({ navigation }) => {
  const copyToClipboard = (number) => {
    Linking.openURL(`tel:${number}`);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Image source={logo} style={styles.logo} />
          <View style={styles.headerIcons}>

            <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
              <Octicons name="gear" size={20} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        <Image
          source={{
            uri: "https://mindfulnessexercises.com/wp-content/uploads/2019/11/Visualizing-Your-Peaceful-and-Beautiful-Place-BG.jpg",
          }}
          style={styles.headerImage}
        />

        <BoldText style={styles.quote}>
          “I know this won’t be easy, but I also know you’ve got what it takes
          to get through it.”
        </BoldText>

        <View style={styles.supportContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate("TakeABreath")}
            style={styles.buttonContainer}
          >
            <Image
              source={{
                uri: "https://img.freepik.com/free-vector/woman-doing-yoga-park_1308-122857.jpg?semt=ais_hybrid",
              }}
              style={styles.avatar}
            />
            <Text style={styles.buttonText}>1 min Breathing</Text>
          </TouchableOpacity>

         

          <TouchableOpacity
            onPress={() => navigation.navigate("MoodTrackerScreen")}
            style={styles.buttonContainer}
          >
            <Image
              source={{
                uri: "https://media.istockphoto.com/id/1304715728/vector/emotions-scale-on-smartphone-screen-mood-concept-tiny-girl-leave-feedback-online-emoji-set.jpg?s=612x612&w=0&k=20&c=aL0usVoe-3cOGY_Opru5f_NJnsLpZLZqqiuqMVkPbK8=",
              }}
              style={styles.avatar}
            />
            <Text style={styles.buttonText}>Mood Track</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("ClipCardGame")}
            style={styles.buttonContainer}
          >
            <Image
              source={require("../../../assets/images/flipcard.jpg")}
              style={styles.avatar}
            />
            <Text style={styles.buttonText}>FlipCardGame</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("Fallinggame")}
            style={styles.buttonContainer}
          >
            <Image
              source={{
                uri: "https://img.freepik.com/premium-photo/cute-cat-hold-full-love-basket_1298798-2327.jpg",
              }}
              style={styles.avatar}
            />
            <Text style={styles.buttonText}>Catch It!</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("Diary")}
            style={styles.buttonContainer}
          >
            <Image
              source={{
                uri: "https://thumbs.dreamstime.com/b/glass-jar-filled-strips-paper-each-one-containing-handwritten-message-buried-beneath-tree-waiting-to-be-unearthed-322199911.jpg",
              }}
              style={styles.avatar}
            />
            <Text style={styles.buttonText}>Diary Jar</Text>
          </TouchableOpacity>
        </View>

        <View>
          <TouchableOpacity
            onPress={() => navigation.navigate("WeeklyWellnessReport")}
            style={styles.report}
          >
            <Image
              source={{
                uri: "https://cdn.prod.website-files.com/59e16042ec229e00016d3a66/613158262dde4943a51937aa_data%20visualization%20tips_blog%20hero.webp",
              }}
              style={styles.reports}
            />
            <Text style={styles.buttonText}>Report</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>😊 Calm down tips</Text>
          <Text>- Tense and relax muscles from toes to head.</Text>
          <Text>- Rub an ice cube on your skin.</Text>
          <Text>- Carry essential oil, a stress ball, or mint gum.</Text>
        </View>

        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>🧘‍♂️ Mindfulness Tips</Text>
          <Text>- Focus on your breathing for a few minutes.</Text>
          <Text>
            - Practice gratitude by listing three things you're thankful for.
          </Text>
          <Text>
            - Take a short walk and observe your surroundings mindfully.
          </Text>
        </View>

        <View style={styles.hotlineContainer}>
          <Text style={styles.tipsTitle}>📞 Mental Health Hotline</Text>
          <Text>If you need urgent support, please reach out to:</Text>
          <TouchableOpacity onPress={() => copyToClipboard("1553")}>
            <Text style={[styles.hotlineNumber, styles.underline]}>
              📍 National Mental Health Crisis Hotline: 1553
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => copyToClipboard("09178998727")}>
            <Text style={[styles.hotlineNumber, styles.underline]}>
              📍 Local Support: 0917-899-8727
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f8f8e8",
  },
  hotlineNumber: {
    color: "blue",
  },
  tipsTitle: {
    fontSize: 18,
    marginBottom: 5,
  },
  hotlineContainer: {
    backgroundColor: "#ffebeb",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    marginBottom: 20,
  },
  hotlineContainer: {
    backgroundColor: "#ffebeb",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    marginBottom: 20,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: -20,
  },
  logo: {
    marginTop: -30,
    width: rem(160),
    height: rem(100),
    resizeMode: "contain",
  },
  headerIcons: {
    marginTop: -30,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginRight: 15,
  },
  headerImage: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  quote: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 20,
  },
  supportContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    marginBottom: 20,
  },
  buttonContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  report: {
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  reports: {
    width: 340,
    height: 150,
    borderRadius: 10,
    marginTop: -15,
  },
  buttonText: {
    textAlign: "center",
    marginTop: 10,
  },
  tipsContainer: {
    backgroundColor: "#ddd",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    marginBottom: 20,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
});

export default LayoutGame;
