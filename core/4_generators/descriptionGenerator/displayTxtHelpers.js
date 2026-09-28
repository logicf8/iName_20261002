import { emojiThemes } from "./helpers/emojiThemes.js";

let currentEmojiTheme = "default";

export function setEmojiTheme(themeName) {
  currentEmojiTheme = themeName;
}

export function addDisplayTxt(
  arr,
  {
    text,
    level = "info",
    emoji,
    message
  }
) {
  if (!text) return;

  const levelEmojiMap = emojiThemes[currentEmojiTheme];

  arr.push({
    text: text.trim(),
    level,
    emoji: emoji ?? levelEmojiMap[level],
    message
  });
}