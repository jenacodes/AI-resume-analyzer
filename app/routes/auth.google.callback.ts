import type { LoaderFunctionArgs } from "react-router";
import { handleGoogleCallback } from "~/services/auth.server";

/**
 * GET /auth/google/callback
 * Google redirects here after the user approves (or denies) access.
 */
export async function loader({ request }: LoaderFunctionArgs) {
  return handleGoogleCallback(request);
}
