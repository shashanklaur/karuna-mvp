export type Id = string;

/* Posts */
export type PostType = "offer" | "request";

export interface ServicePost {
  _id: Id;
  ownerId: Id;
  type: PostType;
  title: string;
  description: string;
  tags: string[];
  city: string;
  createdAt: string;
  updatedAt: string;
}

/* Users (minimal for profile) */
export interface User {
  _id: Id;
  name: string;
  city?: string;
  tags?: string[];
  avatarUrl?: string;
}

/* Admin reports (minimal) */
export interface Report {
  _id: Id;
  reporterId: Id;
  targetUserId?: Id;
  targetPostId?: Id;
  reason: string;
  status: "open" | "closed";
  createdAt: string;
  updatedAt: string;
}
