const statusConfig: Record<string, { label: string; className: string }> = {
  inquiry:      { label: "Inquiry",      className: "bg-blue-50 text-blue-700 ring-blue-200" },
  quoted:       { label: "Quoted",       className: "bg-purple-50 text-purple-700 ring-purple-200" },
  deposit_paid: { label: "Deposit Paid", className: "bg-yellow-50 text-yellow-700 ring-yellow-200" },
  confirmed:    { label: "Confirmed",    className: "bg-green-50 text-green-700 ring-green-200" },
  in_progress:  { label: "In Progress",  className: "bg-teal-50 text-teal-700 ring-teal-200" },
  completed:    { label: "Completed",    className: "bg-gray-100 text-gray-700 ring-gray-200" },
  cancelled:    { label: "Cancelled",    className: "bg-red-50 text-red-700 ring-red-200" },
};

export function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] ?? {
    label: status,
    className: "bg-gray-100 text-gray-600 ring-gray-200",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${config.className}`}
    >
      {config.label}
    </span>
  );
}
