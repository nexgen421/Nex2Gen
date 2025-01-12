import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { api } from "~/trpc/server";

const Admin = async () => {
  const token = headers().get("admin-token");
  if (!token) {
    redirect("/login");
  }
  try {
    const session = await api.adminAuth.fetchSession();

    console.log(session);
  } catch (error) {
    redirect("/login");
  }
};

export default Admin;
