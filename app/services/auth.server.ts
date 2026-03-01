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
 * State is stored in a dedicated short-lived cookie (not the main session)
 * so it survives the round-trip to Google cleanly.
 */
export async function redirectToGoogle() {
  const state = randomBytes(16).toString("hex");

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: getCallbackUrl(),
    response_type: "code",
    scope: "openid email profile",
    access_type: "online",
    state,
  });

  // Store state in its own cookie so it's independent of the main session
  const stateCookie = [
    `oauth_state=${state}`,
    "HttpOnly",
    "Path=/",
    "SameSite=Lax",
    "Max-Age=300", // 5 minutes — plenty of time to complete the OAuth flow
    process.env.NODE_ENV === "production" ? "Secure" : "",
  ]
    .filter(Boolean)
    .join("; ");

  return redirect(`${GOOGLE_AUTH_URL}?${params.toString()}`, {
    headers: { "Set-Cookie": stateCookie },
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
  const googleError = url.searchParams.get("error");
  const returnedState = url.searchParams.get("state");

  if (googleError || !code) {
    console.error("Google OAuth: denied or missing code. error =", googleError);
    return redirect("/login?error=google");
  }

  // Verify state from the dedicated oauth_state cookie
  const cookieHeader = request.headers.get("Cookie") ?? "";
  const stateCookieMatch = cookieHeader.match(/oauth_state=([^;]+)/);
  const expectedState = stateCookieMatch?.[1];

  console.log("Google OAuth state check:", {
    returned: returnedState,
    expected: expectedState,
    match: returnedState === expectedState,
    callbackUrl: getCallbackUrl(),
  });

  if (!returnedState || !expectedState || returnedState !== expectedState) {
    console.error(
      "Google OAuth: state mismatch — possible CSRF or cookie issue",
    );
    return redirect("/login?error=google");
  }

  // Expire the state cookie now that it's been consumed
  const clearStateCookie = "oauth_state=; Max-Age=0; Path=/";

  try {
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
      const body = await tokenRes.text();
      console.error("Google OAuth: token exchange failed:", body);
      return redirect("/login?error=google", {
        headers: { "Set-Cookie": clearStateCookie },
      });
    }

    const { access_token } = (await tokenRes.json()) as {
      access_token: string;
    };

    // 2. Fetch the Google user profile
    const profileRes = await fetch(GOOGLE_USERINFO_URL, {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    if (!profileRes.ok) {
      const body = await profileRes.text();
      console.error("Google OAuth: userinfo fetch failed:", body);
      return redirect("/login?error=google", {
        headers: { "Set-Cookie": clearStateCookie },
      });
    }

    const profile = (await profileRes.json()) as {
      id: string;
      email: string;
      name?: string;
    };

    const { id: googleId, email, name } = profile;

    if (!email) {
      console.error("Google OAuth: no email in profile:", profile);
      return redirect("/login?error=google", {
        headers: { "Set-Cookie": clearStateCookie },
      });
    }

    // 3. Find or create user
    let user = await db.user.findUnique({ where: { googleId } });

    if (!user) {
      user = await db.user.findUnique({ where: { email } });
      if (user) {
        user = await db.user.update({
          where: { id: user.id },
          data: { googleId },
        });
      } else {
        user = await db.user.create({
          data: { email, googleId, name: name ?? null },
        });
      }
    }

    // 4. Write userId into the main app session cookie
    const session = await getSession(request.headers.get("Cookie"));
    session.set("userId", user.id);

    return redirect("/dashboard", {
      headers: [
        ["Set-Cookie", await commitSession(session)],
        ["Set-Cookie", clearStateCookie],
      ],
    });
  } catch (err) {
    console.error("Google OAuth: unexpected error:", err);
    return redirect("/login?error=google", {
      headers: { "Set-Cookie": clearStateCookie },
    });
  }
}
