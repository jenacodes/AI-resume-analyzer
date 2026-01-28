import { Shield, Mail, MapPin } from "lucide-react";
import { Link } from "react-router";
import { useRouteLoaderData } from "react-router";
import type { loader } from "../root";

// interface ProfileHeaderProps {
//   user: {
//     name: string | null;
//     email: string;
//   };
// }

interface ProfileHeaderProps {
  user: {
    name: string | null;
    email: string;
    bio: string | null;
    location: string | null;
  };
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <div className="bg-white border-4 border-black shadow-neo p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-8 relative overflow-hidden">
      {/* Avatar */}
      <div className="relative shrink-0">
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full p-1 bg-neo-primary border-4 border-black">
          <div className="w-full h-full rounded-full bg-neo-secondary border-2 border-black flex items-center justify-center">
            <span className="text-4xl font-bold text-white">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </span>
          </div>
        </div>
        <div className="absolute bottom-1 right-1 bg-green-400 w-6 h-6 rounded-full border-4 border-black" />
      </div>

      {/* User Info */}
      <div className="text-center md:text-left flex-1">
        <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
          <h1 className="text-3xl md:text-4xl font-black uppercase text-black">
            {user?.name}
          </h1>
          <span className="px-3 py-1 bg-neo-accent border-2 border-black shadow-neo-sm text-black text-xs font-black uppercase flex items-center gap-1 transform -rotate-2">
            <Shield className="w-3 h-3" />
            PRO PLAN
          </span>
        </div>

        <p className="text-gray-600 font-bold mb-4 max-w-md mx-auto md:mx-0">
          {user?.bio || "No bio yet."}
        </p>

        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm font-bold text-black uppercase">
          <div className="flex items-center gap-1.5">
            <Mail className="w-4 h-4" />
            <span>{user?.email}</span>
          </div>
          {user?.location && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              <span>{user.location}</span>
            </div>
          )}
        </div>
      </div>

      {/* Edit Button */}
      <Link
        to="/profile/edit"
        className="px-6 py-3 bg-white border-4 border-black shadow-neo hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all text-black font-bold uppercase"
      >
        Edit Profile
      </Link>
    </div>
  );
}
