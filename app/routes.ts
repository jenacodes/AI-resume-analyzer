import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("resume/:id", "routes/resume.$id.tsx"),
  route("scan", "routes/scan.tsx"),
  route("resumes", "routes/resumes.tsx"),
  route("profile", "routes/profile.tsx"),
  route("profile/edit", "routes/profile.edit.tsx"),
  route("settings", "routes/settings.tsx"),
  route("login", "routes/login.tsx"),
  route("signup", "routes/signup.tsx"),
  route("logout", "routes/logout.tsx"),
  route("cover-letter", "routes/cover-letter.tsx"),
] satisfies RouteConfig;
