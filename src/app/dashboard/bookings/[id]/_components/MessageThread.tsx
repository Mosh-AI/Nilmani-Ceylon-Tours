"use client";

import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

type Message = {
  id: string;
  content: string;
  senderRole: string;
  createdAt: string;
};

export function MessageThread({
  bookingId,
  userId,
  userName,
  initialMessages,
}: {
  bookingId: string;
  userId: string;
  userName: string;
  initialMessages: Message[];
}) {
  const [msgs, setMsgs] = useState<Message[]>(initialMessages);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setSending(true);

    const res = await fetch("/api/messages", {
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
    <section className="flex h-full flex-col rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-5 py-3">
        <h2 className="text-sm font-semibold text-gray-900">Messages</h2>
        <p className="text-xs text-gray-400">
          Chat with Roshan about your booking
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-3 overflow-y-auto p-5 min-h-[200px] max-h-[400px]">
        {msgs.length === 0 && (
          <p className="py-8 text-center text-sm text-gray-400">
            No messages yet. Send a message below to start the conversation.
          </p>
        )}
        {msgs.map((m) => {
          const isUser = m.senderRole === "user";
          return (
            <div
              key={m.id}
              className={`flex ${isUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                  isUser
                    ? "bg-[#1C1209] text-[#E8D5A3]"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                <p className="leading-relaxed">{m.content}</p>
                <p
                  className={`mt-1 text-[10px] ${
                    isUser ? "text-[#C9A84C]/60" : "text-gray-400"
                  }`}
                >
                  {isUser ? userName : "Roshan"} ·{" "}
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

      {/* Input */}
      <form
        onSubmit={handleSend}
        className="flex gap-2 border-t border-gray-100 p-4"
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message…"
          maxLength={1000}
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
    </section>
  );
}
