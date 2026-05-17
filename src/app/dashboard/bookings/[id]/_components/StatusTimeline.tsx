type StatusHistoryEntry = {
  id: string;
  status: string;
  note: string | null;
  createdAt: string;
};

type Props = {
  history: StatusHistoryEntry[];
  bookingCreatedAt: string;
};

const STATUS_CONFIG: Record<
  string,
  {
    label: string;
    dot: string;
    ring: string;
    activeBg: string;
    activeText: string;
    activeDot: string;
  }
> = {
  inquiry: {
    label: "Enquiry Received",
    dot: "bg-blue-400",
    ring: "ring-blue-200",
    activeBg: "bg-blue-50",
    activeText: "text-blue-800",
    activeDot: "bg-blue-500",
  },
  quoted: {
    label: "Quote Sent",
    dot: "bg-purple-400",
    ring: "ring-purple-200",
    activeBg: "bg-purple-50",
    activeText: "text-purple-800",
    activeDot: "bg-purple-500",
  },
  deposit_paid: {
    label: "Deposit Confirmed",
    dot: "bg-amber-400",
    ring: "ring-amber-200",
    activeBg: "bg-amber-50",
    activeText: "text-amber-800",
    activeDot: "bg-amber-500",
  },
  confirmed: {
    label: "Booking Confirmed",
    dot: "bg-green-400",
    ring: "ring-green-200",
    activeBg: "bg-green-50",
    activeText: "text-green-800",
    activeDot: "bg-green-500",
  },
  in_progress: {
    label: "Tour Underway",
    dot: "bg-teal-400",
    ring: "ring-teal-200",
    activeBg: "bg-teal-50",
    activeText: "text-teal-800",
    activeDot: "bg-teal-500",
  },
  completed: {
    label: "Tour Completed",
    dot: "bg-gray-400",
    ring: "ring-gray-200",
    activeBg: "bg-gray-100",
    activeText: "text-gray-700",
    activeDot: "bg-gray-500",
  },
  cancelled: {
    label: "Cancelled",
    dot: "bg-red-400",
    ring: "ring-red-200",
    activeBg: "bg-red-50",
    activeText: "text-red-800",
    activeDot: "bg-red-500",
  },
};

const FALLBACK_CONFIG = {
  label: "Status Update",
  dot: "bg-gray-300",
  ring: "ring-gray-200",
  activeBg: "bg-gray-50",
  activeText: "text-gray-700",
  activeDot: "bg-gray-400",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function StatusTimeline({ history, bookingCreatedAt }: Props) {
  // Oldest first so the timeline reads top→bottom chronologically
  const entries: StatusHistoryEntry[] =
    history.length > 0
      ? [...history].sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )
      : [
          {
            id: "synthetic-inquiry",
            status: "inquiry",
            note: null,
            createdAt: bookingCreatedAt,
          },
        ];

  const latestId = entries[entries.length - 1].id;

  return (
    <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      {/* Section header */}
      <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
        Booking Journey
      </h2>

      <ol className="relative space-y-0">
        {entries.map((entry, idx) => {
          const cfg = STATUS_CONFIG[entry.status] ?? FALLBACK_CONFIG;
          const isLatest = entry.id === latestId;
          const isLast = idx === entries.length - 1;

          return (
            <li key={entry.id} className="relative flex gap-3">
              {/* Left column: dot + connector line */}
              <div className="flex flex-col items-center">
                {/* Dot */}
                <div
                  className={[
                    "relative z-10 mt-0.5 flex h-3 w-3 shrink-0 items-center justify-center rounded-full ring-2",
                    isLatest
                      ? `${cfg.activeDot} ring-white shadow-md`
                      : `${cfg.dot} ring-white`,
                  ].join(" ")}
                >
                  {/* Pulse ring on the active dot */}
                  {isLatest && (
                    <span
                      className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-50 ${cfg.dot}`}
                    />
                  )}
                </div>

                {/* Connector line — hidden after the last item */}
                {!isLast && (
                  <div className="mt-1 w-px flex-1 bg-gradient-to-b from-gray-200 to-gray-100" />
                )}
              </div>

              {/* Right column: content */}
              <div
                className={[
                  "mb-4 min-w-0 flex-1 rounded-lg px-3 py-2 transition-colors",
                  isLatest
                    ? `${cfg.activeBg} ring-1 ${cfg.ring}`
                    : "bg-transparent",
                ].join(" ")}
              >
                {/* Label + date row */}
                <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
                  <span
                    className={[
                      "text-sm font-medium leading-snug",
                      isLatest ? cfg.activeText : "text-[#1C1209]",
                    ].join(" ")}
                  >
                    {cfg.label}
                  </span>
                  <time
                    dateTime={entry.createdAt}
                    className="shrink-0 font-mono text-[10px] text-gray-400"
                  >
                    {formatDate(entry.createdAt)}
                  </time>
                </div>

                {/* Admin note */}
                {entry.note && (
                  <blockquote className="mt-1.5 border-l-2 border-[#C9A84C]/40 pl-2">
                    <p className="text-[11px] leading-relaxed text-gray-500 italic">
                      {entry.note}
                    </p>
                  </blockquote>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      {/* Foot note */}
      <p className="mt-1 text-[10px] text-gray-300 text-center tracking-wide">
        All times shown in your local timezone
      </p>
    </section>
  );
}
