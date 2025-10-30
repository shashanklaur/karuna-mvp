import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { postsApi } from "./api";
import PostCard from "../../components/data/PostCard";

const TAGS = ["coding", "guitar", "groceries", "tutoring", "listening", "yoga", "resume", "math"];
const CITIES = ["Toronto", "Mississauga", "Brampton", "Etobicoke"];
const PAGE_SIZE = 10;

export default function Discover() {
  const [tab, setTab] = useState<"offers" | "requests">("offers");
  const [city, setCity] = useState("");
  const [tag, setTag] = useState("");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  const type = tab === "offers" ? "offer" : ("request" as const);

  const { data } = useQuery({
    queryKey: ["posts", type, city, tag, q],
    queryFn: () => postsApi.list({ type, city: city || undefined, tag: tag || undefined, q: q || undefined })
  });

  const list = useMemo(() => data ?? [], [data]);
  const start = (page - 1) * PAGE_SIZE;
  const paged = list.slice(start, start + PAGE_SIZE);

  return (
    <section className="max-w-6xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Discover</h1>

      <div className="flex flex-wrap items-center gap-2">
        <div role="tablist" aria-label="Post type" className="flex gap-2">
          <button
            role="tab"
            aria-selected={tab === "offers"}
            aria-controls="offers-panel"
            className={`px-3 py-1 rounded-xl ${tab === "offers" ? "bg-emerald-100 text-emerald-800" : "bg-gray-100"}`}
            onClick={() => {
              setTab("offers");
              setPage(1);
            }}
          >
            Offers
          </button>
          <button
            role="tab"
            aria-selected={tab === "requests"}
            aria-controls="requests-panel"
            className={`px-3 py-1 rounded-xl ${tab === "requests" ? "bg-emerald-100 text-emerald-800" : "bg-gray-100"}`}
            onClick={() => {
              setTab("requests");
              setPage(1);
            }}
          >
            Requests
          </button>
        </div>

        <input
          className="ml-auto border rounded-xl px-3 py-1"
          placeholder="Search…"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
        />
        <select
          className="border rounded-xl px-3 py-1"
          value={city}
          onChange={(e) => {
            setCity(e.target.value);
            setPage(1);
          }}
          aria-label="Filter by city"
        >
          <option value="">All cities</option>
          {CITIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          className="border rounded-xl px-3 py-1"
          value={tag}
          onChange={(e) => {
            setTag(e.target.value);
            setPage(1);
          }}
          aria-label="Filter by tag"
        >
          <option value="">All tags</option>
          {TAGS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <ul id={tab === "offers" ? "offers-panel" : "requests-panel"} role="tabpanel" className="grid md:grid-cols-2 gap-3">
        {paged.map((p) => (
          <PostCard key={p._id} p={p} />
        ))}
        {paged.length === 0 && <li className="text-sm text-gray-500">No results.</li>}
      </ul>

      <div className="flex gap-2 justify-end">
        <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1 border rounded-xl">
          Prev
        </button>
        <button
          disabled={start + PAGE_SIZE >= list.length}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 border rounded-xl"
        >
          Next
        </button>
      </div>
    </section>
  );
}
