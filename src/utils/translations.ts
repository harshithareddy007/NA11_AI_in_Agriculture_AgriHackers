import { Translation, Language } from '@/types';

export const translations = {
  welcome: {
    telugu: 'స్వాగతం — వ్యవసాయ సూచకుడికి',
    english: 'Welcome — Farmer\'s Crop Doctor'
  },
  languageChoice: {
    telugu: 'భాష ఎంచుకోండి',
    english: 'Choose Language'
  },
  tutorialStep1: {
    telugu: '1) ఫోటో తీసుకోండి',
    english: '1) Take a photo'
  },
  tutorialStep2: {
    telugu: '2) ఫలితాలు వినండి',
    english: '2) Listen to results'
  },
  capturePhoto: {
    telugu: 'ఫోటో తీసుకోండి',
    english: 'Capture Photo'
  },
  analyzing: {
    telugu: 'పరిశీలిస్తున్నాం… కింది విధంగా వేచి ఉండండి',
    english: 'Analyzing… please wait a moment'
  },
  diagnosis: {
    telugu: 'రోగ నిర్ధారణ',
    english: 'Diagnosis'
  },
  organic: {
    telugu: 'సేంద్రీయ',
    english: 'Organic'
  },
  chemical: {
    telugu: 'రసాయన',
    english: 'Chemical'
  },
  listen: {
    telugu: 'ఆవాజు వినండి',
    english: 'Listen'
  },
  causes: {
    telugu: 'సాధ్య కారణాలు:',
    english: 'Likely causes:'
  },
  askQuestion: {
    telugu: 'ప్రశ్న అడగండి — నేను సహాయం చేస్తాను',
    english: 'Ask a question — I\'ll help'
  },
  skip: {
    telugu: 'దాటవేయండి',
    english: 'Skip'
  },
  next: {
    telugu: 'తర్వాత',
    english: 'Next'
  },
  getStarted: {
    telugu: 'మొదలుపెట్టండి',
    english: 'Get Started'
  },
  gallery: {
    telugu: 'గ్యాలరీ',
    english: 'Gallery'
  },
  camera: {
    telugu: 'కేమెరా',
    english: 'Camera'
  },
  retake: {
    telugu: 'మళ్లీ తీయండి',
    english: 'Retake'
  },
  analyze: {
    telugu: 'విశ్లేషించండి',
    english: 'Analyze'
  }
};

export const getTranslation = (key: keyof typeof translations, language: Language): string => {
  return translations[key][language];
};

export const diseaseTranslations = {
  blight: { telugu: 'బ్లైట్', english: 'Blight' },
  rust: { telugu: 'తుప్పు', english: 'Rust' },
  mildew: { telugu: 'మిల్డ్యూ', english: 'Mildew' },
  unknown: { telugu: 'తెలియని రోగం', english: 'Unknown Disease' }
};