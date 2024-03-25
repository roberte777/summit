import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useState } from "react";
import UserOrgListItem from "~/components/custom/ui/userOrgListItem";
import { Button } from "~/components/shadcn/ui/button";
import { Input } from "~/components/shadcn/ui/input";
import { Magnfier } from "~/svgs";
import { api } from "~/utils/api";

export default function Explore() {
  const router = useRouter();
  const routerSearchParams = useSearchParams();
  const searchParams = routerSearchParams.get("search") ?? "";
  const [inputValue, setInputValue] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const organizationSearchData = api.organization.exploreOrganizations.useQuery(
    {
      searchQuery: searchQuery,
    },
  );

  const userSearchData = api.user.exploreUsers.useQuery({
    searchQuery: searchQuery,
  });

  if (searchParams !== searchQuery) {
    setSearchQuery(searchParams);
  }

  return (
    <>
      <div className="flex w-full flex-grow flex-col gap-4">
        <div className="flex items-center justify-between gap-4 border-b border-gray-300 pb-4">
          <h3 className="text-xl font-semibold text-summit-700">Explore</h3>
          <div className="flex items-center gap-2">
            <div className="relative h-10 w-full min-w-[450px]">
              <Magnfier className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                className="pl-10"
                placeholder="Search by name, username, or organization join code..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={
                  organizationSearchData.isLoading || userSearchData.isLoading
                }
              />
            </div>
            <Button
              className="bg-summit-700 text-white hover:bg-summit-700/95"
              onClick={() => {
                setSearchQuery(inputValue);
                setInputValue("");
                void router.push(
                  {
                    pathname: "/explore",
                    query: { search: inputValue },
                  },
                  undefined,
                  { shallow: true },
                );
              }}
            >
              {organizationSearchData.isLoading || userSearchData.isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                "Search"
              )}
            </Button>
          </div>
        </div>
        <div className="flex flex-col divide-y">
          {organizationSearchData.data?.map((org) => (
            <UserOrgListItem
              key={org.id}
              title={org.name}
              description={`@${org.username}`}
              imageUrl={org.logoUrl}
              squareImage
              linkUrl={`/organization/${org.id}/home`}
              actionTitle={
                org.private ? "Private Organization" : "Public Organization"
              }
              actionDescription={""}
            />
          ))}
          {userSearchData.data?.map((user) => (
            <UserOrgListItem
              key={user.id}
              title={user.name ?? "No Name"}
              description={`@${user.credentials?.username}`}
              imageUrl={user.image ?? ""}
              linkUrl={`/user/${user.credentials?.username}`}
              actionTitle={user.academicMajor ?? "No Major"}
              actionDescription={user.academicUniversity ?? "No University"}
            />
          ))}
        </div>
      </div>
    </>
  );
}
