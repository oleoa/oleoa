import { auth0 } from "@/lib/auth0";

export default auth0.withPageAuthRequired(
  async function Dashboard() {
    const session = await auth0.getSession();
    const user = session?.user;
    console.log(user);
    return (
      <div>
        <a href="/auth/logout">Logout</a>
      </div>
    );
  },
  { returnTo: "/dashboard" }
);
