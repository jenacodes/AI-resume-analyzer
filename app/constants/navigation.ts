import {
  LayoutDashboard,
  FileText,
  User,
  Settings,
  PenTool,
} from "lucide-react";

export const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: FileText, label: "My Resumes", href: "/resumes" },
  { icon: PenTool, label: "Cover Letter", href: "/cover-letter" },
  { icon: User, label: "Profile", href: "/profile" },
  { icon: Settings, label: "Settings", href: "/settings" },
];
