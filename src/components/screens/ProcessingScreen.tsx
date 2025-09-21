import React from 'react';
import { Loader2 } from 'lucide-react';
import { Mascot } from '@/components/Mascot';
import { useLanguage } from '@/components/LanguageProvider';
import { getTranslation } from '@/utils/translations';

export const ProcessingScreen: React.FC = () => {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="text-center space-y-8 gentle-fade-in">
        <div className="flex justify-center">
          <Mascot mood="thinking" size="lg" />
        </div>

        <div className="space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          
          <h2 className="text-2xl font-bold text-foreground">
            {getTranslation('analyzing', language)}
          </h2>
          
          <p className="text-muted-foreground text-lg max-w-sm">
            {language === 'telugu'
              ? 'మీ పంట చిత్రాన్ని జాగ్రత్తగా పరిశీలిస్తున్నాం...'
              : 'Carefully examining your crop image...'
            }
          </p>
        </div>

        <div className="flex justify-center space-x-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-primary rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};