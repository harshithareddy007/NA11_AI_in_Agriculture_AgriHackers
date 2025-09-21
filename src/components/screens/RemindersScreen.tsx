import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Clock, Check, Trash2, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ActionButton } from '@/components/ui/button-variants';
import { Mascot } from '@/components/Mascot';
import { useLanguage } from '@/components/LanguageProvider';
import { getTranslation } from '@/utils/translations';
import { TreatmentReminder } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface RemindersScreenProps {
  onBack: () => void;
}

export const RemindersScreen: React.FC<RemindersScreenProps> = ({ onBack }) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [reminders, setReminders] = useState<TreatmentReminder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      const { data, error } = await supabase
        .from('treatment_reminders')
        .select('*')
        .order('reminder_date', { ascending: true });

      if (error) throw error;
      setReminders(data || []);
    } catch (error) {
      console.error('Error fetching reminders:', error);
      toast({
        title: "Error",
        description: "Failed to load reminders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleComplete = async (reminderId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('treatment_reminders')
        .update({ is_completed: !currentStatus })
        .eq('id', reminderId);

      if (error) throw error;

      setReminders(prev => prev.map(reminder => 
        reminder.id === reminderId 
          ? { ...reminder, is_completed: !currentStatus }
          : reminder
      ));

      toast({
        title: "Success",
        description: !currentStatus 
          ? (language === 'telugu' ? 'రిమైండర్ పూర్తయింది' : 'Reminder completed')
          : (language === 'telugu' ? 'రిమైండర్ రీసెట్ చేయబడింది' : 'Reminder reset'),
      });
    } catch (error) {
      console.error('Error updating reminder:', error);
      toast({
        title: "Error",
        description: "Failed to update reminder",
        variant: "destructive",
      });
    }
  };

  const deleteReminder = async (reminderId: string) => {
    try {
      const { error } = await supabase
        .from('treatment_reminders')
        .delete()
        .eq('id', reminderId);

      if (error) throw error;

      setReminders(prev => prev.filter(reminder => reminder.id !== reminderId));

      toast({
        title: "Success",
        description: language === 'telugu' ? 'రిమైండర్ తొలగించబడింది' : 'Reminder deleted',
      });
    } catch (error) {
      console.error('Error deleting reminder:', error);
      toast({
        title: "Error",
        description: "Failed to delete reminder",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return language === 'telugu' ? 'ఈరోజు' : 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return language === 'telugu' ? 'రేపు' : 'Tomorrow';
    } else {
      return date.toLocaleDateString(language === 'telugu' ? 'te-IN' : 'en-US');
    }
  };

  const getTimeRemaining = (dateString: string) => {
    const now = new Date();
    const reminderDate = new Date(dateString);
    const diffInHours = Math.ceil((reminderDate.getTime() - now.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 0) {
      return language === 'telugu' ? 'గడిచిపోయింది' : 'Overdue';
    } else if (diffInHours < 24) {
      return `${diffInHours}${language === 'telugu' ? 'గం' : 'h'}`;
    } else {
      const days = Math.ceil(diffInHours / 24);
      return `${days}${language === 'telugu' ? 'రో' : 'd'}`;
    }
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

  const pendingReminders = reminders.filter(r => !r.is_completed);
  const completedReminders = reminders.filter(r => r.is_completed);

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
            {getTranslation('reminders', language)}
          </h1>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          className="rounded-lg"
          onClick={() => toast({
            title: language === 'telugu' ? 'త్వరలో వస్తుంది' : 'Coming Soon',
            description: language === 'telugu' ? 'రిమైండర్ జోడించడం త్వరలో' : 'Add reminder feature coming soon',
          })}
        >
          <Plus className="w-4 h-4 mr-2" />
          {language === 'telugu' ? 'జోడించు' : 'Add'}
        </Button>
      </div>

      {/* Pending Reminders */}
      {pendingReminders.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center">
            <Bell className="w-5 h-5 mr-2 text-warning" />
            {getTranslation('pending', language)} ({pendingReminders.length})
          </h3>
          {pendingReminders.map((reminder) => (
            <Card key={reminder.id} className="rounded-2xl card-hover">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {reminder.treatment_name}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-warning font-medium">
                      {getTimeRemaining(reminder.reminder_date)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteReminder(reminder.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {formatDate(reminder.reminder_date)} • {new Date(reminder.reminder_date).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                </div>
                
                {reminder.notes && (
                  <p className="text-sm text-muted-foreground">
                    {reminder.notes}
                  </p>
                )}
                
                <ActionButton
                  variant="organic"
                  onClick={() => toggleComplete(reminder.id, reminder.is_completed)}
                  className="w-full"
                >
                  <Check className="w-4 h-4 mr-2" />
                  {language === 'telugu' ? 'పూర్తయింది గా మార్చు' : 'Mark Complete'}
                </ActionButton>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Completed Reminders */}
      {completedReminders.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center">
            <Check className="w-5 h-5 mr-2 text-organic" />
            {getTranslation('completed', language)} ({completedReminders.length})
          </h3>
          {completedReminders.map((reminder) => (
            <Card key={reminder.id} className="rounded-2xl opacity-75">
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium line-through text-muted-foreground">
                      {reminder.treatment_name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(reminder.reminder_date)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleComplete(reminder.id, reminder.is_completed)}
                      className="text-muted-foreground"
                    >
                      {language === 'telugu' ? 'रीसेट' : 'Reset'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteReminder(reminder.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {reminders.length === 0 && (
        <Card className="rounded-2xl text-center p-8">
          <Mascot mood="happy" size="md" />
          <h3 className="mt-4 text-lg font-semibold">
            {language === 'telugu' ? 'రిమైండర్లు లేవు' : 'No Reminders'}
          </h3>
          <p className="mt-2 text-muted-foreground">
            {language === 'telugu' 
              ? 'మీ చికిత్స షెడ్యూల్ ట్రాక్ చేయడానికి రిమైండర్లు జోడించండి' 
              : 'Add reminders to track your treatment schedule'}
          </p>
        </Card>
      )}
    </div>
  );
};