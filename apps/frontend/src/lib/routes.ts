export const routes = {
  root: "/",
  auth: {
    signUp: "/auth/signup",
    login: "/auth/login",
  },
  profile: "/profile",
  editProfile: "/profile/edit",
  userProfile: (userId: string) => `/profile/${userId}`,
  drafts: "/drafts",
  editor: (draftId: string) => `/editor/${draftId}`,
  postBySlug: (slug: string) => `/posts/${slug}`,
};
