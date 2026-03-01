import { redirect } from "react-router";
import { randomBytes } from "crypto";
import { db } from "~/db.server";
import { getSession, commitSession } from "~/sessions";

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo";

function getCallbackUrl() {
  return (
    process.env.GOOGLE_CALLBACK_URL ||
    "http://localhost:5173/auth/google/callback"
  );
}

/**
 * Build the Google OAuth authorization URL and redirect the user to it.
 * Generates a random `state` token stored in the session to prevent CSRF.
 */
export async function redirectToGoogle(request: Request) {
  const state = randomBytes(16).toString("hex");

  const session = await getSession(request.headers.get("Cookie"));
  session.set("oauthState", state);

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: getCallbackUrl(),
    response_type: "code",
    scope: "openid email profile",
    access_type: "online",
    state,
  });

  return redirect(`${GOOGLE_AUTH_URL}?${params.toString()}`, {
    headers: { "Set-Cookie": await commitSession(session) },
  });
}

/**
 * Handle the OAuth callback: exchange code → token → userinfo → upsert user → session.
 */
export async function handleGoogleCallback(
  request: Request,
): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");
  const returnedState = url.searchParams.get("state");

  if (error || !code) {
    return redirect("/login?error=google");
  }

  // Verify the state parameter to prevent CSRF attacks
  const session = await getSession(request.headers.get("Cookie"));
  const expectedState = session.get("oauthState");

  if (!returnedState || !expectedState || returnedState !== expectedState) {
    console.error("Google OAuth: state mismatch — possible CSRF attempt");
    return redirect("/login?error=google");
  }

  // Clear the one-time state from the session now that it's been used
  session.unset("oauthState");

  try {
    // Save the cleared state before the try block passes the session along
    // 1. Exchange authorization code for access token
    const tokenRes = await fetch(GOOGLE_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: getCallbackUrl(),
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      throw new Error("Failed to exchange code for token");
    }

    const { access_token } = (await tokenRes.json()) as {
      access_token: string;
    };

    // 2. Fetch the Google user profile
    const profileRes = await fetch(GOOGLE_USERINFO_URL, {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    if (!profileRes.ok) {
      throw new Error("Failed to fetch Google user profile");
    }

    const profile = (await profileRes.json()) as {
      id: string;
      email: string;
      name?: string;
    };

    const { id: googleId, email, name } = profile;

    if (!email) {
      throw new Error("No email returned from Google");
    }

    // 3. Find or create user
    let user = await db.user.findUnique({ where: { googleId } });

    if (!user) {
      // Try to link by email (existing email/password account)
      user = await db.user.findUnique({ where: { email } });
      if (user) {
        user = await db.user.update({
          where: { id: user.id },
          data: { googleId },
        });
      } else {
        // Brand-new Google user
        user = await db.user.create({
          data: { email, googleId, name: name ?? null },
        });
      }
    }

    // 4. Write the userId into the app session (same as email/password login)
    // Reuse the existing session (which already had oauthState cleared above)
    session.set("userId", user.id);

    return redirect("/dashboard", {
      headers: { "Set-Cookie": await commitSession(session) },
    });
  } catch (err) {
    console.error("Google OAuth error:", err);
    return redirect("/login?error=google");
  }
}
