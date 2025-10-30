import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { ServicePost, User } from "../../lib/types";
import { getUser } from "../../lib/mockServer";

export default function PostCard({ p }: { p: ServicePost }) {
  const [owner, setOwner] = useState<User | null>(null);

  useEffect(() => {
    let mounted = true;
    getUser(p.ownerId).then((u) => mounted && setOwner(u));
    return () => { mounted = false; };
  }, [p.ownerId]);

  return (
    <li className="card p-4 transition hover:shadow-lg">
      <div className="text-xs uppercase tracking-wide text-gray-500">{p.type}</div>
      <h3 className="text-lg font-semibold mt-1">{p.title}</h3>
      <p className="text-sm text-gray-600 mt-1">{p.description}</p>

      <div className="flex gap-2 my-2 flex-wrap">
        {p.tags.map((t) => (
          <span key={t} className="text-xs bg-gray-100 px-2 py-1 rounded">
            {t}
          </span>
        ))}
      </div>

      {owner && (
        <div className="text-sm text-gray-500">
          Posted by <strong>{owner.name}</strong>
          {owner.city ? ` • ${owner.city}` : ""}
        </div>
      )}

      <div className="mt-3">
        <Link
          to={`/service/${p._id}`}
          className="btn btn-primary"
        >
          View details
        </Link>
      </div>
    </li>
  );
}
