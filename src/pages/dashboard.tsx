import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import TextField from "~/components/TextField";

export default function Dashboard() {
  const router = useRouter();

  // Checks if the user is authenticated, if not, redirects to the signin page
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      void router.push("/api/auth/signin");
    },
  });

  const [organizationJoinCode, setOrganizationJoinCode] = useState("");

  // If the session is loading, we display a loading message
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="flex w-full flex-grow flex-col gap-4">
        <div className="flex flex-col gap-4 border-b border-gray-300 pb-4 sm:flex-row sm:items-center">
          <TextField
            input={organizationJoinCode}
            setInput={setOrganizationJoinCode}
            label="Enter your organization's join code..."
          />
          <button className="whitespace-nowrap rounded-md bg-summit-700 px-4 py-2 text-center font-medium text-white hover:bg-summit-700/95">
            Join Organization
          </button>
        </div>
        <div className="flex flex-col border-b border-gray-300 pb-4">
          <h3 className="text-xl font-semibold text-summit-700">
            Recent Activity & Announcements
          </h3>
        </div>
        <div className="flex flex-col border-b border-gray-300 pb-4">
          <h3 className="text-xl font-semibold text-summit-700">
            Upcoming Events
          </h3>
        </div>
      </div>
    </>
  );
}
