"use client";
import { SavedCloudIcon } from "@/components/icons/saved-cloud-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useDebounce } from "@/hooks/logic/use-debounce";
import { useEditorState } from "@/hooks/logic/use-editor-state";
import { toast } from "@/hooks/logic/use-toast";
import { useUploadFile } from "@/hooks/mutate/use-file-upload";
import {
  usePublishPost,
  useUpdateDraft
} from "@/hooks/mutate/use-posts";
import { useGetCategories } from "@/hooks/query/use-categories";
import { useGetDraftById } from "@/hooks/query/use-posts";
import { MAX_MB } from "@/lib/constants";
import { routes } from "@/lib/routes";
import { isAxiosError } from "axios";
import DOMPurify from "isomorphic-dompurify";
import {
  Bold,
  Code,
  ImageIcon,
  Italic,
  Link2,
  List,
  Loader2,
  Send,
  Upload,
  X,
} from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import { useCallback, useEffect, useRef, useState } from "react";
import { AutoSavedStatus, type EditorState } from "./extras";

const EditorClientPage = () => {
  const { slug } = useParams();
  const router = useRouter();
  const {
    data: draft,
    isLoading,
    isError,
  } = useGetDraftById({
    variables: { draftId: String(slug) },
    enabled: !!slug,
  });
  const [tab, setTab] = useQueryState("tab");

  const [autoSaveStatus, setAutoSaveStatus] = useState<AutoSavedStatus>(
    AutoSavedStatus.IDLE,
  );
  const { state, updateState } = useEditorState(draft);
  const { title, body, coverImage, selectedCategories, editorMode } = state;
  const isInitializedRef = useRef(false);
  const debouncedTitle = useDebounce(title, 1000); // 1 second delay
  const debouncedBody = useDebounce(body, 1000); // 1 second delay

  const [isUploading, setIsUploading] = useState(false);

  const { data: categories } = useGetCategories();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFileMutation = useUploadFile();
  const updateDraftMutation = useUpdateDraft();
  const publishPostMutation = usePublishPost();

  const handleChangeTab = async (e: string) => await setTab(e);

  const toggleCategory = async (categoryId: string) => {
    const newCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((id) => id !== categoryId)
      : [...selectedCategories, categoryId];

    updateState({ selectedCategories: newCategories });
    await handleSaveDraft({
      selectedCategories: newCategories,
    });
  };

  const handleFileUpload = useCallback(
    async (file: File) => {
      if (!file) return;

      if (file.size > MAX_MB * 1024 * 1024) {
        toast({
          description: `Image too large. Max ${MAX_MB}MB.`,
          variant: "destructive",
        });
        return;
      }
      setIsUploading(true);
      try {
        const result = await uploadFileMutation.mutateAsync({
          file,
          altText: `Cover image for ${title || "untitled post"}`,
        });
        updateState({ coverImage: result });
        await handleSaveDraft({
          coverImage: result,
        });
      } catch (error) {
        toast({
          description: isAxiosError<{ message: string }>(error)
            ? (error.response?.data?.message ??
              "Something went wrong. Please try again.")
            : "Something went wrong. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsUploading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [uploadFileMutation, title],
  );

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      void handleFileUpload(file);
    }
  };

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const file = event.dataTransfer.files[0];
      if (file?.type.startsWith("image/")) {
        void handleFileUpload(file);
      }
    },
    [handleFileUpload],
  );

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const removeCoverImage = async () => {
    updateState({ coverImage: null });
    await handleSaveDraft({
      coverImage: null,
    });
  };

  const handleSaveDraft = useCallback(
    async (
      overrides?: Partial<
        Pick<
          EditorState,
          "title" | "body" | "selectedCategories" | "coverImage"
        >
      >,
    ) => {
      if (!slug || !isInitializedRef.current) return;

      setAutoSaveStatus(AutoSavedStatus.SAVING);
      try {
        // Update existing draft
        const res = await updateDraftMutation.mutateAsync({
          draftId: String(slug),
          data: {
            title: (overrides?.title ?? title)?.trim(),
            body: (overrides?.body ?? body)?.trim(),
            categories: (overrides?.selectedCategories ?? selectedCategories)
              .length
              ? (overrides?.selectedCategories ?? selectedCategories)
              : undefined,
            coverImage: (overrides?.coverImage ?? coverImage)?.url,
          },
        });

        if (res) {
          setAutoSaveStatus(AutoSavedStatus.SAVED);
        }
      } catch (error: unknown) {
        setAutoSaveStatus(AutoSavedStatus.ERROR);
        toast({
          description: isAxiosError<{ message: string }>(error)
            ? (error.response?.data?.message ??
              "Something went wrong. Please try again.")
            : "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    },
    [slug, title, body, selectedCategories, coverImage, updateDraftMutation],
  );

  const handlePublish = async () => {
    if (
      !title?.trim() ||
      !body?.trim() ||
      selectedCategories.length === 0 ||
      !coverImage
    ) {
      return;
    }

    try {
      const res = await publishPostMutation.mutateAsync({
        draftId: String(slug),
        data: {
          title: title.trim(),
          body: body.trim(),
          categories: selectedCategories,
          coverImage: coverImage.url!,
        },
      });

      const newSlug = res?.data?.slug;
      if (!newSlug) {
        toast({
          description: "Publish succeeded but slug missing.",
          variant: "destructive",
        });
        return;
      }
      router.push(routes.postBySlug(newSlug));
    } catch (error) {
      toast({
        description: isAxiosError<{ message: string }>(error)
          ? (error.response?.data?.message ??
            "Publish failed. Please try again.")
          : "Publish failed. Please try again.",
        variant: "destructive",
      });
    }
  };

  const insertMarkdown = (syntax: string, placeholder = "") => {
    const textarea = document.getElementById(
      "body-textarea",
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = body.substring(start, end);
    const replacement = selectedText || placeholder;

    let newText = "";
    switch (syntax) {
      case "bold":
        newText = `**${replacement}**`;
        break;
      case "italic":
        newText = `*${replacement}*`;
        break;
      case "code":
        newText = `\`${replacement}\``;
        break;
      case "link":
        newText = `[${replacement || "link text"}](url)`;
        break;
      case "image":
        newText = `![${replacement || "alt text"}](image-url)`;
        break;
      case "list":
        newText = `- ${replacement || "list item"}`;
        break;
      default:
        return;
    }

    const newBody = body.substring(0, start) + newText + body.substring(end);
    updateState({ body: newBody });

    // Focus back to textarea
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + newText.length,
        start + newText.length,
      );
    }, 0);
  };

  useEffect(() => {
    if (!draft || isInitializedRef.current) return;
    updateState({
      title: draft.draft.title ?? "",
      body: draft.draft.body ?? "",
      coverImage: draft.draft.coverImage
        ? {
          url: draft.draft.coverImage,
        }
        : null,
      selectedCategories: draft.draft.categories?.map((c) => c.id) ?? [],
    });

    isInitializedRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft]);

  // Auto-save on title change (debounced)
  useEffect(() => {
    if (!isInitializedRef.current) return;
    if (isLoading || isError || !slug) return;

    void handleSaveDraft();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedTitle]);

  // Auto-save on body change (debounced)
  useEffect(() => {
    if (!isInitializedRef.current) return;
    if (isLoading || isError || !slug) return;

    void handleSaveDraft();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedBody]);
  useEffect(() => {
    if (!isLoading && isError) {
      router.replace(routes.root);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isError]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Create New Post</h1>
        <div className="flex items-center gap-3">
          {autoSaveStatus === AutoSavedStatus.SAVING && (
            <div className="flex items-center gap-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <p className="text-muted-foreground">Saving...</p>
            </div>
          )}

          {autoSaveStatus === AutoSavedStatus.SAVED && (
            <div className="flex items-center gap-x-2">
              <SavedCloudIcon className="text-primary" />
              <p className="text-primary">Saved</p>
            </div>
          )}

          {autoSaveStatus === AutoSavedStatus.ERROR && (
            <div className="flex items-center gap-x-2">
              <X className="text-destructive h-4 w-4" />
              <p className="text-destructive">Save failed</p>
            </div>
          )}

          <Button
            onClick={handlePublish}
            disabled={
              publishPostMutation.isPending ||
              !title?.trim() ||
              !body?.trim() ||
              selectedCategories?.length === 0 ||
              !coverImage
            }
          >
            {publishPostMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            Publish
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Editor */}
        <div className="space-y-6 lg:col-span-2">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter your post title..."
              value={title}
              onChange={(e) => updateState({ title: e.target.value })}
              className="text-lg"
            />
          </div>

          {/* Cover Image */}
          <div className="space-y-2">
            <Label>Cover Image</Label>
            {coverImage?.url ? (
              <div className="relative">
                <Image
                  src={coverImage.url}
                  alt={coverImage.altText ?? "Cover image"}
                  className="h-48 w-full rounded-lg object-cover"
                  width={1200}
                  height={630}
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={removeCoverImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div
                className="border-muted-foreground/25 hover:border-muted-foreground/50 cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
              >
                {isUploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <p className="text-muted-foreground text-sm">
                      Uploading...
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="text-muted-foreground h-8 w-8" />
                    <p className="text-muted-foreground text-sm">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-muted-foreground text-xs">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            )}
          </div>

          {/* Content Editor */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Content</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="flex rounded-md border">
                    <Button
                      variant={editorMode === "markdown" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => updateState({ editorMode: "markdown" })}
                      className="rounded-r-none"
                    >
                      Markdown
                    </Button>
                    <Button
                      variant={editorMode === "plain" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => updateState({ editorMode: "plain" })}
                      className="rounded-l-none"
                    >
                      Plain Text
                    </Button>
                  </div>
                  {editorMode === "markdown" && (
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => insertMarkdown("bold")}
                        title="Bold"
                      >
                        <Bold className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => insertMarkdown("italic")}
                        title="Italic"
                      >
                        <Italic className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => insertMarkdown("code")}
                        title="Code"
                      >
                        <Code className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => insertMarkdown("link")}
                        title="Link"
                      >
                        <Link2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => insertMarkdown("image")}
                        title="Image"
                      >
                        <ImageIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => insertMarkdown("list")}
                        title="List"
                      >
                        <List className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs
                defaultValue={tab ?? "write"}
                onValueChange={handleChangeTab}
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="write">Write</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>

                <TabsContent value="write" className="mt-4">
                  <Textarea
                    id="body-textarea"
                    placeholder={
                      editorMode === "markdown"
                        ? "Write your post content here... You can use Markdown syntax!"
                        : "Write your post content here..."
                    }
                    value={body}
                    onChange={(e) => updateState({ body: e.target.value })}
                    className={`min-h-[400px] text-sm ${editorMode === "markdown" ? "font-mono" : ""
                      }`}
                  />
                </TabsContent>

                <TabsContent value="preview" className="mt-4">
                  <div className="bg-muted/30 min-h-[400px] rounded-md border p-4">
                    <div className="prose prose-sm max-w-none">
                      {body ? (
                        editorMode === "markdown" ? (
                          <div
                            dangerouslySetInnerHTML={{
                              __html: DOMPurify.sanitize(
                                body
                                  .replace(
                                    /\*\*(.*?)\*\*/g,
                                    "<strong>$1</strong>",
                                  )
                                  .replace(/\*(.*?)\*/g, "<em>$1</em>")
                                  .replace(/`(.*?)`/g, "<code>$1</code>")
                                  .replace(/^### (.*$)/gim, "<h3>$1</h3>")
                                  .replace(/^## (.*$)/gim, "<h2>$1</h2>")
                                  .replace(/^# (.*$)/gim, "<h1>$1</h1>")
                                  .replace(/^\* (.*$)/gim, "<li>$1</li>")
                                  .replace(/^\d+\. (.*$)/gim, "<li>$1</li>")
                                  .replace(
                                    /\[([^\]]+)\]\(([^)]+)\)/g,
                                    '<a href="$2">$1</a>',
                                  )
                                  .replace(
                                    /!\[([^\]]*)\]\(([^)]+)\)/g,
                                    '<img src="$2" alt="$1" />',
                                  )
                                  .replace(/\n/g, "<br>"),
                              ),
                            }}
                          />
                        ) : (
                          // <div
                          //   dangerouslySetInnerHTML={{
                          //     __html: body
                          //       .replace(
                          //         /\*\*(.*?)\*\*/g,
                          //         "<strong>$1</strong>",
                          //       )
                          //       .replace(/\*(.*?)\*/g, "<em>$1</em>")
                          //       .replace(/`(.*?)`/g, "<code>$1</code>")
                          //       .replace(/^### (.*$)/gim, "<h3>$1</h3>")
                          //       .replace(/^## (.*$)/gim, "<h2>$1</h2>")
                          //       .replace(/^# (.*$)/gim, "<h1>$1</h1>")
                          //       .replace(/^\* (.*$)/gim, "<li>$1</li>")
                          //       .replace(/^\d+\. (.*$)/gim, "<li>$1</li>")
                          //       .replace(
                          //         /\[([^\]]+)\]\(([^)]+)\)/g,
                          //         '<a href="$2">$1</a>',
                          //       )
                          //       .replace(
                          //         /!\[([^\]]*)\]\(([^)]+)\)/g,
                          //         '<img src="$2" alt="$1" />',
                          //       )
                          //       .replace(/\n/g, "<br>"),
                          //   }}
                          // />
                          <div className="whitespace-pre-wrap">{body}</div>
                        )
                      ) : (
                        <p className="text-muted-foreground">
                          Nothing to preview yet...
                        </p>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {categories?.map((category) => (
                  <Badge
                    key={category.id}
                    variant={
                      selectedCategories.includes(category.id)
                        ? "default"
                        : "outline"
                    }
                    className="cursor-pointer capitalize"
                    onClick={() => toggleCategory(category.id)}
                  >
                    {category.name}
                  </Badge>
                ))}
              </div>
              {selectedCategories.length === 0 && (
                <p className="text-muted-foreground mt-2 text-sm">
                  Select at least one category
                </p>
              )}
            </CardContent>
          </Card>

          {/* Publishing Tips */}
          <Card>
            <CardHeader>
              <CardTitle>Publishing Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <div className="bg-primary mt-2 h-2 w-2 flex-shrink-0 rounded-full" />
                <p>Use a compelling title that clearly describes your post</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="bg-primary mt-2 h-2 w-2 flex-shrink-0 rounded-full" />
                <p>Add a cover image to make your post more engaging</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="bg-primary mt-2 h-2 w-2 flex-shrink-0 rounded-full" />
                <p>
                  Select relevant categories to help readers find your content
                </p>
              </div>
              <div className="flex items-start gap-2">
                <div className="bg-primary mt-2 h-2 w-2 flex-shrink-0 rounded-full" />
                <p>
                  {editorMode === "markdown"
                    ? "Use markdown for formatting: **bold**, *italic*, `code`, # headings"
                    : "Write clear, well-structured content that's easy to read"}
                </p>
              </div>
              <div className="flex items-start gap-2">
                <div className="bg-primary mt-2 h-2 w-2 flex-shrink-0 rounded-full" />
                <p>Use the preview tab to see how your post will look</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EditorClientPage;
