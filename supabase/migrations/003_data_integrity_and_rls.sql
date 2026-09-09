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

alter table public.folders
  alter column user_id set default auth.uid();

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

update public.bookmarks set title = '' where title is null;
update public.bookmarks set url = '' where url is null;

alter table public.bookmarks alter column title set not null;
alter table public.bookmarks alter column url set not null;

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

alter table public.folders
  add constraint folders_no_self_parent check (id <> parent_id);

alter policy "Users can view own folders" on public.folders to authenticated;
alter policy "Users can insert own folders" on public.folders to authenticated;
alter policy "Users can update own folders" on public.folders to authenticated;
alter policy "Users can delete own folders" on public.folders to authenticated;

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
