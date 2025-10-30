import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileApi } from "./api";
import { useEffect, useState } from "react";

const TAGS = ["coding","guitar","groceries","tutoring","listening","yoga","resume","math"];

export default function Me(){
  const qc = useQueryClient();
  const { data: me } = useQuery({ queryKey:["me"], queryFn: profileApi.me });

  const [name,setName]=useState("");
  const [city,setCity]=useState("");
  const [tags,setTags]=useState<string[]>([]);

  useEffect(()=>{ if(me){ setName((me as any).name ?? "You"); setCity((me as any).city ?? ""); setTags((me as any).tags ?? []); }},[me]);

  const toggleTag = (t:string)=>{
    setTags(curr => curr.includes(t) ? curr.filter(x=>x!==t) : [...curr, t]);
  };

  const m = useMutation({
    mutationFn: ()=> profileApi.update({ name, city, tags }),
    onSuccess: ()=> qc.invalidateQueries({ queryKey:["me"] })
  });

  if (!me) return <section className="p-4">Please log in.</section>;

  return (
    <section className="space-y-3 max-w-lg mx-auto p-4">
      <h1 className="text-2xl font-bold">My Profile</h1>
      <div className="bg-white rounded-2xl p-4 border shadow-sm space-y-3">
        <label className="block">
          <span className="block text-sm font-medium">Name</span>
          <input className="w-full border rounded-xl px-3 py-2" value={name} onChange={e=>setName(e.target.value)} />
        </label>
        <label className="block">
          <span className="block text-sm font-medium">City</span>
          <input className="w-full border rounded-xl px-3 py-2" value={city} onChange={e=>setCity(e.target.value)} />
        </label>
        <div>
          <span className="block text-sm font-medium">Tags</span>
          <div className="flex flex-wrap gap-2 mt-1">
            {TAGS.map(t=>{
              const active = tags.includes(t);
              return (
                <button key={t} type="button"
                  className={`px-2 py-1 rounded ${active? "bg-emerald-200":"bg-gray-100"}`}
                  onClick={()=>toggleTag(t)}
                  aria-pressed={active}>{t}</button>
              );
            })}
          </div>
        </div>
        <button onClick={()=>m.mutate()} className="bg-emerald-600 text-white px-4 py-2 rounded-xl" disabled={m.isPending}>
          {m.isPending? "Saving…":"Save"}
        </button>
      </div>
    </section>
  );
}
