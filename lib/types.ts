export type RecommendationStatus = "pending" | "approved" | "rejected";

export interface Recommendation {
  id: string;
  user_id: string;
  name: string;
  avatar_url: string | null;
  message: string;
  status: RecommendationStatus;
  created_at: string;
}
