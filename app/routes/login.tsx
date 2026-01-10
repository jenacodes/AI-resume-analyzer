import type { Route } from "./+types/login";
import {
  Link,
  Form,
  redirect,
  useActionData,
  useNavigation,
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

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return { errors: { email: "Invalid email or password" } };
  }

  const session = await getSession(request.headers.get("Cookie"));
  session.set("userId", user.id);

  return redirect("/", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export default function Login() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

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
