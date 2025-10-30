import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { profileApi } from "./api";

export default function PublicProfile() {
  const { id } = useParams();
  const { data: user, isLoading } = useQuery({
    queryKey: ["user", id],
    queryFn: () => profileApi.getUser(id!),
    enabled: !!id
  });

  if (isLoading) return <div className="card p-6">Loading…</div>;
  if (!user) return <div className="card p-6">User not found.</div>;

  return (
    <section className="space-y-3">
      <header>
        <h1 className="text-2xl font-bold">{user.name}</h1>
        <p className="text-gray-600">
          {user.city ? `📍 ${user.city}` : "City not set"}
        </p>
      </header>

      <div className="card p-4">
        <h2 className="text-lg font-semibold mb-2">Tags</h2>
        {user.tags?.length ? (
          <div className="flex flex-wrap gap-2">
            {user.tags.map((t) => (
              <span key={t} className="px-2 py-1 text-sm bg-gray-100 rounded">
                {t}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No tags yet.</p>
        )}
      </div>
    </section>
  );
}
