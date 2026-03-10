export interface Answer {
  text: string;
  score: number;
}

export interface ScoreRange {
  id: number;
  label: string;
  minScore: number;
  maxScore: number;
  feedbackText: string;
}

export interface Scale {
  name: string;
  ranges: ScoreRange[];
}

export interface Question {
  id: number;
  text: string;
  scale: string;
  options: Answer[];
}
