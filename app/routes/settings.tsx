import type { Route } from "./+types/settings";
import { Sidebar } from "../components/Sidebar";
import {
  Shield,
  Bell,
  Trash2,
  Lock,
  Mail,
  Download,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import Navbar from "~/components/Navbar";

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
    <div className="bg-white border-4 border-black shadow-neo overflow-hidden">
      <div className="p-6 border-b-4 border-black bg-neo-bg">
        <h3 className="text-xl font-black uppercase text-black flex items-center gap-2">
          <Icon className={`w-6 h-6 text-black`} />
          {title}
        </h3>
        <p className="text-sm text-gray-600 font-bold mt-1 ml-8 uppercase tracking-wide">
          {description}
        </p>
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
        <p className="text-black font-bold text-lg uppercase">{label}</p>
        <p className="text-sm text-gray-600 font-medium">{description}</p>
      </div>
      <button
        onClick={onChange}
        className={`w-14 h-8 border-4 border-black transition-colors relative ${
          checked ? "bg-neo-primary" : "bg-gray-200"
        }`}
      >
        <div
          className={`absolute top-[-4px] left-[-4px] w-6 h-8 bg-black border-2 border-white transition-transform ${
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
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-neo-bg text-black font-sans selection:bg-neo-primary selection:text-white flex">
        <Sidebar />

        <main className="flex-1 lg:pl-64 min-h-screen relative overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 md:p-12">
            <div className="max-w-4xl mx-auto space-y-8">
              <div>
                <h1 className="text-4xl font-black uppercase text-black">
                  Settings
                </h1>
                <p className="text-black font-medium mt-1 border-l-4 border-neo-primary pl-4">
                  Manage your preferences and account security
                </p>
              </div>

              <div className="grid grid-cols-1 gap-8">
                {/* Account Settings */}
                <ToggleSection
                  title="Account"
                  description="Manage your login and contact details"
                  icon={Shield}
                  color="text-black"
                >
                  <button className="w-full flex items-center justify-between p-4 border-4 border-black bg-white shadow-neo-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-neo-secondary border-2 border-black text-white">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <p className="text-black font-bold uppercase">
                          Email Address
                        </p>
                        <p className="text-sm text-gray-600 font-bold">
                          jena@example.com
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-6 h-6 text-black group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button className="w-full flex items-center justify-between p-4 border-4 border-black bg-white shadow-neo-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-neo-accent border-2 border-black text-black">
                        <Lock className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <p className="text-black font-bold uppercase">
                          Change Password
                        </p>
                        <p className="text-sm text-gray-600 font-bold">
                          Last updated 3 months ago
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-6 h-6 text-black group-hover:translate-x-1 transition-transform" />
                  </button>
                </ToggleSection>

                {/* Notifications */}
                <ToggleSection
                  title="Notifications"
                  description="Choose what you want to be notified about"
                  icon={Bell}
                  color="text-black"
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
                  color="text-black"
                >
                  <ToggleItem
                    label="Two-Factor Authentication"
                    description="Add an extra layer of security"
                    checked={settings.twoFactor}
                    onChange={() => toggle("twoFactor")}
                  />
                  <div className="pt-4 border-t-4 border-black">
                    <button className="flex items-center gap-2 text-black hover:text-neo-primary transition text-sm font-black uppercase">
                      <Download className="w-4 h-4" />
                      Download My Data
                    </button>
                  </div>
                </ToggleSection>

                {/* Danger Zone */}
                <div className="bg-red-100 border-4 border-black shadow-neo overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-xl font-black uppercase text-red-600 flex items-center gap-2 mb-2">
                      <Trash2 className="w-6 h-6" />
                      Danger Zone
                    </h3>
                    <p className="text-sm text-red-800 font-bold mb-6">
                      Once you delete your account, there is no going back.
                      Please be certain.
                    </p>
                    <button className="px-6 py-3 bg-red-500 border-4 border-black text-white font-black uppercase shadow-neo-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
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
