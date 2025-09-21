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

export interface ScanHistory {
  id: string;
  user_id: string;
  image_url: string;
  disease_name: string;
  confidence: number;
  organic_suggestion: any;
  chemical_suggestion: any;
  causes: string[];
  scan_date: string;
  created_at: string;
}

export interface TreatmentReminder {
  id: string;
  user_id: string;
  scan_id: string;
  treatment_name: string;
  reminder_date: string;
  is_completed: boolean;
  notes?: string;
  created_at: string;
}

export interface ShoppingItem {
  id: string;
  user_id: string;
  item_name: string;
  item_type: 'organic' | 'chemical';
  quantity?: string | null;
  is_purchased: boolean;
  supplier_name?: string | null;
  supplier_contact?: string | null;
  estimated_price?: number | null;
  notes?: string | null;
  created_at: string;
}

export interface FAQ {
  id: string;
  question_en: string;
  question_te: string;
  answer_en: string;
  answer_te: string;
  category: string;
  is_active: boolean;
  created_at: string;
}