import { useQuery } from "@tanstack/react-query";
import { gratitudeApi } from "./api";
import type { GratitudeNote } from "../../lib/mockServer";

export default function GratitudeList() {
  const { data: list = [], isLoading } = useQuery({
    queryKey: ["gratitude"],
    queryFn: () => gratitudeApi.mine()
  });

  return (
    <section>
      <header className="mb-4">
        <h1 className="text-2xl font-bold">Gratitude</h1>
        <p className="text-gray-600">Notes you’ve received or sent.</p>
      </header>

      {isLoading ? (
        <div className="card p-6">Loading…</div>
      ) : list.length === 0 ? (
        <div className="card p-6 text-gray-600">No gratitude notes yet.</div>
      ) : (
        <ul className="space-y-3">
          {list.map((g: GratitudeNote) => (
            <li key={g._id} className="card p-4">
              <div className="text-sm text-gray-500">{new Date(g.createdAt).toLocaleString()}</div>
              <div className="mt-1">{g.text}</div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
