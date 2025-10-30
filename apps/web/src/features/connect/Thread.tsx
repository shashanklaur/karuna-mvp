import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { connectApi } from "./api";
import { useState } from "react";
import { gratitudeApi } from "@features/gratitude/api";

export default function Thread() {
  const { id } = useParams();
  const qc = useQueryClient();
  const [body, setBody] = useState("");

  const { data: conn } = useQuery({
    queryKey: ["connection", id],
    queryFn: () => connectApi.get(id!),
    enabled: !!id
  });
  const { data: msgs } = useQuery({
    queryKey: ["messages", id],
    queryFn: () => connectApi.messages.list(id!),
    enabled: !!id
  });

  const send = useMutation({
    mutationFn: () => connectApi.messages.send(id!, body),
    onSuccess: () => {
      setBody("");
      qc.invalidateQueries({ queryKey: ["messages", id] });
    }
  });

  const complete = useMutation({
    mutationFn: () => connectApi.setStatus(id!, "completed"),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["connection", id] })
  });

  const [showGrat, setShowGrat] = useState(false);
  const [text, setText] = useState("");

  const sendThanks = useMutation({
    mutationFn: () => gratitudeApi.create(id!, text),
    onSuccess: () => {
      setShowGrat(false);
      setText("");
      qc.invalidateQueries({ queryKey: ["gratitude"] });
    }
  });

  return (
    <section className="space-y-4 max-w-3xl mx-auto p-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Thread #{id?.slice(-5)}</h1>
        {conn?.status !== "completed" && (
          <button onClick={() => complete.mutate()} className="px-3 py-2 rounded-xl border bg-white hover:bg-gray-50">
            Mark Complete
          </button>
        )}
      </header>

      <div className="bg-white rounded-2xl p-4 shadow-sm border min-h-[220px]">
        <ul className="space-y-2">
          {msgs?.map((m) => (
            <li key={m._id} className={`${m.senderId === "me" ? "text-right" : ""}`}>
              <span
                className={`inline-block px-3 py-2 rounded-2xl ${
                  m.senderId === "me" ? "bg-emerald-100" : "bg-gray-100"
                }`}
              >
                {m.body}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (body.trim()) send.mutate();
        }}
      >
        <input
          className="flex-1 border rounded-xl px-3 py-2"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Type a message…"
        />
        <button className="bg-emerald-600 text-white px-4 py-2 rounded-xl" disabled={send.isPending}>
          Send
        </button>
      </form>

      {conn?.status === "completed" && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border space-y-2">
          {!showGrat ? (
            <button className="px-3 py-2 rounded-xl border" onClick={() => setShowGrat(true)}>
              Leave a Gratitude Note
            </button>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (text.trim()) sendThanks.mutate();
              }}
              className="space-y-2"
            >
              <textarea
                className="w-full border rounded-xl px-3 py-2"
                rows={3}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="What are you thankful for?"
              />
              <button className="bg-emerald-600 text-white px-4 py-2 rounded-xl" disabled={sendThanks.isPending}>
                Send Thanks
              </button>
            </form>
          )}
        </div>
      )}
    </section>
  );
}
