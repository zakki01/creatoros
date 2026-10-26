import React, { useState } from 'react';
import {
  ShieldCheck,
  FileText,
  ArrowLeft,
  Lock,
  Eye,
  Server,
  UserCheck,
  AlertTriangle,
  Download,
} from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';

interface PrivacyPageProps {
  onBack?: () => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onBack }) => {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', num: '01', title: 'Privacy Philosophy & Scope' },
    { id: 'data-collection', num: '02', title: 'Information We Collect' },
    { id: 'account-data', num: '03', title: 'Account & Identity Data' },
    { id: 'creator-brand-info', num: '04', title: 'Creator & Brand Information' },
    { id: 'messages-content', num: '05', title: 'Messages, Content & Uploads' },
    { id: 'payments-financial', num: '06', title: 'Payments & Financial Data' },
    { id: 'cookies-tracking', num: '07', title: 'Cookies & Local Storage' },
    { id: 'analytics-telemetry', num: '08', title: 'Platform Analytics & Telemetry' },
    { id: 'third-parties', num: '09', title: 'Third-Party Service Providers' },
    { id: 'data-retention', num: '10', title: 'Data Retention Schedules' },
    { id: 'security-encryption', num: '11', title: 'Security & Encryption Controls' },
    { id: 'user-rights', num: '12', title: 'Your Rights (GDPR & CCPA)' },
    { id: 'international-transfers', num: '13', title: 'Cross-Border Data Transfers' },
    { id: 'contact', num: '14', title: 'Data Protection Officer Contact' },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#EAECEF] text-zinc-900 font-sans selection:bg-[#007E93]/10 selection:text-[#005564]">
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-black/[0.08] bg-[#EAECEF]/90 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack ? onBack : () => (window.location.href = '/')}
              className="min-h-[44px] min-w-[44px] rounded-xl hover:bg-zinc-100 text-zinc-500 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Back to home"
              title="Back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <BrandLogo size="sm" />
            <span className="text-zinc-600 hidden sm:inline">•</span>
            <span className="text-xs font-semibold text-zinc-700 hidden sm:inline">
              Privacy Policy
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="hidden sm:flex min-h-[44px] px-3.5 py-1.5 rounded-xl border border-black/[0.08] bg-white hover:bg-zinc-100 text-xs font-medium text-zinc-700 items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 border border-zinc-300">
              Oct 2026
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 lg:py-14">
        {/* Counsel Disclaimer Banner */}
        <div className="mb-10 p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-500/30 text-amber-800 flex items-start gap-3.5">
          <AlertTriangle className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider font-mono">
              Privacy Governance Notice
            </h4>
            <p className="text-xs text-amber-800/90 leading-relaxed">
              This Privacy Policy describes data handling procedures, cookie practices, and security measures applied across CreatorOS. This text is an operational staging draft and should be verified by certified data privacy counsel prior to commercial launch to ensure jurisdictional compliance with GDPR, CCPA, and regional statutes.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Table of Contents Rail (Desktop) */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-24 space-y-3">
            <div className="p-4 rounded-2xl bg-white shadow-sm border border-black/[0.08] backdrop-blur-xl">
              <div className="flex items-center gap-2 pb-3 mb-2 border-b border-black/[0.06] text-xs font-bold text-zinc-800 font-mono uppercase tracking-wider">
                <FileText className="w-4 h-4 text-[#007E93]" />
                <span>Policy Outline</span>
              </div>
              <div className="max-h-[calc(100vh-200px)] overflow-y-auto space-y-1 pr-1 text-xs">
                {sections.map((sec) => (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    onClick={() => setActiveSection(sec.id)}
                    className={`block px-3 py-2 rounded-xl transition-all ${
                      activeSection === sec.id
                        ? 'bg-[#00B4D8]/20 text-[#007E93] font-semibold border border-[#00B4D8]/30'
                        : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100/40'
                    }`}
                  >
                    <span className="font-mono text-[10px] text-zinc-500 mr-2">{sec.num}</span>
                    <span>{sec.title}</span>
                  </a>
                ))}
              </div>
            </div>
          </aside>

          {/* Right Document Body */}
          <div className="lg:col-span-8 space-y-12 leading-relaxed">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 font-display mb-3">
                CreatorOS Platform Privacy Policy
              </h1>
              <p className="text-sm text-zinc-500">
                Last modified: October 12, 2026 • Version 2.4.0
              </p>
            </div>

            {/* Section 01 */}
            <section id="overview" className="space-y-3 pt-6 border-t border-black/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-zinc-300">01</span>
                <h2 className="text-lg font-bold text-zinc-900 font-display">Privacy Philosophy & Scope</h2>
              </div>
              <p className="text-xs text-zinc-700">
                CreatorOS values creator autonomy and brand confidentiality. We adhere to data minimization principles: we collect only data strictly necessary to operate collaborative campaigns, formalize commercial agreements, disburse protected payments, and defend against fraudulent activity.
              </p>
            </section>

            {/* Section 02 */}
            <section id="data-collection" className="space-y-3 pt-6 border-t border-black/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-zinc-300">02</span>
                <h2 className="text-lg font-bold text-zinc-900 font-display">Information We Collect</h2>
              </div>
              <p className="text-xs text-zinc-700">
                We collect information directly provided during onboarding, generated through platform usage, or ingested via authenticated third-party social integrations (Google, Apple, Facebook). We do not purchase behavioral profiling lists from external data brokers.
              </p>
            </section>

            {/* Section 03 */}
            <section id="account-data" className="space-y-3 pt-6 border-t border-black/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-zinc-300">03</span>
                <h2 className="text-lg font-bold text-zinc-900 font-display">Account & Identity Data</h2>
              </div>
              <p className="text-xs text-zinc-700">
                Account information includes your display name, email address, password hashes (salted using argon2/bcrypt), avatar images, account role (Creator, Brand, or Super Admin), and multi-factor authorization status.
              </p>
            </section>

            {/* Section 04 */}
            <section id="creator-brand-info" className="space-y-3 pt-6 border-t border-black/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-zinc-300">04</span>
                <h2 className="text-lg font-bold text-zinc-900 font-display">Creator & Brand Information</h2>
              </div>
              <p className="text-xs text-zinc-700">
                For creators: social handles, content categories, rate cards, portfolio samples, and verification documents. For brands: registered legal business names, corporate domains, GST/tax IDs, and authorized billing representatives.
              </p>
            </section>

            {/* Section 05 */}
            <section id="messages-content" className="space-y-3 pt-6 border-t border-black/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-zinc-300">05</span>
                <h2 className="text-lg font-bold text-zinc-900 font-display">Messages, Content & Uploads</h2>
              </div>
              <p className="text-xs text-zinc-700">
                Content published to Discover (Reels, Shots, Blogs) is publicly visible. Private Direct Messages, deliverable review files, and internal revision requests are confidential and protected with restricted access controls.
              </p>
            </section>

            {/* Section 06 */}
            <section id="payments-financial" className="space-y-3 pt-6 border-t border-black/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-zinc-300">06</span>
                <h2 className="text-lg font-bold text-zinc-900 font-display">Payments & Financial Data</h2>
              </div>
              <p className="text-xs text-zinc-700">
                Financial transactions are securely processed by PCI-DSS Level 1 compliant partners (Stripe Connect and PayPal Commerce Platform). CreatorOS does not store raw credit card numbers or banking passwords on internal servers; we store exclusively tokenized customer references and transaction IDs.
              </p>
            </section>

            {/* Section 07 */}
            <section id="cookies-tracking" className="space-y-3 pt-6 border-t border-black/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-zinc-300">07</span>
                <h2 className="text-lg font-bold text-zinc-900 font-display">Cookies & Local Storage</h2>
              </div>
              <p className="text-xs text-zinc-700">
                We employ necessary session cookies and browser local storage to maintain authenticated states, draft autosave caches, and interface theme settings. We do not use third-party cross-site advertising tracking cookies.
              </p>
            </section>

            {/* Section 08 */}
            <section id="analytics-telemetry" className="space-y-3 pt-6 border-t border-black/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-zinc-300">08</span>
                <h2 className="text-lg font-bold text-zinc-900 font-display">Platform Analytics & Telemetry</h2>
              </div>
              <p className="text-xs text-zinc-700">
                Aggregated, anonymized telemetry (page response latency, error codes, conversion flows) is used to optimize system performance and diagnose infrastructure faults.
              </p>
            </section>

            {/* Section 09 */}
            <section id="third-parties" className="space-y-3 pt-6 border-t border-black/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-zinc-300">09</span>
                <h2 className="text-lg font-bold text-zinc-900 font-display">Third-Party Service Providers</h2>
              </div>
              <p className="text-xs text-zinc-700">
                Data may be processed by trusted infrastructure vendors under strict confidentiality obligations: Cloud hosting (Supabase, Vercel, AWS), Payment gateways (Stripe, PayPal), and transactional email dispatchers.
              </p>
            </section>

            {/* Section 10 */}
            <section id="data-retention" className="space-y-3 pt-6 border-t border-black/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-zinc-300">10</span>
                <h2 className="text-lg font-bold text-zinc-900 font-display">Data Retention Schedules</h2>
              </div>
              <p className="text-xs text-zinc-700">
                Active account data is retained for the duration of the account lifespan. Financial transaction audit records and executed contracts are retained for 7 years to fulfill statutory corporate taxation requirements.
              </p>
            </section>

            {/* Section 11 */}
            <section id="security-encryption" className="space-y-3 pt-6 border-t border-black/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-zinc-300">11</span>
                <h2 className="text-lg font-bold text-zinc-900 font-display">Security & Encryption Controls</h2>
              </div>
              <p className="text-xs text-zinc-700">
                All network transmissions are enforced via TLS 1.3 encryption. Database records and stored media objects are encrypted at rest using AES-256. Access to administrative systems is restricted via multi-factor authentication and role-based access control.
              </p>
            </section>

            {/* Section 12 */}
            <section id="user-rights" className="space-y-3 pt-6 border-t border-black/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-zinc-300">12</span>
                <h2 className="text-lg font-bold text-zinc-900 font-display">Your Rights (GDPR & CCPA)</h2>
              </div>
              <p className="text-xs text-zinc-700">
                Users hold the right to: (a) access a copy of personal records; (b) rectify inaccurate information; (c) request erasure of personal data (&quot;Right to be Forgotten&quot;); (d) export data in portable JSON format; (e) opt out of non-essential processing.
              </p>
            </section>

            {/* Section 13 */}
            <section id="international-transfers" className="space-y-3 pt-6 border-t border-black/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-zinc-300">13</span>
                <h2 className="text-lg font-bold text-zinc-900 font-display">Cross-Border Data Transfers</h2>
              </div>
              <p className="text-xs text-zinc-700">
                Where data is transferred internationally across cloud nodes, CreatorOS utilizes EU Standard Contractual Clauses (SCCs) and equivalent recognized safeguards to protect data integrity.
              </p>
            </section>

            {/* Section 14 */}
            <section id="contact" className="space-y-3 pt-6 border-t border-black/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-zinc-300">14</span>
                <h2 className="text-lg font-bold text-zinc-900 font-display">Data Protection Officer Contact</h2>
              </div>
              <p className="text-xs text-zinc-700">
                To submit a Subject Access Request (SAR), exercise privacy rights, or contact our Data Protection Officer, email <strong className="text-white">privacy@creatoros.ai</strong> or submit an inquiry through the <a href="/support" className="text-[#007E93] underline hover:text-[#007E93]">CreatorOS Support Portal</a>.
              </p>
            </section>
          </div>
        </div>
      </main>

      {/* Minimal Legal Footer */}
      <footer className="border-t border-black/[0.08] py-8 bg-white text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BrandLogo size="xs" />
            <span className="text-zinc-600">•</span>
            <span>© 2026 CreatorOS Inc. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="/terms" className="hover:text-zinc-700 transition-colors">Terms</a>
            <a href="/privacy" className="text-zinc-700 hover:text-white transition-colors">Privacy</a>
            <a href="/support" className="hover:text-zinc-700 transition-colors">Support</a>
            <a href="mailto:privacy@creatoros.ai" className="hover:text-zinc-700 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
