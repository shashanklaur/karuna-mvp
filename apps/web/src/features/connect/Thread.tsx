import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { connectApi } from "./api";
import { useState } from "react";
import type { Message } from "../../lib/mockServer";

export default function Thread() {
  const { id } = useParams();
  const qc = useQueryClient();
  const [text, setText] = useState("");

  const { data: thread, isLoading } = useQuery({
    queryKey: ["thread", id],
    queryFn: () => connectApi.getThread(id!),
    enabled: !!id
  });

  const send = useMutation({
    mutationFn: () => connectApi.sendMessage(id!, text),
    onSuccess: () => {
      setText("");
      qc.invalidateQueries({ queryKey: ["thread", id] });
    }
  });

  const complete = useMutation({
    mutationFn: () => connectApi.completeConnection(id!),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["thread", id] });
      qc.invalidateQueries({ queryKey: ["connections"] });
    }
  });

  if (isLoading || !thread) return <div className="card p-6">Loading…</div>;

  return (
    <section className="space-y-3">
      <header>
        <h1 className="text-2xl font-bold">Thread</h1>
        <p className="text-gray-600">Chat and coordinate details.</p>
      </header>

      <div className="card p-4 space-y-3">
        <ul className="space-y-2">
          {thread.messages.map((m: Message) => (
            <li key={m._id} className={`max-w-[75%] ${m.senderId === "me" ? "ml-auto text-right" : ""}`}>
              <div className={`px-3 py-2 rounded-xl ${m.senderId === "me" ? "bg-emerald-100" : "bg-gray-100"}`}>
                <div className="text-sm">{m.body}</div>
                <div className="text-xs text-gray-500 mt-1">{new Date(m.createdAt).toLocaleString()}</div>
              </div>
            </li>
          ))}
        </ul>

        <form
          onSubmit={(e) => { e.preventDefault(); if (text.trim()) send.mutate(); }}
          className="flex gap-2"
        >
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="border rounded-xl px-3 py-2 flex-1"
            placeholder="Write a message…"
          />
          <button className="btn btn-primary" disabled={send.isPending || !text.trim()}>
            {send.isPending ? "Sending…" : "Send"}
          </button>
        </form>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => complete.mutate()}
          className="btn btn-secondary"
          disabled={complete.isPending || thread.connection.status !== "active"}
        >
          {thread.connection.status === "completed" ? "Completed" : complete.isPending ? "Marking…" : "Mark completed"}
        </button>
      </div>
    </section>
  );
}
