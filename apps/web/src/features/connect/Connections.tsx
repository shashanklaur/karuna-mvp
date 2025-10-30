import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { connectApi } from "./api";
import { getPost, getUser } from "../../lib/mockServer";
import { useEffect, useState } from "react";
import type { ServicePost, User } from "../../lib/types";
import type { Connection } from "../../lib/mockServer";

function ConnectionRow({ c }: { c: Connection }) {
  const youStarted = c.starterId === "me";
  const partnerId = youStarted ? c.partnerId : c.starterId;

  const [post, setPost] = useState<ServicePost | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let alive = true;
    getPost(c.postId).then((p) => alive && setPost(p));
    getUser(partnerId).then((u) => alive && setUser(u));
    return () => { alive = false; };
  }, [c.postId, partnerId]);

  return (
    <li className="card p-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <div className="text-sm text-gray-500">{c.status}</div>
          <div className="font-semibold">{post ? post.title : "…"}</div>
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
}

export default function Connections() {
  const { data: list = [], isLoading, isFetching, error } = useQuery({
    queryKey: ["connections"],
    queryFn: () => connectApi.list()
  });

  if (error) {
    return <div className="card p-6 text-red-600">Failed to load connections.</div>;
  }

  return (
    <section>
      <header className="mb-4">
        <h1 className="text-2xl font-bold">Connections</h1>
        <p className="text-gray-600">
          Your active threads with the community.{" "}
          {isFetching && <span className="text-xs text-gray-500">(updating…)</span>}
        </p>
      </header>

      {isLoading ? (
        <div className="card p-6">Loading…</div>
      ) : list.length === 0 ? (
        <div className="card p-6 text-gray-600">You have no active connections yet.</div>
      ) : (
        <ul className="space-y-3">
          {list.map((c) => (
            <ConnectionRow key={c._id} c={c} />
          ))}
        </ul>
      )}
    </section>
  );
}
