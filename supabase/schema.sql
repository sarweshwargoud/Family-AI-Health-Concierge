-- ==============================================================================
-- Family Health Concierge AI - PostgreSQL Schema & Migration
-- Adheres to: sickn33/agentic-awesome-skills (supabase-backend / database-design)
-- ==============================================================================

-- 1. PROFILES TABLE (Linked directly to auth.users)
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- Profiles Policies
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Trigger to auto-create profile on signup (Email & OAuth Google)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if exists and recreate
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- 2. FAMILY MEMBERS TABLE
create table if not exists public.family_members (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  relation text not null,
  age integer default 0,
  dob text default '',
  gender text default 'Male',
  blood_group text default 'O+',
  insurance_provider text default '',
  insurance_id text default '',
  allergies text[] default '{}',
  chronic_diseases text[] default '{}',
  current_medications text[] default '{}',
  height text default '',
  weight text default '',
  avatar text default '',
  emergency_contact jsonb default '{"name": "", "relation": "", "phone": ""}'::jsonb,
  vaccinations jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.family_members enable row level security;

create policy "Users can view own family members"
  on public.family_members for select
  using (auth.uid() = user_id);

create policy "Users can insert own family members"
  on public.family_members for insert
  with check (auth.uid() = user_id);

create policy "Users can update own family members"
  on public.family_members for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own family members"
  on public.family_members for delete
  using (auth.uid() = user_id);

create index if not exists idx_family_members_user_id on public.family_members(user_id);


-- 3. MEDICAL REPORTS TABLE
create table if not exists public.medical_reports (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  member_id uuid references public.family_members(id) on delete cascade not null,
  title text not null,
  date text not null,
  category text not null,
  hospital text default '',
  doctor text default '',
  summary text default '',
  extracted_data jsonb default '{"diseases": [], "medications": [], "values": {}}'::jsonb,
  file_size text default '1 MB',
  file_type text default 'PDF',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.medical_reports enable row level security;

create policy "Users can view own medical reports"
  on public.medical_reports for select
  using (auth.uid() = user_id);

create policy "Users can insert own medical reports"
  on public.medical_reports for insert
  with check (auth.uid() = user_id);

create policy "Users can update own medical reports"
  on public.medical_reports for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own medical reports"
  on public.medical_reports for delete
  using (auth.uid() = user_id);

create index if not exists idx_medical_reports_user_member on public.medical_reports(user_id, member_id);


-- 4. TIMELINE EVENTS TABLE
create table if not exists public.timeline_events (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  member_id uuid references public.family_members(id) on delete cascade not null,
  date text not null,
  year text not null,
  title text not null,
  type text not null,
  description text default '',
  icon text default 'activity',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.timeline_events enable row level security;

create policy "Users can view own timeline events"
  on public.timeline_events for select
  using (auth.uid() = user_id);

create policy "Users can insert own timeline events"
  on public.timeline_events for insert
  with check (auth.uid() = user_id);

create policy "Users can update own timeline events"
  on public.timeline_events for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own timeline events"
  on public.timeline_events for delete
  using (auth.uid() = user_id);

create index if not exists idx_timeline_events_user_member on public.timeline_events(user_id, member_id);


-- 5. MEDICATION REMINDERS TABLE
create table if not exists public.medication_reminders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  member_id uuid references public.family_members(id) on delete cascade not null,
  medicine text not null,
  dosage text not null,
  frequency text not null,
  timing text[] default '{Morning}',
  taken jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.medication_reminders enable row level security;

create policy "Users can view own medication reminders"
  on public.medication_reminders for select
  using (auth.uid() = user_id);

create policy "Users can insert own medication reminders"
  on public.medication_reminders for insert
  with check (auth.uid() = user_id);

create policy "Users can update own medication reminders"
  on public.medication_reminders for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own medication reminders"
  on public.medication_reminders for delete
  using (auth.uid() = user_id);

create index if not exists idx_medication_reminders_user_member on public.medication_reminders(user_id, member_id);


-- 6. APPOINTMENTS TABLE
create table if not exists public.appointments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  member_id uuid references public.family_members(id) on delete cascade not null,
  doctor text not null,
  specialty text default '',
  hospital text default '',
  date text not null,
  time text not null,
  notes text default '',
  status text default 'Upcoming',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.appointments enable row level security;

create policy "Users can view own appointments"
  on public.appointments for select
  using (auth.uid() = user_id);

create policy "Users can insert own appointments"
  on public.appointments for insert
  with check (auth.uid() = user_id);

create policy "Users can update own appointments"
  on public.appointments for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own appointments"
  on public.appointments for delete
  using (auth.uid() = user_id);

create index if not exists idx_appointments_user_member on public.appointments(user_id, member_id);


-- 7. CHAT MESSAGES TABLE
create table if not exists public.chat_messages (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  sender text not null,
  text text not null,
  timestamp text not null,
  attachments jsonb default '[]'::jsonb,
  clinical_cards jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.chat_messages enable row level security;

create policy "Users can view own chat messages"
  on public.chat_messages for select
  using (auth.uid() = user_id);

create policy "Users can insert own chat messages"
  on public.chat_messages for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own chat messages"
  on public.chat_messages for delete
  using (auth.uid() = user_id);

create index if not exists idx_chat_messages_user_created on public.chat_messages(user_id, created_at);


-- 8. NOTIFICATIONS TABLE
create table if not exists public.notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  message text not null,
  date text not null,
  read boolean default false,
  type text default 'general',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.notifications enable row level security;

create policy "Users can view own notifications"
  on public.notifications for select
  using (auth.uid() = user_id);

create policy "Users can insert own notifications"
  on public.notifications for insert
  with check (auth.uid() = user_id);

create policy "Users can update own notifications"
  on public.notifications for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own notifications"
  on public.notifications for delete
  using (auth.uid() = user_id);

create index if not exists idx_notifications_user_date on public.notifications(user_id, created_at);


-- 9. TODOS TABLE (Sandbox / Health Tasks)
create table if not exists public.todos (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  is_completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.todos enable row level security;

create policy "Users can manage own todos"
  on public.todos for all
  using (auth.uid() = user_id or user_id is null)
  with check (auth.uid() = user_id or user_id is null);
