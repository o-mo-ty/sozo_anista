-- Add client_email to projects
ALTER TABLE public.projects ADD COLUMN client_email TEXT;

-- Create hearing_sheets table
CREATE TABLE public.hearing_sheets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  responses JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for hearing_sheets
ALTER TABLE public.hearing_sheets ENABLE ROW LEVEL SECURITY;

-- Policies for hearing_sheets
-- Production full access
CREATE POLICY "Production full access hearing_sheets" ON public.hearing_sheets
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'production'));

-- Client view and update (their own project's hearing sheet)
CREATE POLICY "Client view hearing_sheets" ON public.hearing_sheets
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND client_user_id = auth.uid()));

CREATE POLICY "Client update hearing_sheets" ON public.hearing_sheets
  FOR UPDATE USING (EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND client_user_id = auth.uid()));

CREATE POLICY "Client insert hearing_sheets" ON public.hearing_sheets
  FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND client_user_id = auth.uid()));
