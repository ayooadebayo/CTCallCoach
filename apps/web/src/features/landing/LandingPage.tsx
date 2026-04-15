import { Link } from 'react-router-dom';

// ─── Shared primitives ────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="text-govuk-blue text-xs font-bold uppercase tracking-widest mb-3">
      {children}
    </p>
  );
}

function SectionHeading({ children }: { children: string }) {
  return (
    <h2 className="text-govuk-black text-3xl font-bold mb-4">{children}</h2>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar() {
  return (
    <nav
      className="w-full bg-govuk-black flex flex-wrap items-center justify-between gap-2 px-4 sm:px-6"
      style={{ height: 56 }}
    >
      <span className="text-white font-bold text-base">Acme City Council</span>
      <div className="flex items-center gap-4">
        <Link
          to="/admin"
          className="text-white text-sm font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-govuk-yellow"
        >
          Admin
        </Link>
        <Link
          to="/app"
          className="bg-govuk-blue text-white text-sm font-medium px-4 py-2 rounded-[2px] hover:bg-govuk-blue-dark focus:outline-none focus:ring-2 focus:ring-govuk-yellow"
        >
          Launch demo
        </Link>
      </div>
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="w-full bg-govuk-blue py-16 px-4 text-center sm:px-6 sm:py-20">
      <h1 className="mx-auto max-w-[720px] text-3xl font-bold leading-tight text-white sm:text-5xl">
        Guided call coaching 
        <br />
        for council tax advisors
      </h1>
      <p className="mx-auto mt-5 max-w-[600px] text-base text-white opacity-90 sm:text-xl">
        Rules-led. Guidance-based. AI-assisted.<br />
        Built for the pressure of a live resident call.
      </p>
      <div className="flex items-center justify-center flex-wrap gap-4 mt-10">
        <Link
          to="/app"
          className="bg-white text-govuk-blue font-bold px-8 py-3.5 rounded-[2px] hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-govuk-yellow"
          style={{ fontSize: 16 }}
        >
          Launch demo →
        </Link>
        <Link
          to="/admin"
          className="text-white font-bold px-8 py-3.5 rounded-[2px] border-2 border-white hover:bg-white hover:text-govuk-blue focus:outline-none focus:ring-4 focus:ring-govuk-yellow transition-colors"
          style={{ fontSize: 16 }}
        >
          View system transparency
        </Link>
      </div>
      <p className="text-white mt-4 text-sm" style={{ opacity: 0.7 }}>
        No login required · Free to use · Built for demo
        <br />
        Built for Acme City Council (a fictional council)
      </p>
    </section>
  );
}

// ─── Problem ──────────────────────────────────────────────────────────────────

interface ProblemCard {
  borderColor: string;
  heading: string;
  body: string;
}

const PROBLEM_CARDS: ProblemCard[] = [
  {
    borderColor: '#f47738',
    heading: 'Inconsistent advice',
    body: 'Without a structured guide, different agents handle the same situation differently, leading to resident confusion and compliance risk.',
  },
  {
    borderColor: '#d4351c',
    heading: 'Slow call handling',
    body: 'Advisors pause to check manuals, ask colleagues, or escalate unnecessarily, adding time and cost to every interaction.',
  },
  {
    borderColor: '#1d70b8',
    heading: 'No in-call learning',
    body: 'Traditional training happens before the task. By the time the call arrives, the learning has faded. Learning on the call is challenging.',
  },
];

function Problem() {
  return (
    <section className="w-full bg-white py-18 px-6" style={{ paddingTop: 72, paddingBottom: 72 }}>
      <div className="max-w-[1100px] mx-auto">
        <SectionLabel>THE PROBLEM</SectionLabel>
        <SectionHeading>Contact centre advisors carry a lot in their heads</SectionHeading>
        <p className="text-gray-700 mb-12" style={{ fontSize: 18, maxWidth: 680 }}>
          Council tax calls involve complex rules, multiple support options, and residents in
          financial difficulty, all at once, under time pressure. Advisors shouldn't have to
          cram the policy manual and navigation steps.
        </p>
        <div className="flex gap-6 flex-wrap">
          {PROBLEM_CARDS.map((card) => (
            <div
              key={card.heading}
              className="flex-1 bg-white border border-[#e8e8e8] rounded-[2px] p-6"
              style={{ minWidth: 260, borderLeft: `4px solid ${card.borderColor}` }}
            >
              <h3 className="text-govuk-black font-semibold text-base mb-2">{card.heading}</h3>
              <p className="text-gray-700 text-sm leading-relaxed">{card.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── How it works ─────────────────────────────────────────────────────────────

interface WorkflowStep {
  n: number;
  heading: string;
  body: string;
}

const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    n: 1,
    heading: 'Start the call',
    body: 'Select the scenario type and agent. The system loads the relevant workflow rules for the chosen call type and follow the official guidance.',
  },
  {
    n: 2,
    heading: 'Answer guided questions',
    body: 'One structured question at a time. The workflow engine determines the likely path based on official guidance, there is no AI involved in routing decisions.',
  },
  {
    n: 3,
    heading: 'Receive real-time guidance',
    body: 'As the path becomes clear, relevant policy guidance and support options appear alongside the call, to aid learning in the flow of work when it matters most.',
  },
  {
    n: 4,
    heading: 'Wrap up with confidence',
    body: 'AI drafts the case note for the advisor to review and edit. Coaching feedback appears after the call. The advisor learns from every interaction they have.',
  },
];

function HowItWorks() {
  return (
    <section
      className="w-full bg-govuk-light-grey px-6"
      style={{ paddingTop: 72, paddingBottom: 72 }}
    >
      <div className="max-w-[1100px] mx-auto">
        <SectionLabel>HOW IT WORKS</SectionLabel>
        <SectionHeading>The workflow guides the call. The AI supports the advisor.</SectionHeading>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {WORKFLOW_STEPS.map((step) => (
            <div key={step.n}>
              <p className="text-govuk-blue font-bold mb-2" style={{ fontSize: 40 }}>
                {step.n}
              </p>
              <h3 className="text-govuk-black font-semibold text-lg mb-2">{step.heading}</h3>
              <p className="text-gray-700" style={{ fontSize: 15 }}>
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Capabilities ─────────────────────────────────────────────────────────────

interface CapabilityCard {
  heading: string;
  body: string;
}

const CAPABILITY_CARDS: CapabilityCard[] = [
  {
    heading: 'Deterministic workflow engine',
    body: 'Every routing decision is made by a rules engine loaded from versioned JSON config. AI never determines what question comes next or what outcome applies.',
  },
  {
    heading: 'Policy and operations separated',
    body: 'GOV.UK statutory guidance and Acme City Council operating guidance are kept in separate content bundles, clearly labelled on every guidance card to provide context.',
  },
  {
    heading: 'AI that explains and coaches',
    body: 'AI explains why each question matters, drafts the case note from call data, and delivers specific after-call coaching. It supports but never decides. The advisor is required to decide.',
  },
  {
    heading: 'Learning in the flow of work',
    body: 'Guidance appears at the moment of need, not in a training room three months earlier. Advisors build expertise through every real and simulated call. They also improve with each coaching feedback.',
  },
];

function Capabilities() {
  return (
    <section className="w-full bg-white px-6" style={{ paddingTop: 72, paddingBottom: 72 }}>
      <div className="max-w-[1100px] mx-auto">
        <SectionLabel>WHAT MAKES IT DIFFERENT</SectionLabel>
        <SectionHeading>Rules-led decisions with AI-assisted support. Always auditable.</SectionHeading>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {CAPABILITY_CARDS.map((card) => (
            <div
              key={card.heading}
              className="bg-white border border-[#e8e8e8] rounded-[2px] p-6"
              style={{ borderTop: '3px solid #1d70b8' }}
            >
              <h3 className="text-govuk-black font-semibold text-base mb-2">{card.heading}</h3>
              <p className="text-gray-700 text-sm leading-relaxed">{card.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Second CTA ───────────────────────────────────────────────────────────────

function SecondCta() {
  return (
    <section className="w-full bg-govuk-blue px-6 text-center" style={{ paddingTop: 64, paddingBottom: 64 }}>
      <h2 className="text-white font-bold text-3xl">See it in action</h2>
      <p className="text-white mx-auto mt-3 mb-10" style={{ fontSize: 18, opacity: 0.85, maxWidth: 560 }}>
        Run a simulated council tax arrears call and see the full guided workflow, AI assistance,
        and transparency features as the admin.
      </p>
      <div className="flex items-center justify-center flex-wrap gap-4">
        <Link
          to="/app"
          className="bg-white text-govuk-blue font-bold px-8 py-3.5 rounded-[2px] hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-govuk-yellow"
          style={{ fontSize: 16 }}
        >
          Launch demo →
        </Link>
        <Link
          to="/admin"
          className="text-white font-bold px-8 py-3.5 rounded-[2px] border-2 border-white hover:bg-white hover:text-govuk-blue focus:outline-none focus:ring-4 focus:ring-govuk-yellow transition-colors"
          style={{ fontSize: 16 }}
        >
          View system admin →
        </Link>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="w-full bg-govuk-black px-6" style={{ paddingTop: 40, paddingBottom: 40 }}>
      <div className="max-w-[1100px] mx-auto flex flex-wrap justify-between gap-8">
        <div>
          <p className="text-white font-bold text-base mb-2">CTCallCoach</p>
          <p className="text-govuk-mid-grey text-sm leading-relaxed" style={{ maxWidth: 400 }}>
            A Learning in the Flow of Work (LITFOW) proof of concept.
            <br />
            Built for Acme City Council, a fictional local authority intended for demonstration.
          </p>
        </div>
        <div className="flex items-start gap-4 text-sm text-govuk-mid-grey">
          <Link to="/app" className="hover:text-white focus:outline-none focus:ring-2 focus:ring-govuk-yellow">
            Launch demo
          </Link>
          <span aria-hidden="true">·</span>
          <Link to="/admin" className="hover:text-white focus:outline-none focus:ring-2 focus:ring-govuk-yellow">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Problem />
        <HowItWorks />
        <Capabilities />
        <SecondCta />
      </main>
      <Footer />
    </div>
  );
}
