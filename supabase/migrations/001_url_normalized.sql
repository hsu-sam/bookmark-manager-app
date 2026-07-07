-- Normalise bookmark URLs for duplicate detection.
-- Run in Supabase SQL Editor or via `supabase db push`.

CREATE OR REPLACE FUNCTION normalize_bookmark_url(raw_url text)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  input text;
  without_scheme text;
  host_part text;
  path_part text;
  scheme text;
  slash_pos int;
BEGIN
  input := trim(raw_url);
  IF input = '' THEN
    RETURN '';
  END IF;

  IF input ~* '^https://' THEN
    scheme := 'https://';
    without_scheme := substring(input from 9);
  ELSIF input ~* '^http://' THEN
    scheme := 'http://';
    without_scheme := substring(input from 8);
  ELSE
    scheme := 'https://';
    without_scheme := input;
  END IF;

  host_part := split_part(without_scheme, '/', 1);
  slash_pos := position('/' in without_scheme);

  IF slash_pos > 0 THEN
    path_part := regexp_replace(
      substring(without_scheme from slash_pos),
      '/+$',
      ''
    );
  ELSE
    path_part := '';
  END IF;

  IF host_part ~* '^www\.' THEN
    host_part := substring(host_part from 5);
  END IF;

  RETURN lower(scheme || host_part || path_part);
END;
$$;

ALTER TABLE bookmarks
  ADD COLUMN IF NOT EXISTS url_normalized text;

UPDATE bookmarks
SET url_normalized = normalize_bookmark_url(url)
WHERE url_normalized IS NULL;

CREATE OR REPLACE FUNCTION set_bookmark_url_normalized()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.url_normalized := normalize_bookmark_url(NEW.url);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS bookmarks_url_normalized ON bookmarks;

CREATE TRIGGER bookmarks_url_normalized
  BEFORE INSERT OR UPDATE OF url ON bookmarks
  FOR EACH ROW
  EXECUTE FUNCTION set_bookmark_url_normalized();

CREATE UNIQUE INDEX IF NOT EXISTS bookmarks_user_url_unique
  ON bookmarks (user_id, url_normalized)
  WHERE is_archived = false;
