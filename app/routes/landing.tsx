import { Link, redirect } from "react-router";
import type { Route } from "./+types/landing";
import {
  Sparkles,
  ArrowRight,
  FileText,
  Zap,
  Shield,
  TrendingUp,
  CheckCircle2,
  Star,
  MailOpen,
} from "lucide-react";
import { getSession } from "~/sessions";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");
  if (userId) {
    throw redirect("/dashboard");
  }
  return null;
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ResumeAI – AI-Powered Resume Analyzer" },
    {
      name: "description",
      content:
        "Transform your resume with actionable, AI-driven intelligence. Instantly score, optimize, and generate cover letters.",
    },
  ];
}

const FEATURES = [
  {
    icon: Zap,
    title: "Instant AI Analysis",
    description:
      "Upload your PDF and get a comprehensive score across ATS compatibility, content impact, and structure in seconds.",
    color: "bg-neo-primary",
  },
  {
    icon: TrendingUp,
    title: "Metric-Based Scoring",
    description:
      "No fluff. We score your resume on 4 quantifiable pillars so you know exactly what to fix.",
    color: "bg-neo-secondary",
  },
  {
    icon: MailOpen,
    title: "Smart Cover Letters",
    description:
      "Generate tailored cover letters from your resume and job description. Choose your tone, edit in-app.",
    color: "bg-neo-accent",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description:
      "Your data is yours. HTTP-only sessions, bcrypt hashing, and zero tracking by default.",
    color: "bg-white",
  },
];

