import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { connectApi } from "./api";
import { gratitudeApi } from "../gratitude/api";
import { useState } from "react";
import type { Message } from "../../lib/mockServer";

export default function Thread() {
  const { id } = useParams();
  const qc = useQueryClient();
  const [text, setText] = useState("");
  const [gratitudeText, setGratitudeText] = useState("");
  const [showGratitude, setShowGratitude] = useState(false);
  const [success, setSuccess] = useState(false);

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
      setShowGratitude(true); // show gratitude input after completion
    }
  });

  const sendGratitude = useMutation({
    mutationFn: () => gratitudeApi.create(id!, "u1", gratitudeText), // mock to first user; backend will fix later
    onSuccess: () => {
      setSuccess(true);
      setGratitudeText("");
      setShowGratitude(false);
      qc.invalidateQueries({ queryKey: ["gratitude"] });
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

      <div className="flex flex-col gap-3">
        <button
          onClick={() => complete.mutate()}
          className="btn btn-secondary w-fit"
          disabled={complete.isPending || thread.connection.status === "completed"}
        >
          {thread.connection.status === "completed"
            ? "Completed"
            : complete.isPending
            ? "Marking…"
            : "Mark Completed"}
        </button>

        {showGratitude && (
          <div className="card p-4 space-y-2 max-w-md">
            <h2 className="text-lg font-semibold">Leave a gratitude note</h2>
            <textarea
              value={gratitudeText}
              onChange={(e) => setGratitudeText(e.target.value)}
              rows={3}
              className="w-full border rounded-xl px-3 py-2"
              placeholder="Write a short thank-you message…"
            />
            <div className="flex gap-2">
              <button
                onClick={() => sendGratitude.mutate()}
                disabled={sendGratitude.isPending || !gratitudeText.trim()}
                className="btn btn-primary"
              >
                {sendGratitude.isPending ? "Sending…" : "Send Gratitude"}
              </button>
              <button
                onClick={() => setShowGratitude(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {success && (
          <div className="text-emerald-700 font-medium">
            Gratitude note sent successfully!
          </div>
        )}
      </div>
    </section>
  );
}
