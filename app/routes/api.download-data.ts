import { type LoaderFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { db } from "~/db.server";
import { getSession } from "~/sessions";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");

  if (!userId) {
    throw redirect("/login");
  }

  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      resumes: true,
    },
  });

  if (!user) {
    throw redirect("/login");
  }

  // Remove sensitive data
  const { passwordHash, ...safeUser } = user;

  const data = JSON.stringify(safeUser, null, 2);

  return new Response(data, {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="resume-ai-data-${userId}.json"`,
    },
  });
}
