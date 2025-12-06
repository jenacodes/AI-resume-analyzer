import { redirect } from "react-router";
import { db } from "~/db.server";
import { getSession } from "~/sessions";

export async function getUserFromSession(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");
  if (!userId) return null;
  return db.user.findUnique({ where: { id: userId } });
}

export async function requireUser(request: Request) {
  const user = await getUserFromSession(request);
  if (!user) throw redirect("/login");
  return user;
}
