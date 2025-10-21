-- Demo data (run after supabase.sql)
insert into public.profiles (id, email, plan)
values
  ('00000000-0000-0000-0000-000000000001', 'demo@agent.com', 'pro_monthly')
on conflict (id) do nothing;

insert into public.profiles (id, email, plan)
values
  ('00000000-0000-0000-0000-000000000002', 'free@agent.com', 'free')
on conflict (id) do nothing;

insert into public.reports (user_id, subject_address, model_name, result_json)
values
  ('00000000-0000-0000-0000-000000000001', '123 Maple St', 'gpt-4o-mini', '{"model_version":"gpt-4o-mini","stats":{"n":5},"suggested_price_range":{"low":345000,"high":355000,"method":"trimmed-median-ppsf"},"rationale":["Recent comps within 90 days","Median PPSF holding steady"],"risks":["Overpricing may extend DOM"],"talking_points":["Homes with updated kitchens sold faster"]}');

