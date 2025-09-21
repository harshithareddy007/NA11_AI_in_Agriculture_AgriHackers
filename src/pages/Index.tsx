import React, { useState } from 'react';
import { LanguageProvider } from '@/components/LanguageProvider';
import { WelcomeScreen } from '@/components/screens/WelcomeScreen';
import { TutorialScreen } from '@/components/screens/TutorialScreen';
import { MainScreen } from '@/components/screens/MainScreen';
import { ProcessingScreen } from '@/components/screens/ProcessingScreen';
import { ResultScreen } from '@/components/screens/ResultScreen';
import { HistoryScreen } from '@/components/screens/HistoryScreen';
import { RemindersScreen } from '@/components/screens/RemindersScreen';
import { ShoppingScreen } from '@/components/screens/ShoppingScreen';
import { ChatbotScreen } from '@/components/screens/ChatbotScreen';
import { CropImage, Diagnosis, ScanHistory } from '@/types';
import { analyzeCropImage } from '@/utils/diagnosisLogic';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

type AppState = 'welcome' | 'tutorial' | 'main' | 'processing' | 'result' | 'history' | 'reminders' | 'shopping' | 'chatbot';

const Index = () => {
  const [currentState, setCurrentState] = useState<AppState>('welcome');
  const [currentImage, setCurrentImage] = useState<CropImage | null>(null);
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);
  const [selectedScan, setSelectedScan] = useState<ScanHistory | null>(null);
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
      
      // Save to scan history (if user is logged in)
      try {
        const { error } = await supabase
          .from('scan_history')
          .insert({
            user_id: 'anonymous', // For demo purposes, use 'anonymous'
            image_url: image.url,
            disease_name: result.disease,
            confidence: result.confidence,
            organic_suggestion: result.organicSuggestion,
            chemical_suggestion: result.chemicalSuggestion,
            causes: result.causes
          });
        
        if (error) console.log('Note: Scan not saved to history (user not logged in)');
      } catch (e) {
        // Silently fail for demo mode
      }
      
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
    setCurrentState('chatbot');
  };

  const handleHistoryClick = () => {
    setCurrentState('history');
  };

  const handleRemindersClick = () => {
    setCurrentState('reminders');
  };

  const handleShoppingClick = () => {
    setCurrentState('shopping');
  };

  const handleViewScan = (scan: ScanHistory) => {
    setSelectedScan(scan);
    // Convert scan history to diagnosis format
    const diagnosisFromHistory: Diagnosis = {
      disease: scan.disease_name,
      confidence: scan.confidence,
      organicSuggestion: scan.organic_suggestion,
      chemicalSuggestion: scan.chemical_suggestion,
      causes: scan.causes
    };
    setDiagnosis(diagnosisFromHistory);
    setCurrentImage({ file: new File([], 'scan'), url: scan.image_url, timestamp: Date.now() });
    setCurrentState('result');
  };

  const handleAddToShopping = async (item: { name: string; type: 'organic' | 'chemical' }) => {
    try {
      const { error } = await supabase
        .from('shopping_lists')
        .insert({
          user_id: 'anonymous',
          item_name: item.name,
          item_type: item.type
        });

      if (error) throw error;

      toast({
        title: "Added to Shopping List",
        description: `${item.name} has been added to your shopping list.`,
      });
    } catch (error) {
      toast({
        title: "Note",
        description: "Feature available after user login implementation",
        variant: "destructive",
      });
    }
  };

  const handleSetReminder = async (treatment: string) => {
    try {
      const reminderDate = new Date();
      reminderDate.setDate(reminderDate.getDate() + 1); // Set for tomorrow

      const { error } = await supabase
        .from('treatment_reminders')
        .insert({
          user_id: 'anonymous',
          treatment_name: treatment,
          reminder_date: reminderDate.toISOString(),
          notes: `Apply ${treatment} as recommended`
        });

      if (error) throw error;

      toast({
        title: "Reminder Set",
        description: `Reminder set for ${treatment} application.`,
      });
    } catch (error) {
      toast({
        title: "Note",
        description: "Feature available after user login implementation",
        variant: "destructive",
      });
    }
  };

  const handleBackToMain = () => {
    setCurrentState('main');
    setSelectedScan(null);
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
            onHistoryClick={handleHistoryClick}
            onRemindersClick={handleRemindersClick}
            onShoppingClick={handleShoppingClick}
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
            onAddToShopping={handleAddToShopping}
            onSetReminder={handleSetReminder}
          />
        ) : (
          <MainScreen
            onImageCaptured={handleImageCaptured}
            onSettingsClick={handleSettingsClick}
            onChatClick={handleChatClick}
            onHistoryClick={handleHistoryClick}
            onRemindersClick={handleRemindersClick}
            onShoppingClick={handleShoppingClick}
          />
        );
      case 'history':
        return <HistoryScreen onBack={handleBackToMain} onViewScan={handleViewScan} />;
      case 'reminders':
        return <RemindersScreen onBack={handleBackToMain} />;
      case 'shopping':
        return <ShoppingScreen onBack={handleBackToMain} />;
      case 'chatbot':
        return <ChatbotScreen onBack={handleBackToMain} />;
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
