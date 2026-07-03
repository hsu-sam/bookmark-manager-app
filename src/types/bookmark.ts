export type Bookmark = {
  id: string;
  created_at: string;
  title: string;
  url: string;
  description?: string;
  tags?: string[];
  visit_count: number;
  last_visited?: string | null;
  is_archived: boolean;
  user_id: string;
  is_pinned: boolean;
};

export type AddBookmarkPayload = {
  title: string;
  url: string;
  description?: string;
  tags: string[];
};

export type UpdateBookmarkPayload = Partial<
  AddBookmarkPayload & Pick<Bookmark, "is_pinned" | "is_archived">
>;
