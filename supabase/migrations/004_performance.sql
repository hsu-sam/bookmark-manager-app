create extension if not exists pg_trgm;

create index if not exists bookmarks_title_trgm_idx
  on public.bookmarks using gin (title gin_trgm_ops);
create index if not exists bookmarks_url_trgm_idx
  on public.bookmarks using gin (url gin_trgm_ops);
create index if not exists bookmarks_description_trgm_idx
  on public.bookmarks using gin (description gin_trgm_ops);

create index if not exists bookmarks_tags_gin_idx
  on public.bookmarks using gin (tags);

create index if not exists bookmarks_list_created_idx
  on public.bookmarks (user_id, is_archived, is_pinned desc, created_at desc);
create index if not exists bookmarks_list_visits_idx
  on public.bookmarks (user_id, is_archived, is_pinned desc, visit_count desc);
create index if not exists bookmarks_list_last_visited_idx
  on public.bookmarks (user_id, is_archived, is_pinned desc, last_visited desc);

create index if not exists bookmarks_folder_scope_idx
  on public.bookmarks (user_id, is_archived, folder_id);

create or replace function public.bookmark_folder_counts(p_is_archived boolean default false)
returns table (folder_id uuid, count bigint)
language sql
security invoker
set search_path = ''
stable
as $$
  select b.folder_id, count(*) as count
  from public.bookmarks b
  where b.user_id = auth.uid()
    and b.is_archived = p_is_archived
  group by b.folder_id;
$$;

revoke all on function public.bookmark_folder_counts(boolean) from public;
grant execute on function public.bookmark_folder_counts(boolean) to authenticated;

create or replace function public.bookmark_tag_counts(p_is_archived boolean default false)
returns table (tag text, count bigint)
language sql
security invoker
set search_path = ''
stable
as $$
  select t.tag, count(*) as count
  from public.bookmarks b, unnest(b.tags) as t(tag)
  where b.user_id = auth.uid()
    and b.is_archived = p_is_archived
  group by t.tag
  order by t.tag;
$$;

revoke all on function public.bookmark_tag_counts(boolean) from public;
grant execute on function public.bookmark_tag_counts(boolean) to authenticated;

create or replace function public.find_duplicate_bookmark(p_url text, p_exclude_id bigint default null)
returns public.bookmarks
language sql
security invoker
set search_path = ''
stable
as $$
  select b.*
  from public.bookmarks b
  where b.user_id = auth.uid()
    and b.is_archived = false
    and b.url_normalized = public.normalize_bookmark_url(p_url)
    and (p_exclude_id is null or b.id <> p_exclude_id)
  limit 1;
$$;

revoke all on function public.find_duplicate_bookmark(text, bigint) from public;
grant execute on function public.find_duplicate_bookmark(text, bigint) to authenticated;

alter table public.bookmarks add column if not exists favicon_url text;
