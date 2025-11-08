import { useEffect } from "react";
import { playAudio } from "../utils/audioUtils";

const AudioPlayer = ({ audioSrc }) => {
  useEffect(() => {
    playAudio(audioSrc);
  }, [audioSrc]);

  return null;
};

export default AudioPlayer;
