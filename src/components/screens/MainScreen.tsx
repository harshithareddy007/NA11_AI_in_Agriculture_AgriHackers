import React, { useRef } from 'react';
import { Camera, Image, Settings, MessageCircle, History, Clock, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CameraButton } from '@/components/ui/button-variants';
import { Mascot } from '@/components/Mascot';
import { useLanguage } from '@/components/LanguageProvider';
import { getTranslation } from '@/utils/translations';
import { CropImage } from '@/types';

interface MainScreenProps {
  onImageCaptured: (image: CropImage) => void;
  onSettingsClick: () => void;
  onChatClick: () => void;
  onHistoryClick: () => void;
  onRemindersClick: () => void;
  onShoppingClick: () => void;
}

export const MainScreen: React.FC<MainScreenProps> = ({ 
  onImageCaptured, 
  onSettingsClick, 
  onChatClick,
  onHistoryClick,
  onRemindersClick,
  onShoppingClick
}) => {
  const { language, setLanguage } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      onImageCaptured({
        file,
        url,
        timestamp: Date.now()
      });
    }
  };

  const handleGalleryClick = () => {
    fileInputRef.current?.click();
  };

  const handleCameraClick = () => {
    cameraInputRef.current?.click();
  };

  const toggleLanguage = () => {
    setLanguage(language === 'telugu' ? 'english' : 'telugu');
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Header */}
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center space-x-3">
          <Mascot mood="happy" size="md" />
          <h1 className="text-lg font-semibold text-foreground">
            AgriVaani
          </h1>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Language toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleLanguage}
            className="rounded-lg"
          >
            {language === 'telugu' ? 'EN' : 'తె'}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onSettingsClick}
            className="rounded-lg"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col items-center justify-center px-6 py-12 space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-foreground">
            {language === 'telugu' 
              ? 'మీ పంట డాక్టర్'
              : 'Your Crop Doctor'
            }
          </h2>
          <p className="text-muted-foreground text-lg">
            {language === 'telugu'
              ? 'పంట వ్యాధులను త్వరితగా కనుగొనండి'
              : 'Quickly identify crop diseases'
            }
          </p>
        </div>

        {/* Main camera button */}
        <div className="flex flex-col items-center space-y-6">
          <CameraButton onClick={handleCameraClick}>
            <Camera className="w-10 h-10" />
          </CameraButton>
          
          <p className="text-lg font-medium text-foreground">
            {getTranslation('capturePhoto', language)}
          </p>
        </div>

        {/* Gallery button */}
        <Button
          variant="outline"
          onClick={handleGalleryClick}
          className="w-48 h-12 rounded-xl text-lg"
        >
          <Image className="w-5 h-5 mr-2" />
          {getTranslation('gallery', language)}
        </Button>

        {/* Helpful tip */}
        <div className="text-center space-y-2 max-w-sm">
          <p className="text-sm text-muted-foreground">
            {language === 'telugu'
              ? 'స్పష్టమైన ఫోటో కోసం మంచి వెలుగులో తీయండి'
              : 'Take photos in good light for clear diagnosis'
            }
          </p>
        </div>
      </div>

      {/* Floating chat button */}
      <Button
        onClick={onChatClick}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
        className="hidden"
      />
      
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
        className="hidden"
      />
    </div>
  );
};