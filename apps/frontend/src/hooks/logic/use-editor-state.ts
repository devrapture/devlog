import type { EditorState } from "@/app/(protect-routes)/editor/[slug]/extras";
import type { GetDraftByIdResponse } from "@/types/api";
import { useEffect, useState } from "react";

export const useEditorState = (initialDraft?: GetDraftByIdResponse["data"]) => {
    const [state, setState] = useState<EditorState>({
        title: "",
        body: "",
        coverImage: null,
        selectedCategories: [],
        editorMode: "markdown",
    });

    useEffect(() => {
        if (initialDraft?.draft) {
            setState((prev) => ({
                ...prev,
                title: initialDraft.draft.title ?? "",
                body: initialDraft.draft.body ?? "",
                coverImage: initialDraft.draft.coverImage
                    ? { url: initialDraft.draft.coverImage }
                    : null,
                selectedCategories:
                    initialDraft.draft.categories?.map((c) => c.id) ?? [],
            }));
        }
    }, [initialDraft]);

    const updateState = (updates: Partial<EditorState>) => {
        setState((prev) => ({ ...prev, ...updates }));
    };

    return { state, updateState };
};
