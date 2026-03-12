// Shared types used across the Allowance Buddy mobile app.
// These are used by both frontend screens and backend services.

/** A screen name used for navigation */
export type ScreenName = "ChildHome" | "ParentDashboard" | "Rewards";

/** A child's profile information */
export type ChildProfile = {
  id: string;
  name: string;
  avatarUrl?: string;
  balance: number;       // current spending balance in dollars
  savingsBalance: number; // money moved to savings
  streakDays: number;     // consecutive days of completed goals
};

/** A reward that can be unlocked by spending allowance */
export type Reward = {
  id: string;
  name: string;
  description?: string;
  cost: number;       // cost in dollars
  unlocked: boolean;
};

/** A log entry for a child's activity (chore, reading, etc.) */
export type ActivityLog = {
  id: string;
  childId: string;
  activity: string;
  timestamp: string;   // ISO date string
  status: "Pending" | "Approved" | "Needs Review";
  earnedAmount?: number; // dollars earned for this activity
};
