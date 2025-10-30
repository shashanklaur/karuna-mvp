export type Id = string;

export interface User {
  _id: Id;
  name: string;
  email?: string;
  city?: string;
  tags: string[];
  avatarUrl?: string;
  role?: "user" | "admin";
}

export interface ServicePost {
  _id: Id;
  ownerId: Id;
  type: "offer" | "request";
  title: string;
  description: string;
  tags: string[];
  city: string;
  createdAt: string;
  updatedAt: string;
}

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
