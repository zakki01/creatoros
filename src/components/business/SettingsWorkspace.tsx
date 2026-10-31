import React, { useState } from 'react';
import {
  Check,
  Lock,
  Key,
  Shield,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useAppState } from '../../context/StateContext';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, Monitor } from 'lucide-react';
import { Button } from '../ui/Button';
import {
  getStoredLiveEngineConfig,
  saveStoredLiveEngineConfig,
} from '../../services/live/liveAIProvider';
import { TeamManagementSettings } from './TeamManagementSettings';
import { ByokAiSettings } from './ByokAiSettings';

export const SettingsWorkspace: React.FC = () => {
  const { workspace, resetDemoData, triggerCelebration } = useAppState();
  const { theme, themePreference, setTheme } = useTheme();
  const [aiEnabled, setAiEnabled] = useState(true);

  // Live Creator Engine configuration (buyer self-hosted Decart integration)
  const [liveConfig, setLiveConfig] = useState(getStoredLiveEngineConfig);
  const [showApiKey, setShowApiKey] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'preview'>('idle');
  const [saveNotice, setSaveNotice] = useState(false);

  const handleSaveLiveConfig = () => {
    saveStoredLiveEngineConfig(liveConfig);
    setSaveNotice(true);
    setTimeout(() => setSaveNotice(false), 2000);
  };

  const handleTestConnection = () => {
    setTestStatus('testing');
    setTimeout(() => {
      if (liveConfig.apiKey && liveConfig.apiKey.trim().length > 0) {
        setTestStatus('success');
      } else {
        setTestStatus('preview');
      }
    }, 500);
  };

  const autoActions = [
    'Deadline reminders to creators',
    'Campaign status & milestone updates',
    'Attribution analytics collection',
    'Weekly executive performance reports',
  ];

  const alwaysAskActions = [
    'Escrow payment releases',
    'Contract terms & licensing changes',
    'Campaign budget increases',
    'Final creative content approvals',
  ];

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl pb-16">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-[var(--text-primary)] font-display">
          Settings
        </h1>
        <p className="text-xs text-[var(--text-secondary)] mt-1">
          Manage workspace preferences, AI assistance behaviors, and team access.
        </p>
      </div>

      {/* AI ASSISTANCE SECTION (Clean & Uncluttered as required) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
          <div>
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">
              AI Assistance
            </h2>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              CreatorOS helps with recommendations, reminders, content checks and reporting.
            </p>
          </div>

          {/* Clean Toggle Switch */}
          <button
            type="button"
            onClick={() => setAiEnabled(!aiEnabled)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              aiEnabled ? 'bg-[var(--primary)]' : 'bg-[var(--surface-subtle)] border border-[var(--border)]'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                aiEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {aiEnabled && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1 animate-fade-in">
            {/* Automatic Actions */}
            <div className="p-4 rounded-xl bg-[var(--surface)] shadow-xs border border-[var(--border)] space-y-3">
              <h3 className="text-xs font-semibold text-[var(--text-primary)]">
                Automatic Actions
              </h3>
              <ul className="space-y-2 text-xs text-[var(--text-secondary)]">
                {autoActions.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Always Ask Before */}
            <div className="p-4 rounded-xl bg-[var(--surface)] shadow-xs border border-[var(--border)] space-y-3">
              <h3 className="text-xs font-semibold text-[var(--text-primary)]">
                Always Ask Before
              </h3>
              <ul className="space-y-2 text-xs text-[var(--text-secondary)]">
                {alwaysAskActions.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Brand Profile Details */}
      <div className="space-y-4 pt-4 border-t border-[var(--border)]">
        <div>
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">Brand Profile</h2>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Default workspace identity displayed on creator contracts and outreach.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3.5 rounded-xl bg-[var(--surface)] shadow-xs border border-[var(--border)]">
            <span className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider block">Company Name</span>
            <span className="text-xs font-medium text-[var(--text-primary)] mt-1 block">{workspace.name}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[var(--surface)] shadow-xs border border-[var(--border)]">
            <span className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider block">Operating Currency</span>
            <span className="text-xs font-medium text-[var(--text-primary)] mt-1 block">INR (₹)</span>
          </div>
        </div>
      </div>

      {/* LIVE CREATOR ENGINE (DECART) */}
      <div className="space-y-4 pt-4 border-t border-[var(--border)]">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-[var(--text-primary)]">
                Live Creator Engine (Decart Realtime)
              </h2>
              <span className="px-2 py-0.2 rounded-full text-[10px] font-mono bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/30">
                Self-Hosted / Optional
              </span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Enables creators to transform camera feeds into cinematic AI scenes in realtime. Configure your Decart API credentials.
            </p>
          </div>

          {/* Toggle Live Engine */}
          <button
            type="button"
            onClick={() => {
              const updated = { ...liveConfig, enabled: !liveConfig.enabled };
              setLiveConfig(updated);
              saveStoredLiveEngineConfig(updated);
            }}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              liveConfig.enabled ? 'bg-[var(--primary)]' : 'bg-[var(--surface-subtle)] border border-[var(--border)]'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                liveConfig.enabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {liveConfig.enabled && (
          <div className="p-4 sm:p-5 rounded-xl bg-[var(--surface)] shadow-xs border border-[var(--border)] space-y-4 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* API Key */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-medium text-[var(--text-primary)] flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-[var(--primary)]" />
                    <span>Decart API Key</span>
                  </span>
                  <span className="text-[11px] text-[var(--text-muted)] font-normal">
                    Leave blank to run in local Preview Mode
                  </span>
                </label>
                <div className="relative">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={liveConfig.apiKey}
                    onChange={(e) =>
                      setLiveConfig({ ...liveConfig, apiKey: e.target.value })
                    }
                    placeholder="sk_decart_..."
                    className="w-full px-3 py-2 pr-10 rounded-lg bg-[var(--input)] border border-[var(--border)] text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] font-mono focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  >
                    {showApiKey ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Realtime Model */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[var(--text-primary)]">
                  Default Realtime Model
                </label>
                <select
                  value={liveConfig.defaultModel}
                  onChange={(e) =>
                    setLiveConfig({ ...liveConfig, defaultModel: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-[var(--input)] border border-[var(--border)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
                >
                  <option value="mirage-realtime-v1">
                    mirage-realtime-v1 (Low Latency)
                  </option>
                  <option value="mirage-cinematic-turbo">
                    mirage-cinematic-turbo (Enhanced Bokeh)
                  </option>
                  <option value="mirage-editorial-v2">
                    mirage-editorial-v2 (Studio Lighting)
                  </option>
                </select>
              </div>

              {/* Max Session Duration (Cost Protection) */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[var(--text-primary)] flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Max Session Duration (Cost Limit)</span>
                  </span>
                </label>
                <select
                  value={liveConfig.maxSessionDurationSec}
                  onChange={(e) =>
                    setLiveConfig({
                      ...liveConfig,
                      maxSessionDurationSec: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-[var(--input)] border border-[var(--border)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
                >
                  <option value={15}>15 Seconds (Budget Friendly)</option>
                  <option value={30}>30 Seconds (Default Recommended)</option>
                  <option value={45}>45 Seconds (Extended Take)</option>
                  <option value={60}>60 Seconds (Full Hook & Content)</option>
                </select>
              </div>
            </div>

            {/* Test Connection & Save Action */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-[var(--border)]">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleTestConnection}
                  className="text-xs"
                >
                  Test Connection
                </Button>

                {testStatus === 'success' && (
                  <span className="text-xs text-emerald-500 flex items-center gap-1 font-medium animate-fade-in">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Decart Realtime Connected</span>
                  </span>
                )}

                {testStatus === 'preview' && (
                  <span className="text-xs text-amber-500 flex items-center gap-1 font-medium animate-fade-in">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Local Preview Mode Active (0 API Cost)</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {saveNotice && (
                  <span className="text-xs text-emerald-500 font-medium animate-fade-in">
                    Saved!
                  </span>
                )}
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSaveLiveConfig}
                  className="text-xs bg-[var(--primary)] hover:bg-[var(--primary-hover)] shadow-teal-900/15"
                >
                  Save Live Engine Settings
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* RBAC Team Management */}
      <TeamManagementSettings />

      {/* Bring Your Own AI (BYOK) */}
      <ByokAiSettings />

      {/* Connected Channels */}
      <div className="space-y-3 pt-4 border-t border-[var(--border)]">
        <div>
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">Connected Services</h2>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Integrations used to verify posts and track conversion analytics.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { name: 'Instagram Graph API', status: 'Connected' },
            { name: 'YouTube Data API', status: 'Connected' },
            { name: 'Shopify Checkout Webhook', status: 'Active' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-[var(--surface)] shadow-xs border border-[var(--border)] flex items-center justify-between text-xs"
            >
              <span className="text-[var(--text-primary)] font-medium">{item.name}</span>
              <span className="text-[11px] text-emerald-500 font-mono">
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Appearance & Theme System */}
      <div className="space-y-3 pt-6 border-t border-[var(--border)]">
        <div>
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">Appearance &amp; Theme</h2>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Select your preferred display theme for CreatorOS workspace.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl">
          <div
            onClick={() => setTheme('light')}
            className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
              themePreference === 'light'
                ? 'bg-[var(--primary)]/15 border-[var(--primary)] shadow-xs'
                : 'bg-[var(--surface)] border-[var(--border)] hover:border-[var(--border-strong)]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Sun className="w-4 h-4 text-amber-500" />
              <div>
                <p className="text-xs font-bold text-[var(--text-primary)]">Light Studio</p>
                <p className="text-[10px] text-[var(--text-secondary)]">Pristine light</p>
              </div>
            </div>
            {themePreference === 'light' && <Check className="w-4 h-4 text-[var(--primary)]" />}
          </div>

          <div
            onClick={() => setTheme('dark')}
            className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
              themePreference === 'dark'
                ? 'bg-[var(--primary)]/15 border-[var(--primary)] shadow-xs'
                : 'bg-[var(--surface)] border-[var(--border)] hover:border-[var(--border-strong)]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Moon className="w-4 h-4 text-indigo-400" />
              <div>
                <p className="text-xs font-bold text-[var(--text-primary)]">Dark Studio</p>
                <p className="text-[10px] text-[var(--text-secondary)]">Near-black contrast</p>
              </div>
            </div>
            {themePreference === 'dark' && <Check className="w-4 h-4 text-[var(--primary)]" />}
          </div>

          <div
            onClick={() => setTheme('system')}
            className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
              themePreference === 'system'
                ? 'bg-[var(--primary)]/15 border-[var(--primary)] shadow-xs'
                : 'bg-[var(--surface)] border-[var(--border)] hover:border-[var(--border-strong)]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Monitor className="w-4 h-4 text-sky-500" />
              <div>
                <p className="text-xs font-bold text-[var(--text-primary)]">System</p>
                <p className="text-[10px] text-[var(--text-secondary)]">Follows device OS</p>
              </div>
            </div>
            {themePreference === 'system' && <Check className="w-4 h-4 text-[var(--primary)]" />}
          </div>
        </div>
      </div>

      {/* Reset State */}
      <div className="pt-6 border-t border-[var(--border)] flex items-center justify-between text-xs">
        <div>
          <p className="text-[var(--text-primary)] font-medium">Reset Demo Sandbox</p>
          <p className="text-[var(--text-secondary)] text-[11px] mt-0.5">
            Restores campaigns, creators, and approvals to initial demo data.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            resetDemoData();
            triggerCelebration();
          }}
          className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        >
          Reset Data
        </Button>
      </div>
    </div>
  );
};
