import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  Copy,
  Check,
  Cpu,
  ShieldCheck,
  Video,
  FileText,
  Layers,
  Settings,
} from 'lucide-react';
import { useAppState } from '../../context/StateContext';

export const CreatorAiStudio: React.FC = () => {
  const { byokConfig } = useAppState();

  const [activeTool, setActiveTool] = useState<'hooks' | 'script' | 'caption' | 'compliance'>('hooks');
  const [topic, setTopic] = useState('Autumn Streetwear Lookbook & Layering Guide');
  const [niche, setNiche] = useState('Streetwear & Urban Culture');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Generated outputs state
  const [generatedHooks, setGeneratedHooks] = useState<string[]>([
    'Stop wearing oversized tees like this in 2026—here is the correct silhouette formula.',
    'I tried 5 street fashion layering techniques so you do not look bulky this season.',
    '3 streetwear styling mistakes making your outfits look cheap (and the fix).',
  ]);

  const [generatedScript, setGeneratedScript] = useState<string>(
    `[00:00 - 00:03 | THE HOOK]\nVisual: Fast jump-cut between flat lay and full body fit with heavy cinematic motion blur.\nAudio/Voice: "Stop layering oversized pieces like this. You look like a walking duvet."\n\n[00:03 - 00:15 | THE PROBLEM & TENSION]\nVisual: Quick close-ups on fabric textures, zipper details, and sneaker drop.\nAudio/Voice: "The key to 2026 streetwear is proportional contrast. Heavy cropped outerwear paired with relaxed pleated denim."\n\n[00:15 - 00:30 | THE SOLUTION / REVEAL]\nVisual: 3 rapid outfit transitions timed to the beat drop.\nAudio/Voice: "Save this reel before your next fit check. Link to items in bio."`
  );

  const [generatedCaption, setGeneratedCaption] = useState<string>(
    `Proportional contrast > oversized everything. Fall styling breakdown featuring cropped outerwear & relaxed Japanese denim.\n\nDrop 1 or 2 below for the cleaner fit.\n\n#Streetwear2026 #OutfitInspo #LayeringSeason #MinimalStreetwear #FashionCreator`
  );

  const [complianceResult, setComplianceResult] = useState<{
    score: number;
    notes: string[];
  }>({
    score: 98,
    notes: [
      'ASCI Guidelines: Includes clear #ad / #partner disclosure placeholder.',
      'Brand Safety: Zero restricted substances or unverified claims.',
      'Audio Rights: Ready for commercial licensed audio overlay.',
    ],
  });

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      if (activeTool === 'hooks') {
        setGeneratedHooks([
          `Why everyone in ${niche} is switching to this aesthetic in 2026.`,
          `The secret technique top creators use for ${topic.toLowerCase()}.`,
          `Stop scrolling if you care about your next viral reel.`,
        ]);
      }
    }, 800);
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12 font-sans text-[var(--text-primary)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] font-display">
              AI Creative Studio
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/30">
              Autonomous Assistant
            </span>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Generate viral hooks, production scripts, SEO captions, and run automated brief compliance audits.
          </p>
        </div>

        {/* Studio Mode Selector */}
        <div className="flex items-center p-1 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)] text-xs">
          <button
            onClick={() => setActiveTool('hooks')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              activeTool === 'hooks' ? 'bg-[var(--accent)] text-white shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            Hook Engine
          </button>
          <button
            onClick={() => setActiveTool('script')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              activeTool === 'script' ? 'bg-[var(--accent)] text-white shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            Reel Script
          </button>
          <button
            onClick={() => setActiveTool('caption')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              activeTool === 'caption' ? 'bg-[var(--accent)] text-white shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            Caption & Tags
          </button>
          <button
            onClick={() => setActiveTool('compliance')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              activeTool === 'compliance' ? 'bg-[var(--accent)] text-white shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            Brief Audit
          </button>
        </div>
      </div>

      {/* Input Parameters Box */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 space-y-1">
            <label className="text-xs font-semibold text-[var(--text-secondary)]">
              Campaign / Video Concept Topic
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Summer streetwear outfit transitions with oversized hoodies"
              className="w-full bg-[var(--input)] border border-[var(--border)] rounded-xl px-3.5 py-2 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[var(--text-secondary)]">Target Niche</label>
            <select
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              className="w-full bg-[var(--input)] border border-[var(--border)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] cursor-pointer"
            >
              <option value="Streetwear & Urban Culture">Streetwear & Urban</option>
              <option value="Tech & Consumer Electronics">Tech & Gadgets</option>
              <option value="Fitness & Health">Fitness & Wellness</option>
              <option value="Beauty & Skincare">Beauty & Skincare</option>
              <option value="Gaming & Esports">Gaming & Esports</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]">
          <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)] font-mono">
            <Cpu className="w-3.5 h-3.5" />
            <span>Inference Model: {byokConfig.activeProvider === 'default' ? 'CreatorOS Engine' : byokConfig.activeProvider.toUpperCase()}</span>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-4 py-2 rounded-xl bg-[var(--accent)] hover:opacity-90 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
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
            <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider font-mono">
              High-Retention Hook Variations (3-Second Window)
            </h3>
            <div className="space-y-2.5">
              {generatedHooks.map((hook, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-xs p-4 flex items-start justify-between gap-3 group hover:border-[var(--accent)]/40 transition-all"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold text-[var(--accent)]">
                      Variation #{idx + 1}
                    </span>
                    <p className="text-xs text-[var(--text-primary)] leading-relaxed font-medium">"{hook}"</p>
                  </div>
                  <button
                    onClick={() => handleCopy(hook, `hook-${idx}`)}
                    className="p-1.5 rounded-lg bg-[var(--surface-muted)] hover:bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors shrink-0 cursor-pointer"
                    title="Copy hook"
                  >
                    {copiedKey === `hook-${idx}` ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
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
              <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider font-mono">
                Full Production Reel Script Breakdown
              </h3>
              <button
                onClick={() => handleCopy(generatedScript, 'script')}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--surface-muted)] hover:bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-secondary)] text-xs transition-colors cursor-pointer"
              >
                {copiedKey === 'script' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-500">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Script</span>
                  </>
                )}
              </button>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-xs p-4">
              <pre className="text-xs text-[var(--text-primary)] whitespace-pre-wrap font-sans leading-relaxed">
                {generatedScript}
              </pre>
            </div>
          </div>
        )}

        {/* Tool 3: Captions */}
        {activeTool === 'caption' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider font-mono">
                Optimized Engagement Caption & Hashtags
              </h3>
              <button
                onClick={() => handleCopy(generatedCaption, 'caption')}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--surface-muted)] hover:bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-secondary)] text-xs transition-colors cursor-pointer"
              >
                {copiedKey === 'caption' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-500">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Caption</span>
                  </>
                )}
              </button>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-xs p-4">
              <p className="text-xs text-[var(--text-primary)] leading-relaxed whitespace-pre-line">
                {generatedCaption}
              </p>
            </div>
          </div>
        )}

        {/* Tool 4: Brief Compliance Pre-Check */}
        {activeTool === 'compliance' && (
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider font-mono">
              Automated Deliverable Pre-Submission Audit
            </h3>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-xs p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[var(--text-primary)]">Compliance Score: {complianceResult.score}%</h4>
                    <p className="text-xs text-[var(--text-secondary)]">Passed safety checks and brief alignment criteria.</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
                  Ready to Submit
                </span>
              </div>

              <div className="pt-3 border-t border-[var(--border)] space-y-2">
                {complianceResult.notes.map((note, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
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