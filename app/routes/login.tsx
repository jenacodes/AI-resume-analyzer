import type { Route } from "./+types/login";
import {
  Link,
  Form,
  redirect,
  useActionData,
  useNavigation,
  useSearchParams,
} from "react-router";
import { ArrowRight, Lock, Mail, Sparkles } from "lucide-react";
import { db } from "~/db.server";
import bcrypt from "bcryptjs";
import { commitSession, getSession } from "~/sessions";

import { checkRateLimit, loginRateLimiter } from "~/services/rate-limit.server";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Login - ResumeAI" },
    { name: "description", content: "Sign in to your account" },
  ];
}

export async function action({ request }: Route.ActionArgs) {
  // 1. Rate Limiting Check
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const limitResult = await checkRateLimit(loginRateLimiter, ip);

  if (!limitResult.success) {
    return { errors: { email: limitResult.error } as Record<string, string> };
  }

  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const errors: Record<string, string> = {};

  if (!email || !email.includes("@")) {
    errors.email = "Invalid email address";
  }

  if (!password) {
    errors.password = "Password is required";
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  const user = await db.user.findUnique({ where: { email } });

  if (
    !user ||
    !user.passwordHash ||
    !(await bcrypt.compare(password, user.passwordHash))
  ) {
    return { errors: { email: "Invalid email or password" } };
  }

  const session = await getSession(request.headers.get("Cookie"));
  session.set("userId", user.id);

  return redirect("/dashboard", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export default function Login() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [searchParams] = useSearchParams();
  const googleError = searchParams.get("error") === "google";

  return (
    <div className="min-h-screen bg-neo-bg text-black font-sans selection:bg-neo-primary selection:text-white flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-neo-primary border-r-4 border-black items-center justify-center p-12">
        <div className="relative z-10 max-w-lg text-center">
          <div className="w-24 h-24 bg-white border-4 border-black shadow-neo rounded-none flex items-center justify-center mx-auto mb-8">
            <Sparkles className="w-12 h-12 text-black" />
          </div>
          <h1 className="text-5xl font-black uppercase text-white mb-6 tracking-tight drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
            Welcome Back to ResumeAI
          </h1>
          <p className="text-xl text-black font-bold leading-relaxed bg-white border-4 border-black p-6 shadow-neo">
            Your personal AI career coach. Sign in to access your resume scans,
            track your progress, and land your dream job.
          </p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-4xl font-black uppercase text-black">
              Sign In
            </h2>
            <p className="text-black font-bold mt-2">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-neo-primary hover:underline decoration-4 underline-offset-4"
              >
                Sign up
              </Link>
            </p>
          </div>

          {googleError && (
            <p className="text-red-600 font-bold text-sm border-l-4 border-red-600 pl-2">
              Google sign-in failed. Please try again or use email and password.
            </p>
          )}

          {/* Google OAuth Button */}
          <a
            href="/auth/google"
            className="w-full py-4 bg-white border-4 border-black text-black font-black uppercase text-base shadow-neo hover:bg-neo-primary hover:text-white hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-200 flex items-center justify-center gap-3 group"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </a>

          {/* Divider */}
          <div className="relative flex items-center gap-4">
            <div className="flex-1 h-[2px] bg-black" />
            <span className="text-xs font-black uppercase text-black">or</span>
            <div className="flex-1 h-[2px] bg-black" />
          </div>

          <Form method="post" className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-bold text-black uppercase block"
              >
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="name@example.com"
                  autoComplete="email"
                  className="w-full bg-white border-4 border-black pl-11 pr-4 py-3 text-black font-bold placeholder:text-gray-400 focus:outline-none focus:shadow-neo transition-all"
                />
                <Mail className="w-5 h-5 text-black absolute left-3.5 top-4" />
              </div>
              {actionData?.errors?.email && (
                <p className="text-red-600 font-bold text-sm border-l-4 border-red-600 pl-2">
                  {actionData.errors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-bold text-black uppercase block"
                >
                  Password
                </label>
                <Link
                  to="#"
                  className="text-xs font-bold text-neo-primary hover:underline decoration-2 underline-offset-2"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full bg-white border-4 border-black pl-11 pr-4 py-3 text-black font-bold placeholder:text-gray-400 focus:outline-none focus:shadow-neo transition-all"
                />
                <Lock className="w-5 h-5 text-black absolute left-3.5 top-4" />
              </div>
              {actionData?.errors?.password && (
                <p className="text-red-600 font-bold text-sm border-l-4 border-red-600 pl-2">
                  {actionData.errors.password}
                </p>
              )}
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-5 w-5 border-2 border-black rounded-none text-neo-primary focus:ring-0 focus:ring-offset-0"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm font-bold text-black"
              >
                Remember me
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-black border-4 border-black text-white font-black uppercase text-lg shadow-neo hover:bg-neo-primary hover:text-white hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Signing In..." : "Sign In"}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
}
