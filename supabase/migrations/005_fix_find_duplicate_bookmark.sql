drop function if exists public.find_duplicate_bookmark(text, bigint);

create function public.find_duplicate_bookmark(p_url text, p_exclude_id bigint default null)
returns setof public.bookmarks
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
