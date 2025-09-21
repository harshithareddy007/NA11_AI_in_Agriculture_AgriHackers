import React, { useState, useEffect } from 'react';
import { ArrowLeft, Send, MessageCircle, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mascot } from '@/components/Mascot';
import { useLanguage } from '@/components/LanguageProvider';
import { getTranslation } from '@/utils/translations';
import { FAQ } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { speakText } from '@/utils/diagnosisLogic';

interface ChatbotScreenProps {
  onBack: () => void;
}

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export const ChatbotScreen: React.FC<ChatbotScreenProps> = ({ onBack }) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchFAQs();
    // Initial greeting
    setMessages([
      {
        id: '1',
        text: language === 'telugu' 
          ? 'నమస్కారం! నేను AgriVaani సహాయకుడిని. మీకు ఏమైనా ప్రశ్నలు ఉంటే అడగండి.'
          : 'Hello! I\'m AgriVaani assistant. Ask me any questions about crop diseases and treatments.',
        isUser: false,
        timestamp: new Date()
      }
    ]);
  }, [language]);

  const fetchFAQs = async () => {
    try {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .eq('is_active', true)
        .order('category', { ascending: true });

      if (error) throw error;
      setFaqs(data || []);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      toast({
        title: "Error",
        description: "Failed to load FAQ data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFAQClick = (faq: FAQ) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: language === 'telugu' ? faq.question_te : faq.question_en,
      isUser: true,
      timestamp: new Date()
    };

    const botResponse: ChatMessage = {
      id: (Date.now() + 1).toString(),
      text: language === 'telugu' ? faq.answer_te : faq.answer_en,
      isUser: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage, botResponse]);
  };

  const handleSpeak = (text: string) => {
    speakText(text, language);
  };

  const categories = [...new Set(faqs.map(faq => faq.category))];
  const filteredFaqs = selectedCategory === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <div className="text-center">
          <Mascot mood="thinking" size="md" />
          <p className="mt-4 text-muted-foreground">
            {language === 'telugu' ? 'లోడ్ అవుతోంది...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            onClick={onBack}
            size="sm"
            className="rounded-lg"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Mascot mood="happy" size="sm" />
          <h1 className="text-xl font-bold text-foreground">
            {getTranslation('chatbot', language)}
          </h1>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] p-3 rounded-2xl ${
              message.isUser 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted'
            }`}>
              <div className="flex items-start justify-between space-x-2">
                <p className="text-sm">{message.text}</p>
                {!message.isUser && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSpeak(message.text)}
                    className="flex-shrink-0 p-1 h-auto"
                  >
                    <Volume2 className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Category Filter */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-foreground">
          {language === 'telugu' ? 'వర్గాలు' : 'Categories'}
        </h3>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('all')}
            className="rounded-full"
          >
            {language === 'telugu' ? 'అన్నీ' : 'All'}
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="rounded-full capitalize"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* FAQ Questions */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground flex items-center">
          <MessageCircle className="w-5 h-5 mr-2" />
          {language === 'telugu' ? 'తరచుగా అడిగే ప్రశ్నలు' : 'Frequently Asked Questions'}
        </h3>
        {filteredFaqs.length === 0 ? (
          <Card className="rounded-2xl text-center p-6">
            <Mascot mood="thinking" size="md" />
            <p className="mt-4 text-muted-foreground">
              {language === 'telugu' 
                ? 'ఈ వర్గంలో ప్రశ్నలు లేవు' 
                : 'No questions in this category'}
            </p>
          </Card>
        ) : (
          filteredFaqs.map((faq) => (
            <Card 
              key={faq.id} 
              className="rounded-2xl card-hover cursor-pointer"
              onClick={() => handleFAQClick(faq)}
            >
              <CardContent className="py-4">
                <p className="text-sm font-medium">
                  {language === 'telugu' ? faq.question_te : faq.question_en}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-muted-foreground capitalize">
                    {faq.category}
                  </span>
                  <MessageCircle className="w-4 h-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Input Area */}
      <Card className="rounded-2xl">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder={language === 'telugu' 
                ? 'మీ ప్రశ్న టైప్ చేయండి...' 
                : 'Type your question...'}
              className="flex-1 p-2 border rounded-lg bg-background"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  toast({
                    title: language === 'telugu' ? 'త్వరలో వస్తుంది' : 'Coming Soon',
                    description: language === 'telugu' 
                      ? 'కస్టమ్ ప్రశ్నలు త్వరలో సపోర్ట్ చేస్తాము' 
                      : 'Custom questions will be supported soon',
                  });
                }
              }}
            />
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg"
              onClick={() => toast({
                title: language === 'telugu' ? 'త్వరలో వస్తుంది' : 'Coming Soon',
                description: language === 'telugu' 
                  ? 'కస్టమ్ ప్రశ్నలు త్వరలో సపోర్ట్ చేస్తాము' 
                  : 'Custom questions will be supported soon',
              })}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};