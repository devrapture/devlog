import type { EditorState } from "@/app/(protect-routes)/editor/[slug]/extras";
import type { GetDraftByIdResponse } from "@/types/api";
import { useEffect, useRef, useState } from "react";

export const useEditorState = (initialDraft?: GetDraftByIdResponse["data"]) => {
  const [state, setState] = useState<EditorState>({
    title: "",
    body: "",
    coverImage: null,
    selectedCategories: [],
    editorMode: "markdown",
  });
  const initializedRef = useRef(false);
  useEffect(() => {
    if (!initialDraft?.draft || initializedRef.current) return;
    setState((prev) => ({
      ...prev,
      title: initialDraft.draft.title ?? "",
      body: initialDraft.draft.body ?? "",
      coverImage: initialDraft.draft.coverImage
        ? { url: initialDraft.draft.coverImage }
        : null,
      selectedCategories: initialDraft.draft.categories?.map((c) => c.id) ?? [],
    }));
    initializedRef.current = true;
  }, [initialDraft]);

  const updateState = (updates: Partial<EditorState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  return { state, updateState };
};
