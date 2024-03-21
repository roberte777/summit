import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { CreateOrganizationForm } from "~/components/forms/CreateOrganizationForm";

export default function OrganizationCreate() {
  const router = useRouter();
  // Checks if the user is authenticated, if not, redirects to the signin page
  const { data } = useSession({
    required: true,
    onUnauthenticated() {
      void router.push("/api/auth/signin");
    },
  });

  return (
    <>
      <div className="flex w-full flex-grow flex-col gap-4 rounded-md border border-gray-300 bg-white px-8 py-4">
        <h3 className="text-2xl font-semibold text-summit-700">
          Create an Organization
        </h3>
        {data?.user.id && <CreateOrganizationForm userId={data.user.id} />}
      </div>
    </>
  );
}
