export function createValidationEntry(
  arr,
  {
    title,
    text,
    level = "info", // info | warning | error
    emoji,
    pic,
    result,
    rows,
    headers,
    message,
    ...rest // 🔥 fångar upp ALLT annat (t.ex. simpleTable)
  }
) {
  if (!text) return;

  const levelEmojiMap = {
    warning: "🚨",
    expired: "🔔",
    info: ""
  };

  arr.push({
    title: title?.trim?.() || "",
    text: text?.trim?.() || "",
    level,
    emoji: emoji ?? levelEmojiMap[level],
    pic,
    result,
    rows,
    headers,
    message,
    ...rest // 🔥 skickar vidare allt extra
  });
}