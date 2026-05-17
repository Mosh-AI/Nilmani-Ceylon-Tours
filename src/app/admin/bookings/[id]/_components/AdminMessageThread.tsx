"use client";

import { useState, useRef, useEffect } from "react";
import { Send, MessageSquare } from "lucide-react";

type Message = {
  id: string;
  content: string;
  senderRole: string;
  createdAt: string;
};

export function AdminMessageThread({
  bookingId,
  guestName,
}: {
  bookingId: string;
  guestName: string;
}) {
  const [msgs, setMsgs] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`/api/admin/messages?bookingId=${bookingId}`)
      .then((r) => r.json())
      .then((data) => {
        setMsgs(data.messages ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [bookingId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setSending(true);

    const res = await fetch("/api/admin/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId, content: text.trim() }),
    });

    const data = await res.json();
    if (data.message) {
      setMsgs((prev) => [...prev, data.message]);
      setText("");
    }
    setSending(false);
  }

  return (
    <section className="rounded-xl border border-gray-100 bg-white shadow-sm flex flex-col">
      <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-3">
        <MessageSquare className="h-4 w-4 text-[#C9A84C]" />
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Guest Messages</h2>
          <p className="text-xs text-gray-400">Thread with {guestName}</p>
        </div>
        <span className="ml-auto rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-500">
          {msgs.length} msg{msgs.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Message list */}
      <div className="flex-1 space-y-3 overflow-y-auto p-5 min-h-[180px] max-h-[400px]">
        {loading && (
          <p className="py-6 text-center text-sm text-gray-400">Loading…</p>
        )}
        {!loading && msgs.length === 0 && (
          <p className="py-8 text-center text-sm text-gray-400">
            No messages yet. Replies you send here are visible to the guest in their dashboard.
          </p>
        )}
        {msgs.map((m) => {
          const isAdmin = m.senderRole === "admin";
          return (
            <div
              key={m.id}
              className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                  isAdmin
                    ? "bg-[#1C1209] text-[#E8D5A3]"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                <p className="leading-relaxed">{m.content}</p>
                <p
                  suppressHydrationWarning
                  className={`mt-1 text-[10px] ${
                    isAdmin ? "text-[#C9A84C]/60" : "text-gray-400"
                  }`}
                >
                  {isAdmin ? "You (Admin)" : guestName} ·{" "}
                  {new Date(m.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Reply input */}
      <form
        onSubmit={handleSend}
        className="flex gap-2 border-t border-gray-100 p-4"
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Reply to guest…"
          maxLength={2000}
          className="flex-1 rounded-full border border-gray-200 px-4 py-2 text-sm focus:border-[#C9A84C] focus:outline-none focus:ring-1 focus:ring-[#C9A84C]"
        />
        <button
          type="submit"
          disabled={sending || !text.trim()}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1C1209] text-[#C9A84C] transition hover:bg-[#2E1E0A] disabled:opacity-40"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
      <p className="pb-3 text-center text-[10px] text-gray-400">
        Replies are visible to the guest in their dashboard.
      </p>
    </section>
  );
}
