import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { profileApi } from "./api";

export default function PublicProfile(){
  const { id } = useParams();
  const { data: user, isLoading } = useQuery({
    queryKey:["user", id],
    queryFn: ()=> profileApi.get(id!),
    enabled: !!id
  });

  if (isLoading) return <p className="p-4">Loading…</p>;
  if (!user) return <p className="p-4">User not found.</p>;

  const u = user as any;

  return (
    <section className="space-y-2 max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold">{u.name ?? "User"}</h1>
      <div className="text-sm text-gray-600">{u.city ?? "-"}</div>
      <div className="flex gap-2 flex-wrap">
        {(u.tags ?? []).map((t:string)=> <span key={t} className="text-xs bg-gray-100 px-2 py-1 rounded">{t}</span>)}
      </div>
    </section>
  );
}
