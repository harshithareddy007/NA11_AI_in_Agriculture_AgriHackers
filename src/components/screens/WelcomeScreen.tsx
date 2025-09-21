import React from 'react';
import { LanguageButton } from '@/components/ui/button-variants';
import { Mascot } from '@/components/Mascot';
import { useLanguage } from '@/components/LanguageProvider';
import { Language } from '@/types';
import { getTranslation } from '@/utils/translations';

interface WelcomeScreenProps {
  onLanguageSelected: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onLanguageSelected }) => {
  const { language, setLanguage } = useLanguage();

  const handleLanguageSelect = (selectedLanguage: Language) => {
    setLanguage(selectedLanguage);
    setTimeout(onLanguageSelected, 300); // Small delay for animation
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="text-center space-y-8 max-w-md w-full gentle-fade-in">
        <div className="flex justify-center mb-6">
          <Mascot mood="happy" size="lg" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-foreground leading-tight">
            {getTranslation('welcome', language)}
          </h1>
          <p className="text-lg text-muted-foreground">
            {getTranslation('languageChoice', language)}
          </p>
        </div>

        <div className="space-y-4 w-full">
          <LanguageButton
            onClick={() => handleLanguageSelect('telugu')}
            isSelected={language === 'telugu'}
            className="w-full"
          >
            <div className="flex items-center justify-center space-x-3">
              <span className="text-2xl">🇮🇳</span>
              <span>తెలుగు</span>
            </div>
          </LanguageButton>

          <LanguageButton
            onClick={() => handleLanguageSelect('english')}
            isSelected={language === 'english'}
            className="w-full"
          >
            <div className="flex items-center justify-center space-x-3">
              <span className="text-2xl">🇺🇸</span>
              <span>English</span>
            </div>
          </LanguageButton>
        </div>

        <p className="text-sm text-muted-foreground">
          Choose your preferred language • భాష ఎంచుకోండి
        </p>
      </div>
    </div>
  );
};