import type { Route } from "./+types/settings.password";
import { Sidebar } from "../components/Sidebar";
import Navbar from "~/components/Navbar";
import { ArrowLeft, Save, Lock } from "lucide-react";
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
  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  const errors: Record<string, string> = {};

  if (!currentPassword) errors.currentPassword = "Current password is required";
  if (!newPassword) errors.newPassword = "New password is required";
  if (!confirmPassword) errors.confirmPassword = "Confirm password is required";

  if (newPassword && newPassword.length < 8) {
    errors.newPassword = "Password must be at least 8 characters";
  }

  if (newPassword !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  const user = await db.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw redirect("/login");
  }

  const isValid = await bcrypt.compare(currentPassword, user.passwordHash);

  if (!isValid) {
    return { errors: { currentPassword: "Incorrect password" } };
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);

  await db.user.update({
    where: { id: userId },
    data: { passwordHash },
  });

  return { success: true };
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Change Password - ResumeAI" },
    { name: "description", content: "Update your account password" },
  ];
}

export default function ChangePassword({ loaderData }: Route.ComponentProps) {
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
                    Change Password
                  </h1>
                  <p className="text-black font-medium mt-1 border-l-4 border-neo-primary pl-4">
                    Ensure your account is using a long, random password to stay
                    secure.
                  </p>
                </div>
              </div>

              {/* Success Message */}
              {actionData?.success && (
                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 shadow-neo-sm">
                  <p className="font-bold">Success</p>
                  <p>Your password has been updated successfully.</p>
                </div>
              )}

              {/* Form */}
              <div className="bg-white border-4 border-black shadow-neo p-6 md:p-8">
                <Form method="post" className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-black uppercase mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        name="currentPassword"
                        className={`w-full bg-white border-4 border-black p-3 pl-10 text-black font-bold placeholder:text-gray-400 focus:outline-none focus:shadow-neo transition-all ${
                          actionData?.errors?.currentPassword
                            ? "border-red-500"
                            : ""
                        }`}
                        placeholder="••••••••"
                      />
                      <Lock className="w-5 h-5 text-gray-500 absolute left-3 top-4" />
                    </div>
                    {actionData?.errors?.currentPassword && (
                      <p className="mt-1 text-red-600 font-bold text-sm">
                        {actionData.errors.currentPassword}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-black uppercase mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        name="newPassword"
                        className={`w-full bg-white border-4 border-black p-3 pl-10 text-black font-bold placeholder:text-gray-400 focus:outline-none focus:shadow-neo transition-all ${
                          actionData?.errors?.newPassword
                            ? "border-red-500"
                            : ""
                        }`}
                        placeholder="••••••••"
                      />
                      <Lock className="w-5 h-5 text-gray-500 absolute left-3 top-4" />
                    </div>
                    {actionData?.errors?.newPassword && (
                      <p className="mt-1 text-red-600 font-bold text-sm">
                        {actionData.errors.newPassword}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-black uppercase mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        name="confirmPassword"
                        className={`w-full bg-white border-4 border-black p-3 pl-10 text-black font-bold placeholder:text-gray-400 focus:outline-none focus:shadow-neo transition-all ${
                          actionData?.errors?.confirmPassword
                            ? "border-red-500"
                            : ""
                        }`}
                        placeholder="••••••••"
                      />
                      <Lock className="w-5 h-5 text-gray-500 absolute left-3 top-4" />
                    </div>
                    {actionData?.errors?.confirmPassword && (
                      <p className="mt-1 text-red-600 font-bold text-sm">
                        {actionData.errors.confirmPassword}
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
                      {isSubmitting ? "Updating..." : "Update Password"}
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
