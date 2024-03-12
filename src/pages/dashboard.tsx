import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function Dashboard() {
  const router = useRouter();

  // Checks if the user is authenticated, if not, redirects to the signin page
  const { status, data } = useSession({
    required: true,
    onUnauthenticated() {
      void router.push("/api/auth/signin");
    },
  });

  // If the session is loading, we display a loading message
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div>Dashboard Page</div>
      <pre>{JSON.stringify(data?.user, null, 2)}</pre>
    </>
  );
}
