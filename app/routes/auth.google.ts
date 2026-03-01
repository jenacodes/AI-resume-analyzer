import { redirectToGoogle } from "~/services/auth.server";

/**
 * GET /auth/google
 * Redirects the user to Google's OAuth consent screen.
 */
export async function loader() {
  return redirectToGoogle();
}
