import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Check, Trash2, Phone, MapPin, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ActionButton } from '@/components/ui/button-variants';
import { Mascot } from '@/components/Mascot';
import { useLanguage } from '@/components/LanguageProvider';
import { getTranslation } from '@/utils/translations';
import { ShoppingItem } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ShoppingScreenProps {
  onBack: () => void;
}

export const ShoppingScreen: React.FC<ShoppingScreenProps> = ({ onBack }) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShoppingItems();
  }, []);

  const fetchShoppingItems = async () => {
    try {
      const { data, error } = await supabase
        .from('shopping_lists')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems((data || []) as ShoppingItem[]);
    } catch (error) {
      console.error('Error fetching shopping items:', error);
      toast({
        title: "Error",
        description: "Failed to load shopping list",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const togglePurchased = async (itemId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('shopping_lists')
        .update({ is_purchased: !currentStatus })
        .eq('id', itemId);

      if (error) throw error;

      setItems(prev => prev.map(item => 
        item.id === itemId 
          ? { ...item, is_purchased: !currentStatus }
          : item
      ));

      toast({
        title: "Success",
        description: !currentStatus 
          ? (language === 'telugu' ? 'వస్తువు కొనుగోలు చేయబడింది' : 'Item purchased')
          : (language === 'telugu' ? 'వస్తువు పెండింగ్‌లోకి మార్చబడింది' : 'Item moved to pending'),
      });
    } catch (error) {
      console.error('Error updating item:', error);
      toast({
        title: "Error",
        description: "Failed to update item",
        variant: "destructive",
      });
    }
  };

  const deleteItem = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('shopping_lists')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      setItems(prev => prev.filter(item => item.id !== itemId));

      toast({
        title: "Success",
        description: language === 'telugu' ? 'వస్తువు తొలగించబడింది' : 'Item deleted',
      });
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive",
      });
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

  const pendingItems = items.filter(item => !item.is_purchased);
  const purchasedItems = items.filter(item => item.is_purchased);

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
            {getTranslation('shoppingList', language)}
          </h1>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          className="rounded-lg"
          onClick={() => toast({
            title: language === 'telugu' ? 'త్వరలో వస్తుంది' : 'Coming Soon',
            description: language === 'telugu' ? 'వస్తువు జోడించడం త్వరలో' : 'Add item feature coming soon',
          })}
        >
          <Plus className="w-4 h-4 mr-2" />
          {language === 'telugu' ? 'జోడించు' : 'Add'}
        </Button>
      </div>

      {/* Pending Items */}
      {pendingItems.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center">
            <ShoppingCart className="w-5 h-5 mr-2 text-warning" />
            {getTranslation('pending', language)} ({pendingItems.length})
          </h3>
          {pendingItems.map((item) => (
            <Card key={item.id} className="rounded-2xl card-hover">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      item.item_type === 'organic' ? 'bg-organic' : 'bg-chemical'
                    }`} />
                    <CardTitle className="text-lg">
                      {item.item_name}
                    </CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteItem(item.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {item.quantity && (
                  <p className="text-sm text-muted-foreground">
                    {language === 'telugu' ? 'పరిమాణం' : 'Quantity'}: {item.quantity}
                  </p>
                )}
                
                {item.estimated_price && (
                  <p className="text-sm font-medium">
                    {language === 'telugu' ? 'అంచనా ధర' : 'Estimated Price'}: ₹{item.estimated_price}
                  </p>
                )}

                {item.supplier_name && (
                  <div className="bg-muted p-3 rounded-lg space-y-2">
                    <h4 className="font-medium text-sm">
                      {getTranslation('suppliers', language)}
                    </h4>
                    <div className="space-y-1">
                      <p className="text-sm flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {item.supplier_name}
                      </p>
                      {item.supplier_contact && (
                        <p className="text-sm flex items-center">
                          <Phone className="w-3 h-3 mr-1" />
                          {item.supplier_contact}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {item.notes && (
                  <p className="text-sm text-muted-foreground">
                    {item.notes}
                  </p>
                )}
                
                <ActionButton
                  variant={item.item_type === 'organic' ? 'organic' : 'warning'}
                  onClick={() => togglePurchased(item.id, item.is_purchased)}
                  className="w-full"
                >
                  <Check className="w-4 h-4 mr-2" />
                  {language === 'telugu' ? 'కొనుగోలు చేసారు గా మార్చు' : 'Mark as Purchased'}
                </ActionButton>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Purchased Items */}
      {purchasedItems.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center">
            <Check className="w-5 h-5 mr-2 text-organic" />
            {getTranslation('purchased', language)} ({purchasedItems.length})
          </h3>
          {purchasedItems.map((item) => (
            <Card key={item.id} className="rounded-2xl opacity-75">
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      item.item_type === 'organic' ? 'bg-organic' : 'bg-chemical'
                    }`} />
                    <div>
                      <h4 className="font-medium line-through text-muted-foreground">
                        {item.item_name}
                      </h4>
                      {item.quantity && (
                        <p className="text-sm text-muted-foreground">
                          {item.quantity}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => togglePurchased(item.id, item.is_purchased)}
                      className="text-muted-foreground"
                    >
                      {language === 'telugu' ? 'రీసెట్' : 'Reset'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteItem(item.id)}
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
      {items.length === 0 && (
        <Card className="rounded-2xl text-center p-8">
          <Mascot mood="happy" size="md" />
          <h3 className="mt-4 text-lg font-semibold">
            {language === 'telugu' ? 'షాపింగ్ జాబితా ఖాళీ' : 'Shopping List Empty'}
          </h3>
          <p className="mt-2 text-muted-foreground">
            {language === 'telugu' 
              ? 'మీ చికిత్స కోసం అవసరమైన వస్తువులను జోడించండి' 
              : 'Add items needed for your treatments'}
          </p>
        </Card>
      )}
    </div>
  );
};