export interface PaginationMeta {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface SuccessResponse {
  success: true;
  message: string;
}

export interface ApiBaseResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: {
    items?: T[];
  };
  meta?: PaginationMeta;
}

export interface Category {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  role: string;
  email: string;
  avatar: string | null;
  bio: string | null;
  displayName: string | null;
  isActive: boolean;
  followersCount?: number;
  followingCount?: number;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserCredentials {
  email: string;
  password: string;
}

export type UserLogin = UserCredentials;
export type UserRegister = UserCredentials;

export type SignUpResponse = ApiBaseResponse<{ user: User }>;

export type GetCategoriesResponse = ApiBaseResponse<Category[]>;

export type SessionUser = ApiBaseResponse<{
  user: User;
  accessToken: string;
}>;

export type GetUserProfileResponse = ApiBaseResponse<{ user: User }>;
export type GetUserProfileByIdResponse = ApiBaseResponse<{
  user: User;
  isFollowing: boolean;
}>;

export type UserUpdate = Partial<User>;

type FollowItem = {
  id: string;
  avatar: string | null;
  displayName: string | null;
};

type Following = {
  id: string;
  following: FollowItem;
  createdAt: string;
  updatedAt: string;
};

type Follower = {
  id: string;
  follower: FollowItem;
  createdAt: string;
  updatedAt: string;
};

export type GetUserFollowingResponse = ApiResponse<Following>;

export type GetUserFollowersResponse = ApiResponse<Follower>;
