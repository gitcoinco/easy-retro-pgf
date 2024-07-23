export function snakeToTitleCase(str = ""): string {
  // Split the snake_case string by underscores
  const words = str.split("_");

  // Check for a time-related suffix
  const timeRegex = /^(\d+_months|\d+_days|\d+_weeks|\d+_years)$/;

  // Capitalize the first letter of each word and convert the rest to lowercase
  const titleCaseWords = words.map((word, index) => {
    if (
      index === words.length - 1 &&
      timeRegex.test(words.slice(-2).join("_"))
    ) {
      // Wrap the last two words in parentheses if they match the time pattern
      const timePart = words.slice(-2).join("_");
      return "(" + timePart.replace(/_/g, " ") + ")";
    }
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });

  // Join the words with spaces and remove any duplicate parentheses
  return titleCaseWords.slice(0, -2).join(" ") + " " + titleCaseWords.slice(-1);
}
