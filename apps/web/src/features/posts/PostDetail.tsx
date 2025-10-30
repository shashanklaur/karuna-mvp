import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { postsApi } from "./api";
import { connectApi } from "../connect/api";
import { getUser } from "../../lib/mockServer";
import type { User } from "../../lib/types";

export default function PostDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const [owner, setOwner] = useState<User | null>(null);

  const { data: post, isLoading } = useQuery({
    queryKey: ["post", id],
    queryFn: () => postsApi.get(id!),
    enabled: !!id,
  });

  useEffect(() => {
    if (post) getUser(post.ownerId).then(setOwner);
  }, [post]);

  const connect = useMutation({
    mutationFn: async () => {
      if (!post) throw new Error("Missing post");
      const c = await connectApi.connectToPost(post._id, post.ownerId);
      return c;
    },
    onSuccess: (c) => nav(`/connections/${c._id}`),
  });

  if (isLoading) return <div className="card p-6">Loading…</div>;
  if (!post) return <div className="card p-6">Not found.</div>;

  const isOwner = post.ownerId === "me";

  return (
    <article className="card p-6 space-y-3">
      <div className="text-xs uppercase text-gray-500">{post.type}</div>
      <h1 className="text-2xl font-bold">{post.title}</h1>
      {owner && (
        <p className="text-sm text-gray-500">
          Posted by <strong>{owner.name}</strong>
          {owner.city ? ` • ${owner.city}` : ""}
        </p>
      )}
      <p className="text-gray-700">{post.description}</p>

      <div className="flex gap-2 my-2 flex-wrap">
        {post.tags.map((t) => (
          <span key={t} className="text-xs bg-gray-100 px-2 py-1 rounded">
            {t}
          </span>
        ))}
      </div>

      <div className="mt-2 flex gap-2">
        <button
          onClick={() => connect.mutate()}
          disabled={isOwner || connect.isPending}
          className="btn btn-primary disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {isOwner ? "You own this post" : connect.isPending ? "Connecting…" : "Send Invitation"}
        </button>
        <button onClick={() => nav(-1)} className="btn btn-secondary">Back</button>
      </div>
    </article>
  );
}
