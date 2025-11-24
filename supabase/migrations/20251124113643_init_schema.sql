-- Create profiles table
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  role TEXT NOT NULL CHECK (role IN ('production', 'client')),
  company_name TEXT,
  display_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create projects table
CREATE TABLE public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  client_name TEXT NOT NULL,
  sales_rep TEXT,
  pm_name TEXT,
  current_phase INTEGER NOT NULL DEFAULT 1 CHECK (current_phase BETWEEN 1 AND 7),
  status TEXT NOT NULL DEFAULT 'preparing' CHECK (status IN ('preparing', 'production', 'review', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Create scenarios table (Phase 3)
CREATE TABLE public.scenarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  option_a TEXT,
  option_b TEXT,
  option_c TEXT,
  selected_option TEXT CHECK (selected_option IN ('option_a', 'option_b', 'option_c')),
  client_comment TEXT,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for scenarios
ALTER TABLE public.scenarios ENABLE ROW LEVEL SECURITY;

-- Create scenes table (Phase 4-6)
CREATE TABLE public.scenes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  scene_no INTEGER NOT NULL,
  action TEXT,
  dialogue TEXT,
  duration INTEGER,
  sora_prompt TEXT,
  video_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'submitted', 'approved')),
  assigned_to UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for scenes
ALTER TABLE public.scenes ENABLE ROW LEVEL SECURITY;

-- Create approvals table (Phase tracking)
CREATE TABLE public.approvals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  phase_number INTEGER NOT NULL CHECK (phase_number BETWEEN 1 AND 7),
  approved_at TIMESTAMPTZ DEFAULT NOW(),
  approved_by UUID REFERENCES public.profiles(id),
  memo TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for approvals
ALTER TABLE public.approvals ENABLE ROW LEVEL SECURITY;

-- Create reviews table (Client feedback)
CREATE TABLE public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  scene_id UUID REFERENCES public.scenes(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE, -- Optional direct link for project-level reviews
  user_id UUID REFERENCES public.profiles(id),
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for reviews
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles: 
-- Public read for now (or restricted to authenticated users)
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
-- Users can update own profile
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Projects:
-- Production team can do everything
CREATE POLICY "Production team can do everything on projects" ON public.projects
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'production'));

-- Clients can view projects they are assigned to (TODO: Add client_id to projects or a join table. For now, assuming client_name matches or using a simplified check)
-- Ideally we need a many-to-many or a direct client_user_id on projects. 
-- Let's add client_user_id to projects for stricter RLS.
ALTER TABLE public.projects ADD COLUMN client_user_id UUID REFERENCES public.profiles(id);

CREATE POLICY "Clients can view their own projects" ON public.projects
  FOR SELECT USING (auth.uid() = client_user_id);

-- Scenarios:
-- Production full access
CREATE POLICY "Production full access scenarios" ON public.scenarios
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'production'));
-- Client view and update (select option)
CREATE POLICY "Client view scenarios" ON public.scenarios
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND client_user_id = auth.uid()));
CREATE POLICY "Client update scenarios" ON public.scenarios
  FOR UPDATE USING (EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND client_user_id = auth.uid()));

-- Scenes:
-- Production full access
CREATE POLICY "Production full access scenes" ON public.scenes
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'production'));
-- Client view
CREATE POLICY "Client view scenes" ON public.scenes
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND client_user_id = auth.uid()));

-- Approvals:
-- Production full access
CREATE POLICY "Production full access approvals" ON public.approvals
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'production'));
-- Client insert (approve)
CREATE POLICY "Client insert approvals" ON public.approvals
  FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND client_user_id = auth.uid()));
-- Client view
CREATE POLICY "Client view approvals" ON public.approvals
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND client_user_id = auth.uid()));

-- Reviews:
-- Production full access
CREATE POLICY "Production full access reviews" ON public.reviews
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'production'));
-- Client insert/view
CREATE POLICY "Client access reviews" ON public.reviews
  USING (
    (scene_id IS NOT NULL AND EXISTS (SELECT 1 FROM public.scenes s JOIN public.projects p ON s.project_id = p.id WHERE s.id = scene_id AND p.client_user_id = auth.uid())) OR
    (project_id IS NOT NULL AND EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND client_user_id = auth.uid()))
  );

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role, display_name)
  VALUES (new.id, 'client', new.raw_user_meta_data->>'full_name'); -- Default to client, admin can change later or use metadata
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
