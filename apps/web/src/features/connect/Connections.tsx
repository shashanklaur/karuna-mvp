import { useQuery } from "@tanstack/react-query";
import { connectApi } from "./api";
import { Link } from "react-router-dom";

export default function Connections() {
  const { data } = useQuery({ queryKey: ["connections"], queryFn: connectApi.list });
  const list = data ?? [];

  return (
    <section className="space-y-4 max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold">Connections</h1>
      <ul className="space-y-2">
        {list.map((c) => (
          <li key={c._id} className="bg-white rounded-2xl p-4 shadow-sm border flex items-center justify-between">
            <div>
              <div className="font-semibold">Connection #{c._id.slice(-5)}</div>
              <div className="text-sm text-gray-500">Status: {c.status}</div>
            </div>
            <Link to={`/connections/${c._id}`} className="bg-emerald-600 text-white px-3 py-2 rounded-xl">
              Open
            </Link>
          </li>
        ))}
        {list.length === 0 && <li className="text-sm text-gray-500">No connections yet.</li>}
      </ul>
    </section>
  );
}
