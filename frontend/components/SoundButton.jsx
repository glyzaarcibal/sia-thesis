import React from "react";
import useAudioPlayer from "../hooks/useAudioPlayer";

import tapAudio from "../assets/audio/tap2.mp3";
import ding from "../assets/audio/ding.mp3";
import page from "../assets/audio/page.mp3";
import { Button } from "react-native-paper";

const SoundButton = ({ children, onPress, className, mode, type = "tap" }) => {
  const { playSound } = useAudioPlayer();

  const handleTap = () => {
    if (type === "tap") {
      playSound(tapAudio);
    } else if (type === "ding") {
      playSound(ding);
    } else if (type === "page") {
      playSound(page);
    }

    setTimeout(() => {
      onPress();
    }, 100);
  };

  return (
    <Button className={className} mode={mode} onPress={() => handleTap()}>
      {children}
    </Button>
  );
};

export default SoundButton;
