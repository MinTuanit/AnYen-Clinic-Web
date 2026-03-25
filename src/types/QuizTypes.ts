export interface Answer {
  text: string;
  score: number | string;
}

export interface ScoreRange {
  id: number;
  label: string;
  minScore: number | string;
  maxScore: number | string;
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
