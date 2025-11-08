import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { Audio } from "expo-av";
import AntDesign from "@expo/vector-icons/AntDesign";
import BoldText from "../../../components/BoldText";
import { default as Text } from "../../../components/CustomText";

const { width } = Dimensions.get("window");
const cardSize = width / 4.5;

const icons = ["🐰", "🐻", "🦊", "🐼", "🐱", "🐶", "🐵", "🐸", "🐯", "🐹"];
const quotes = [
  "You're pawsome! 🐾 Keep going! ✨",
  "Cuteness overload! You're amazing! 💖",
  "Wow! You have the heart of a panda! 🐼💪",
  "You’re as clever as a fox! 🦊 Keep it up! 🚀",
  "Great job! You're on fire! 🔥 Keep pushing! 🏆",
];

let winnerSound;

const generateCards = (level) => {
  const numPairs = 2 + (level - 1) * 2;
  const selectedIcons = icons.slice(0, numPairs);
  const cards = [...selectedIcons, ...selectedIcons].map((content, index) => ({
    id: index + 1,
    content,
    matched: false,
    flipped: false,
  }));
  return shuffleCards(cards);
};

const shuffleCards = (cards) => [...cards].sort(() => Math.random() - 0.5);

const Card = ({ card, onClick }) => {
  return (
    <TouchableOpacity
      style={[
        styles.card,
        (card.matched || card.flipped) && styles.flippedCard,
      ]}
      onPress={() => onClick(card)}
      disabled={card.matched}
    >
      <Text style={styles.cardText}>
        {card.matched || card.flipped ? card.content : "❓"}
      </Text>
    </TouchableOpacity>
  );
};

const ClipCardGame = ({ navigation }) => {
  const [level, setLevel] = useState(1);
  const [cards, setCards] = useState(generateCards(level));
  const [selectedCards, setSelectedCards] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [motivationQuote, setMotivationQuote] = useState("");

  const playSound = async (soundFile) => {
    const { sound } = await Audio.Sound.createAsync(soundFile);
    await sound.playAsync();
    return sound;
  };

  useEffect(() => {
    if (selectedCards.length === 2) {
      const [first, second] = selectedCards;
      if (first.content === second.content) {
        setCards((prevCards) =>
          prevCards.map((card) =>
            card.content === first.content ? { ...card, matched: true } : card
          )
        );
        playSound(require("../../../assets/audio/ting.mp3"));
      } else {
        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((card) =>
              card.id === first.id || card.id === second.id
                ? { ...card, flipped: false }
                : card
            )
          );
        }, 1000);
      }
      setSelectedCards([]);
    }
  }, [selectedCards]);

  useEffect(() => {
    if (cards.every((card) => card.matched)) {
      setGameOver(true);
      setMotivationQuote(quotes[Math.floor(Math.random() * quotes.length)]);
      playSound(require("../../../assets/audio/winner.mp3")).then((sound) => {
        winnerSound = sound;
      });
    }
  }, [cards]);

  const handleCardClick = (card) => {
    if (
      !gameOver &&
      selectedCards.length < 2 &&
      !card.flipped &&
      !card.matched
    ) {
      setCards((prevCards) =>
        prevCards.map((c) => (c.id === card.id ? { ...c, flipped: true } : c))
      );
      setSelectedCards([...selectedCards, card]);
      playSound(require("../../../assets/audio/tap2.mp3"));
    }
  };

  const nextLevel = () => {
    if (winnerSound) {
      winnerSound.stopAsync();
    }
    if (level < 5) {
      setLevel(level + 1);
      setCards(generateCards(level + 1));
      setSelectedCards([]);
      setGameOver(false);
      setMotivationQuote("");
    } else {
      resetGame();
    }
  };

  const resetGame = () => {
    if (winnerSound) {
      winnerSound.stopAsync();
    }
    setLevel(1);
    setCards(generateCards(1));
    setSelectedCards([]);
    setGameOver(false);
    setMotivationQuote("");
  };

  return (
    <View style={styles.container}>
      <View
        style={{ marginBottom: 10, position: "absolute", top: 20, left: 20 }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <BoldText style={styles.title}>Clip Card Game 🐰✨</BoldText>
      <BoldText style={styles.level}>Level {level} 🔥</BoldText>

      {gameOver ? (
        <View style={styles.motivationContainer}>
          <Text style={styles.motivationText}>{motivationQuote}</Text>
          <TouchableOpacity style={styles.nextButton} onPress={nextLevel}>
            <Text style={styles.nextButtonText}>
              {level < 5 ? "Next Level 🚀" : "Restart Game 🔄"}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.grid}>
          {cards.map((card) => (
            <Card key={card.id} card={card} onClick={handleCardClick} />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#E8F5E9",
  },
  title: {
    fontSize: 28,
    marginBottom: 10,
    color: "#2E7D32",
  },
  level: {
    fontSize: 20,
    color: "#ff4500",
    marginBottom: 15,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  card: {
    width: cardSize,
    height: cardSize,
    backgroundColor: "#C8E6C9",
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
    borderRadius: 15,
    shadowColor: "#1B5E20",
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  flippedCard: {
    backgroundColor: "#2E7D32",
  },
  cardText: {
    fontSize: 28,
    color: "#fff",
  },
  nextButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#ff4500",
    borderRadius: 10,
  },
  nextButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ClipCardGame;
