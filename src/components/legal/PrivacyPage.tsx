import React, { useState } from 'react';
import {
  FileText,
  ArrowLeft,
  AlertTriangle,
  Download,
} from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
import { ThemeToggle } from '../common/ThemeToggle';

interface PrivacyPageProps {
  onBack?: () => void;
}

interface PrivacySection {
  id: string;
  num: string;
  title: string;
  content: React.ReactNode;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onBack }) => {
  const [activeSection, setActiveSection] = useState('overview');

  const sections: PrivacySection[] = [
    {
      id: 'overview',
      num: '01',
      title: 'Privacy Philosophy & Scope',
      content: (
        <p>
          CreatorOS values creator autonomy and brand confidentiality. We adhere to data minimization principles: we collect only data strictly necessary to operate collaborative campaigns, formalize commercial agreements, disburse protected payments, and defend against fraudulent activity.
        </p>
      ),
    },
    {
      id: 'data-collection',
      num: '02',
      title: 'Information We Collect',
      content: (
        <p>
          We collect information directly provided during onboarding, generated through platform usage, or ingested via authenticated third-party social integrations (Google, Apple, Facebook). We do not purchase behavioral profiling lists from external data brokers.
        </p>
      ),
    },
    {
      id: 'account-data',
      num: '03',
      title: 'Account & Identity Data',
      content: (
        <p>
          Account information includes your display name, email address, password hashes (salted using argon2/bcrypt), avatar images, account role (Creator, Brand, or Super Admin), and multi-factor authorization status.
        </p>
      ),
    },
    {
      id: 'creator-brand-info',
      num: '04',
      title: 'Creator & Brand Information',
      content: (
        <p>
          For creators: social handles, content categories, rate cards, portfolio samples, and verification documents. For brands: registered legal business names, corporate domains, GST/tax IDs, and authorized billing representatives.
        </p>
      ),
    },
    {
      id: 'messages-content',
      num: '05',
      title: 'Messages, Content & Uploads',
      content: (
        <p>
          Content published to Discover (Reels, Shots, Blogs) is publicly visible. Private Direct Messages, deliverable review files, and internal revision requests are confidential and protected with restricted access controls.
        </p>
      ),
    },
    {
      id: 'payments-financial',
      num: '06',
      title: 'Payments & Financial Data',
      content: (
        <p>
          Financial transactions are securely processed by PCI-DSS Level 1 compliant partners (Stripe Connect, PayPal Commerce Platform, and direct UPI rails). CreatorOS does not store raw credit card numbers or banking passwords on internal servers; we store exclusively tokenized customer references and transaction IDs.
        </p>
      ),
    },
    {
      id: 'cookies-tracking',
      num: '07',
      title: 'Cookies & Local Storage',
      content: (
        <p>
          We employ necessary session cookies and browser local storage to maintain authenticated states, draft autosave caches, and interface theme settings. We do not use third-party cross-site advertising tracking cookies.
        </p>
      ),
    },
    {
      id: 'analytics-telemetry',
      num: '08',
      title: 'Platform Analytics & Telemetry',
      content: (
        <p>
          Aggregated, anonymized telemetry (page response latency, error codes, conversion flows) is used to optimize system performance and diagnose infrastructure faults.
        </p>
      ),
    },
    {
      id: 'third-parties',
      num: '09',
      title: 'Third-Party Service Providers',
      content: (
        <p>
          Data may be processed by trusted infrastructure vendors under strict confidentiality obligations: Cloud hosting (Supabase, Vercel, AWS), Payment gateways (Stripe, PayPal, UPI banks), and transactional email dispatchers.
        </p>
      ),
    },
    {
      id: 'data-retention',
      num: '10',
      title: 'Data Retention Schedules',
      content: (
        <p>
          Active account data is retained for the duration of the account lifespan. Financial transaction audit records and executed contracts are retained for 7 years to fulfill statutory corporate taxation requirements.
        </p>
      ),
    },
    {
      id: 'security-encryption',
      num: '11',
      title: 'Security & Encryption Controls',
      content: (
        <p>
          All network transmissions are enforced via TLS 1.3 encryption. Database records and stored media objects are encrypted at rest using AES-256. Access to administrative systems is restricted via multi-factor authentication and role-based access control.
        </p>
      ),
    },
    {
      id: 'user-rights',
      num: '12',
      title: 'Your Rights (GDPR & CCPA)',
      content: (
        <p>
          Users hold the right to: (a) access a copy of personal records; (b) rectify inaccurate information; (c) request erasure of personal data (&quot;Right to be Forgotten&quot;); (d) export data in portable JSON format; (e) opt out of non-essential processing.
        </p>
      ),
    },
    {
      id: 'international-transfers',
      num: '13',
      title: 'Cross-Border Data Transfers',
      content: (
        <p>
          Where data is transferred internationally across cloud nodes, CreatorOS utilizes EU Standard Contractual Clauses (SCCs) and equivalent recognized safeguards to protect data integrity.
        </p>
      ),
    },
    {
      id: 'contact',
      num: '14',
      title: 'Data Protection Officer Contact',
      content: (
        <p>
          To submit a Subject Access Request (SAR), exercise privacy rights, or contact our Data Protection Officer, email{' '}
          <strong className="text-[var(--text-primary)] font-semibold">privacy@creatoros.ai</strong> or submit an inquiry through the{' '}
          <a href="/support" className="text-[var(--primary)] underline hover:text-[var(--primary-hover)] font-medium">
            CreatorOS Support Portal
          </a>
          .
        </p>
      ),
    },
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)] font-sans selection:bg-[var(--primary)]/15 selection:text-[var(--primary)] transition-colors duration-200">
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--surface)]/85 backdrop-blur-2xl transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="w-10 h-10 rounded-xl hover:bg-[var(--surface-muted)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border)] flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Back to home"
              title="Back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <BrandLogo size="sm" />
            <span className="text-[var(--text-muted)] hidden sm:inline">•</span>
            <span className="text-xs font-semibold text-[var(--text-secondary)] hidden sm:inline">
              Privacy Policy
            </span>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={handlePrint}
              className="hidden sm:flex px-3.5 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-muted)] text-xs font-medium text-[var(--text-primary)] items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-[var(--surface-muted)] text-[var(--text-secondary)] border border-[var(--border)] font-semibold">
              Oct 2026
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 lg:py-14">
        {/* Counsel Disclaimer Banner */}
        <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 flex items-start gap-3.5 shadow-xs transition-colors duration-200">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider font-mono">
              Privacy Governance Notice
            </h4>
            <p className="text-xs text-amber-900/90 dark:text-amber-200/90 leading-relaxed">
              This Privacy Policy describes data handling procedures, cookie practices, and security measures applied across CreatorOS. This text is an operational staging draft and should be verified by certified data privacy counsel prior to commercial launch to ensure jurisdictional compliance with GDPR, CCPA, and regional statutes.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Table of Contents Rail (Desktop) */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-24 space-y-3">
            <div className="p-4 rounded-2xl bg-[var(--surface)] shadow-sm border border-[var(--border)] backdrop-blur-xl transition-colors duration-200">
              <div className="flex items-center gap-2 pb-3 mb-2 border-b border-[var(--border)] text-xs font-bold text-[var(--text-primary)] font-mono uppercase tracking-wider">
                <FileText className="w-4 h-4 text-[var(--primary)]" />
                <span>Policy Outline</span>
              </div>
              <div className="max-h-[calc(100vh-200px)] overflow-y-auto space-y-1 pr-1 text-xs scrollbar-thin">
                {sections.map((sec) => (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    onClick={() => setActiveSection(sec.id)}
                    className={`block px-3 py-2 rounded-xl transition-all ${
                      activeSection === sec.id
                        ? 'bg-[var(--primary)]/15 text-[var(--primary)] font-bold border border-[var(--primary)]/30 shadow-xs'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-muted)] border border-transparent'
                    }`}
                  >
                    <span
                      className={`font-mono text-[10px] mr-2 ${
                        activeSection === sec.id ? 'text-[var(--primary)] font-bold' : 'text-[var(--text-muted)]'
                      }`}
                    >
                      {sec.num}
                    </span>
                    <span>{sec.title}</span>
                  </a>
                ))}
              </div>
            </div>
          </aside>

          {/* Right Document Body */}
          <div className="lg:col-span-8 space-y-10 leading-relaxed">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)] font-display mb-3">
                CreatorOS Platform Privacy Policy
              </h1>
              <p className="text-sm text-[var(--text-muted)]">
                Last modified: October 12, 2026 • Version 2.4.0
              </p>
            </div>

            {sections.map((sec) => (
              <section
                key={sec.id}
                id={sec.id}
                className="space-y-3 pt-6 border-t border-[var(--border)] scroll-mt-24"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-mono px-2 py-0.5 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20 font-bold">
                    {sec.num}
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] font-display">
                    {sec.title}
                  </h2>
                </div>
                <div className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {sec.content}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>

      {/* Minimal Legal Footer */}
      <footer className="border-t border-[var(--border)] py-8 bg-[var(--surface)] text-xs text-[var(--text-muted)] transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BrandLogo size="xs" />
            <span className="text-[var(--text-muted)]">•</span>
            <span>© 2026 CreatorOS Inc. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="/terms" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              Terms
            </a>
            <a href="/privacy" className="text-[var(--primary)] font-semibold hover:underline transition-colors">
              Privacy
            </a>
            <a href="/support" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              Support
            </a>
            <a href="mailto:privacy@creatoros.ai" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
