// Kid-friendly color palette for Allowance Buddy.
// Soft greens, blues, and warm accents that feel playful but readable.

const colors = {
  // Primary — nature-inspired green
  primary: "#245B4B",
  primaryLight: "#D9F4E7",
  primaryBorder: "#BDE8D5",
  primaryBg: "#F6FBF4",

  // Secondary — calm blue (used on parent screens)
  secondary: "#243547",
  secondaryLight: "#EAF1F8",
  secondaryBorder: "#D7E5F2",
  secondaryBg: "#F9FAFB",

  // Accent — warm gold (used on rewards)
  accent: "#5A4A1A",
  accentLight: "#FFFDF6",
  accentBorder: "#E3DDC5",

  // Status
  success: "#1F7A4E",
  warning: "#B8860B",
  muted: "#6B7280",

  // Neutrals
  white: "#FFFFFF",
  background: "#F6FBF4",
  border: "#E5E7EB",
  textDark: "#1F2937",
  textMedium: "#4B5563",
  textLight: "#9CA3AF",

  // Tab bar
  tabBarBg: "#EEF3F8",
  tabBarBorder: "#D8E1EA",
  tabActive: "#D5E8FF",
  tabActiveBorder: "#9CC4F3",
  tabText: "#35506B",
  tabActiveText: "#153D66",
} as const;

export default colors;
