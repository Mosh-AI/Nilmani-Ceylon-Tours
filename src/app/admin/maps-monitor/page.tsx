import { requireAdmin } from "@/lib/admin-auth";
import {
  getCurrentMonthTotal,
  getLast30DaysUsage,
  getMonthlyUsage,
  getMapSettings,
} from "@/lib/map-usage";
import { MapSettingsForm } from "./_components/MapSettingsForm";
import { Activity, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

export const dynamic = "force-dynamic";

function ProgressBar({
  value,
  max,
  color,
}: {
  value: number;
  max: number;
  color: "gold" | "orange" | "red";
}) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  const bg =
    color === "gold"
      ? "bg-[#C9A84C]"
      : color === "orange"
      ? "bg-orange-400"
      : "bg-red-500";
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-brand-border">
      <div
        className={`h-full rounded-full transition-all ${bg}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export default async function MapsMonitorPage() {
  await requireAdmin();

  const [monthTotal, dailyData, monthlyHistory, mapSettings] =
    await Promise.all([
      getCurrentMonthTotal(),
      getLast30DaysUsage(),
      getMonthlyUsage(3),
      getMapSettings(),
    ]);

  const freeTierLimit = 28500;
  const visitorPct = Math.round((monthTotal / mapSettings.visitorThreshold) * 100);
  const freeTierPct = Math.round((monthTotal / freeTierLimit) * 100);
  const autoDisablePct = Math.round(
    (monthTotal / mapSettings.autoDisableThreshold) * 100
  );

  const maxDaily = Math.max(...dailyData.map((d) => d.pageViews), 1);

  const apiKeySet =
    !!(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "").trim();

  return (
    <div className="space-y-8 p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Activity className="h-6 w-6 text-[#C9A84C]" />
        <div>
          <h1 className="text-xl font-semibold text-brand-text">Maps Monitor</h1>
          <p className="text-sm text-brand-muted">
            Google Maps usage tracking &amp; free-tier protection
          </p>
        </div>
      </div>

      {/* Status banner */}
      <div
        className={`flex items-center gap-4 rounded-xl border p-4 ${
          mapSettings.enabled && apiKeySet
            ? "border-green-200 bg-green-50"
            : mapSettings.enabled && !apiKeySet
            ? "border-amber-200 bg-amber-50"
            : "border-red-200 bg-red-50"
        }`}
      >
        {mapSettings.enabled && apiKeySet ? (
          <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
        ) : mapSettings.enabled && !apiKeySet ? (
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
        ) : (
          <XCircle className="h-5 w-5 text-red-600 shrink-0" />
        )}
        <div>
          {mapSettings.enabled && apiKeySet && (
            <>
              <p className="text-sm font-semibold text-green-800">Google Maps Active</p>
              <p className="text-xs text-green-700">
                Visitors on /tours/customize are seeing Google Maps.
              </p>
            </>
          )}
          {mapSettings.enabled && !apiKeySet && (
            <>
              <p className="text-sm font-semibold text-amber-800">
                Google Maps enabled but API key missing
              </p>
              <p className="text-xs text-amber-700">
                Add <code>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> to your environment variables and redeploy.
              </p>
            </>
          )}
          {!mapSettings.enabled && (
            <>
              <p className="text-sm font-semibold text-red-800">Google Maps Disabled</p>
              <p className="text-xs text-red-700">
                The SVG fallback map is showing. Use the toggle below to re-enable.
              </p>
            </>
          )}
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-brand-border bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-brand-muted">
            This Month
          </p>
          <p className="mt-2 text-3xl font-light text-brand-text">
            {monthTotal.toLocaleString()}
          </p>
          <p className="mt-0.5 text-xs text-brand-faint">map loads</p>
          <div className="mt-3 space-y-1.5">
            <div className="flex justify-between text-xs text-brand-muted">
              <span>Visitor alert</span>
              <span>{visitorPct}%</span>
            </div>
            <ProgressBar
              value={monthTotal}
              max={mapSettings.visitorThreshold}
              color="gold"
            />
          </div>
        </div>

        <div className="rounded-xl border border-brand-border bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-brand-muted">
            Free Tier Usage
          </p>
          <p className="mt-2 text-3xl font-light text-brand-text">
            {freeTierPct}%
          </p>
          <p className="mt-0.5 text-xs text-brand-faint">
            of ~{freeTierLimit.toLocaleString()} free loads / mo
          </p>
          <div className="mt-3 space-y-1.5">
            <div className="flex justify-between text-xs text-brand-muted">
              <span>Free-tier alert at {mapSettings.freeTierAlertThreshold.toLocaleString()}</span>
              <span>
                {Math.round(
                  (monthTotal / mapSettings.freeTierAlertThreshold) * 100
                )}%
              </span>
            </div>
            <ProgressBar
              value={monthTotal}
              max={mapSettings.freeTierAlertThreshold}
              color={freeTierPct > 80 ? "red" : "orange"}
            />
          </div>
        </div>

        <div className="rounded-xl border border-brand-border bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-brand-muted">
            Auto-disable Buffer
          </p>
          <p className="mt-2 text-3xl font-light text-brand-text">
            {Math.max(0, mapSettings.autoDisableThreshold - monthTotal).toLocaleString()}
          </p>
          <p className="mt-0.5 text-xs text-brand-faint">loads remaining</p>
          <div className="mt-3 space-y-1.5">
            <div className="flex justify-between text-xs text-brand-muted">
              <span>Auto-disables at {mapSettings.autoDisableThreshold.toLocaleString()}</span>
              <span>{autoDisablePct}%</span>
            </div>
            <ProgressBar
              value={monthTotal}
              max={mapSettings.autoDisableThreshold}
              color={autoDisablePct > 90 ? "red" : autoDisablePct > 70 ? "orange" : "gold"}
            />
          </div>
        </div>
      </div>

      {/* Daily bar chart */}
      <div className="rounded-xl border border-brand-border bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-brand-text">
          Daily Usage — Last 30 Days
        </h2>
        <div className="flex h-32 items-end gap-0.5">
          {dailyData.map((day) => {
            const height = maxDaily > 0 ? (day.pageViews / maxDaily) * 100 : 0;
            return (
              <div
                key={day.date}
                className="group relative flex-1 cursor-default"
                title={`${day.date}: ${day.pageViews} loads`}
              >
                <div
                  className="w-full rounded-t bg-[#C9A84C]/60 transition-all group-hover:bg-[#C9A84C]"
                  style={{ height: `${Math.max(height, day.pageViews > 0 ? 4 : 0)}%` }}
                />
                {/* Tooltip */}
                <div className="pointer-events-none absolute bottom-full left-1/2 mb-1 -translate-x-1/2 whitespace-nowrap rounded bg-brand-text px-1.5 py-0.5 text-[10px] text-white opacity-0 group-hover:opacity-100">
                  {day.date.slice(5)}: {day.pageViews}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-2 flex justify-between text-[10px] text-brand-faint">
          <span>{dailyData[0]?.date.slice(5)}</span>
          <span>{dailyData[dailyData.length - 1]?.date.slice(5)}</span>
        </div>
      </div>

      {/* Monthly history */}
      <div className="rounded-xl border border-brand-border bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-brand-text">Monthly History</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-brand-border text-xs text-brand-muted">
              <th className="pb-2 text-left font-medium">Month</th>
              <th className="pb-2 text-right font-medium">Map Loads</th>
              <th className="pb-2 text-right font-medium">% of Free Tier</th>
              <th className="pb-2 text-right font-medium">Est. Cost</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border">
            {monthlyHistory.map((m) => {
              const pct = Math.round((m.total / freeTierLimit) * 100);
              const overFree = Math.max(0, m.total - freeTierLimit);
              const cost = overFree > 0 ? ((overFree / 1000) * 7).toFixed(2) : "Free";
              return (
                <tr key={m.month}>
                  <td className="py-2.5 text-brand-text">{m.month}</td>
                  <td className="py-2.5 text-right font-mono text-brand-text">
                    {m.total.toLocaleString()}
                  </td>
                  <td
                    className={`py-2.5 text-right font-mono ${
                      pct > 90 ? "text-red-600" : pct > 70 ? "text-amber-600" : "text-brand-muted"
                    }`}
                  >
                    {pct}%
                  </td>
                  <td
                    className={`py-2.5 text-right font-mono ${
                      cost !== "Free" ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {cost === "Free" ? "Free" : `$${cost}`}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Settings form */}
      <div className="rounded-xl border border-brand-border bg-white p-5 shadow-sm">
        <h2 className="mb-5 text-sm font-semibold text-brand-text">Settings</h2>
        <MapSettingsForm initialSettings={mapSettings} />
      </div>
    </div>
  );
}
