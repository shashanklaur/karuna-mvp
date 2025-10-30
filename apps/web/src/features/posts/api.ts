import { listPosts, getPost, createPost } from "../../lib/mockServer";
import type { ServicePost } from "../../lib/types";

export const postsApi = {
  list: (params: {
    type?: "offer" | "request";
    city?: string;
    tag?: string;
    q?: string;
  }) => listPosts(params) as Promise<ServicePost[]>,

  get: (id: string) => getPost(id) as Promise<ServicePost | null>,

  create: (input: {
    type: "offer" | "request";
    title: string;
    description: string;
    tags: string[];
    city: string;
  }) => createPost(input) as Promise<ServicePost>
};
