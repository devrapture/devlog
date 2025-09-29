import type { MediaFile } from "@/services/file-upload-services";

export interface EditorState {
  title: string;
  body: string;
  coverImage: Partial<MediaFile> | null;
  selectedCategories: string[];
  editorMode: "markdown" | "plain";
}

export enum AutoSavedStatus {
  IDLE="idle",
  ERROR = "error",
  SAVED = "saved",
  SAVING = "saving",
} 
