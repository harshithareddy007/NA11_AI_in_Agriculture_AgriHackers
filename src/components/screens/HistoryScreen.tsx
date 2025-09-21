import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Clock, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mascot } from '@/components/Mascot';
import { useLanguage } from '@/components/LanguageProvider';
import { getTranslation } from '@/utils/translations';
import { ScanHistory } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface HistoryScreenProps {
  onBack: () => void;
  onViewScan: (scan: ScanHistory) => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({ 
  onBack,
  onViewScan 
}) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [scans, setScans] = useState<ScanHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScanHistory();
  }, []);

  const fetchScanHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('scan_history')
        .select('*')
        .order('scan_date', { ascending: false });

      if (error) throw error;
      setScans(data || []);
    } catch (error) {
      console.error('Error fetching scan history:', error);
      toast({
        title: "Error",
        description: "Failed to load scan history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'telugu' ? 'te-IN' : 'en-US');
  };

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
            {getTranslation('scanHistory', language)}
          </h1>
        </div>
      </div>

      {/* Scan History List */}
      <div className="space-y-4">
        {scans.length === 0 ? (
          <Card className="rounded-2xl text-center p-8">
            <Mascot mood="sad" size="md" />
            <p className="mt-4 text-muted-foreground">
              {language === 'telugu' 
                ? 'ఇంకా స్కాన్లు లేవు. మొదటి స్కాన్ చేయండి!' 
                : 'No scans yet. Take your first scan!'}
            </p>
          </Card>
        ) : (
          scans.map((scan) => (
            <Card 
              key={scan.id} 
              className="rounded-2xl card-hover cursor-pointer"
              onClick={() => onViewScan(scan)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {scan.disease_name}
                  </CardTitle>
                  <div className="text-sm text-muted-foreground flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(scan.scan_date)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted">
                      <img 
                        src={scan.image_url} 
                        alt="Crop scan"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {language === 'telugu' ? 'నమ్మకం' : 'Confidence'}: {scan.confidence}%
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {new Date(scan.scan_date).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {scan.causes.slice(0, 2).map((cause, index) => (
                    <span 
                      key={index}
                      className="text-xs bg-muted px-2 py-1 rounded-full"
                    >
                      {cause}
                    </span>
                  ))}
                  {scan.causes.length > 2 && (
                    <span className="text-xs text-muted-foreground">
                      +{scan.causes.length - 2} {language === 'telugu' ? 'మరిన్ని' : 'more'}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};