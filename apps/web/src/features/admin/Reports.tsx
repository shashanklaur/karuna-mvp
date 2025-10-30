import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "./api";

export default function Reports() {
  const qc = useQueryClient();
  const { data: list = [], isLoading } = useQuery({
    queryKey: ["reports"],
    queryFn: () => adminApi.list()
  });

  const close = useMutation({
    mutationFn: (id: string) => adminApi.close(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reports"] })
  });

  return (
    <section>
      <header className="mb-4">
        <h1 className="text-2xl font-bold">Reports</h1>
        <p className="text-gray-600">Admin moderation queue.</p>
      </header>

      {isLoading ? (
        <div className="card p-6">Loading…</div>
      ) : list.length === 0 ? (
        <div className="card p-6 text-gray-600">No open reports.</div>
      ) : (
        <ul className="space-y-3">
          {list.map((r) => (
            <li key={r._id} className="card p-4 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm text-gray-500">{r.status}</div>
                  <div className="font-semibold">Reason:</div>
                  <p className="text-gray-700">{r.reason}</p>
                  {r.targetUserId && (
                    <div className="text-sm text-gray-500 mt-1">
                      User ID: {r.targetUserId}
                    </div>
                  )}
                  {r.targetPostId && (
                    <div className="text-sm text-gray-500">
                      Post ID: {r.targetPostId}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => close.mutate(r._id)}
                  disabled={close.isPending}
                  className="btn btn-secondary"
                >
                  {close.isPending ? "…" : "Mark closed"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
