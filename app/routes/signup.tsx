import type { Route } from "./+types/signup";
import {
  Link,
  Form,
  redirect,
  useActionData,
  useNavigation,
} from "react-router";
import {
  ArrowRight,
  Lock,
  Mail,
  User,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

import { db } from "~/db.server";
import bcrypt from "bcryptjs";
import { commitSession, getSession } from "~/sessions";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Sign Up - ResumeAI" },
    { name: "description", content: "Create your account" },
  ];
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  const errors: Record<string, string> = {};

  if (!email || !email.includes("@")) {
    errors.email = "Invalid email address";
  }

  if (!password || password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  const existingUser = await db.user.findUnique({ where: { email } });
  if (existingUser) {
    return { errors: { email: "User already exists with this email" } };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await db.user.create({
    data: {
      email,
      passwordHash,
      name,
    },
  });

  const session = await getSession(request.headers.get("Cookie"));
  session.set("userId", user.id);

  return redirect("/", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export default function Signup() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-blue-500/30 flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-slate-900 items-center justify-center p-12">
        {/* Ambient Background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-[-20%] left-[-20%] w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen" />
          <div className="absolute bottom-[-20%] right-[-20%] w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[120px] mix-blend-screen" />
        </div>

        <div className="relative z-10 max-w-lg">
          <div className="w-20 h-20 bg-linear-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(37,99,235,0.3)]">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-6">
            Join the Future of Career Growth
          </h1>
          <div className="space-y-4">
            {[
              "AI-powered resume analysis",
              "Personalized improvement tips",
              "ATS compatibility checks",
              "Unlimited resume scans",
            ].map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-3 text-lg text-slate-300"
              >
                <CheckCircle2 className="w-6 h-6 text-green-400 shrink-0" />
                {feature}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Sign Up Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative">
        {/* Mobile Background Effects */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none lg:hidden">
          <div className="absolute top-[-10%] right-[20%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[80px]" />
        </div>

        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-white">Create Account</h2>
            <p className="text-slate-400 mt-2">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-400 hover:text-blue-300 font-medium transition"
              >
                Sign in
              </Link>
            </p>
          </div>

          <Form method="post" className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium text-slate-300 block"
              >
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  className="w-full bg-slate-900/50 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition"
                />
                <User className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-slate-300 block"
              >
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="name@example.com"
                  className="w-full bg-slate-900/50 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition"
                />
                <Mail className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5" />
              </div>
              {actionData?.errors?.email && (
                <p className="text-red-500 text-sm">
                  {actionData.errors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-slate-300 block"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Create a password"
                  autoComplete="new-password"
                  className="w-full bg-slate-900/50 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition"
                />
                <Lock className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5" />
              </div>
              {actionData?.errors?.password && (
                <p className="text-red-500 text-sm">
                  {actionData.errors.password}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="confirm-password"
                className="text-sm font-medium text-slate-300 block"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="confirm-password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  className="w-full bg-slate-900/50 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition"
                />
                <Lock className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5" />
              </div>
              {actionData?.errors?.confirmPassword && (
                <p className="text-red-500 text-sm">
                  {actionData.errors.confirmPassword}
                </p>
              )}
            </div>

            <div className="flex items-start">
              <input
                id="terms"
                type="checkbox"
                className="h-4 w-4 mt-1 rounded border-white/10 bg-slate-900 text-blue-600 focus:ring-blue-500/50 focus:ring-offset-0"
              />
              <label
                htmlFor="terms"
                className="ml-2 block text-sm text-slate-400"
              >
                I agree to the{" "}
                <Link to="#" className="text-blue-400 hover:text-blue-300">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="#" className="text-blue-400 hover:text-blue-300">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-linear-to-r from-blue-600 to-purple-600 text-white font-bold shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
}
