import type { Route } from "./+types/profile.edit";
import { Sidebar } from "../components/Sidebar";
import { ArrowLeft, Upload, Save, X } from "lucide-react";
import {
  Link,
  redirect,
  Form,
  useNavigation,
  useActionData,
} from "react-router";
import { useEffect, useState } from "react";
import { db } from "~/db.server";

import { getSession } from "~/sessions";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");

  if (!userId) {
    throw redirect("/login");
  }

  const user = await db.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true, bio: true, location: true },
  });

  if (!user) {
    throw redirect("/login");
  }

  return { user };
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Edit Profile - ResumeAI" },
    { name: "description", content: "Update your profile information" },
  ];
}
export async function action({ request }: Route.ActionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");

  if (!userId) {
    throw redirect("/login");
  }

  const formData = await request.formData();
  const name = formData.get("name") as string;
  // const email = formData.get("email") as string;
  const bio = formData.get("bio") as string;
  const location = formData.get("location") as string;

  // Basic validation could go here

  await db.user.update({
    where: { id: userId },
    data: {
      name,
      // email is handled in settings
      bio,
      location,
    },
  });

  return { success: true };
}

export default function EditProfile({ loaderData }: Route.ComponentProps) {
  const { user } = loaderData;
  const navigation = useNavigation();
  const actionData = useActionData<{ success?: boolean }>();
  const isSubmitting = navigation.state === "submitting";

  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email,
    bio: user.bio || "",
    location: user.location || "",
  });

  useEffect(() => {
    if (actionData?.success) {
      // Optional: Show success toast or redirect
      // For now, we just stay here as the user might want to continue editing
    }
  }, [actionData]);

  return (
    <div className="min-h-screen bg-neo-bg text-black font-sans selection:bg-neo-primary selection:text-white flex">
      <Sidebar />

      <main className="flex-1 md:pl-64 min-h-screen relative overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 md:p-12">
          <div className="max-w-3xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4">
              <Link
                to="/profile"
                className="p-2 bg-white border-2 border-black shadow-neo-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all text-black"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-3xl md:text-4xl font-black uppercase text-black">
                  Edit Profile
                </h1>
                <p className="text-black font-medium mt-1 border-l-4 border-neo-primary pl-4">
                  Update your personal information
                </p>
              </div>
            </div>

            {/* Form */}
            <Form method="post" className="space-y-6">
              {actionData?.success && (
                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
                  <p className="font-bold">Success</p>
                  <p>Profile updated successfully.</p>
                </div>
              )}
              {/* Personal Information */}
              <div className="bg-white border-4 border-black shadow-neo p-6 md:p-8 space-y-6">
                <h3 className="text-xl font-black uppercase text-black">
                  Personal Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-black uppercase mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full bg-white border-4 border-black p-3 text-black font-bold placeholder:text-gray-400 focus:outline-none focus:shadow-neo transition-all"
                      placeholder="Enter your name"
                      name="name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-black uppercase mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={formData.email}
                        readOnly
                        disabled
                        className="w-full bg-gray-100 border-4 border-black p-3 text-gray-500 font-bold cursor-not-allowed"
                        placeholder="Enter your email"
                      />
                      <div className="absolute right-3 top-3">
                        <Link
                          to="/settings/email"
                          className="text-xs font-black text-neo-primary uppercase hover:underline"
                        >
                          Change
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-black uppercase mb-2">
                    Bio
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    rows={4}
                    className="w-full bg-white border-4 border-black p-3 text-black font-bold placeholder:text-gray-400 focus:outline-none focus:shadow-neo transition-all resize-none"
                    placeholder="Tell us about yourself"
                    name="bio"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-black uppercase mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="w-full bg-white border-4 border-black p-3 text-black font-bold placeholder:text-gray-400 focus:outline-none focus:shadow-neo transition-all"
                    placeholder="City, Country"
                    name="location"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col-reverse md:flex-row gap-4 justify-end">
                <Link
                  to="/profile"
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-white border-4 border-black shadow-neo hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all text-black font-bold uppercase"
                >
                  <X className="w-5 h-5" />
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-neo-primary border-4 border-black shadow-neo hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all text-white font-bold uppercase disabled:opacity-50"
                >
                  <Save className="w-5 h-5" />
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </Form>
          </div>
        </div>
      </main>
    </div>
  );
}
