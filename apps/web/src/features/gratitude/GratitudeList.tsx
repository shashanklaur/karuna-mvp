import { useQuery } from "@tanstack/react-query";
import { gratitudeApi } from "./api";

export default function GratitudeList() {
  const { data } = useQuery({ queryKey: ["gratitude"], queryFn: gratitudeApi.list });
  const list = data ?? [];

  return (
    <section className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-3">Gratitude Notes</h1>
      <ul className="space-y-2">
        {list.map((n) => (
          <li key={n._id} className="bg-white rounded-2xl p-4 border shadow-sm">
            <div className="text-xs text-gray-500">{new Date(n.createdAt).toLocaleString()}</div>
            <p>{n.text}</p>
          </li>
        ))}
        {list.length === 0 && <li className="text-sm text-gray-500">No gratitude yet.</li>}
      </ul>
    </section>
  );
}
