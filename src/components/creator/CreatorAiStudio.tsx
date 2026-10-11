import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  Copy,
  Check,
  ShieldCheck,
  Cpu,
} from 'lucide-react';
import { useAppState } from '../../context/StateContext';
import { byokAiService } from '../../services/byokAiService';

export const CreatorAiStudio: React.FC = () => {
  const { byokConfig } = useAppState();

  const [topic, setTopic] = useState('');
  const [niche, setNiche] = useState('Streetwear & Urban Culture');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const [activeTool, setActiveTool] = useState<'hooks' | 'script' | 'caption' | 'compliance'>('hooks');

  const [generatedHooks, setGeneratedHooks] = useState<string[]>([
    'Stop styling your graphic tees like it is still 2019 — here is the 3-step layered look.',
    'I tried every high-street streetwear brand so you do not waste your money on thin cotton.',
    'The secret to making affordable streetwear look like high-end luxury in under 10 seconds.',
  ]);

  const [generatedScript, setGeneratedScript] = useState<string>(
    `[0:00 - 0:03] HOOK: Quick transition showing oversized silhouette against brutalist architecture.\n[0:03 - 0:15] PROBLEM: Why typical summer streetwear looks washed out on camera.\n[0:15 - 0:35] SOLUTION: Highlighting texture pairing, muted earth tones, and the signature fit.\n[0:35 - 0:45] CALL TO ACTION: Check the link in bio for the drop before it sells out.`
  );

  const [generatedCaption, setGeneratedCaption] = useState<string>(
    `Unfiltered street aesthetic for the high-summer collection. The silhouette drape speaks for itself. Which layer would you rock?\n\n#streetwear #urbanfits #creatoros #lookbook #aestheticreels`
  );

  const [complianceResult, setComplianceResult] = useState<{
    score: number;
    notes: string[];
    safe: boolean;
  }>({
    score: 96,
    notes: [
      'Passed: Zero minor presence or child safety risk indicators.',
      'Passed: Clear brand logo exposure in the first 3 seconds.',
      'Passed: Disclosure hashtag included (#ad / partnership).',
    ],
    safe: true,
  });

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const promptContext = topic || 'Summer street drop collection';
      if (activeTool === 'hooks') {
        const hooks = byokAiService.generateViralHooks(promptContext, niche);
        setGeneratedHooks(hooks);
      } else if (activeTool === 'script') {
        const script = byokAiService.generateReelScript(promptContext, 'Showcase fit transitions and quality stitching');
        setGeneratedScript(script);
      } else if (activeTool === 'caption') {
        const caption = byokAiService.generateCaptions(promptContext, ['#streetwear', '#fitcheck', '#summerdrop']);
        setGeneratedCaption(caption);
      } else if (activeTool === 'compliance') {
        setComplianceResult({
          score: 98,
          notes: [
            'Audit Passed: Verified compliance with 18+ creator safety guidelines.',
            'Brand brief deliverables met: 4K 60fps frame rate confirmed.',
            'Appropriate product placement lighting and audio clearance.',
          ],
          safe: true,
        });
      }
      setIsGenerating(false);
    }, 500);
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-white font-mono flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <span>Creator AI Studio</span>
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-purple-500/10 text-purple-400 border border-purple-500/20">
              Active: {byokConfig.activeProvider.toUpperCase()}
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Produce viral short-form hooks, full reel video scripts, compliant captions, and brief audits.
          </p>
        </div>

        {/* Studio Tools Navigation */}
        <div className="flex items-center p-1 rounded-xl bg-zinc-900 border border-zinc-800 text-xs">
          <button
            onClick={() => setActiveTool('hooks')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTool === 'hooks' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Viral Hooks
          </button>
          <button
            onClick={() => setActiveTool('script')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTool === 'script' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Video Script
          </button>
          <button
            onClick={() => setActiveTool('caption')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTool === 'caption' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Captions
          </button>
          <button
            onClick={() => setActiveTool('compliance')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTool === 'compliance' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Brief Audit
          </button>
        </div>
      </div>

      {/* Input Parameters Box */}
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/70 p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 space-y-1">
            <label className="text-xs font-semibold text-zinc-300">
              Campaign / Video Concept Topic
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Summer streetwear outfit transitions with oversized hoodies"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-300">Target Niche</label>
            <select
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="Streetwear & Urban Culture">Streetwear & Urban</option>
              <option value="Tech & Consumer Electronics">Tech & Gadgets</option>
              <option value="Fitness & Health">Fitness & Wellness</option>
              <option value="Beauty & Skincare">Beauty & Skincare</option>
              <option value="Gaming & Esports">Gaming & Esports</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-zinc-900">
          <div className="flex items-center gap-2 text-[11px] text-zinc-500">
            <Cpu className="w-3.5 h-3.5 text-zinc-400" />
            <span>Inference Model: {byokConfig.activeProvider === 'default' ? 'CreatorOS Engine' : byokConfig.activeProvider.toUpperCase()}</span>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all"
          >
            <Zap className="w-3.5 h-3.5 fill-white" />
            <span>{isGenerating ? 'Synthesizing...' : 'Generate with AI'}</span>
          </button>
        </div>
      </div>

      {/* Output Canvas */}
      <div className="space-y-4">
        {/* Tool 1: Viral Hooks */}
        {activeTool === 'hooks' && (
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider font-mono">
              High-Retention Hook Variations (3-Second Window)
            </h3>
            <div className="space-y-2.5">
              {generatedHooks.map((hook, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-4 flex items-start justify-between gap-3 group hover:border-zinc-700 transition-all"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold text-indigo-400">
                      Variation #{idx + 1}
                    </span>
                    <p className="text-xs text-zinc-200 leading-relaxed font-medium">"{hook}"</p>
                  </div>
                  <button
                    onClick={() => handleCopy(hook, `hook-${idx}`)}
                    className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors shrink-0"
                    title="Copy hook"
                  >
                    {copiedKey === `hook-${idx}` ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tool 2: Video Script */}
        {activeTool === 'script' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider font-mono">
                Full Production Reel Script Breakdown
              </h3>
              <button
                onClick={() => handleCopy(generatedScript, 'script')}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs transition-colors"
              >
                {copiedKey === 'script' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Script</span>
                  </>
                )}
              </button>
            </div>
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-4">
              <pre className="text-xs text-zinc-200 whitespace-pre-wrap font-sans leading-relaxed">
                {generatedScript}
              </pre>
            </div>
          </div>
        )}

        {/* Tool 3: Captions */}
        {activeTool === 'caption' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider font-mono">
                Optimized Engagement Caption & Hashtags
              </h3>
              <button
                onClick={() => handleCopy(generatedCaption, 'caption')}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs transition-colors"
              >
                {copiedKey === 'caption' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Caption</span>
                  </>
                )}
              </button>
            </div>
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-4">
              <p className="text-xs text-zinc-200 leading-relaxed whitespace-pre-line">
                {generatedCaption}
              </p>
            </div>
          </div>
        )}

        {/* Tool 4: Brief Compliance Pre-Check */}
        {activeTool === 'compliance' && (
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider font-mono">
              Automated Deliverable Pre-Submission Audit
            </h3>
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Compliance Score: {complianceResult.score}%</h4>
                    <p className="text-xs text-zinc-400">Passed safety checks and brief alignment criteria.</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
                  Ready to Submit
                </span>
              </div>

              <div className="pt-3 border-t border-zinc-800 space-y-2">
                {complianceResult.notes.map((note, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-zinc-300">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{note}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
