export type RecommendationStatus = "pending" | "approved" | "rejected";

export interface Recommendation {
  id: string;
  name: string;
  affiliation: string;
  message: string;
  status: RecommendationStatus;
  created_at: string;
}
