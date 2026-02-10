import type { Route } from "./+types/settings.email";
import { Sidebar } from "../components/Sidebar";
import Navbar from "~/components/Navbar";
import { ArrowLeft, Save, Mail, Lock } from "lucide-react";
import {
  Link,
  redirect,
  Form,
  useNavigation,
  useActionData,
} from "react-router";
import { db } from "~/db.server";
import { getSession } from "~/sessions";
import bcrypt from "bcryptjs";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");

  if (!userId) {
    throw redirect("/login");
  }

  const user = await db.user.findUnique({
    where: { id: userId },
    select: { email: true, passwordHash: true },
  });

  if (!user) {
    throw redirect("/login");
  }

  return { user };
}

export async function action({ request }: Route.ActionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");

  if (!userId) {
    throw redirect("/login");
  }

  const formData = await request.formData();
  const newEmail = formData.get("newEmail") as string;
  const password = formData.get("password") as string;

  const errors: Record<string, string> = {};

  if (!newEmail || !newEmail.includes("@")) {
    errors.newEmail = "Valid email is required";
  }
  if (!password) {
    errors.password = "Password is required to confirm changes";
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) throw redirect("/login");

  // Verify password
  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    return { errors: { password: "Incorrect password" } };
  }

  // Check if email is already taken
  const existingUser = await db.user.findUnique({ where: { email: newEmail } });
  if (existingUser && existingUser.id !== userId) {
    return { errors: { newEmail: "This email is already in use" } };
  }

  // Update email
  await db.user.update({
    where: { id: userId },
    data: { email: newEmail },
  });

  return { success: true };
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Change Email - ResumeAI" },
    { name: "description", content: "Update your email address" },
  ];
}

export default function ChangeEmail({ loaderData }: Route.ComponentProps) {
  const { user } = loaderData;
  const navigation = useNavigation();
  const actionData = useActionData<{
    errors?: Record<string, string>;
    success?: boolean;
  }>();
  const isSubmitting = navigation.state === "submitting";

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-neo-bg text-black font-sans selection:bg-neo-primary selection:text-white flex">
        <Sidebar />

        <main className="flex-1 lg:pl-64 min-h-screen relative overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 md:p-12">
            <div className="max-w-3xl mx-auto space-y-8">
              {/* Header */}
              <div className="flex items-center gap-4">
                <Link
                  to="/settings"
                  className="p-2 bg-white border-2 border-black shadow-neo-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all text-black"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                  <h1 className="text-3xl md:text-4xl font-black uppercase text-black">
                    Change Email
                  </h1>
                  <p className="text-black font-medium mt-1 border-l-4 border-neo-primary pl-4">
                    Update the email address associated with your account.
                  </p>
                </div>
              </div>

              {/* Success Message */}
              {actionData?.success && (
                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 shadow-neo-sm">
                  <p className="font-bold">Success</p>
                  <p>Your email has been updated successfully.</p>
                </div>
              )}

              {/* Form */}
              <div className="bg-white border-4 border-black shadow-neo p-6 md:p-8">
                <Form method="post" className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-black uppercase mb-2">
                      Current Email
                    </label>
                    <div className="w-full bg-gray-100 border-4 border-black p-3 text-gray-600 font-bold">
                      {user.email}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-black uppercase mb-2">
                      New Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        name="newEmail"
                        className={`w-full bg-white border-4 border-black p-3 pl-10 text-black font-bold placeholder:text-gray-400 focus:outline-none focus:shadow-neo transition-all ${
                          actionData?.errors?.newEmail ? "border-red-500" : ""
                        }`}
                        placeholder="new@example.com"
                      />
                      <Mail className="w-5 h-5 text-gray-500 absolute left-3 top-4" />
                    </div>
                    {actionData?.errors?.newEmail && (
                      <p className="mt-1 text-red-600 font-bold text-sm">
                        {actionData.errors.newEmail}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-black uppercase mb-2">
                      Confirm with Password
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        name="password"
                        className={`w-full bg-white border-4 border-black p-3 pl-10 text-black font-bold placeholder:text-gray-400 focus:outline-none focus:shadow-neo transition-all ${
                          actionData?.errors?.password ? "border-red-500" : ""
                        }`}
                        placeholder="••••••••"
                      />
                      <Lock className="w-5 h-5 text-gray-500 absolute left-3 top-4" />
                    </div>
                    {actionData?.errors?.password && (
                      <p className="mt-1 text-red-600 font-bold text-sm">
                        {actionData.errors.password}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-neo-primary border-4 border-black shadow-neo hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all text-white font-bold uppercase disabled:opacity-50"
                    >
                      <Save className="w-5 h-5" />
                      {isSubmitting ? "Updating..." : "Update Email"}
                    </button>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
