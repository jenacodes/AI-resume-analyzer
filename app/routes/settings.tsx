import type { Route } from "./+types/settings";
import { Sidebar } from "../components/Sidebar";
import {
  Shield,
  Bell,
  Moon,
  Trash2,
  Lock,
  Mail,
  Smartphone,
  Download,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import Navbar from "~/components/Navbar";
import AmbientBackground from "~/components/AmbientBackground";
import { getSession } from "~/sessions";
import { redirect } from "react-router";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("userId")) {
    throw redirect("/login");
  }
  return null;
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Settings - ResumeAI" },
    { name: "description", content: "Manage your application settings" },
  ];
}

interface ToggleSectionProps {
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  children: React.ReactNode;
}

function ToggleSection({
  title,
  description,
  icon: Icon,
  color,
  children,
}: ToggleSectionProps) {
  return (
    <div className="bg-slate-900/50 border border-white/10 rounded-2xl overflow-hidden">
      <div className="p-6 border-b border-white/5">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Icon className={`w-5 h-5 ${color}`} />
          {title}
        </h3>
        <p className="text-sm text-slate-400 mt-1 ml-7">{description}</p>
      </div>
      <div className="p-6 space-y-6">{children}</div>
    </div>
  );
}

interface ToggleItemProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}

function ToggleItem({
  label,
  description,
  checked,
  onChange,
}: ToggleItemProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-white font-medium">{label}</p>
        <p className="text-sm text-slate-400">{description}</p>
      </div>
      <button
        onClick={onChange}
        className={`w-12 h-6 rounded-full transition-colors relative ${
          checked ? "bg-blue-600" : "bg-slate-700"
        }`}
      >
        <div
          className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
            checked ? "translate-x-6" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

export default function Settings() {
  const [settings, setSettings] = useState({
    emailNotifs: true,
    marketingEmails: false,
    pushNotifs: true,
    twoFactor: false,
    darkMode: true,
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-blue-500/30 flex">
        <Sidebar />

        <main className="flex-1 md:pl-64 min-h-screen relative overflow-hidden flex flex-col">
          {/* Ambient Background Effects */}
          <AmbientBackground />

          <div className="flex-1 overflow-y-auto p-6 md:p-12">
            <div className="max-w-4xl mx-auto space-y-8">
              <div>
                <h1 className="text-3xl font-bold text-white">Settings</h1>
                <p className="text-slate-400 mt-1">
                  Manage your preferences and account security
                </p>
              </div>

              <div className="grid grid-cols-1 gap-8">
                {/* Account Settings */}
                <ToggleSection
                  title="Account"
                  description="Manage your login and contact details"
                  icon={Shield}
                  color="text-blue-400"
                >
                  <button className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition group">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <p className="text-white font-medium">Email Address</p>
                        <p className="text-sm text-slate-400">
                          jena@example.com
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-white transition" />
                  </button>

                  <button className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition group">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
                        <Lock className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <p className="text-white font-medium">
                          Change Password
                        </p>
                        <p className="text-sm text-slate-400">
                          Last updated 3 months ago
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-white transition" />
                  </button>
                </ToggleSection>

                {/* Notifications */}
                <ToggleSection
                  title="Notifications"
                  description="Choose what you want to be notified about"
                  icon={Bell}
                  color="text-yellow-400"
                >
                  <ToggleItem
                    label="Email Notifications"
                    description="Receive analysis results via email"
                    checked={settings.emailNotifs}
                    onChange={() => toggle("emailNotifs")}
                  />
                  <ToggleItem
                    label="Marketing Emails"
                    description="Receive product updates and tips"
                    checked={settings.marketingEmails}
                    onChange={() => toggle("marketingEmails")}
                  />
                  <ToggleItem
                    label="Push Notifications"
                    description="Receive notifications on your device"
                    checked={settings.pushNotifs}
                    onChange={() => toggle("pushNotifs")}
                  />
                </ToggleSection>

                {/* Privacy & Security */}
                <ToggleSection
                  title="Privacy & Security"
                  description="Control your data and account security"
                  icon={Lock}
                  color="text-green-400"
                >
                  <ToggleItem
                    label="Two-Factor Authentication"
                    description="Add an extra layer of security"
                    checked={settings.twoFactor}
                    onChange={() => toggle("twoFactor")}
                  />
                  <div className="pt-4 border-t border-white/5">
                    <button className="flex items-center gap-2 text-slate-300 hover:text-white transition text-sm font-medium">
                      <Download className="w-4 h-4" />
                      Download My Data
                    </button>
                  </div>
                </ToggleSection>

                {/* Appearance */}
                <ToggleSection
                  title="Appearance"
                  description="Customize the look and feel"
                  icon={Moon}
                  color="text-purple-400"
                >
                  <ToggleItem
                    label="Dark Mode"
                    description="Use dark theme across the application"
                    checked={settings.darkMode}
                    onChange={() => toggle("darkMode")}
                  />
                </ToggleSection>

                {/* Danger Zone */}
                <div className="bg-red-500/5 border border-red-500/20 rounded-2xl overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-red-400 flex items-center gap-2 mb-2">
                      <Trash2 className="w-5 h-5" />
                      Danger Zone
                    </h3>
                    <p className="text-sm text-red-400/70 mb-6">
                      Once you delete your account, there is no going back.
                      Please be certain.
                    </p>
                    <button className="px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-sm font-medium transition">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
