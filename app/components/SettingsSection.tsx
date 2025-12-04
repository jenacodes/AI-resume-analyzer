import { Bell, Moon, Shield, CreditCard } from "lucide-react";
import { useState } from "react";

export function SettingsSection() {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  return (
    <div className="space-y-6">
      {/* Account Settings */}
      <div className="bg-slate-900/50 border border-white/10 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/5">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-400" />
            Account Preferences
          </h3>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Email Notifications</p>
              <p className="text-sm text-slate-400">
                Receive analysis results via email
              </p>
            </div>
            <button
              onClick={() => setEmailNotifs(!emailNotifs)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                emailNotifs ? "bg-blue-600" : "bg-slate-700"
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  emailNotifs ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Marketing Emails</p>
              <p className="text-sm text-slate-400">
                Receive product updates and tips
              </p>
            </div>
            <button
              onClick={() => setMarketingEmails(!marketingEmails)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                marketingEmails ? "bg-blue-600" : "bg-slate-700"
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
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
