import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function Home() {
  const cookieStore = await cookies();
  const role = cookieStore.get("role")?.value;
  const token = cookieStore.get("token")?.value;

  if (!token) redirect("/login");
  if (role === "client") redirect("/portal");
  redirect("/dashboard");
}
