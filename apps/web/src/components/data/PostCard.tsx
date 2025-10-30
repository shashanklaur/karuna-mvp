import { Link } from "react-router-dom";
import type { ServicePost } from "../../lib/types";

export default function PostCard({ p }: { p: ServicePost }) {
  return (
    <li className="bg-white rounded-2xl p-4 shadow-sm border">
      <div className="text-xs uppercase text-gray-500">{p.type}</div>
      <h3 className="text-lg font-semibold">{p.title}</h3>
      <p className="text-sm text-gray-600">{p.description}</p>

      <div className="flex gap-2 my-2 flex-wrap">
        {p.tags.map((t) => (
          <span key={t} className="text-xs bg-gray-100 px-2 py-1 rounded">
            {t}
          </span>
        ))}
      </div>

      <div className="text-sm text-gray-500">City: {p.city}</div>

      <div className="mt-3">
        <Link
          to={`/service/${p._id}`}
          className="inline-block bg-emerald-600 text-white px-3 py-2 rounded-xl hover:bg-emerald-700"
        >
          View details
        </Link>
      </div>
    </li>
  );
}
