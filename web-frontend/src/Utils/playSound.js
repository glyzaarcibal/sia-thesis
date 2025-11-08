export const playAudio = (filePath) => {
  const audio = new Audio(filePath);
  setTimeout(() => {
    audio
      .play()
      .catch((error) => console.error("Audio playback error:", error));
  }, 200);
};
