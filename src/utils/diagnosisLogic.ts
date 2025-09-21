import { Diagnosis } from '@/types';

// Simple deterministic diagnosis logic for demo
export const analyzeCropImage = (imageFile: File): Promise<Diagnosis> => {
  return new Promise((resolve) => {
    // Simulate processing time
    setTimeout(() => {
      // Simple logic based on filename or random selection for demo
      const fileName = imageFile.name.toLowerCase();
      let disease = 'unknown';
      
      if (fileName.includes('yellow') || fileName.includes('rust')) {
        disease = 'rust';
      } else if (fileName.includes('brown') || fileName.includes('blight')) {
        disease = 'blight';
      } else if (fileName.includes('white') || fileName.includes('mildew')) {
        disease = 'mildew';
      } else {
        // Random selection for demo
        const diseases = ['rust', 'blight', 'mildew'];
        disease = diseases[Math.floor(Math.random() * diseases.length)];
      }

      const diagnoses = {
        rust: {
          disease: 'rust',
          confidence: 85,
          organicSuggestion: {
            name: 'Sulphur Dust',
            howToUse: 'Apply during early morning or evening. Dust leaves lightly.',
            safety: 'Wear mask when applying. Safe for humans and pets.'
          },
          chemicalSuggestion: {
            name: 'Systemic Fungicide',
            howToUse: 'Mix 2ml per liter water. Spray every 10-14 days.',
            safety: 'Wear protective gear. Keep away from children.'
          },
          causes: ['Humid weather', 'Poor air circulation', 'Overhead watering']
        },
        blight: {
          disease: 'blight',
          confidence: 78,
          organicSuggestion: {
            name: 'Neem Oil Spray',
            howToUse: 'Mix 5ml neem oil per liter water. Spray in evening.',
            safety: 'Natural and safe. Avoid during flowering.'
          },
          chemicalSuggestion: {
            name: 'Copper Fungicide',
            howToUse: 'Mix as per label instructions. Apply weekly.',
            safety: 'Avoid inhalation. Wash hands after use.'
          },
          causes: ['Rainy season', 'Poor soil drainage', 'Nearby infected plants']
        },
        mildew: {
          disease: 'mildew',
          confidence: 72,
          organicSuggestion: {
            name: 'Baking Soda Spray',
            howToUse: '1 tsp per liter water + few drops dish soap.',
            safety: 'Completely safe. Test on small area first.'
          },
          chemicalSuggestion: {
            name: 'Potassium Bicarbonate',
            howToUse: 'Follow package directions. Apply in cool weather.',
            safety: 'Less toxic than traditional fungicides.'
          },
          causes: ['High humidity', 'Poor ventilation', 'Overcrowded plants']
        }
      };

      resolve(diagnoses[disease as keyof typeof diagnoses] || diagnoses.blight);
    }, 2000);
  });
};

export const speakText = (text: string, language: 'telugu' | 'english') => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'telugu' ? 'te-IN' : 'en-IN';
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
  }
};