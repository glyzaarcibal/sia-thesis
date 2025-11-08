import { useState, useEffect } from "react";
import { Audio } from "expo-av";
import { useSelector } from "react-redux";

const useAudioPlayer = () => {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playSound = async (audioFile) => {
    try {
      if (sound) {
        await sound.unloadAsync(); // Unload previous sound if any
      }

      const { sound: newSound } = await Audio.Sound.createAsync(audioFile);
      setSound(newSound);
      await newSound.playAsync();
      setIsPlaying(true);

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setIsPlaying(false);
        }
      });
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  const stopSound = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  return { playSound, stopSound, isPlaying };
};

export default useAudioPlayer;
