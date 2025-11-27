import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("resume/:id", "routes/resume.$id.tsx"),
  route("scan", "routes/scan.tsx"),
] satisfies RouteConfig;
