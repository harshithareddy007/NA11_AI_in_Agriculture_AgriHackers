import React, { useState } from 'react';
import { LanguageProvider } from '@/components/LanguageProvider';
import { WelcomeScreen } from '@/components/screens/WelcomeScreen';
import { TutorialScreen } from '@/components/screens/TutorialScreen';
import { MainScreen } from '@/components/screens/MainScreen';
import { ProcessingScreen } from '@/components/screens/ProcessingScreen';
import { ResultScreen } from '@/components/screens/ResultScreen';
import { CropImage, Diagnosis } from '@/types';
import { analyzeCropImage } from '@/utils/diagnosisLogic';
import { useToast } from '@/hooks/use-toast';

type AppState = 'welcome' | 'tutorial' | 'main' | 'processing' | 'result';

const Index = () => {
  const [currentState, setCurrentState] = useState<AppState>('welcome');
  const [currentImage, setCurrentImage] = useState<CropImage | null>(null);
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);
  const { toast } = useToast();

  const handleLanguageSelected = () => {
    setCurrentState('tutorial');
  };

  const handleTutorialComplete = () => {
    setCurrentState('main');
  };

  const handleImageCaptured = async (image: CropImage) => {
    setCurrentImage(image);
    setCurrentState('processing');
    
    try {
      const result = await analyzeCropImage(image.file);
      setDiagnosis(result);
      setCurrentState('result');
      
      toast({
        title: "Analysis Complete!",
        description: "Your crop has been analyzed successfully.",
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Please try again with a clearer image.",
        variant: "destructive",
      });
      setCurrentState('main');
    }
  };

  const handleRetake = () => {
    setCurrentImage(null);
    setDiagnosis(null);
    setCurrentState('main');
  };

  const handleSettingsClick = () => {
    toast({
      title: "Settings",
      description: "Settings panel coming soon!",
    });
  };

  const handleChatClick = () => {
    toast({
      title: "FAQ Chat",
      description: "Chat feature coming soon!",
    });
  };

  const renderCurrentScreen = () => {
    switch (currentState) {
      case 'welcome':
        return <WelcomeScreen onLanguageSelected={handleLanguageSelected} />;
      case 'tutorial':
        return <TutorialScreen onComplete={handleTutorialComplete} />;
      case 'main':
        return (
          <MainScreen
            onImageCaptured={handleImageCaptured}
            onSettingsClick={handleSettingsClick}
            onChatClick={handleChatClick}
          />
        );
      case 'processing':
        return <ProcessingScreen />;
      case 'result':
        return diagnosis && currentImage ? (
          <ResultScreen
            diagnosis={diagnosis}
            imageUrl={currentImage.url}
            onRetake={handleRetake}
          />
        ) : (
          <MainScreen
            onImageCaptured={handleImageCaptured}
            onSettingsClick={handleSettingsClick}
            onChatClick={handleChatClick}
          />
        );
      default:
        return <WelcomeScreen onLanguageSelected={handleLanguageSelected} />;
    }
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen">
        {renderCurrentScreen()}
      </div>
    </LanguageProvider>
  );
};

export default Index;
