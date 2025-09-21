import React from 'react';
import { Volume2, RotateCcw, Share, Download, Calendar, ShoppingCart, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ActionButton } from '@/components/ui/button-variants';
import { Mascot } from '@/components/Mascot';
import { useLanguage } from '@/components/LanguageProvider';
import { getTranslation, diseaseTranslations } from '@/utils/translations';
import { Diagnosis } from '@/types';
import { speakText } from '@/utils/diagnosisLogic';

interface ResultScreenProps {
  diagnosis: Diagnosis;
  imageUrl: string;
  onRetake: () => void;
  onAddToShopping?: (item: { name: string; type: 'organic' | 'chemical' }) => void;
  onSetReminder?: (treatment: string) => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({ 
  diagnosis, 
  imageUrl, 
  onRetake,
  onAddToShopping,
  onSetReminder
}) => {
  const { language } = useLanguage();

  const handleSpeak = (text: string) => {
    speakText(text, language);
  };

  const diseaseName = diseaseTranslations[diagnosis.disease as keyof typeof diseaseTranslations]?.[language] || diagnosis.disease;

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Mascot mood="celebrating" size="md" />
          <h1 className="text-xl font-bold text-foreground">
            {getTranslation('diagnosis', language)}
          </h1>
        </div>
        
        <Button
          variant="outline"
          onClick={onRetake}
          size="sm"
          className="rounded-lg"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          {getTranslation('retake', language)}
        </Button>
      </div>

      {/* Image preview */}
      <div className="w-full h-48 rounded-2xl overflow-hidden bg-muted">
        <img 
          src={imageUrl} 
          alt="Crop analysis"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Disease diagnosis card */}
      <Card className="rounded-2xl card-hover confetti gentle-fade-in">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">
              {diseaseName}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSpeak(diseaseName)}
              className="rounded-lg"
            >
              <Volume2 className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            {language === 'telugu' ? 'నమ్మకం' : 'Confidence'}: {diagnosis.confidence}%
          </p>
        </CardHeader>
      </Card>

      {/* Treatment suggestions */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">
          {language === 'telugu' ? 'చికిత్స సూచనలు' : 'Treatment Suggestions'}
        </h3>

        {/* Organic suggestion */}
        <Card className="rounded-2xl card-hover gentle-fade-in">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-organic rounded-full"></div>
                <CardTitle className="text-lg text-organic">
                  {getTranslation('organic', language)}
                </CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSpeak(`${diagnosis.organicSuggestion.name}. ${diagnosis.organicSuggestion.howToUse}`)}
                className="rounded-lg"
              >
                <Volume2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <h4 className="font-medium">{diagnosis.organicSuggestion.name}</h4>
            <p className="text-sm text-muted-foreground">
              {diagnosis.organicSuggestion.howToUse}
            </p>
            <p className="text-xs text-organic font-medium">
              ✓ {diagnosis.organicSuggestion.safety}
            </p>
            <div className="flex space-x-2 mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddToShopping?.({ name: diagnosis.organicSuggestion.name, type: 'organic' })}
                className="flex-1"
              >
                <ShoppingCart className="w-3 h-3 mr-1" />
                {getTranslation('addToShopping', language)}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSetReminder?.(diagnosis.organicSuggestion.name)}
                className="flex-1"
              >
                <Calendar className="w-3 h-3 mr-1" />
                {getTranslation('setReminder', language)}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Chemical suggestion */}
        <Card className="rounded-2xl card-hover gentle-fade-in">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-chemical rounded-full"></div>
                <CardTitle className="text-lg text-chemical">
                  {getTranslation('chemical', language)}
                </CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSpeak(`${diagnosis.chemicalSuggestion.name}. ${diagnosis.chemicalSuggestion.howToUse}`)}
                className="rounded-lg"
              >
                <Volume2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <h4 className="font-medium">{diagnosis.chemicalSuggestion.name}</h4>
            <p className="text-sm text-muted-foreground">
              {diagnosis.chemicalSuggestion.howToUse}
            </p>
            <p className="text-xs text-chemical font-medium">
              ⚠ {diagnosis.chemicalSuggestion.safety}
            </p>
            <div className="flex space-x-2 mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddToShopping?.({ name: diagnosis.chemicalSuggestion.name, type: 'chemical' })}
                className="flex-1"
              >
                <ShoppingCart className="w-3 h-3 mr-1" />
                {getTranslation('addToShopping', language)}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSetReminder?.(diagnosis.chemicalSuggestion.name)}
                className="flex-1"
              >
                <Calendar className="w-3 h-3 mr-1" />
                {getTranslation('setReminder', language)}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Causes */}
      <Card className="rounded-2xl gentle-fade-in">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 text-warning" />
            {getTranslation('causes', language)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {diagnosis.causes.map((cause, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-start bg-muted/50 p-2 rounded-lg">
                <span className="text-warning mr-2 font-bold">•</span>
                {cause}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Action buttons */}
      <div className="flex space-x-4 pt-4">
        <ActionButton variant="organic" className="flex-1">
          <Share className="w-4 h-4 mr-2" />
          {language === 'telugu' ? 'పంచుకోండి' : 'Share'}
        </ActionButton>
        
        <ActionButton variant="warning" className="flex-1">
          <Download className="w-4 h-4 mr-2" />
          {language === 'telugu' ? 'డౌన్‌లోడ్' : 'Download'}
        </ActionButton>
      </div>
    </div>
  );
};