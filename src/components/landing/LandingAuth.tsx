import React, { useState } from 'react';
import {
  Sparkles,
  Building2,
  UserCheck,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import { useAppState } from '../../context/StateContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { UserRole } from '../../types';
import { BrandLogo } from '../common/BrandLogo';

interface LandingAuthProps {
  onEnterApp: () => void;
}

export const LandingAuth: React.FC<LandingAuthProps> = ({ onEnterApp }) => {
  const { setRole, triggerCelebration } = useAppState();
  const [selectedRole, setSelectedRole] = useState<UserRole>('business');

  const handleSelect = (r: UserRole) => {
    setSelectedRole(r);
  };

  const handleProceed = () => {
    setRole(selectedRole);
    triggerCelebration();
    onEnterApp();
  };

  return (
    <div className="min-h-screen w-full bg-[#09090b] text-zinc-100 flex flex-col justify-between p-6 sm:p-12 relative overflow-hidden font-sans">
      {/* Subtle ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-indigo-600/15 via-purple-600/10 to-emerald-600/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Header */}
      <header className="flex items-center justify-between max-w-6xl w-full mx-auto relative z-10">
        <BrandLogo size="lg" subtitle="AI Influencer Operating System" />

        <Badge variant="brand" size="md">
          v2.4 Production Prototype
        </Badge>
      </header>

      {/* Main Role Selection Modal Card */}
      <div className="max-w-3xl w-full mx-auto my-auto relative z-10 py-10 space-y-8 animate-fade-in">
        <div className="text-center space-y-3">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-zinc-100 font-display tracking-tight leading-tight">
            The intelligent operating system for influencer marketing.
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Select your operating workspace. CreatorOS adapts its entire intelligence layer, navigation, and permissions to your exact workflow.
          </p>
        </div>

        {/* 2 Roles Split Cards (Business vs Creator) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          {/* BUSINESS / BRAND */}
          <div
            onClick={() => handleSelect('business')}
            className={`p-7 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between space-y-5 ${
              selectedRole === 'business'
                ? 'bg-zinc-900 border-indigo-500 shadow-2xl shadow-indigo-500/15 ring-2 ring-indigo-500/50'
                : 'bg-zinc-900/60 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900/90'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
                  <Building2 className="w-6 h-6" />
                </div>
                {selectedRole === 'business' && (
                  <Badge variant="brand" size="sm">
                    Selected Workspace
                  </Badge>
                )}
              </div>

              <div>
                <h3 className="text-xl font-bold text-zinc-100 font-display">
                  Business & Brand App
                </h3>
                <p className="text-xs text-indigo-300 font-medium mt-0.5">
                  "Run my influencer campaigns."
                </p>
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                  For brands, direct-to-consumer labels, and agencies looking to discover, simulate, negotiate, approve content, and track blended ROAS.
                </p>
              </div>

              <div className="space-y-2 text-xs text-zinc-300 pt-2 border-t border-zinc-800/80">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>AI Attention Center & Proactive Risk Engine</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Campaign Simulator (Scenario A vs B vs C)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Automated AI Pre-Check on Video Submissions</span>
                </div>
              </div>
            </div>

            <Button
              variant={selectedRole === 'business' ? 'primary' : 'outline'}
              size="md"
              className="w-full text-xs"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Enter as Business
            </Button>
          </div>

          {/* CREATOR */}
          <div
            onClick={() => handleSelect('creator')}
            className={`p-7 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between space-y-5 ${
              selectedRole === 'creator'
                ? 'bg-zinc-900 border-emerald-500 shadow-2xl shadow-emerald-500/15 ring-2 ring-emerald-500/50'
                : 'bg-zinc-900/60 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900/90'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                  <UserCheck className="w-6 h-6" />
                </div>
                {selectedRole === 'creator' && (
                  <Badge variant="success" size="sm">
                    Selected Workspace
                  </Badge>
                )}
              </div>

              <div>
                <h3 className="text-xl font-bold text-zinc-100 font-display">
                  Creator Studio App
                </h3>
                <p className="text-xs text-emerald-400 font-medium mt-0.5">
                  "Grow my creator business."
                </p>
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                  For creators and influencers to accept tailored brand invites, submit drafts with instant AI pre-checks, manage escrow payouts, and own their Creator Passport.
                </p>
              </div>

              <div className="space-y-2 text-xs text-zinc-300 pt-2 border-t border-zinc-800/80">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Creator Passport™ with Verified Platform Metrics</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Instant Escrow Payouts (50% Advance Guaranteed)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Strict Data Privacy: Confidential Brand Data Isolated</span>
                </div>
              </div>
            </div>

            <Button
              variant={selectedRole === 'creator' ? 'primary' : 'outline'}
              size="md"
              className={`w-full text-xs ${
                selectedRole === 'creator' ? 'bg-emerald-600 hover:bg-emerald-500' : ''
              }`}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Enter as Creator
            </Button>
          </div>
        </div>

        {/* Central Launch Button */}
        <div className="text-center pt-2">
          <Button
            variant="ai"
            size="lg"
            onClick={handleProceed}
            className="px-8 text-sm"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Launch {selectedRole === 'business' ? 'Business' : 'Creator'} Operating System
          </Button>
          <p className="text-xs text-zinc-500 mt-2">
            You can seamlessly toggle between workspaces at any time from the top navigation bar.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-xs text-zinc-500 max-w-6xl w-full mx-auto relative z-10 pt-6 border-t border-zinc-900">
        CreatorOS Architecture: Decoupled UI, Unified State Bridge, Continuous AI Intelligence Layer.
      </footer>
    </div>
  );
};
