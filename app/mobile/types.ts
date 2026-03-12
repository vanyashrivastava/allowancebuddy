// Shared types for simple mobile wireframes.

export type ScreenName = "ChildHome" | "ParentDashboard" | "Rewards";

export type RewardItem = {
  id: string;
  name: string;
  cost: number;
  unlocked: boolean;
};

export type ActivityLog = {
  id: string;
  activity: string;
  timestamp: string;
  status: "Pending" | "Approved" | "Needs Review";
};
