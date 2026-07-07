export type Folder = {
  id: string;
  user_id: string;
  parent_id: string | null;
  name: string;
  created_at: string;
};

export type CreateFolderPayload = {
  name: string;
  parent_id?: string | null;
};

export type UpdateFolderPayload = {
  name?: string;
  parent_id?: string | null;
};

export const UNCATEGORIZED_FOLDER_ID = "__uncategorized__";
