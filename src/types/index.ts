export type Language = 'telugu' | 'english';

export interface Diagnosis {
  disease: string;
  confidence: number;
  organicSuggestion: {
    name: string;
    howToUse: string;
    safety: string;
  };
  chemicalSuggestion: {
    name: string;
    howToUse: string;
    safety: string;
  };
  causes: string[];
}

export interface Translation {
  telugu: string;
  english: string;
}

export interface CropImage {
  file: File;
  url: string;
  timestamp: number;
}