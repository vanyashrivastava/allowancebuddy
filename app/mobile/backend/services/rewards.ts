// Placeholder service functions for rewards and allowance data.
// These return mock data for now. Replace the bodies with real
// Supabase queries when the database is set up.

import type { Reward, ActivityLog, ChildProfile } from "../types";

// ── Mock Data ──────────────────────────────────────────────────────

const MOCK_REWARDS: Reward[] = [
  { id: "1", name: "Dog Tail Wag", description: "Your buddy wags their tail!", cost: 2, unlocked: true },
  { id: "2", name: "New Dog Trick", description: "Teach your buddy a new trick", cost: 4, unlocked: false },
  { id: "3", name: "Extra Weekend Treat", description: "A special weekend surprise", cost: 5, unlocked: false },
  { id: "4", name: "Small Toy", description: "Pick a small toy reward", cost: 12, unlocked: false },
  { id: "5", name: "Bonus Allowance", description: "Extra $2 added to balance", cost: 8, unlocked: true },
];

const MOCK_CHILD: ChildProfile = {
  id: "child-1",
  name: "Explorer",
  balance: 12.5,
  savingsBalance: 3.0,
  streakDays: 5,
};

const MOCK_ACTIVITIES: ActivityLog[] = [
  { id: "a1", childId: "child-1", activity: "Made bed", timestamp: "2026-03-12T07:45:00Z", status: "Pending", earnedAmount: 0.5 },
  { id: "a2", childId: "child-1", activity: "Reading session", timestamp: "2026-03-12T16:20:00Z", status: "Approved", earnedAmount: 1.0 },
  { id: "a3", childId: "child-1", activity: "Toy cleanup", timestamp: "2026-03-12T17:10:00Z", status: "Needs Review" },
];

// ── Service Functions ──────────────────────────────────────────────

/** Fetch all available rewards */
export async function getRewards(): Promise<Reward[]> {
  // TODO: Replace with Supabase query:
  // const { data } = await supabase.from("rewards").select("*");
  return MOCK_REWARDS;
}

/** Fetch the current child's balance info */
export async function getChildBalance(): Promise<ChildProfile> {
  // TODO: Replace with Supabase query:
  // const { data } = await supabase.from("children").select("*").eq("id", childId).single();
  return MOCK_CHILD;
}

/** Fetch recent activity log entries */
export async function getRecentActivities(): Promise<ActivityLog[]> {
  // TODO: Replace with Supabase query:
  // const { data } = await supabase.from("activity_logs").select("*").order("timestamp", { ascending: false }).limit(10);
  return MOCK_ACTIVITIES;
}
