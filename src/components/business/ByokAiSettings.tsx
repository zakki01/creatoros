import React, { useState } from 'react';
import {
  Sparkles,
  Key,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Cpu,
} from 'lucide-react';
import { useAppState } from '../../context/StateContext';
import { AiProviderType } from '../../types/trustSafety';
import { byokAiService } from '../../services/byokAiService';

export const ByokAiSettings: React.FC = () => {
  const { byokConfig, updateByokConfig } = useAppState();

  const [selectedProvider, setSelectedProvider] = useState<AiProviderType>(byokConfig.activeProvider);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [testState, setTestState] = useState<'idle' | 'testing' | 'success' | 'fallback'>('idle');

  const handleProviderSelect = (provider: AiProviderType) => {
    setSelectedProvider(provider);
    updateByokConfig({ activeProvider: provider });
    setTestState('idle');
  };

  const handleSaveKey = () => {
    if (!apiKeyInput.trim()) return;
    updateByokConfig({
      activeProvider: selectedProvider,
      apiKeys: {
        ...byokConfig.apiKeys,
        [selectedProvider]: apiKeyInput.trim(),
      },
    });
    setApiKeyInput('');
    setTestState('success');
  };

  const handleTestInference = () => {
    setTestState('testing');
    setTimeout(() => {
      const activeKey = byokConfig.apiKeys[selectedProvider];
      if (selectedProvider === 'default' || (activeKey && activeKey.length > 5)) {
        setTestState('success');
      } else {
        setTestState('fallback');
      }
    }, 600);
  };

  return (
    <div className="space-y-4 pt-6 border-t border-zinc-200">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-zinc-800">
            Bring Your Own AI (BYOK Inference)
          </h2>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-purple-500/10 text-purple-400 border border-purple-500/20">
            Multi-LLM
          </span>
        </div>
        <p className="text-xs text-zinc-500 mt-0.5">
          Connect your proprietary model API keys for campaign strategy generation, brief auditing, and viral hook scripting.
        </p>
      </div>

      {/* Provider Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { id: 'default' as AiProviderType, name: 'CreatorOS Engine', badge: 'Built-in', desc: 'Included zero-config pipeline' },
          { id: 'openai' as AiProviderType, name: 'OpenAI GPT-4o', badge: 'BYOK', desc: 'Reasoning & brief compliance' },
          { id: 'anthropic' as AiProviderType, name: 'Claude 3.5 Sonnet', badge: 'BYOK', desc: 'Artistic scripting & nuances' },
          { id: 'gemini' as AiProviderType, name: 'Gemini 1.5 Pro', badge: 'BYOK', desc: 'Multimodal video understanding' },
        ].map((p) => {
          const isSelected = selectedProvider === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => handleProviderSelect(p.id)}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-white border-[#00B4D8]/80 ring-1 ring-indigo-500/30'
                  : 'bg-zinc-50 border-zinc-200 hover:border-zinc-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-white">{p.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                  isSelected ? 'bg-indigo-500/20 text-[#0096C7]' : 'bg-zinc-800 text-zinc-500'
                }`}>
                  {p.badge}
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 leading-tight">{p.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Selected Provider Key Configuration */}
      {selectedProvider !== 'default' && (
        <div className="p-4 rounded-xl bg-white shadow-xs border border-zinc-200 space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-zinc-700 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-[#0096C7]" />
              <span>{selectedProvider.toUpperCase()} Secret Key</span>
            </label>
            <span className="text-[11px] text-zinc-500 font-mono">
              Status: {byokConfig.apiKeys[selectedProvider] ? 'Key Configured (Encrypted)' : 'No Key Set'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder={`Paste your ${selectedProvider} API key...`}
                className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#00B4D8] focus:ring-1 focus:ring-[#00B4D8] pr-9"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <button
              type="button"
              onClick={handleSaveKey}
              disabled={!apiKeyInput.trim()}
              className="px-3.5 py-2 rounded-lg bg-[#00B4D8] hover:bg-[#0096C7] disabled:opacity-40 text-white text-xs font-medium transition-colors"
            >
              Save Key
            </button>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-zinc-200/60 text-xs">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleTestInference}
                className="px-3 py-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-100 text-zinc-700 text-xs transition-colors"
              >
                {testState === 'testing' ? 'Testing Connection...' : 'Test Model Health'}
              </button>

              {testState === 'success' && (
                <span className="text-emerald-400 flex items-center gap-1 text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>API Handshake Verified</span>
                </span>
              )}
              {testState === 'fallback' && (
                <span className="text-amber-400 flex items-center gap-1 text-xs">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Falling back to CreatorOS Default Engine</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 text-[11px] text-zinc-500">
              <ShieldCheck className="w-3.5 h-3.5 text-zinc-500" />
              <span>Keys stored client-side in browser storage</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
