import React, { useState } from 'react';
import {
  ShieldAlert,
  FileText,
  ArrowLeft,
  CheckCircle2,
  Lock,
  DollarSign,
  AlertTriangle,
  Scale,
  Building2,
  User,
  ExternalLink,
  ChevronRight,
  Download,
} from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';

interface TermsPageProps {
  onBack?: () => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onBack }) => {
  const [activeSection, setActiveSection] = useState('acceptance');

  const sections = [
    { id: 'acceptance', num: '01', title: 'Acceptance of Terms' },
    { id: 'eligibility', num: '02', title: 'Eligibility' },
    { id: 'registration', num: '03', title: 'Account Registration & Security' },
    { id: 'creator-accounts', num: '04', title: 'Creator Accounts & Profiles' },
    { id: 'brand-accounts', num: '05', title: 'Brand Accounts & Workspaces' },
    { id: 'verification', num: '06', title: 'Identity & Professional Verification' },
    { id: 'platform', num: '07', title: 'The CreatorOS Platform' },
    { id: 'campaigns', num: '08', title: 'Campaigns & Discovery' },
    { id: 'contracts', num: '09', title: 'Commercial Agreements & Contracts' },
    { id: 'payments', num: '10', title: 'Payment Processing & Escrow Holds' },
    { id: 'platform-fees', num: '11', title: 'Platform Fees (10% Model)' },
    { id: 'project-protection', num: '12', title: 'Project Protection Guarantee' },
    { id: 'deliverables', num: '13', title: 'Deliverables & File Standards' },
    { id: 'revisions', num: '14', title: 'Revisions & Acceptance Windows' },
    { id: 'usage-rights', num: '15', title: 'Usage Rights & Licensing' },
    { id: 'ip', num: '16', title: 'Intellectual Property Ownership' },
    { id: 'user-content', num: '17', title: 'User Content & Portfolio Display' },
    { id: 'messaging', num: '18', title: 'Direct Messaging & Communications' },
    { id: 'prohibited-conduct', num: '19', title: 'Prohibited Conduct & Community Standards' },
    { id: 'disputes', num: '20', title: 'Dispute Arbitration & Resolution' },
    { id: 'cancellation', num: '21', title: 'Cancellation & Termination' },
    { id: 'refunds', num: '22', title: 'Refund Policy' },
    { id: 'suspension', num: '23', title: 'Account Suspension & Sanctions' },
    { id: 'privacy', num: '24', title: 'Data Privacy Reference' },
    { id: 'liability', num: '25', title: 'Limitation of Liability' },
    { id: 'changes', num: '26', title: 'Changes to Terms' },
    { id: 'contact', num: '27', title: 'Contact Information' },
    { id: 'virtual-gifts', num: '28', title: 'Virtual Coins & Gift Ledgers' },
    { id: 'live-streaming', num: '29', title: 'Live Broadcast & AR Guidelines' },
    { id: 'dmca', num: '30', title: 'DMCA & Copyright Notice Procedure' },
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
              Terms & Conditions
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="hidden sm:flex min-h-[44px] px-3.5 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-elevated)] text-xs font-medium text-[var(--text-primary)] items-center gap-1.5 transition-colors cursor-pointer"
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
              Legal Counsel Review Notice
            </h4>
            <p className="text-xs text-amber-800/90 leading-relaxed">
              These Terms & Conditions outline the operational governance, contract mechanisms, payment procedures, and dispute resolution rules of CreatorOS. This document is provided for operational staging and must be formally audited and reviewed by qualified jurisdiction-specific commercial legal counsel prior to full production deployment.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Table of Contents Rail (Desktop) */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-24 space-y-3">
            <div className="p-4 rounded-2xl bg-[var(--surface)] shadow-sm border border-[var(--border)] backdrop-blur-xl">
              <div className="flex items-center gap-2 pb-3 mb-2 border-b border-black/[0.06] text-xs font-bold text-zinc-800 font-mono uppercase tracking-wider">
                <FileText className="w-4 h-4 text-[#007E93]" />
                <span>Document Outline</span>
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
                Terms of Service & Commercial Operating Agreement
              </h1>
              <p className="text-sm text-zinc-500">
                Last modified: October 12, 2026 • Version 2.4.0
              </p>
            </div>

            {/* Section 01 */}
            <section id="acceptance" className="space-y-3 pt-6 border-t border-black/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-zinc-300">01</span>
                <h2 className="text-lg font-bold text-zinc-900 font-display">Acceptance of Terms</h2>
              </div>
              <p className="text-xs text-zinc-700">
                By creating an account, accessing, or utilizing CreatorOS (&quot;the Platform&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), you (&quot;User&quot;, &quot;Creator&quot;, &quot;Brand&quot;, or &quot;Business&quot;) agree to be bound by these Terms of Service, all applicable laws, and all operating guidelines published on the Platform. If you do not accept these terms in their entirety, you must discontinue platform use immediately.
              </p>
            </section>

            {/* Section 02 */}
            <section id="eligibility" className="space-y-3 pt-6 border-t border-black/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-zinc-300">02</span>
                <h2 className="text-lg font-bold text-zinc-900 font-display">Eligibility</h2>
              </div>
              <p className="text-xs text-zinc-700">
                You must be at least 18 years of age or the legal age of majority in your jurisdiction to register an account or enter into legally binding commercial agreements on CreatorOS. By registering a Brand account, the individual represents and warrants that they possess explicit authority to bind the corporate legal entity to commercial financial obligations.
              </p>
            </section>

            {/* Section 03 */}
            <section id="registration" className="space-y-3 pt-6 border-t border-black/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-zinc-300">03</span>
                <h2 className="text-lg font-bold text-zinc-900 font-display">Account Registration & Security</h2>
              </div>
              <p className="text-xs text-zinc-700">
                Users must provide truthful, current, and complete registration credentials. You are responsible for safeguarding your authentication credentials, session tokens, and multi-factor authorization codes. CreatorOS is not liable for unauthorized account access resulting from compromised user credentials.
              </p>
            </section>

            {/* Section 04 */}
            <section id="creator-accounts" className="space-y-3 pt-6 border-t border-black/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-zinc-300">04</span>
                <h2 className="text-lg font-bold text-zinc-900 font-display">Creator Accounts & Profiles</h2>
              </div>
              <p className="text-xs text-zinc-700">
                Creators maintain professional public portfolios showcasing verified deliverables, rate cards, and engagement statistics. Creators warrant that all uploaded portfolio media, past brand associations, and audience demographics represent authentic work performed without automated engagement manipulation or deceptive metrics.
              </p>
            </section>

            {/* Section 05 */}
            <section id="brand-accounts" className="space-y-3 pt-6 border-t border-black/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-zinc-300">05</span>
                <h2 className="text-lg font-bold text-zinc-900 font-display">Brand Accounts & Workspaces</h2>
              </div>
              <p className="text-xs text-zinc-700">
                Brand Workspaces enable corporate marketing teams to organize campaigns, invite creators, issue contracts, and process protected project payments. Brands are responsible for ensuring that all campaign briefs and creative guidelines comply with commercial advertising standards and truthful product claims.
              </p>
            </section>

            {/* Section 06 */}
            <section id="verification" className="space-y-3 pt-6 border-t border-black/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-zinc-300">06</span>
                <h2 className="text-lg font-bold text-zinc-900 font-display">Identity & Professional Verification</h2>
              </div>
              <p className="text-xs text-zinc-700">
                Platform verification badges are granted following comprehensive evaluations encompassing government ID checks, corporate domain registration, track record of successfully executed agreements, and authentic delivery metrics. Verification is never sold for a recurring fee and may be revoked if deceptive conduct is detected.
              </p>
            </section>

            {/* Section 07 */}
            <section id="platform" className="space-y-3 pt-6 border-t border-black/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-zinc-300">07</span>
                <h2 className="text-lg font-bold text-zinc-900 font-display">The CreatorOS Platform</h2>
              </div>
              <p className="text-xs text-zinc-700">
                CreatorOS operates as an infrastructure provider connecting independent creative contractors with commercial enterprise brands. CreatorOS does not act as an employer, talent agency, or direct broker of physical commodities, except where explicit platform escrow and arbitration guarantees apply.
              </p>
            </section>

            {/* Section 08 */}
            <section id="campaigns" className="space-y-3 pt-6 border-t border-black/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-zinc-300">08</span>
                <h2 className="text-lg font-bold text-zinc-900 font-display">Campaigns & Discovery</h2>
              </div>
              <p className="text-xs text-zinc-700">
                Brands publish campaign briefs defining deliverables, compensation brackets, target demographic criteria, and submission deadlines. Creators may submit tailored proposals or respond to brand invitations. All commercial transactions resulting from discovery connections must be formalized through CreatorOS Contracts.
              </p>
            </section>

            {/* Section 09 */}
            <section id="contracts" className="space-y-3 pt-6 border-t border-black/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-zinc-300">09</span>
                <h2 className="text-lg font-bold text-zinc-900 font-display">Commercial Agreements & Contracts</h2>
              </div>
              <p className="text-xs text-zinc-700">
                Contracts executed on CreatorOS represent binding bilateral commercial agreements. Once both parties digitally execute an agreement and the brand funds the payment gateway hold, the contract transitions to Active status and binds the parties to the explicit milestones and schedules outlined.
              </p>
            </section>

            {/* Section 10 */}
            <section id="payments" className="space-y-3 pt-6 border-t border-black/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-zinc-300">10</span>
                <h2 className="text-lg font-bold text-zinc-900 font-display">Payment Processing & Escrow Holds</h2>
              </div>
              <p className="text-xs text-zinc-700">
                All contract funds are captured through integrated compliant payment gateways (Stripe Connect and PayPal Commerce Platform). Funds are maintained in protected payment status until the brand approves submitted deliverables or the designated auto-approval review period elapses.
              </p>
            </section>

            {/* Section 11 */}
            <section id="platform-fees" className="space-y-3 pt-6 border-t border-black/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-zinc-300">11</span>
                <h2 className="text-lg font-bold text-zinc-900 font-display">Platform Fees (10% Model)</h2>
              </div>
              <p className="text-xs text-zinc-700">
                CreatorOS charges an administrative platform fee (defaulting to 10% of gross contract value, subject to administrative configuration between minimum and maximum caps). Platform fees finance secure payment infrastructure, dispute arbitration guarantees, automated risk scanning, and server maintenance.
              </p>
            </section>

            {/* Section 12 */}
            <section id="project-protection" className="space-y-3 pt-6 border-t border-black/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-zinc-300">12</span>
                <h2 className="text-lg font-bold text-zinc-900 font-display">Project Protection Guarantee</h2>
              </div>
              <p className="text-xs text-zinc-700">
                CreatorOS Project Protection reserves 20% in hold allocation to protect against unfulfilled deliverables, late delivery, or non-responsive brand review windows. In the event of confirmed contract abandonment by either party, Project Protection reserves facilitate equitable restitution.
              </p>
            </section>

            {/* Section 13 */}
            <section id="deliverables" className="space-y-3 pt-6 border-t border-black/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-zinc-300">13</span>
                <h2 className="text-lg font-bold text-zinc-900 font-display">Deliverables & File Standards</h2>
              </div>
              <p className="text-xs text-zinc-700">
                Deliverables must adhere to explicit technical constraints stipulated in the contract, including aspect ratio (e.g. 9:16 vertical video, 16:9 landscape, 4:5 portrait), resolution (1080p, 4K), duration, and master file formats. Submissions failing to meet technical criteria may be flagged for technical revision.
              </p>
            </section>

            {/* Section 14 */}
            <section id="revisions" className="space-y-3 pt-6 border-t border-black/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-zinc-300">14</span>
                <h2 className="text-lg font-bold text-zinc-900 font-display">Revisions & Acceptance Windows</h2>
              </div>
              <p className="text-xs text-zinc-700">
                Contracts include a specified number of revision rounds (defaulting to 2 rounds). Brands have a 3-business-day review window upon asset submission to accept or provide consolidated, actionable revision notes. If a brand fails to respond within the review window, assets are deemed automatically approved.
              </p>
            </section>

            {/* Section 15 */}
            <section id="usage-rights" className="space-y-3 pt-6 border-t border-black/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-zinc-300">15</span>
                <h2 className="text-lg font-bold text-zinc-900 font-display">Usage Rights & Licensing</h2>
              </div>
              <p className="text-xs text-zinc-700">
                Usage rights granted to Brands are governed strictly by the contract parameters: designated channels (Organic Social, Paid Ads, Website, Print), duration (e.g. 30 days, 90 days, 1 year), territory, and exclusivity terms. Brands may not syndicate content beyond the agreed scope without an approved contract amendment.
              </p>
            </section>

            {/* Section 16 */}
            <section id="ip" className="space-y-3 pt-6 border-t border-black/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-zinc-300">16</span>
                <h2 className="text-lg font-bold text-zinc-900 font-display">Intellectual Property Ownership</h2>
              </div>
              <p className="text-xs text-zinc-700">
                Unless a complete copyright assignment buyout is explicitly selected and compensated in the contract, Creators retain underlying copyright and moral rights to their likeness, artistic expression, and original footage, granting the Brand an exclusive or non-exclusive commercial license.
              </p>
            </section>

            {/* Section 17 */}
            <section id="user-content" className="space-y-3 pt-6 border-t border-black/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-zinc-300">17</span>
                <h2 className="text-lg font-bold text-zinc-900 font-display">User Content & Portfolio Display</h2>
              </div>
              <p className="text-xs text-zinc-700">
                Users grant CreatorOS a worldwide, non-exclusive license to host, transcode, and display publicly published posts, reels, shots, and blogs across the Discover feed, search indices, and promotional materials demonstrating platform capabilities.
              </p>
            </section>

            {/* Section 18 */}
            <section id="messaging" className="space-y-3 pt-6 border-t border-black/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-zinc-300">18</span>
                <h2 className="text-lg font-bold text-zinc-900 font-display">Direct Messaging & Communications</h2>
              </div>
              <p className="text-xs text-zinc-700">
                CreatorOS Direct Messages provide private channels for collaboration, milestone updates, and contract negotiations. Off-platform payment solicitation, harassment, spamming, and distribution of malicious code are strictly prohibited and subject to immediate account termination.
              </p>
            </section>

            {/* Section 19 */}
            <section id="prohibited-conduct" className="space-y-3 pt-6 border-t border-black/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-zinc-300">19</span>
                <h2 className="text-lg font-bold text-zinc-900 font-display">Prohibited Conduct & Community Standards</h2>
              </div>
              <p className="text-xs text-zinc-700">
                Users may not: (a) circumvent platform escrow to evade fees; (b) upload infringing, defamatory, or unlawful media; (c) manipulate analytics using bots; (d) engage in predatory contracting practices flagged by the automated risk scanner.
              </p>
            </section>

            {/* Section 20 */}
            <section id="disputes" className="space-y-3 pt-6 border-t border-black/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-zinc-300">20</span>
                <h2 className="text-lg font-bold text-zinc-900 font-display">Dispute Arbitration & Resolution</h2>
              </div>
              <p className="text-xs text-zinc-700">
                If parties reach an impasse regarding deliverable quality, revision exhaustion, or non-responsiveness, either party may file a formal Dispute. Disputes are submitted to the Super Admin Arbitration Workbench, where evidence, audit trails, and versioned deliverables are evaluated to render a binding settlement.
              </p>
            </section>

            {/* Section 21 */}
            <section id="cancellation" className="space-y-3 pt-6 border-t border-black/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-zinc-300">21</span>
                <h2 className="text-lg font-bold text-zinc-900 font-display">Cancellation & Termination</h2>
              </div>
              <p className="text-xs text-zinc-700">
                Contracts cancelled prior to creator commencement receive a full escrow refund minus transaction charges. If cancelled after partial delivery, the cancellation clause stipulated in the contract (e.g. 50% compensation for verified rough cuts) determines fund release.
              </p>
            </section>

            {/* Section 22 */}
            <section id="refunds" className="space-y-3 pt-6 border-t border-black/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-zinc-300">22</span>
                <h2 className="text-lg font-bold text-zinc-900 font-display">Refund Policy</h2>
              </div>
              <p className="text-xs text-zinc-700">
                Platform fees and subscription charges are non-refundable once services are rendered. Contract escrow funds are refundable exclusively under contract cancellation terms or through an arbitrated dispute settlement.
              </p>
            </section>

            {/* Section 23 */}
            <section id="suspension" className="space-y-3 pt-6 border-t border-black/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-zinc-300">23</span>
                <h2 className="text-lg font-bold text-zinc-900 font-display">Account Suspension & Sanctions</h2>
              </div>
              <p className="text-xs text-zinc-700">
                CreatorOS reserves the right to suspend or permanently terminate accounts exhibiting repeated contract defaults, fraudulent verification documents, abusive behavior, or persistent attempts to process off-platform transactions.
              </p>
            </section>

            {/* Section 24 */}
            <section id="privacy" className="space-y-3 pt-6 border-t border-black/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-zinc-300">24</span>
                <h2 className="text-lg font-bold text-zinc-900 font-display">Data Privacy Reference</h2>
              </div>
              <p className="text-xs text-zinc-700">
                Our practices regarding personal data collection, processing, cookie utilization, and international data transfers are detailed in the CreatorOS <a href="/privacy" className="text-[#007E93] underline hover:text-[#007E93]">Privacy Policy</a>, which is incorporated by reference into these Terms.
              </p>
            </section>

            {/* Section 25 */}
            <section id="liability" className="space-y-3 pt-6 border-t border-black/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-zinc-300">25</span>
                <h2 className="text-lg font-bold text-zinc-900 font-display">Limitation of Liability</h2>
              </div>
              <p className="text-xs text-zinc-700">
                In no event shall CreatorOS, its directors, employees, or affiliates be liable for indirect, incidental, punitive, or consequential damages resulting from lost creator revenues, third-party social media account suspensions, algorithm shifts, or breach of contract committed by other users.
              </p>
            </section>

            {/* Section 26 */}
            <section id="changes" className="space-y-3 pt-6 border-t border-black/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-zinc-300">26</span>
                <h2 className="text-lg font-bold text-zinc-900 font-display">Changes to Terms</h2>
              </div>
              <p className="text-xs text-zinc-700">
                We reserve the right to modify these Terms to reflect legislative changes, new platform capabilities, or fee adjustments. Users will receive platform notifications at least 14 calendar days prior to material amendments taking effect.
              </p>
            </section>

            {/* Section 27 */}
            <section id="contact" className="space-y-3 pt-6 border-t border-black/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-zinc-300">27</span>
                <h2 className="text-lg font-bold text-zinc-900 font-display">Contact Information</h2>
              </div>
              <p className="text-xs text-zinc-700">
                For commercial legal inquiries, dispute escalations, or regulatory compliance questions, contact the CreatorOS Legal Operations team at <strong className="text-white">legal@creatoros.ai</strong> or submit a formal request via the <a href="/support" className="text-[#007E93] underline hover:text-[#007E93]">CreatorOS Support Portal</a>.
              </p>
            </section>

            {/* Section 28 */}
            <section id="virtual-gifts" className="space-y-3 pt-6 border-t border-black/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-zinc-300">28</span>
                <h2 className="text-lg font-bold text-zinc-900 font-display">Virtual Coins &amp; Gift Ledgers</h2>
              </div>
              <p className="text-xs text-zinc-700">
                CreatorOS Coins constitute limited, revocable, non-transferable digital licenses intended solely for peer appreciation and interactive broadcast engagement. Coins are not legal tender, cryptocurrency, or investment securities. Coin purchases are processed through verified payment providers and recorded immutably in a server-side double-entry ledger. When a user sends a virtual gift, 70% of the net nominal value is credited to the recipient creator's reward balance, and 30% is retained by CreatorOS as platform infrastructure maintenance fees.
              </p>
            </section>

            {/* Section 29 */}
            <section id="live-streaming" className="space-y-3 pt-6 border-t border-black/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-zinc-300">29</span>
                <h2 className="text-lg font-bold text-zinc-900 font-display">Live Broadcast &amp; AR Guidelines</h2>
              </div>
              <p className="text-xs text-zinc-700">
                Live stream hosts are strictly liable for content transmitted during real-time sessions. Broadcasters must enforce chat moderation using platform controls (mute, kick, ban). Streaming copyrighted musical works or unauthorized sporting events without licenses is strictly prohibited and results in immediate automated stream termination. AR face effects, custom 3D models, and LUT filters must comply with community safety standards and may be automatically downgraded if client hardware latency exceeds platform thresholds.
              </p>
            </section>

            {/* Section 30 */}
            <section id="dmca" className="space-y-3 pt-6 border-t border-black/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-zinc-300">30</span>
                <h2 className="text-lg font-bold text-zinc-900 font-display">DMCA &amp; Copyright Notice Procedure</h2>
              </div>
              <p className="text-xs text-zinc-700">
                CreatorOS respects intellectual property rights and complies with the Digital Millennium Copyright Act (17 U.S.C. § 512). Copyright holders may submit takedown notices to our designated copyright agent at <strong className="text-white">dmca@creatoros.ai</strong> including: identification of the copyrighted work, URL location of infringing material, a statement of good faith belief, and electronic signature. Repeat infringers will have their accounts and connected escrow privileges permanently terminated.
              </p>
            </section>
          </div>
        </div>
      </main>

      {/* Minimal Legal Footer */}
      <footer className="border-t border-[var(--border)] py-8 bg-[var(--surface)] text-xs text-[var(--text-muted)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BrandLogo size="xs" />
            <span className="text-zinc-600">•</span>
            <span>© 2026 CreatorOS Inc. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="/terms" className="text-zinc-700 hover:text-white transition-colors">Terms</a>
            <a href="/privacy" className="hover:text-zinc-700 transition-colors">Privacy</a>
            <a href="/support" className="hover:text-zinc-700 transition-colors">Support</a>
            <a href="mailto:legal@creatoros.ai" className="hover:text-zinc-700 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
