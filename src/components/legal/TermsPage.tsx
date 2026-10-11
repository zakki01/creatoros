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
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#070709] text-zinc-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#070709]/90 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack ? onBack : () => (window.location.href = '/')}
              className="min-h-[44px] min-w-[44px] rounded-xl hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Back to home"
              title="Back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <BrandLogo size="sm" />
            <span className="text-zinc-600 hidden sm:inline">•</span>
            <span className="text-xs font-semibold text-zinc-300 hidden sm:inline">
              Terms & Conditions
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="hidden sm:flex min-h-[44px] px-3.5 py-1.5 rounded-xl border border-white/[0.08] bg-zinc-900 hover:bg-zinc-800 text-xs font-medium text-zinc-300 items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
              Oct 2026
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 lg:py-14">
        {/* Counsel Disclaimer Banner */}
        <div className="mb-10 p-4 sm:p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-amber-200 flex items-start gap-3.5">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider font-mono">
              Legal Counsel Review Notice
            </h4>
            <p className="text-xs text-amber-200/90 leading-relaxed">
              These Terms & Conditions outline the operational governance, contract mechanisms, payment procedures, and dispute resolution rules of CreatorOS. This document is provided for operational staging and must be formally audited and reviewed by qualified jurisdiction-specific commercial legal counsel prior to full production deployment.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Table of Contents Rail (Desktop) */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-24 space-y-3">
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/[0.08] backdrop-blur-xl">
              <div className="flex items-center gap-2 pb-3 mb-2 border-b border-white/[0.06] text-xs font-bold text-zinc-200 font-mono uppercase tracking-wider">
                <FileText className="w-4 h-4 text-indigo-400" />
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
                        ? 'bg-indigo-600/20 text-indigo-300 font-semibold border border-indigo-500/30'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
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
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-display mb-3">
                Terms of Service & Commercial Operating Agreement
              </h1>
              <p className="text-sm text-zinc-400">
                Last modified: October 12, 2026 • Version 2.4.0
              </p>
            </div>

            {/* Section 01 */}
            <section id="acceptance" className="space-y-3 pt-6 border-t border-white/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-indigo-400 border border-zinc-700">01</span>
                <h2 className="text-lg font-bold text-white font-display">Acceptance of Terms</h2>
              </div>
              <p className="text-xs text-zinc-300">
                By creating an account, accessing, or utilizing CreatorOS (&quot;the Platform&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), you (&quot;User&quot;, &quot;Creator&quot;, &quot;Brand&quot;, or &quot;Business&quot;) agree to be bound by these Terms of Service, all applicable laws, and all operating guidelines published on the Platform. If you do not accept these terms in their entirety, you must discontinue platform use immediately.
              </p>
            </section>

            {/* Section 02 */}
            <section id="eligibility" className="space-y-3 pt-6 border-t border-white/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-indigo-400 border border-zinc-700">02</span>
                <h2 className="text-lg font-bold text-white font-display">Eligibility</h2>
              </div>
              <p className="text-xs text-zinc-300">
                You must be at least 18 years of age or the legal age of majority in your jurisdiction to register an account or enter into legally binding commercial agreements on CreatorOS. By registering a Brand account, the individual represents and warrants that they possess explicit authority to bind the corporate legal entity to commercial financial obligations.
              </p>
            </section>

            {/* Section 03 */}
            <section id="registration" className="space-y-3 pt-6 border-t border-white/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-indigo-400 border border-zinc-700">03</span>
                <h2 className="text-lg font-bold text-white font-display">Account Registration & Security</h2>
              </div>
              <p className="text-xs text-zinc-300">
                Users must provide truthful, current, and complete registration credentials. You are responsible for safeguarding your authentication credentials, session tokens, and multi-factor authorization codes. CreatorOS is not liable for unauthorized account access resulting from compromised user credentials.
              </p>
            </section>

            {/* Section 04 */}
            <section id="creator-accounts" className="space-y-3 pt-6 border-t border-white/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-indigo-400 border border-zinc-700">04</span>
                <h2 className="text-lg font-bold text-white font-display">Creator Accounts & Profiles</h2>
              </div>
              <p className="text-xs text-zinc-300">
                Creators maintain professional public portfolios showcasing verified deliverables, rate cards, and engagement statistics. Creators warrant that all uploaded portfolio media, past brand associations, and audience demographics represent authentic work performed without automated engagement manipulation or deceptive metrics.
              </p>
            </section>

            {/* Section 05 */}
            <section id="brand-accounts" className="space-y-3 pt-6 border-t border-white/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-indigo-400 border border-zinc-700">05</span>
                <h2 className="text-lg font-bold text-white font-display">Brand Accounts & Workspaces</h2>
              </div>
              <p className="text-xs text-zinc-300">
                Brand Workspaces enable corporate marketing teams to organize campaigns, invite creators, issue contracts, and process protected project payments. Brands are responsible for ensuring that all campaign briefs and creative guidelines comply with commercial advertising standards and truthful product claims.
              </p>
            </section>

            {/* Section 06 */}
            <section id="verification" className="space-y-3 pt-6 border-t border-white/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-indigo-400 border border-zinc-700">06</span>
                <h2 className="text-lg font-bold text-white font-display">Identity & Professional Verification</h2>
              </div>
              <p className="text-xs text-zinc-300">
                Platform verification badges are granted following comprehensive evaluations encompassing government ID checks, corporate domain registration, track record of successfully executed agreements, and authentic delivery metrics. Verification is never sold for a recurring fee and may be revoked if deceptive conduct is detected.
              </p>
            </section>

            {/* Section 07 */}
            <section id="platform" className="space-y-3 pt-6 border-t border-white/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-indigo-400 border border-zinc-700">07</span>
                <h2 className="text-lg font-bold text-white font-display">The CreatorOS Platform</h2>
              </div>
              <p className="text-xs text-zinc-300">
                CreatorOS operates as an infrastructure provider connecting independent creative contractors with commercial enterprise brands. CreatorOS does not act as an employer, talent agency, or direct broker of physical commodities, except where explicit platform escrow and arbitration guarantees apply.
              </p>
            </section>

            {/* Section 08 */}
            <section id="campaigns" className="space-y-3 pt-6 border-t border-white/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-indigo-400 border border-zinc-700">08</span>
                <h2 className="text-lg font-bold text-white font-display">Campaigns & Discovery</h2>
              </div>
              <p className="text-xs text-zinc-300">
                Brands publish campaign briefs defining deliverables, compensation brackets, target demographic criteria, and submission deadlines. Creators may submit tailored proposals or respond to brand invitations. All commercial transactions resulting from discovery connections must be formalized through CreatorOS Contracts.
              </p>
            </section>

            {/* Section 09 */}
            <section id="contracts" className="space-y-3 pt-6 border-t border-white/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-indigo-400 border border-zinc-700">09</span>
                <h2 className="text-lg font-bold text-white font-display">Commercial Agreements & Contracts</h2>
              </div>
              <p className="text-xs text-zinc-300">
                Contracts executed on CreatorOS represent binding bilateral commercial agreements. Once both parties digitally execute an agreement and the brand funds the payment gateway hold, the contract transitions to Active status and binds the parties to the explicit milestones and schedules outlined.
              </p>
            </section>

            {/* Section 10 */}
            <section id="payments" className="space-y-3 pt-6 border-t border-white/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-indigo-400 border border-zinc-700">10</span>
                <h2 className="text-lg font-bold text-white font-display">Payment Processing & Escrow Holds</h2>
              </div>
              <p className="text-xs text-zinc-300">
                All contract funds are captured through integrated compliant payment gateways (Stripe Connect and PayPal Commerce Platform). Funds are maintained in protected payment status until the brand approves submitted deliverables or the designated auto-approval review period elapses.
              </p>
            </section>

            {/* Section 11 */}
            <section id="platform-fees" className="space-y-3 pt-6 border-t border-white/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-indigo-400 border border-zinc-700">11</span>
                <h2 className="text-lg font-bold text-white font-display">Platform Fees (10% Model)</h2>
              </div>
              <p className="text-xs text-zinc-300">
                CreatorOS charges an administrative platform fee (defaulting to 10% of gross contract value, subject to administrative configuration between minimum and maximum caps). Platform fees finance secure payment infrastructure, dispute arbitration guarantees, automated risk scanning, and server maintenance.
              </p>
            </section>

            {/* Section 12 */}
            <section id="project-protection" className="space-y-3 pt-6 border-t border-white/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-indigo-400 border border-zinc-700">12</span>
                <h2 className="text-lg font-bold text-white font-display">Project Protection Guarantee</h2>
              </div>
              <p className="text-xs text-zinc-300">
                CreatorOS Project Protection reserves 20% in hold allocation to protect against unfulfilled deliverables, late delivery, or non-responsive brand review windows. In the event of confirmed contract abandonment by either party, Project Protection reserves facilitate equitable restitution.
              </p>
            </section>

            {/* Section 13 */}
            <section id="deliverables" className="space-y-3 pt-6 border-t border-white/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-indigo-400 border border-zinc-700">13</span>
                <h2 className="text-lg font-bold text-white font-display">Deliverables & File Standards</h2>
              </div>
              <p className="text-xs text-zinc-300">
                Deliverables must adhere to explicit technical constraints stipulated in the contract, including aspect ratio (e.g. 9:16 vertical video, 16:9 landscape, 4:5 portrait), resolution (1080p, 4K), duration, and master file formats. Submissions failing to meet technical criteria may be flagged for technical revision.
              </p>
            </section>

            {/* Section 14 */}
            <section id="revisions" className="space-y-3 pt-6 border-t border-white/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-indigo-400 border border-zinc-700">14</span>
                <h2 className="text-lg font-bold text-white font-display">Revisions & Acceptance Windows</h2>
              </div>
              <p className="text-xs text-zinc-300">
                Contracts include a specified number of revision rounds (defaulting to 2 rounds). Brands have a 3-business-day review window upon asset submission to accept or provide consolidated, actionable revision notes. If a brand fails to respond within the review window, assets are deemed automatically approved.
              </p>
            </section>

            {/* Section 15 */}
            <section id="usage-rights" className="space-y-3 pt-6 border-t border-white/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-indigo-400 border border-zinc-700">15</span>
                <h2 className="text-lg font-bold text-white font-display">Usage Rights & Licensing</h2>
              </div>
              <p className="text-xs text-zinc-300">
                Usage rights granted to Brands are governed strictly by the contract parameters: designated channels (Organic Social, Paid Ads, Website, Print), duration (e.g. 30 days, 90 days, 1 year), territory, and exclusivity terms. Brands may not syndicate content beyond the agreed scope without an approved contract amendment.
              </p>
            </section>

            {/* Section 16 */}
            <section id="ip" className="space-y-3 pt-6 border-t border-white/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-indigo-400 border border-zinc-700">16</span>
                <h2 className="text-lg font-bold text-white font-display">Intellectual Property Ownership</h2>
              </div>
              <p className="text-xs text-zinc-300">
                Unless a complete copyright assignment buyout is explicitly selected and compensated in the contract, Creators retain underlying copyright and moral rights to their likeness, artistic expression, and original footage, granting the Brand an exclusive or non-exclusive commercial license.
              </p>
            </section>

            {/* Section 17 */}
            <section id="user-content" className="space-y-3 pt-6 border-t border-white/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-indigo-400 border border-zinc-700">17</span>
                <h2 className="text-lg font-bold text-white font-display">User Content & Portfolio Display</h2>
              </div>
              <p className="text-xs text-zinc-300">
                Users grant CreatorOS a worldwide, non-exclusive license to host, transcode, and display publicly published posts, reels, shots, and blogs across the Discover feed, search indices, and promotional materials demonstrating platform capabilities.
              </p>
            </section>

            {/* Section 18 */}
            <section id="messaging" className="space-y-3 pt-6 border-t border-white/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-indigo-400 border border-zinc-700">18</span>
                <h2 className="text-lg font-bold text-white font-display">Direct Messaging & Communications</h2>
              </div>
              <p className="text-xs text-zinc-300">
                CreatorOS Direct Messages provide private channels for collaboration, milestone updates, and contract negotiations. Off-platform payment solicitation, harassment, spamming, and distribution of malicious code are strictly prohibited and subject to immediate account termination.
              </p>
            </section>

            {/* Section 19 */}
            <section id="prohibited-conduct" className="space-y-3 pt-6 border-t border-white/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-indigo-400 border border-zinc-700">19</span>
                <h2 className="text-lg font-bold text-white font-display">Prohibited Conduct & Community Standards</h2>
              </div>
              <p className="text-xs text-zinc-300">
                Users may not: (a) circumvent platform escrow to evade fees; (b) upload infringing, defamatory, or unlawful media; (c) manipulate analytics using bots; (d) engage in predatory contracting practices flagged by the automated risk scanner.
              </p>
            </section>

            {/* Section 20 */}
            <section id="disputes" className="space-y-3 pt-6 border-t border-white/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-indigo-400 border border-zinc-700">20</span>
                <h2 className="text-lg font-bold text-white font-display">Dispute Arbitration & Resolution</h2>
              </div>
              <p className="text-xs text-zinc-300">
                If parties reach an impasse regarding deliverable quality, revision exhaustion, or non-responsiveness, either party may file a formal Dispute. Disputes are submitted to the Super Admin Arbitration Workbench, where evidence, audit trails, and versioned deliverables are evaluated to render a binding settlement.
              </p>
            </section>

            {/* Section 21 */}
            <section id="cancellation" className="space-y-3 pt-6 border-t border-white/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-indigo-400 border border-zinc-700">21</span>
                <h2 className="text-lg font-bold text-white font-display">Cancellation & Termination</h2>
              </div>
              <p className="text-xs text-zinc-300">
                Contracts cancelled prior to creator commencement receive a full escrow refund minus transaction charges. If cancelled after partial delivery, the cancellation clause stipulated in the contract (e.g. 50% compensation for verified rough cuts) determines fund release.
              </p>
            </section>

            {/* Section 22 */}
            <section id="refunds" className="space-y-3 pt-6 border-t border-white/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-indigo-400 border border-zinc-700">22</span>
                <h2 className="text-lg font-bold text-white font-display">Refund Policy</h2>
              </div>
              <p className="text-xs text-zinc-300">
                Platform fees and subscription charges are non-refundable once services are rendered. Contract escrow funds are refundable exclusively under contract cancellation terms or through an arbitrated dispute settlement.
              </p>
            </section>

            {/* Section 23 */}
            <section id="suspension" className="space-y-3 pt-6 border-t border-white/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-indigo-400 border border-zinc-700">23</span>
                <h2 className="text-lg font-bold text-white font-display">Account Suspension & Sanctions</h2>
              </div>
              <p className="text-xs text-zinc-300">
                CreatorOS reserves the right to suspend or permanently terminate accounts exhibiting repeated contract defaults, fraudulent verification documents, abusive behavior, or persistent attempts to process off-platform transactions.
              </p>
            </section>

            {/* Section 24 */}
            <section id="privacy" className="space-y-3 pt-6 border-t border-white/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-indigo-400 border border-zinc-700">24</span>
                <h2 className="text-lg font-bold text-white font-display">Data Privacy Reference</h2>
              </div>
              <p className="text-xs text-zinc-300">
                Our practices regarding personal data collection, processing, cookie utilization, and international data transfers are detailed in the CreatorOS <a href="/privacy" className="text-indigo-400 underline hover:text-indigo-300">Privacy Policy</a>, which is incorporated by reference into these Terms.
              </p>
            </section>

            {/* Section 25 */}
            <section id="liability" className="space-y-3 pt-6 border-t border-white/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-indigo-400 border border-zinc-700">25</span>
                <h2 className="text-lg font-bold text-white font-display">Limitation of Liability</h2>
              </div>
              <p className="text-xs text-zinc-300">
                In no event shall CreatorOS, its directors, employees, or affiliates be liable for indirect, incidental, punitive, or consequential damages resulting from lost creator revenues, third-party social media account suspensions, algorithm shifts, or breach of contract committed by other users.
              </p>
            </section>

            {/* Section 26 */}
            <section id="changes" className="space-y-3 pt-6 border-t border-white/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-indigo-400 border border-zinc-700">26</span>
                <h2 className="text-lg font-bold text-white font-display">Changes to Terms</h2>
              </div>
              <p className="text-xs text-zinc-300">
                We reserve the right to modify these Terms to reflect legislative changes, new platform capabilities, or fee adjustments. Users will receive platform notifications at least 14 calendar days prior to material amendments taking effect.
              </p>
            </section>

            {/* Section 27 */}
            <section id="contact" className="space-y-3 pt-6 border-t border-white/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-indigo-400 border border-zinc-700">27</span>
                <h2 className="text-lg font-bold text-white font-display">Contact Information</h2>
              </div>
              <p className="text-xs text-zinc-300">
                For commercial legal inquiries, dispute escalations, or regulatory compliance questions, contact the CreatorOS Legal Operations team at <strong className="text-white">legal@creatoros.ai</strong> or submit a formal request via the <a href="/support" className="text-indigo-400 underline hover:text-indigo-300">CreatorOS Support Portal</a>.
              </p>
            </section>
          </div>
        </div>
      </main>

      {/* Minimal Legal Footer */}
      <footer className="border-t border-white/[0.08] py-8 bg-zinc-950 text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BrandLogo size="xs" />
            <span className="text-zinc-600">•</span>
            <span>© 2026 CreatorOS Inc. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="/terms" className="text-zinc-300 hover:text-white transition-colors">Terms</a>
            <a href="/privacy" className="hover:text-zinc-300 transition-colors">Privacy</a>
            <a href="/support" className="hover:text-zinc-300 transition-colors">Support</a>
            <a href="mailto:legal@creatoros.ai" className="hover:text-zinc-300 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
