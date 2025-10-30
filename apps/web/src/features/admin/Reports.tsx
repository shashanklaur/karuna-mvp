import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "./api";

export default function Reports(){
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey:["reports"], queryFn: adminApi.list });
  const close = useMutation({
    mutationFn: (id:string)=> adminApi.close(id),
    onSuccess: ()=> qc.invalidateQueries({ queryKey:["reports"] })
  });

  const list = data ?? [];

  return (
    <section className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-3">Admin • Reports</h1>
      <table className="w-full bg-white rounded-2xl border shadow-sm overflow-hidden">
        <thead className="bg-gray-50 text-left">
          <tr>
            <th className="p-3">Reporter</th>
            <th className="p-3">Target</th>
            <th className="p-3">Reason</th>
            <th className="p-3">Status</th>
            <th className="p-3"></th>
          </tr>
        </thead>
        <tbody>
          {list.map((r:any)=>(
            <tr key={r._id} className="border-t">
              <td className="p-3">{r.reporterId}</td>
              <td className="p-3">{r.targetUserId || r.targetPostId || "-"}</td>
              <td className="p-3">{r.reason}</td>
              <td className="p-3">{r.status}</td>
              <td className="p-3">
                {r.status==="open" && <button onClick={()=>close.mutate(r._id)} className="px-3 py-1 rounded-xl border">Close</button>}
              </td>
            </tr>
          ))}
          {list.length===0 && (
            <tr><td className="p-3 text-sm text-gray-500" colSpan={5}>No reports</td></tr>
          )}
        </tbody>
      </table>
    </section>
  );
}
