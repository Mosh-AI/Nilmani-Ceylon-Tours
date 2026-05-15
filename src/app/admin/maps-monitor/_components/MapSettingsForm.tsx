"use client";

import { useState } from "react";
import { Save, Power, RefreshCw } from "lucide-react";

interface MapSettingsFormProps {
  initialSettings: {
    enabled: boolean;
    alertEmail: string;
    visitorThreshold: number;
    freeTierAlertThreshold: number;
    autoDisableThreshold: number;
  };
}

export function MapSettingsForm({ initialSettings }: MapSettingsFormProps) {
  const [settings, setSettings] = useState(initialSettings);
  const [saving, setSaving] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function saveSettings() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/maps-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          maps_alert_email: settings.alertEmail,
          maps_monthly_visitor_threshold: settings.visitorThreshold,
          maps_free_tier_alert_threshold: settings.freeTierAlertThreshold,
          maps_auto_disable_threshold: settings.autoDisableThreshold,
        }),
      });
      if (!res.ok) throw new Error("Save failed");
      setSavedAt(new Date().toLocaleTimeString());
    } catch {
      setError("Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleEnabled() {
    setToggling(true);
    setError(null);
    const newValue = !settings.enabled;
    try {
      const res = await fetch("/api/admin/maps-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ google_maps_enabled: newValue ? "true" : "false" }),
      });
      if (!res.ok) throw new Error("Toggle failed");
      setSettings((s) => ({ ...s, enabled: newValue }));
    } catch {
      setError("Failed to toggle. Please try again.");
    } finally {
      setToggling(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Enable / Disable toggle */}
      <div className="flex items-center justify-between rounded-xl border border-brand-border bg-white p-4 shadow-sm">
        <div>
          <p className="text-sm font-semibold text-brand-text">Google Maps Status</p>
          <p className="text-xs text-brand-muted mt-0.5">
            {settings.enabled ? "Showing Google Maps to visitors" : "Showing built-in SVG map (fallback)"}
          </p>
        </div>
        <button
          onClick={toggleEnabled}
          disabled={toggling}
          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${
            settings.enabled
              ? "bg-red-100 text-red-700 hover:bg-red-200"
              : "bg-green-100 text-green-700 hover:bg-green-200"
          } disabled:opacity-50`}
        >
          {toggling ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Power className="h-4 w-4" />
          )}
          {settings.enabled ? "Disable Google Maps" : "Enable Google Maps"}
        </button>
      </div>

      {/* Alert Email */}
      <div>
        <label className="block text-sm font-medium text-brand-text mb-1.5">
          Alert Email
        </label>
        <input
          type="email"
          value={settings.alertEmail}
          onChange={(e) => setSettings((s) => ({ ...s, alertEmail: e.target.value }))}
          className="w-full rounded-lg border border-brand-border px-3 py-2 text-sm text-brand-text focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/40"
          placeholder="mtulanka@gmail.com"
        />
        <p className="text-xs text-brand-muted mt-1">
          Receives visitor milestone and free-tier alerts.
        </p>
      </div>

      {/* Threshold fields */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-brand-text mb-1.5">
            Visitor Alert (monthly)
          </label>
          <input
            type="number"
            min={1}
            max={28000}
            value={settings.visitorThreshold}
            onChange={(e) => setSettings((s) => ({ ...s, visitorThreshold: parseInt(e.target.value) || 400 }))}
            className="w-full rounded-lg border border-brand-border px-3 py-2 text-sm text-brand-text focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/40"
          />
          <p className="text-xs text-brand-muted mt-1">Send visitor milestone email</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-text mb-1.5">
            Free-tier Alert
          </label>
          <input
            type="number"
            min={1}
            max={28000}
            value={settings.freeTierAlertThreshold}
            onChange={(e) => setSettings((s) => ({ ...s, freeTierAlertThreshold: parseInt(e.target.value) || 24000 }))}
            className="w-full rounded-lg border border-brand-border px-3 py-2 text-sm text-brand-text focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/40"
          />
          <p className="text-xs text-brand-muted mt-1">Warn before billing starts</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-text mb-1.5">
            Auto-disable At
          </label>
          <input
            type="number"
            min={1}
            max={28500}
            value={settings.autoDisableThreshold}
            onChange={(e) => setSettings((s) => ({ ...s, autoDisableThreshold: parseInt(e.target.value) || 27000 }))}
            className="w-full rounded-lg border border-brand-border px-3 py-2 text-sm text-brand-text focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/40"
          />
          <p className="text-xs text-brand-muted mt-1">Hard stop to protect billing</p>
        </div>
      </div>

      {/* Save button */}
      <div className="flex items-center gap-4">
        <button
          onClick={saveSettings}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-[#1C1209] px-5 py-2.5 text-sm font-semibold text-[#C9A84C] transition hover:bg-[#2a1c0e] disabled:opacity-50"
        >
          {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? "Saving…" : "Save Settings"}
        </button>
        {savedAt && !error && (
          <span className="text-xs text-green-600">Saved at {savedAt}</span>
        )}
        {error && <span className="text-xs text-red-600">{error}</span>}
      </div>
    </div>
  );
}
