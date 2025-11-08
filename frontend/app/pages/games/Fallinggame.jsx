import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  PanResponder,
  Animated,
  ImageBackground,
  ScrollView,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { Audio } from "expo-av";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { default as Text } from "../../../components/CustomText";

const { width, height } = Dimensions.get("window");

const WORDS = [
  "Serenity",
  "Courage",
  "Healing",
  "SelfLove",
  "Breathe",
  "Growth",
  "Hope",
  "Acceptance",
  "Mindfulness",
  "Kindness",
  "Patience",
  "Balance",
  "Compassion",
  "Peace",
  "Strength",
];

const COLORS = {
  background: ["#1a2980", "#26d0ce"],
  wordColors: ["#ff6b6b", "#4ecdc4", "#45b7d1", "#f9d5e5", "#eeac99"],
  basketGradient: ["#ff6b6b", "#ffa3a3"],
};

const Fallinggame = ({ navigation }) => {
  const [score, setScore] = useState(0);
  const [basketX, setBasketX] = useState(width / 2 - 60);
  const [items, setItems] = useState([]);
  const [level, setLevel] = useState("Easy");
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [multiplier, setMultiplier] = useState(1);
  const [timeLeft, setTimeLeft] = useState(120);
  const [highScores, setHighScores] = useState([]);
  const [showScoreboard, setShowScoreboard] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [showNameInput, setShowNameInput] = useState(false);

  const shakeBasket = useRef(new Animated.Value(0)).current;
  const catchSoundRef = useRef(null);
  const missSoundRef = useRef(null);
  const gameOverSoundRef = useRef(null);
  const intervalRefs = useRef([]);
  const isMountedRef = useRef(true);
  const basketXRef = useRef(basketX);

  // Keep basketX ref updated
  useEffect(() => {
    basketXRef.current = basketX;
  }, [basketX]);

  const getSpeed = useCallback(() => {
    if (level === "Easy") return 2 + Math.random() * 2;
    if (level === "Medium") return 3 + Math.random() * 3;
    return 4 + Math.random() * 4;
  }, [level]);

  const levelColors = useMemo(
    () => ({
      Easy: "orange",
      Medium: "#FF9800",
      Hard: "#F44336",
    }),
    []
  );

  useEffect(() => {
    const loadSounds = async () => {
      try {
        catchSoundRef.current = new Audio.Sound();
        await catchSoundRef.current.loadAsync(
          require("../../../assets/audio/ding.mp3")
        );

        missSoundRef.current = new Audio.Sound();
        await missSoundRef.current.loadAsync(
          require("../../../assets/audio/ting.mp3")
        );

        gameOverSoundRef.current = new Audio.Sound();
        await gameOverSoundRef.current.loadAsync(
          require("../../../assets/audio/page.mp3")
        );
      } catch (error) {
        console.error("Failed to load sounds", error);
      }
    };

    loadSounds();

    return () => {
      const unloadSounds = async () => {
        await catchSoundRef.current?.unloadAsync();
        await missSoundRef.current?.unloadAsync();
        await gameOverSoundRef.current?.unloadAsync();
      };
      unloadSounds();
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const loadHighScores = async () => {
      try {
        const savedScores = await AsyncStorage.getItem("highScores");
        if (savedScores && isMountedRef.current) {
          const parsedScores = JSON.parse(savedScores);
          setHighScores(parsedScores);
        }
      } catch (error) {
        console.error("Failed to load high scores", error);
      }
    };
    loadHighScores();
  }, []);

  useEffect(() => {
    let timer;
    if (gameStarted && timeLeft > 0 && !gameOver && isMountedRef.current) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === 1 && isMountedRef.current) {
            const playGameOverSound = async () => {
              await gameOverSoundRef.current?.playAsync();
            };
            playGameOverSound();
            setGameOver(true);
            setShowNameInput(true);
          }
          return prev - 1;
        });
      }, 1000);
      intervalRefs.current.push(timer);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [gameStarted, gameOver, timeLeft]);

  useEffect(() => {
    let wordInterval;
    if (gameStarted && !gameOver && isMountedRef.current) {
      wordInterval = setInterval(
        () => {
          setItems((prevItems) => {
            if (level === "Easy" && prevItems.length >= 3) return prevItems;
            return [
              ...prevItems,
              {
                id: Date.now() + Math.random(), // Add unique ID
                x: Math.random() * (width - 100),
                y: 0,
                speed: getSpeed(),
                word: WORDS[Math.floor(Math.random() * WORDS.length)],
                color:
                  COLORS.wordColors[
                    Math.floor(Math.random() * COLORS.wordColors.length)
                  ],
              },
            ];
          });
        },
        level === "Easy" ? 1500 : level === "Medium" ? 1000 : 700
      );
      intervalRefs.current.push(wordInterval);
    }
    return () => {
      if (wordInterval) clearInterval(wordInterval);
    };
  }, [level, gameStarted, gameOver, getSpeed]);

  // Combined game loop with collision detection
  useEffect(() => {
    let gameLoopInterval;
    if (gameStarted && !gameOver && isMountedRef.current) {
      gameLoopInterval = setInterval(() => {
        setItems((prevItems) => {
          const updatedItems = [];
          
          prevItems.forEach((item) => {
            const newY = item.y + item.speed;
            const currentBasketX = basketXRef.current;
            
            // Check if caught
            if (
              newY + 40 >= height - 150 &&
              newY <= height - 120 &&
              item.x + 50 >= currentBasketX &&
              item.x <= currentBasketX + 120
            ) {
              // Caught!
              const playCatchSound = async () => {
                if (catchSoundRef.current) {
                  await catchSoundRef.current.replayAsync();
                }
              };
              playCatchSound();

              setScore((prevScore) => Math.floor(prevScore + multiplier));
              animateBasketShake();
              setMultiplier((prev) => Math.min(prev + 0.1, 4));
              // Don't add to updatedItems (remove it)
            }
            // Check if missed
            else if (newY >= height) {
              const playMissSound = async () => {
                if (missSoundRef.current) {
                  await missSoundRef.current.replayAsync();
                }
              };
              playMissSound();

              setMultiplier(1);
              // Don't add to updatedItems (remove it)
            }
            // Still falling
            else {
              updatedItems.push({ ...item, y: newY });
            }
          });
          
          return updatedItems;
        });
      }, 50);
      intervalRefs.current.push(gameLoopInterval);
    }
    return () => {
      if (gameLoopInterval) clearInterval(gameLoopInterval);
    };
  }, [gameStarted, gameOver, multiplier]);

  useEffect(() => {
    if (score >= 0 && score <= 25) setLevel("Easy");
    else if (score >= 26 && score <= 75) setLevel("Medium");
    else if (score >= 125) setLevel("Hard");
  }, [score]);

  useEffect(() => {
    return () => {
      intervalRefs.current.forEach(clearInterval);
      intervalRefs.current = [];
    };
  }, []);

  const animateBasketShake = useCallback(() => {
    Animated.sequence([
      Animated.timing(shakeBasket, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeBasket, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeBasket, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  }, [shakeBasket]);

  const saveHighScore = useCallback(
    async (finalScore, remainingTime) => {
      try {
        if (playerName.trim() === "") {
          Alert.alert(
            "Please enter a name",
            "You must enter a name to save your score"
          );
          return false;
        }

        const newScore = {
          name: playerName.trim(),
          score: Math.floor(finalScore),
          time: 120 - remainingTime,
          timestamp: new Date().toISOString(),
        };

        const updatedScores = [...highScores, newScore]
          .sort((a, b) => b.score - a.score || a.time - b.time)
          .slice(0, 10);

        await AsyncStorage.setItem("highScores", JSON.stringify(updatedScores));
        setHighScores(updatedScores);
        return true;
      } catch (error) {
        console.error("Failed to save high score", error);
        Alert.alert("Error", "Could not save high score");
        return false;
      }
    },
    [highScores, playerName]
  );

  const handleSaveScore = async () => {
    const saved = await saveHighScore(score, timeLeft);
    if (saved) {
      setShowNameInput(false);
      setShowScoreboard(true);
    }
  };

  const resetGame = useCallback(() => {
    setScore(0);
    setItems([]);
    setBasketX(width / 2 - 60);
    setGameStarted(false);
    setGameOver(false);
    setTimeLeft(120);
    setMultiplier(1);
    setShowScoreboard(false);
    setPlayerName("");
    setShowNameInput(false);
    setLevel("Easy");
  }, []);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (_, gestureState) => {
          setBasketX(
            Math.max(0, Math.min(width - 120, gestureState.moveX - 60))
          );
        },
      }),
    []
  );

  const renderNameInput = () => {
    return (
      <View style={styles.nameInputContainer}>
        <Text style={styles.nameInputTitle}>Game Over!</Text>
        <Text style={styles.nameInputScore}>
          Your Score: {Math.floor(score)}
        </Text>
        <TextInput
          style={styles.nameInput}
          placeholder="Enter Your Name"
          placeholderTextColor="rgba(255,255,255,0.5)"
          value={playerName}
          onChangeText={setPlayerName}
          maxLength={12}
        />
        <TouchableOpacity
          style={styles.saveNameButton}
          onPress={handleSaveScore}
        >
          <Text style={styles.saveNameButtonText}>Save Score</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderScoreboard = useCallback(() => {
    return (
      <View style={styles.scoreboardContainer}>
        <View style={styles.scoreboardHeader}>
          <Text style={styles.scoreboardTitle}>All High Scores</Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          style={styles.scrollViewStyle}
          showsVerticalScrollIndicator={true}
          nestedScrollEnabled={true}
        >
          {highScores.length === 0 ? (
            <Text style={styles.noScoresText}>No high scores yet!</Text>
          ) : (
            highScores.map((s, i) => (
              <View
                key={`${s.timestamp}-${i}`}
                style={styles.scoreEntryContainer}
              >
                <View style={styles.scoreEntryLeft}>
                  <Text style={styles.scoreboardEntry}>
                    {i + 1}. {s.name}
                  </Text>
                </View>
                <View style={styles.scoreEntryRight}>
                  <Text style={styles.scoreboardEntryDetails}>
                    {s.score} pts
                  </Text>
                </View>
              </View>
            ))
          )}
        </ScrollView>

        <TouchableOpacity style={styles.newGameButton} onPress={resetGame}>
          <Text style={styles.newGameButtonText}>New Game</Text>
        </TouchableOpacity>
      </View>
    );
  }, [highScores, resetGame]);

  const renderHeader = useCallback(() => {
    return (
      <View style={styles.header}>
        <View style={styles.headerColumn}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.scoreText}>Score: {Math.floor(score)}</Text>
          <Text style={styles.multiplierText}>
            Multiplier: {multiplier.toFixed(1)}x
          </Text>
        </View>
        <View style={styles.headerColumn}>
          <Text style={styles.timeText}>Time: {timeLeft}s</Text>
          <Text style={[styles.levelText, { color: levelColors[level] }]}>
            Level: {level}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.trophyIcon}
          onPress={() => setShowScoreboard(true)}
        >
          <MaterialIcons name="leaderboard" size={30} color="white" />
        </TouchableOpacity>
      </View>
    );
  }, [score, multiplier, timeLeft, level, levelColors, navigation]);

  return (
    <ImageBackground
      source={{
        uri: "https://mfiles.alphacoders.com/950/thumb-1920-950249.jpg",
      }}
      style={styles.container}
      resizeMode="cover"
    >
      <LinearGradient
        colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.3)"]}
        style={styles.container}
      >
        {showNameInput ? (
          renderNameInput()
        ) : showScoreboard ? (
          renderScoreboard()
        ) : (
          <>
            {renderHeader()}

            {!gameStarted ? (
              <TouchableOpacity
                style={styles.startButton}
                onPress={() => {
                  setGameStarted(true);
                  setShowHint(true);
                  setTimeout(() => setShowHint(false), 2000);
                }}
              >
                <Text style={styles.startButtonText}>Start Game</Text>
              </TouchableOpacity>
            ) : (
              <>
                <View style={styles.gameArea}>
                  {!gameOver &&
                    items.map((item) => (
                      <View
                        key={item.id}
                        style={{
                          position: "absolute",
                          top: item.y,
                          left: item.x,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: "bold",
                            color: item.color,
                          }}
                        >
                          {item.word}
                        </Text>
                      </View>
                    ))}
                </View>

                <Animated.Image
                  source={require("../../../assets/images/basket.png")}
                  style={[
                    styles.basket,
                    {
                      left: basketX,
                      transform: [
                        {
                          translateX: shakeBasket,
                        },
                      ],
                    },
                  ]}
                  {...panResponder.panHandlers}
                />

                {showHint && (
                  <Text style={styles.hintText}>
                    Hold the cat and Slide the basket to catch the words!
                  </Text>
                )}
              </>
            )}
          </>
        )}
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  header: {
    position: "absolute",
    top: 20,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    zIndex: 10,
  },
  headerColumn: {
    alignItems: "center",
  },
  backButton: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
  scoreText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  timeText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "yellow",
  },
  multiplierText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "pink",
  },
  levelText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  gameArea: {
    position: "absolute",
    top: 0,
    left: 0,
    width: width,
    height: height,
  },
  startButton: {
    padding: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "white",
  },
  startButtonText: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
  },
  basket: {
    position: "absolute",
    bottom: 50,
    width: 120,
    height: 150,
    resizeMode: "contain",
    zIndex: 5,
  },
  hintText: {
    position: "absolute",
    top: height / 2,
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 10,
    borderRadius: 5,
  },
  scoreboardContainer: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  scoreboardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  scoreboardTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  scrollViewStyle: {
    maxHeight: 300,
    width: "100%",
  },
  scoreEntryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    width: "100%",
  },
  scoreEntryLeft: {
    flex: 2,
  },
  scoreEntryRight: {
    flex: 1,
    alignItems: "flex-end",
  },
  scoreboardEntry: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
  scoreboardEntryDetails: {
    fontSize: 16,
    color: "rgba(255,255,255,0.7)",
  },
  noScoresText: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
    marginTop: 20,
  },
  newGameButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "white",
    alignItems: "center",
  },
  newGameButtonText: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
  },
  trophyIcon: {
    justifyContent: "center",
    alignItems: "center",
  },
  nameInputContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    width: "100%",
  },
  nameInputTitle: {
    fontSize: 24,
    color: "white",
    fontWeight: "bold",
    marginBottom: 10,
  },
  nameInputScore: {
    fontSize: 20,
    color: "white",
    marginBottom: 20,
  },
  nameInput: {
    width: "80%",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 10,
    padding: 15,
    fontSize: 18,
    color: "white",
    textAlign: "center",
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "white",
  },
  saveNameButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  saveNameButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Fallinggame;