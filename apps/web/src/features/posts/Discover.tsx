import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { postsApi } from "./api";
import PostCard from "../../components/data/PostCard";

type Tab = "all" | "offer" | "request";

export default function Discover() {
  const [tab, setTab] = useState<Tab>("all");
  const [q, setQ] = useState("");
  const [city, setCity] = useState("");

  const params = useMemo(() => {
    return {
      type: tab === "all" ? undefined : tab,
      q: q.trim() || undefined,
      city: city || undefined
    } as { type?: "offer" | "request"; q?: string; city?: string };
  }, [tab, q, city]);

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["posts", params],
    queryFn: () => postsApi.list(params)
  });

  return (
    <section>
      <header className="mb-4">
        <h1 className="text-2xl font-bold">Discover</h1>
        <p className="text-gray-600">Browse offers and requests from your community.</p>
      </header>

      {/* Filters */}
      <div className="card p-3 mb-4">
        <div className="flex gap-2 flex-wrap items-center">
          <div className="flex gap-2 bg-gray-100 rounded-xl p-1">
            {(["all", "offer", "request"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3 py-1 rounded-lg capitalize ${
                  tab === t ? "bg-white border shadow-sm" : "opacity-70"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by title or description…"
            className="border rounded-xl px-3 py-2 flex-1 min-w-56"
          />

          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="border rounded-xl px-3 py-2"
          >
            <option value="">All cities</option>
            {["Toronto", "Mississauga", "Brampton", "Etobicoke", "Scarborough", "Vaughan"].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="card p-6 text-gray-600">Loading…</div>
      ) : posts.length === 0 ? (
        <div className="card p-6 text-gray-600">
          No posts found. Try a different filter or{" "}
          <span className="font-medium">publish a new one</span>.
        </div>
      ) : (
        <ul className="grid gap-3 md:grid-cols-2">
          {posts.map((p) => (
            <PostCard key={p._id} p={p} />
          ))}
        </ul>
      )}
    </section>
  );
}
