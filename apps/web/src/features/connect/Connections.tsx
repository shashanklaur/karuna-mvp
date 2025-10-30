import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { connectApi } from "./api";
import { getPost, getUser } from "../../lib/mockServer";
import { useEffect, useState } from "react";
import type { ServicePost, User } from "../../lib/types";

function useMeta(postId: string, partnerId: string) {
  const [post, setPost] = useState<ServicePost | null>(null);
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    let ok = true;
    getPost(postId).then((p) => ok && setPost(p));
    getUser(partnerId).then((u) => ok && setUser(u));
    return () => { ok = false; };
  }, [postId, partnerId]);
  return { post, user };
}

export default function Connections() {
  const { data: list = [], isLoading } = useQuery({
    queryKey: ["connections"],
    queryFn: () => connectApi.list()
  });

  return (
    <section>
      <header className="mb-4">
        <h1 className="text-2xl font-bold">Connections</h1>
        <p className="text-gray-600">Your active threads with the community.</p>
      </header>

      {isLoading ? (
        <div className="card p-6">Loading…</div>
      ) : list.length === 0 ? (
        <div className="card p-6 text-gray-600">You have no active connections yet.</div>
      ) : (
        <ul className="space-y-3">
          {list.map((c) => {
            const youStarted = c.starterId === "me";
            const partnerId = youStarted ? c.partnerId : c.starterId;
            const { post, user } = useMeta(c.postId, partnerId);

            return (
              <li key={c._id} className="card p-4">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <div className="text-sm text-gray-500">{c.status}</div>
                    <div className="font-semibold">
                      {post ? post.title : "…"}
                    </div>
                    <div className="text-sm text-gray-600">
                      With {user ? user.name : "…"}
                    </div>
                  </div>
                  <Link to={`/connections/${c._id}`} className="btn btn-primary">
                    Open thread
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
