import { Dimensions, PixelRatio, Platform } from "react-native";

// Get the screen width
const screenWidth = Dimensions.get("window").width;

// Base width to scale from (assuming design is based on iPhone 8 width - 375px)
const baseWidth = 375;

// Base font size (similar to browser's default 16px)
const baseFontSize = 16;

/**
 * Converts size to rem-like units
 * @param {number} size - Size in pixels based on design
 * @returns {number} - Converted size in pixels
 */
export const rem = (size) => {
  // Convert size relative to base font size (like rem)
  const remSize = size / baseFontSize;

  // Scale based on screen width
  const scaledSize = (screenWidth / baseWidth) * (remSize * baseFontSize);

  // Round to nearest pixel
  return PixelRatio.roundToNearestPixel(scaledSize);
};

/**
 * Converts size to em-like units based on parent size
 * @param {number} size - Size in pixels based on design
 * @param {number} parentSize - Parent element's font size in pixels
 * @returns {number} - Converted size in pixels
 */
export const em = (size, parentSize) => {
  // Convert size relative to parent size (like em)
  const emSize = size / parentSize;

  // Scale based on screen width
  const scaledSize = (screenWidth / baseWidth) * (emSize * parentSize);

  // Round to nearest pixel
  return PixelRatio.roundToNearestPixel(scaledSize);
};

/**
 * Responsive scale function for other measurements (padding, margin, etc.)
 * @param {number} size - Size in pixels based on design
 * @returns {number} - Converted size in pixels
 */
export const responsiveScale = (size) => {
  const scale = screenWidth / baseWidth;
  return PixelRatio.roundToNearestPixel(size * scale);
};

// Example usage:
const styles = {
  container: {
    padding: responsiveScale(20),
    margin: responsiveScale(10),
  },
  title: {
    fontSize: rem(24), // 1.5rem equivalent
    lineHeight: rem(32),
  },
  subtitle: {
    fontSize: em(16, 24), // 0.667em relative to title
    marginTop: em(8, 24),
  },
};

export default {
  rem,
  em,
  responsiveScale,
  baseFontSize,
};
