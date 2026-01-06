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
  //1. This runs on the server when the form is submitted (POST request)
  const formData = await request.formData();
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  const errors: Record<string, string> = {};

  //2. Validate the form data
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

  //3. Check if the user already exists
  const existingUser = await db.user.findUnique({ where: { email } });
  if (existingUser) {
    return { errors: { email: "User already exists with this email" } };
  }

  //4. Hash the password
  const passwordHash = await bcrypt.hash(password, 10);

  //5. Create the user in the database
  const user = await db.user.create({
    data: {
      email,
      passwordHash,
      name,
    },
  });

  //6. Create a session
  const session = await getSession(request.headers.get("Cookie"));
  session.set("userId", user.id);

  //7. Redirect to the home page
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
    <div className="min-h-screen bg-neo-bg text-black font-sans selection:bg-neo-primary selection:text-white flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-neo-primary border-r-4 border-black items-center justify-center p-12">
        <div className="relative z-10 max-w-lg">
          <div className="w-24 h-24 bg-white border-4 border-black shadow-neo rounded-none flex items-center justify-center mb-8">
            <Sparkles className="w-12 h-12 text-black" />
          </div>
          <h1 className="text-5xl font-black uppercase text-white mb-8 tracking-tight drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
            Join the Future of Career Growth
          </h1>
          <div className="space-y-6">
            {[
              "AI-powered resume analysis",
              "Personalized improvement tips",
              "ATS compatibility checks",
              "Unlimited resume scans",
            ].map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-4 text-xl font-bold text-black bg-white border-4 border-black p-4 shadow-neo hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-200"
              >
                <CheckCircle2 className="w-8 h-8 text-black shrink-0" />
                {feature}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Sign Up Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-4xl font-black uppercase text-black">
              Create Account
            </h2>
            <p className="text-black font-bold mt-2">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-neo-primary hover:underline decoration-4 underline-offset-4"
              >
                Sign in
              </Link>
            </p>
          </div>

          <Form method="post" className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-bold text-black uppercase block"
              >
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  className="w-full bg-white border-4 border-black pl-11 pr-4 py-3 text-black font-bold placeholder:text-gray-400 focus:outline-none focus:shadow-neo transition-all"
                />
                <User className="w-5 h-5 text-black absolute left-3.5 top-4" />
              </div>
            </div>

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
              <label
                htmlFor="password"
                className="text-sm font-bold text-black uppercase block"
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

            <div className="space-y-2">
              <label
                htmlFor="confirm-password"
                className="text-sm font-bold text-black uppercase block"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="confirm-password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  className="w-full bg-white border-4 border-black pl-11 pr-4 py-3 text-black font-bold placeholder:text-gray-400 focus:outline-none focus:shadow-neo transition-all"
                />
                <Lock className="w-5 h-5 text-black absolute left-3.5 top-4" />
              </div>
              {actionData?.errors?.confirmPassword && (
                <p className="text-red-600 font-bold text-sm border-l-4 border-red-600 pl-2">
                  {actionData.errors.confirmPassword}
                </p>
              )}
            </div>

            <div className="flex items-start">
              <input
                id="terms"
                type="checkbox"
                className="h-5 w-5 mt-1 border-2 border-black rounded-none text-neo-primary focus:ring-0 focus:ring-offset-0"
              />
              <label
                htmlFor="terms"
                className="ml-2 block text-sm font-bold text-black"
              >
                I agree to the{" "}
                <Link
                  to="#"
                  className="text-neo-primary hover:underline decoration-2 underline-offset-2"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  to="#"
                  className="text-neo-primary hover:underline decoration-2 underline-offset-2"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-black border-4 border-black text-white font-black uppercase text-lg shadow-neo hover:bg-neo-primary hover:text-white hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
}
