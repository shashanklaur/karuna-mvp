import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { postsApi } from "./api";
import { connectApi } from "../connect/api";

export default function PostDetail() {
  const { id } = useParams();
  const nav = useNavigate();

  const { data: post, isLoading } = useQuery({
    queryKey: ["post", id],
    queryFn: () => postsApi.get(id!),
    enabled: !!id
  });

  const connect = useMutation({
    mutationFn: async () => {
      if (!post) throw new Error("Missing post");
      // connect with the post owner
      const c = await connectApi.connectToPost(post._id, post.ownerId);
      return c;
    },
    onSuccess: (c) => nav(`/connections/${c._id}`)
  });

  if (isLoading) return <p className="p-4">Loading…</p>;
  if (!post) return <p className="p-4">Not found.</p>;

  const isOwner = post.ownerId === "me"; // our mock "current user"

  return (
    <article className="max-w-3xl mx-auto bg-white rounded-2xl p-6 shadow-sm border">
      <div className="text-xs uppercase text-gray-500">{post.type}</div>
      <h1 className="text-2xl font-bold">{post.title}</h1>
      <p className="text-gray-600 mt-2">{post.description}</p>
      <p className="text-sm text-gray-500 mt-1">City: {post.city}</p>

      <div className="flex gap-2 my-3 flex-wrap">
        {post.tags.map((t) => (
          <span key={t} className="text-xs bg-gray-100 px-2 py-1 rounded">
            {t}
          </span>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => connect.mutate()}
          disabled={isOwner || connect.isPending}
          className="bg-emerald-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-xl hover:bg-emerald-700 disabled:cursor-not-allowed"
          aria-disabled={isOwner || connect.isPending}
        >
          {isOwner ? "You own this post" : connect.isPending ? "Connecting…" : "Send Invitation"}
        </button>
        <button onClick={() => nav(-1)} className="px-4 py-2 rounded-xl border">
          Back
        </button>
      </div>
    </article>
  );
}
