create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  email text unique,
  stripe_customer_id text,
  plan text default 'free',
  created_at timestamp with time zone default now()
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  subject_address text,
  raw_csv text,
  model_name text,
  result_json jsonb,
  created_at timestamp with time zone default now()
);

alter table public.profiles enable row level security;
alter table public.reports  enable row level security;

create policy "profiles self" on public.profiles for all using (id = auth.uid());
create policy "reports by owner" on public.reports  for all using (user_id = auth.uid());

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

