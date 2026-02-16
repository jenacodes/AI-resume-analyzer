import { redirect } from "react-router";

// Redirect root URL "/" to the home dashboard
export function loader() {
  return redirect("/login");
}
