import { Shield } from "lucide-react";
import { useState } from "react";

export function SettingsSection() {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  return (
    <div className="space-y-6">
      {/* Account Settings */}
      <div className="bg-white border-4 border-black shadow-neo overflow-hidden">
        <div className="p-6 border-b-4 border-black bg-neo-bg">
          <h3 className="text-xl font-black uppercase text-black flex items-center gap-2">
            <Shield className="w-6 h-6 text-black" />
            Account Preferences
          </h3>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-black font-bold text-lg">
                Email Notifications
              </p>
              <p className="text-sm text-gray-600 font-medium">
                Receive analysis results via email
              </p>
            </div>
            <button
              onClick={() => setEmailNotifs(!emailNotifs)}
              className={`w-14 h-8 border-4 border-black transition-colors relative ${
                emailNotifs ? "bg-neo-primary" : "bg-gray-200"
              }`}
            >
              <div
                className={`absolute top-[-4px] left-[-4px] w-6 h-8 bg-black border-2 border-white transition-transform ${
                  emailNotifs ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-black font-bold text-lg">Marketing Emails</p>
              <p className="text-sm text-gray-600 font-medium">
                Receive product updates and tips
              </p>
            </div>
            <button
              onClick={() => setMarketingEmails(!marketingEmails)}
              className={`w-14 h-8 border-4 border-black transition-colors relative ${
                marketingEmails ? "bg-neo-primary" : "bg-gray-200"
              }`}
            >
              <div
                className={`absolute top-[-4px] left-[-4px] w-6 h-8 bg-black border-2 border-white transition-transform ${
                  marketingEmails ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Subscription */}
      {/* <div className="bg-slate-900/50 border border-white/10 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/5">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-purple-400" />
            Subscription
          </h3>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white font-medium">Pro Plan</p>
              <p className="text-sm text-slate-400">$19.99 / month</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold border border-green-500/20">
              Active
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 mb-2">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full w-3/4" />
          </div>
          <p className="text-xs text-slate-500 text-right">
            Renews on Dec 24, 2025
          </p>

          <div className="mt-6 flex gap-3">
            <button className="flex-1 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-medium transition">
              Manage Billing
            </button>
            <button className="flex-1 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-medium transition">
              Upgrade Plan
            </button>
          </div>
        </div>
      </div> */}
    </div>
  );
}
