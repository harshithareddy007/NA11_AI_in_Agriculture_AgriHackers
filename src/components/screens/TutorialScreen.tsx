import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Volume2 } from 'lucide-react';
import { Mascot } from '@/components/Mascot';
import { useLanguage } from '@/components/LanguageProvider';
import { getTranslation } from '@/utils/translations';

interface TutorialScreenProps {
  onComplete: () => void;
}

export const TutorialScreen: React.FC<TutorialScreenProps> = ({ onComplete }) => {
  const { language } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      icon: <Camera className="w-16 h-16 text-primary" />,
      title: getTranslation('tutorialStep1', language),
      description: language === 'telugu' 
        ? 'మీ పంట ఆకు లేదా కాడ యొక్క స్పష్టమైన ఫోటో తీయండి'
        : 'Take a clear photo of your crop leaf or stem'
    },
    {
      icon: <Volume2 className="w-16 h-16 text-accent" />,
      title: getTranslation('tutorialStep2', language),
      description: language === 'telugu'
        ? 'రోగ నిర్ధారణ మరియు చికిత్స సూచనలను వినండి'
        : 'Listen to disease diagnosis and treatment suggestions'
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="text-center space-y-8 max-w-md w-full gentle-fade-in">
        <div className="flex justify-center mb-6">
          <Mascot mood="thinking" size="lg" />
        </div>

        {/* Progress indicator */}
        <div className="flex justify-center space-x-2 mb-8">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                index === currentStep ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        <div className="space-y-6">
          <div className="flex justify-center">
            {steps[currentStep].icon}
          </div>
          
          <h2 className="text-2xl font-bold text-foreground">
            {steps[currentStep].title}
          </h2>
          
          <p className="text-lg text-muted-foreground leading-relaxed">
            {steps[currentStep].description}
          </p>
        </div>

        <div className="flex space-x-4 w-full">
          <Button
            variant="outline"
            onClick={handleSkip}
            className="flex-1 rounded-xl"
          >
            {getTranslation('skip', language)}
          </Button>
          
          <Button
            onClick={handleNext}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
          >
            {currentStep === steps.length - 1 
              ? getTranslation('getStarted', language)
              : getTranslation('next', language)
            }
          </Button>
        </div>
      </div>
    </div>
  );
};