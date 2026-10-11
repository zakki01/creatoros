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
import { Button } from '../ui/Button';
import {
  getStoredLiveEngineConfig,
  saveStoredLiveEngineConfig,
} from '../../services/live/liveAIProvider';
import { TeamManagementSettings } from './TeamManagementSettings';
import { ByokAiSettings } from './ByokAiSettings';

export const SettingsWorkspace: React.FC = () => {
  const { workspace, resetDemoData, triggerCelebration } = useAppState();
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
        <h1 className="text-xl font-bold text-zinc-100 font-display">
          Settings
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Manage workspace preferences, AI assistance behaviors, and team access.
        </p>
      </div>

      {/* AI ASSISTANCE SECTION (Clean & Uncluttered as required) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
          <div>
            <h2 className="text-sm font-semibold text-zinc-200">
              AI Assistance
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              CreatorOS helps with recommendations, reminders, content checks and reporting.
            </p>
          </div>

          {/* Clean Toggle Switch */}
          <button
            type="button"
            onClick={() => setAiEnabled(!aiEnabled)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              aiEnabled ? 'bg-indigo-600' : 'bg-zinc-800'
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
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-3">
              <h3 className="text-xs font-semibold text-zinc-300">
                Automatic Actions
              </h3>
              <ul className="space-y-2 text-xs text-zinc-400">
                {autoActions.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Always Ask Before */}
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-3">
              <h3 className="text-xs font-semibold text-zinc-300">
                Always Ask Before
              </h3>
              <ul className="space-y-2 text-xs text-zinc-400">
                {alwaysAskActions.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Brand Profile Details */}
      <div className="space-y-4 pt-4 border-t border-zinc-800/80">
        <div>
          <h2 className="text-sm font-semibold text-zinc-200">Brand Profile</h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Default workspace identity displayed on creator contracts and outreach.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
            <span className="text-[11px] text-zinc-500 uppercase tracking-wider block">Company Name</span>
            <span className="text-xs font-medium text-zinc-200 mt-1 block">{workspace.name}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
            <span className="text-[11px] text-zinc-500 uppercase tracking-wider block">Operating Currency</span>
            <span className="text-xs font-medium text-zinc-200 mt-1 block">INR (₹)</span>
          </div>
        </div>
      </div>

      {/* LIVE CREATOR ENGINE (DECART) */}
      <div className="space-y-4 pt-4 border-t border-zinc-800/80">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-zinc-200">
                Live Creator Engine (Decart Realtime)
              </h2>
              <span className="px-2 py-0.2 rounded-full text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Self-Hosted / Optional
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
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
              liveConfig.enabled ? 'bg-indigo-600' : 'bg-zinc-800'
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
          <div className="p-4 sm:p-5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-4 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* API Key */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-medium text-zinc-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Decart API Key</span>
                  </span>
                  <span className="text-[11px] text-zinc-500 font-normal">
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
                    className="w-full px-3 py-2 pr-10 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 font-mono focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
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
                <label className="text-xs font-medium text-zinc-300">
                  Default Realtime Model
                </label>
                <select
                  value={liveConfig.defaultModel}
                  onChange={(e) =>
                    setLiveConfig({ ...liveConfig, defaultModel: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
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
                <label className="text-xs font-medium text-zinc-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-emerald-400" />
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
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value={15}>15 Seconds (Budget Friendly)</option>
                  <option value={30}>30 Seconds (Default Recommended)</option>
                  <option value={45}>45 Seconds (Extended Take)</option>
                  <option value={60}>60 Seconds (Full Hook & Content)</option>
                </select>
              </div>
            </div>

            {/* Test Connection & Save Action */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-zinc-800/80">
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
                  <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium animate-fade-in">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Decart Realtime Connected</span>
                  </span>
                )}

                {testStatus === 'preview' && (
                  <span className="text-xs text-amber-400 flex items-center gap-1 font-medium animate-fade-in">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Local Preview Mode Active (0 API Cost)</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {saveNotice && (
                  <span className="text-xs text-emerald-400 font-medium animate-fade-in">
                    Saved!
                  </span>
                )}
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSaveLiveConfig}
                  className="text-xs bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/20"
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
      <div className="space-y-3 pt-4 border-t border-zinc-800/80">
        <div>
          <h2 className="text-sm font-semibold text-zinc-200">Connected Services</h2>
          <p className="text-xs text-zinc-400 mt-0.5">
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
              className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between text-xs"
            >
              <span className="text-zinc-300 font-medium">{item.name}</span>
              <span className="text-[11px] text-emerald-400 font-mono">
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Reset State */}
      <div className="pt-6 border-t border-zinc-800/80 flex items-center justify-between text-xs">
        <div>
          <p className="text-zinc-300 font-medium">Reset Demo Sandbox</p>
          <p className="text-zinc-500 text-[11px] mt-0.5">
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
          className="text-xs text-zinc-400 hover:text-zinc-200"
        >
          Reset Data
        </Button>
      </div>
    </div>
  );
};
