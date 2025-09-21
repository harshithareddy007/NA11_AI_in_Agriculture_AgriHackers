-- Create tables for AgriVaani features

-- User profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  display_name TEXT,
  phone_number TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Scan history table
CREATE TABLE public.scan_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  image_url TEXT NOT NULL,
  disease_name TEXT NOT NULL,
  confidence REAL NOT NULL,
  organic_suggestion JSONB NOT NULL,
  chemical_suggestion JSONB NOT NULL,
  causes TEXT[] NOT NULL,
  scan_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.scan_history ENABLE ROW LEVEL SECURITY;

-- Treatment reminders table
CREATE TABLE public.treatment_reminders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  scan_id UUID REFERENCES public.scan_history(id) ON DELETE CASCADE,
  treatment_name TEXT NOT NULL,
  reminder_date TIMESTAMP WITH TIME ZONE NOT NULL,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.treatment_reminders ENABLE ROW LEVEL SECURITY;

-- Shopping list table
CREATE TABLE public.shopping_lists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  item_name TEXT NOT NULL,
  item_type TEXT NOT NULL CHECK (item_type IN ('organic', 'chemical')),
  quantity TEXT,
  is_purchased BOOLEAN NOT NULL DEFAULT false,
  supplier_name TEXT,
  supplier_contact TEXT,
  estimated_price REAL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.shopping_lists ENABLE ROW LEVEL SECURITY;

-- FAQ table
CREATE TABLE public.faqs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question_en TEXT NOT NULL,
  question_te TEXT NOT NULL,
  answer_en TEXT NOT NULL,
  answer_te TEXT NOT NULL,
  category TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create policies for scan_history
CREATE POLICY "Users can view their own scan history" 
ON public.scan_history 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own scans" 
ON public.scan_history 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own scans" 
ON public.scan_history 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create policies for treatment_reminders
CREATE POLICY "Users can view their own reminders" 
ON public.treatment_reminders 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own reminders" 
ON public.treatment_reminders 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reminders" 
ON public.treatment_reminders 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reminders" 
ON public.treatment_reminders 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create policies for shopping_lists
CREATE POLICY "Users can view their own shopping lists" 
ON public.shopping_lists 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own shopping items" 
ON public.shopping_lists 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own shopping items" 
ON public.shopping_lists 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own shopping items" 
ON public.shopping_lists 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create policies for FAQs (public read access)
CREATE POLICY "Anyone can view active FAQs" 
ON public.faqs 
FOR SELECT 
USING (is_active = true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample FAQ data
INSERT INTO public.faqs (question_en, question_te, answer_en, answer_te, category) VALUES
('How often should I spray the medicine?', 'ఎంత తరచుగా మందు చల్లాలి?', 'Apply once every 10-14 days during active infection period.', 'సక్రియ సంక్రమణ సమయంలో 10-14 రోజులకు ఒకసారి వేయండి.', 'treatment'),
('When is the best time to spray?', 'చల్లడానికి మంచి సమయం ఎప్పుడు?', 'Early morning or late evening when temperature is cooler.', 'ఉదయం లేదా సాయంత్రం చల్లగా ఉన్నప్పుడు.', 'treatment'),
('How to prevent disease spread?', 'వ్యాధి వ్యాప్తిని ఎలా నిరోధించాలి?', 'Remove infected parts, ensure proper drainage, and maintain plant spacing.', 'సోకిన భాగాలను తొలగించి, మంచి నీటి నిష్కాసన మరియు మొక్కల మధ్య దూరం ఉంచండి.', 'prevention'),
('Are organic treatments safe?', 'సేంద్రీయ చికిత్సలు సురక్షితమా?', 'Yes, organic treatments are generally safer for the environment and human health.', 'అవును, సేంద్రీయ చికిత్సలు పర్యావరణం మరియు మానవ ఆరోగ్యానికి సురక్షితం.', 'organic');