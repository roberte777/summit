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
      <div className="flex h-full w-full flex-grow flex-col gap-4 pb-16 sm:pb-0">
        <h3 className="py-4 text-2xl font-semibold text-summit-700">
          Create an Organization
        </h3>
        <div className="w-full overflow-auto">
          {data?.user.id && <CreateOrganizationForm userId={data.user.id} />}
        </div>
      </div>
    </>
  );
}