const STATS = [
  { value: "4", label: "Analysis Pillars" },
  { value: "AI", label: "Powered by Gemini" },
  { value: "100%", label: "Free to Start" },
  { value: "<30s", label: "Average Scan Time" },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Upload Your Resume",
    desc: "Drop your PDF into the upload zone. Your file is stored securely in the cloud.",
  },
  {
    step: "02",
    title: "AI Does the Work",
    desc: "Google Gemini analyzes your resume against ATS rules, content quality, and structure.",
  },
  {
    step: "03",
    title: "Get Actionable Feedback",
    desc: "Receive a scored report with specific tips, extracted skills, and salary estimates.",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-neo-bg text-black font-sans selection:bg-neo-primary selection:text-white">
      {/* ── NAVBAR ── */}
      <header className="sticky top-0 z-50 bg-neo-bg border-b-4 border-black flex items-center justify-between px-4 md:px-12 py-3 md:py-4">
        {/* Logo */}
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-9 h-9 md:w-10 md:h-10 bg-neo-primary border-2 border-black shadow-neo flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </div>
          <span className="text-lg md:text-xl font-black uppercase tracking-tight">
            ResumeAI
          </span>
        </div>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-6 font-bold text-sm uppercase">
          <a
            href="#features"
            className="hover:text-neo-primary transition-colors"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="hover:text-neo-primary transition-colors"
          >
            How It Works
          </a>
        </nav>

        {/* CTA buttons */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Log In — text-only on mobile, full button on md+ */}
          <Link
            to="/login"
            className="hidden sm:inline-flex px-4 md:px-5 py-2 border-4 border-black bg-white font-black uppercase text-sm shadow-neo hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
          >
            Log In
          </Link>
          {/* Mobile-only plain text link */}
          <Link
            to="/login"
            className="sm:hidden font-black uppercase text-sm hover:text-neo-primary transition-colors"
          >
            Log In
          </Link>
          <Link
            to="/signup"
            className="px-3 sm:px-4 md:px-5 py-2 border-4 border-black bg-neo-primary text-white font-black uppercase text-xs sm:text-sm shadow-neo hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all whitespace-nowrap"
          >
            Sign Up Free
          </Link>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden px-6 md:px-12 pt-20 pb-24 max-w-7xl mx-auto">
        {/* decorative grid dots */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, #000 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* pill badge */}
        <div className="relative flex justify-center mb-8">
          <span className="inline-flex items-center gap-2 px-5 py-2 bg-white border-4 border-black shadow-neo text-sm font-black uppercase">
            <Star className="w-4 h-4 fill-neo-primary text-neo-primary" />
            Powered by Google Gemini AI
          </span>
        </div>

        <div className="relative text-center max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-black uppercase leading-none tracking-tight mb-6">
            Your Resume,{" "}
            <span className="text-neo-primary underline decoration-8 underline-offset-4">
              Brutally
            </span>{" "}
            Honest.
          </h1>
          <p className="text-xl md:text-2xl font-bold text-gray-700 max-w-2xl mx-auto mb-10 border-l-4 border-neo-primary pl-4 text-left">
            Stop guessing why you aren't getting callbacks. ResumeAI scores your
            resume across ATS rules, content quality, and structure — then tells
            you exactly what to fix.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="group inline-flex items-center justify-center gap-3 px-10 py-5 bg-neo-primary border-4 border-black text-white font-black uppercase text-xl shadow-neo hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-all duration-200"
            >
              Analyze My Resume
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-white border-4 border-black text-black font-black uppercase text-xl shadow-neo hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-all duration-200"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* stats row */}
        <div className="relative grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 max-w-4xl mx-auto">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="bg-white border-4 border-black shadow-neo p-6 text-center"
            >
              <div className="text-4xl font-black text-neo-primary leading-none">
                {s.value}
              </div>
              <div className="text-xs font-bold uppercase mt-2 text-gray-600">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="border-t-4 border-black bg-neo-primary">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">
          <h2 className="text-5xl font-black uppercase text-white mb-4 drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
            Everything You Need
          </h2>
          <p className="text-black font-bold text-xl mb-12 bg-white border-4 border-black p-4 shadow-neo inline-block">
            No subscriptions. No paywalls. Just honest AI feedback.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className={`${f.color} border-4 border-black shadow-neo p-8 hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-all duration-200`}
                >
                  <div className="w-14 h-14 bg-black flex items-center justify-center mb-6 border-2 border-black">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-black uppercase mb-3">
                    {f.title}
                  </h3>
                  <p className="font-bold text-gray-800 leading-relaxed">
                    {f.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="border-t-4 border-black bg-neo-bg">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">
          <h2 className="text-5xl font-black uppercase mb-16">How It Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((item, i) => (
              <div key={item.step} className="relative">
                {/* connector line */}
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-full w-8 border-t-4 border-dashed border-black z-10" />
                )}
                <div className="bg-white border-4 border-black shadow-neo p-8 h-full">
                  <div className="text-7xl font-black text-neo-primary opacity-20 leading-none mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-black uppercase mb-3">
                    {item.title}
                  </h3>
                  <p className="font-bold text-gray-700 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT YOU GET ── */}
      <section className="border-t-4 border-black bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-5xl font-black uppercase mb-6 leading-tight">
              What Your Report Includes
            </h2>
            <div className="space-y-4">
              {[
                "Overall score out of 100",
                "ATS compatibility rating",
                "Content impact & action verb analysis",
                "Structure and hierarchy check",
                "Extracted skills list",
                "Estimated salary range",
                "Personalized improvement tips",
                "AI cover letter generation",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-4 p-4 border-4 border-black bg-neo-bg shadow-neo hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                >
                  <CheckCircle2 className="w-6 h-6 text-neo-primary shrink-0" />
                  <span className="font-bold">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Fake score card preview */}
          <div className="bg-white border-4 border-black shadow-[8px_8px_0px_#000] p-8">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b-4 border-black">
              <FileText className="w-8 h-8" />
              <div>
                <div className="font-black text-lg uppercase">
                  Resume_Final_v3.pdf
                </div>
                <div className="text-xs font-bold text-green-600 uppercase">
                  ● Analysis Complete
                </div>
              </div>
            </div>

            <div className="text-center mb-8">
              <div className="text-8xl font-black text-neo-primary leading-none">
                82
              </div>
              <div className="text-sm font-bold uppercase text-gray-500 mt-1">
                Overall Score
              </div>
            </div>

            <div className="space-y-3">
              {[
                {
                  label: "ATS Compatibility",
                  score: 90,
                  color: "bg-green-500",
                },
                { label: "Content Impact", score: 75, color: "bg-neo-primary" },
                { label: "Structure", score: 88, color: "bg-blue-500" },
              ].map((bar) => (
                <div key={bar.label}>
                  <div className="flex justify-between font-bold text-sm mb-1">
                    <span className="uppercase">{bar.label}</span>
                    <span>{bar.score}/100</span>
                  </div>
                  <div className="h-4 bg-neo-bg border-2 border-black">
                    <div
                      className={`h-full ${bar.color} border-r-2 border-black`}
                      style={{ width: `${bar.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="border-t-4 border-black bg-black text-white">
        <div className="max-w-4xl mx-auto px-6 md:px-12 py-24 text-center">
          <Sparkles className="w-16 h-16 text-neo-primary mx-auto mb-6" />
          <h2 className="text-6xl font-black uppercase leading-tight mb-6 drop-shadow-[4px_4px_0px_rgba(255,107,0,1)]">
            Ready for Brutal Honesty?
          </h2>
          <p className="text-xl font-bold text-gray-300 mb-10">
            Create a free account and get your first resume scored under a
            minute.
          </p>
          <Link
            to="/signup"
            className="group inline-flex items-center gap-3 px-12 py-6 bg-neo-primary border-4 border-white text-white font-black uppercase text-2xl shadow-[6px_6px_0px_#ff6b00] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-all duration-200"
          >
            Get Started — It's Free
            <ArrowRight className="w-7 h-7 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t-4 border-black bg-neo-bg px-6 md:px-12 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-neo-primary border-2 border-black flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-black uppercase text-sm">ResumeAI</span>
        </div>
        <p className="text-sm font-bold text-gray-600">
          MIT © {new Date().getFullYear()} Jenacodes
        </p>
        <div className="flex gap-6 text-sm font-bold uppercase">
          <Link
            to="/login"
            className="hover:text-neo-primary transition-colors"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="hover:text-neo-primary transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </footer>
    </div>
  );
}
