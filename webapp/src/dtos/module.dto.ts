export interface KeuzeModule {
  id: number;
  name: string;
  description: string;
  shortdescription: string;
  content: string;
  location: string;
  studycredit: number;
  level: string;
  learningoutcomes: string;
}

export interface KeuzeModuleAI {
  id: number;
  name: string;
  level: string;
  location: string;
  estimated_difficulty: number;
  content_score: number;
  popularity_score: number;
  hybrid_score: number;
  reason_text: string;
}

export interface RecommendationInput {
  studentInput: string;
}

export interface SaveRecommendation {
  id: number;
  name: string;
  location: string;
  level: string;
  hybrid_score: number;
  reason_text: string;
  popularity_score: number;
  content_score: number;
  estimated_difficulty: number;
}
