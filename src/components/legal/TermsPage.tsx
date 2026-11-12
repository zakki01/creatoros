import React, { useState } from 'react';
import {
  FileText,
  ArrowLeft,
  AlertTriangle,
  Download,
} from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
import { ThemeToggle } from '../common/ThemeToggle';

interface TermsPageProps {
  onBack?: () => void;
}

interface TermSection {
  id: string;
  num: string;
  title: string;
  content: React.ReactNode;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onBack }) => {
  const [activeSection, setActiveSection] = useState('acceptance');

  const sections: TermSection[] = [
    {
      id: 'acceptance',
      num: '01',
      title: 'Acceptance of Terms',
      content: (
        <p>
          By creating an account, accessing, or utilizing CreatorOS (&quot;the Platform&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), you (&quot;User&quot;, &quot;Creator&quot;, &quot;Brand&quot;, or &quot;Business&quot;) agree to be bound by these Terms of Service, all applicable laws, and all operating guidelines published on the Platform. If you do not accept these terms in their entirety, you must discontinue platform use immediately.
        </p>
      ),
    },
    {
      id: 'eligibility',
      num: '02',
      title: 'Eligibility',
      content: (
        <p>
          You must be at least 18 years of age or the legal age of majority in your jurisdiction to register an account or enter into legally binding commercial agreements on CreatorOS. By registering a Brand account, the individual represents and warrants that they possess explicit authority to bind the corporate legal entity to commercial financial obligations.
        </p>
      ),
    },
    {
      id: 'registration',
      num: '03',
      title: 'Account Registration & Security',
      content: (
        <p>
          Users must provide truthful, current, and complete registration credentials. You are responsible for safeguarding your authentication credentials, session tokens, and multi-factor authorization codes. CreatorOS is not liable for unauthorized account access resulting from compromised user credentials.
        </p>
      ),
    },
    {
      id: 'creator-accounts',
      num: '04',
      title: 'Creator Accounts & Profiles',
      content: (
        <p>
          Creators maintain professional public portfolios showcasing verified deliverables, rate cards, and engagement statistics. Creators warrant that all uploaded portfolio media, past brand associations, and audience demographics represent authentic work performed without automated engagement manipulation or deceptive metrics.
        </p>
      ),
    },
    {
      id: 'brand-accounts',
      num: '05',
      title: 'Brand Accounts & Workspaces',
      content: (
        <p>
          Brand Workspaces enable corporate marketing teams to organize campaigns, invite creators, issue contracts, and process protected project payments. Brands are responsible for ensuring that all campaign briefs and creative guidelines comply with commercial advertising standards and truthful product claims.
        </p>
      ),
    },
    {
      id: 'verification',
      num: '06',
      title: 'Identity & Professional Verification',
      content: (
        <p>
          Platform verification badges are granted following comprehensive evaluations encompassing government ID checks, corporate domain registration, track record of successfully executed agreements, and authentic delivery metrics. Verification is never sold for a recurring fee and may be revoked if deceptive conduct is detected.
        </p>
      ),
    },
    {
      id: 'platform',
      num: '07',
      title: 'The CreatorOS Platform',
      content: (
        <p>
          CreatorOS operates as an infrastructure provider connecting independent creative contractors with commercial enterprise brands. CreatorOS does not act as an employer, talent agency, or direct broker of physical commodities, except where explicit platform escrow and arbitration guarantees apply.
        </p>
      ),
    },
    {
      id: 'campaigns',
      num: '08',
      title: 'Campaigns & Discovery',
      content: (
        <p>
          Brands publish campaign briefs defining deliverables, compensation brackets, target demographic criteria, and submission deadlines. Creators may submit tailored proposals or respond to brand invitations. All commercial transactions resulting from discovery connections must be formalized through CreatorOS Contracts.
        </p>
      ),
    },
    {
      id: 'contracts',
      num: '09',
      title: 'Commercial Agreements & Contracts',
      content: (
        <p>
          Contracts executed on CreatorOS represent binding bilateral commercial agreements. Once both parties digitally execute an agreement and the brand funds the payment gateway hold, the contract transitions to Active status and binds the parties to the explicit milestones and schedules outlined.
        </p>
      ),
    },
    {
      id: 'payments',
      num: '10',
      title: 'Payment Processing & Escrow Holds',
      content: (
        <p>
          All contract funds are captured through integrated compliant payment gateways (Stripe Connect, PayPal Commerce Platform, and UPI rails). Funds are maintained in protected payment status until the brand approves submitted deliverables or the designated auto-approval review period elapses.
        </p>
      ),
    },
    {
      id: 'platform-fees',
      num: '11',
      title: 'Platform Fees (10% Model)',
      content: (
        <p>
          CreatorOS charges an administrative platform fee (defaulting to 10% of gross contract value, subject to administrative configuration between minimum and maximum caps). Platform fees finance secure payment infrastructure, dispute arbitration guarantees, automated risk scanning, and server maintenance.
        </p>
      ),
    },
    {
      id: 'project-protection',
      num: '12',
      title: 'Project Protection Guarantee',
      content: (
        <p>
          CreatorOS Project Protection reserves 20% in hold allocation to protect against unfulfilled deliverables, late delivery, or non-responsive brand review windows. In the event of confirmed contract abandonment by either party, Project Protection reserves facilitate equitable restitution.
        </p>
      ),
    },
    {
      id: 'deliverables',
      num: '13',
      title: 'Deliverables & File Standards',
      content: (
        <p>
          Deliverables must adhere to explicit technical constraints stipulated in the contract, including aspect ratio (e.g. 9:16 vertical video, 16:9 landscape, 4:5 portrait), resolution (1080p, 4K), duration, and master file formats. Submissions failing to meet technical criteria may be flagged for technical revision.
        </p>
      ),
    },
    {
      id: 'revisions',
      num: '14',
      title: 'Revisions & Acceptance Windows',
      content: (
        <p>
          Contracts include a specified number of revision rounds (defaulting to 2 rounds). Brands have a 3-business-day review window upon asset submission to accept or provide consolidated, actionable revision notes. If a brand fails to respond within the review window, assets are deemed automatically approved.
        </p>
      ),
    },
    {
      id: 'usage-rights',
      num: '15',
      title: 'Usage Rights & Licensing',
      content: (
        <p>
          Usage rights granted to Brands are governed strictly by the contract parameters: designated channels (Organic Social, Paid Ads, Website, Print), duration (e.g. 30 days, 90 days, 1 year), territory, and exclusivity terms. Brands may not syndicate content beyond the agreed scope without an approved contract amendment.
        </p>
      ),
    },
    {
      id: 'ip',
      num: '16',
      title: 'Intellectual Property Ownership',
      content: (
        <p>
          Unless a complete copyright assignment buyout is explicitly selected and compensated in the contract, Creators retain underlying copyright and moral rights to their likeness, artistic expression, and original footage, granting the Brand an exclusive or non-exclusive commercial license.
        </p>
      ),
    },
    {
      id: 'user-content',
      num: '17',
      title: 'User Content & Portfolio Display',
      content: (
        <p>
          Users grant CreatorOS a worldwide, non-exclusive license to host, transcode, and display publicly published posts, reels, shots, and blogs across the Discover feed, search indices, and promotional materials demonstrating platform capabilities.
        </p>
      ),
    },
    {
      id: 'messaging',
      num: '18',
      title: 'Direct Messaging & Communications',
      content: (
        <p>
          CreatorOS Direct Messages provide private channels for collaboration, milestone updates, and contract negotiations. Off-platform payment solicitation, harassment, spamming, and distribution of malicious code are strictly prohibited and subject to immediate account termination.
        </p>
      ),
    },
    {
      id: 'prohibited-conduct',
      num: '19',
      title: 'Prohibited Conduct & Community Standards',
      content: (
        <p>
          Users may not: (a) circumvent platform escrow to evade fees; (b) upload infringing, defamatory, or unlawful media; (c) manipulate analytics using bots; (d) engage in predatory contracting practices flagged by the automated risk scanner.
        </p>
      ),
    },
    {
      id: 'disputes',
      num: '20',
      title: 'Dispute Arbitration & Resolution',
      content: (
        <p>
          If parties reach an impasse regarding deliverable quality, revision exhaustion, or non-responsiveness, either party may file a formal Dispute. Disputes are submitted to the Super Admin Arbitration Workbench, where evidence, audit trails, and versioned deliverables are evaluated to render a binding settlement.
        </p>
      ),
    },
    {
      id: 'cancellation',
      num: '21',
      title: 'Cancellation & Termination',
      content: (
        <p>
          Contracts cancelled prior to creator commencement receive a full escrow refund minus transaction charges. If cancelled after partial delivery, the cancellation clause stipulated in the contract (e.g. 50% compensation for verified rough cuts) determines fund release.
        </p>
      ),
    },
    {
      id: 'refunds',
      num: '22',
      title: 'Refund Policy',
      content: (
        <p>
          Platform fees and subscription charges are non-refundable once services are rendered. Contract escrow funds are refundable exclusively under contract cancellation terms or through an arbitrated dispute settlement.
        </p>
      ),
    },
    {
      id: 'suspension',
      num: '23',
      title: 'Account Suspension & Sanctions',
      content: (
        <p>
          CreatorOS reserves the right to suspend or permanently terminate accounts exhibiting repeated contract defaults, fraudulent verification documents, abusive behavior, or persistent attempts to process off-platform transactions.
        </p>
      ),
    },
    {
      id: 'privacy',
      num: '24',
      title: 'Data Privacy Reference',
      content: (
        <p>
          Our practices regarding personal data collection, processing, cookie utilization, and international data transfers are detailed in the CreatorOS{' '}
          <a href="/privacy" className="text-[var(--primary)] underline hover:text-[var(--primary-hover)] font-medium">
            Privacy Policy
          </a>
          , which is incorporated by reference into these Terms.
        </p>
      ),
    },
    {
      id: 'liability',
      num: '25',
      title: 'Limitation of Liability',
      content: (
        <p>
          In no event shall CreatorOS, its directors, employees, or affiliates be liable for indirect, incidental, punitive, or consequential damages resulting from lost creator revenues, third-party social media account suspensions, algorithm shifts, or breach of contract committed by other users.
        </p>
      ),
    },
    {
      id: 'changes',
      num: '26',
      title: 'Changes to Terms',
      content: (
        <p>
          We reserve the right to modify these Terms to reflect legislative changes, new platform capabilities, or fee adjustments. Users will receive platform notifications at least 14 calendar days prior to material amendments taking effect.
        </p>
      ),
    },
    {
      id: 'contact',
      num: '27',
      title: 'Contact Information',
      content: (
        <p>
          For commercial legal inquiries, dispute escalations, or regulatory compliance questions, contact the CreatorOS Legal Operations team at{' '}
          <strong className="text-[var(--text-primary)] font-semibold">legal@creatoros.ai</strong> or submit a formal request via the{' '}
          <a href="/support" className="text-[var(--primary)] underline hover:text-[var(--primary-hover)] font-medium">
            CreatorOS Support Portal
          </a>
          .
        </p>
      ),
    },
    {
      id: 'virtual-gifts',
      num: '28',
      title: 'Virtual Coins & Gift Ledgers',
      content: (
        <p>
          CreatorOS Coins constitute limited, revocable, non-transferable digital licenses intended solely for peer appreciation and interactive broadcast engagement. Coins are not legal tender, cryptocurrency, or investment securities. Coin purchases are processed through verified payment providers and recorded immutably in a server-side double-entry ledger. When a user sends a virtual gift, 70% of the net nominal value is credited to the recipient creator's reward balance, and 30% is retained by CreatorOS as platform infrastructure maintenance fees.
        </p>
      ),
    },
    {
      id: 'live-streaming',
      num: '29',
      title: 'Live Broadcast & AR Guidelines',
      content: (
        <p>
          Live stream hosts are strictly liable for content transmitted during real-time sessions. Broadcasters must enforce chat moderation using platform controls (mute, kick, ban). Streaming copyrighted musical works or unauthorized sporting events without licenses is strictly prohibited and results in immediate automated stream termination. AR face effects, custom 3D models, and LUT filters must comply with community safety standards and may be automatically downgraded if client hardware latency exceeds platform thresholds.
        </p>
      ),
    },
    {
      id: 'dmca',
      num: '30',
      title: 'DMCA & Copyright Notice Procedure',
      content: (
        <p>
          CreatorOS respects intellectual property rights and complies with the Digital Millennium Copyright Act (17 U.S.C. § 512). Copyright holders may submit takedown notices to our designated copyright agent at{' '}
          <strong className="text-[var(--text-primary)] font-semibold">dmca@creatoros.ai</strong> including: identification of the copyrighted work, URL location of infringing material, a statement of good faith belief, and electronic signature. Repeat infringers will have their accounts and connected escrow privileges permanently terminated.
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
              Terms &amp; Conditions
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
              Legal Counsel Review Notice
            </h4>
            <p className="text-xs text-amber-900/90 dark:text-amber-200/90 leading-relaxed">
              These Terms &amp; Conditions outline the operational governance, contract mechanisms, payment procedures, and dispute resolution rules of CreatorOS. This document is provided for operational staging and must be formally audited and reviewed by qualified jurisdiction-specific commercial legal counsel prior to full production deployment.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Table of Contents Rail (Desktop) */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-24 space-y-3">
            <div className="p-4 rounded-2xl bg-[var(--surface)] shadow-sm border border-[var(--border)] backdrop-blur-xl transition-colors duration-200">
              <div className="flex items-center gap-2 pb-3 mb-2 border-b border-[var(--border)] text-xs font-bold text-[var(--text-primary)] font-mono uppercase tracking-wider">
                <FileText className="w-4 h-4 text-[var(--primary)]" />
                <span>Document Outline</span>
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
                Terms of Service &amp; Commercial Operating Agreement
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
            <a href="/terms" className="text-[var(--primary)] font-semibold hover:underline transition-colors">
              Terms
            </a>
            <a href="/privacy" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              Privacy
            </a>
            <a href="/support" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              Support
            </a>
            <a href="mailto:legal@creatoros.ai" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
