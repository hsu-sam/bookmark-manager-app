-- Fixes for data modeling / Supabase issues identified in review:
--   1. FK delete rules didn't match 002_folders.sql (live schema had NO ACTION,
--      not ON DELETE SET NULL / CASCADE) -> deleting a non-empty folder failed.
--   2. folders.user_id had no default, unlike bookmarks.user_id -> extra
--      getUser() round trip in the client on every folder create.
--   3. visit_count was incremented via client read-modify-write -> race condition
--      between tabs/devices. Replaced with an atomic RPC.
--   4. title/url were nullable despite always having a required value in the app.
--   5. No updated_at on either table.
--   6. No guard against a folder being its own parent.
--   7. folders RLS policies were scoped to `public` instead of `authenticated`.
--   8. bookmarks had 5 overlapping RLS policies (4 per-command + 1 ALL) instead
--      of a clean, auditable set. Consolidated to 4, matching folders' shape.
-- Run in Supabase SQL Editor or via `supabase db push`.

-- 1. Foreign key delete behavior
alter table public.bookmarks
  drop constraint bookmarks_folder_id_fkey;

alter table public.bookmarks
  add constraint bookmarks_folder_id_fkey
  foreign key (folder_id) references public.folders(id) on delete set null;

alter table public.folders
  drop constraint folders_parent_id_fkey;

alter table public.folders
  add constraint folders_parent_id_fkey
  foreign key (parent_id) references public.folders(id) on delete cascade;

-- 2. Consistent user_id default
alter table public.folders
  alter column user_id set default auth.uid();

-- 3. Atomic visit increment
create or replace function public.increment_bookmark_visit(bookmark_id bigint)
returns public.bookmarks
language sql
security invoker
set search_path = ''
as $$
  update public.bookmarks
  set visit_count = visit_count + 1,
      last_visited = now()
  where id = bookmark_id
  returning *;
$$;

revoke all on function public.increment_bookmark_visit(bigint) from public;
grant execute on function public.increment_bookmark_visit(bigint) to authenticated;

-- 4. Required columns actually required
update public.bookmarks set title = '' where title is null;
update public.bookmarks set url = '' where url is null;

alter table public.bookmarks alter column title set not null;
alter table public.bookmarks alter column url set not null;

-- 5. updated_at tracking
alter table public.bookmarks add column if not exists updated_at timestamptz not null default now();
alter table public.folders add column if not exists updated_at timestamptz not null default now();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists bookmarks_set_updated_at on public.bookmarks;
create trigger bookmarks_set_updated_at
  before update on public.bookmarks
  for each row execute function public.set_updated_at();

drop trigger if exists folders_set_updated_at on public.folders;
create trigger folders_set_updated_at
  before update on public.folders
  for each row execute function public.set_updated_at();

-- 6. A folder can't be its own parent
alter table public.folders
  add constraint folders_no_self_parent check (id <> parent_id);

-- 7. folders RLS: scope to authenticated (was `public`, i.e. also anon)
alter policy "Users can view own folders" on public.folders to authenticated;
alter policy "Users can insert own folders" on public.folders to authenticated;
alter policy "Users can update own folders" on public.folders to authenticated;
alter policy "Users can delete own folders" on public.folders to authenticated;

-- 8. bookmarks RLS: replace 5 overlapping policies with 4 clean ones
drop policy if exists "Enable delete for users based on user_id" on public.bookmarks;
drop policy if exists "Enable insert for users based on user_id" on public.bookmarks;
drop policy if exists "sers can manage their own bookmarks" on public.bookmarks;
drop policy if exists "Users can only read their own bookmarks." on public.bookmarks;
drop policy if exists "Users can update their own bookmarks" on public.bookmarks;

create policy "Users can view own bookmarks"
  on public.bookmarks for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own bookmarks"
  on public.bookmarks for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update own bookmarks"
  on public.bookmarks for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own bookmarks"
  on public.bookmarks for delete
  to authenticated
  using (auth.uid() = user_id);
