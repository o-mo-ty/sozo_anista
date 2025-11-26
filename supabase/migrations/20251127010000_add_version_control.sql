-- Create storyboard_versions table for JSON snapshots
CREATE TABLE public.storyboard_versions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  version_number INTEGER NOT NULL,
  name TEXT,
  scenes_data JSONB NOT NULL,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  comment TEXT
);

-- Enable RLS
ALTER TABLE public.storyboard_versions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Production full access storyboard_versions" ON public.storyboard_versions
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'production'));

CREATE POLICY "Client view storyboard_versions" ON public.storyboard_versions
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND client_user_id = auth.uid()));
