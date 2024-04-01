import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import UserOrgListItem from "~/components/custom/ui/userOrgListItem";
import UserProfileDialog from "~/components/custom/ui/userProfileDialog";
import { Input } from "~/components/shadcn/ui/input";
import { type UserWithCredentials } from "~/server/api/routers/user";
import { api } from "~/utils/api";

export default function OrganizationDirectory() {
  const params = useParams<{ id: string }>();
  const session = useSession();
  const { data, isLoading } =
    api.organization.getAllUsersInOrganization.useQuery({
      organizationId: params?.id ?? "",
    });
  const checkMembership = api.organization.isMember.useQuery({
    userId: session.data?.user.id ?? "",
    organizationId: params?.id ?? "",
  });

  const [users, setUsers] = useState(data);
  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [selectedUser, setSelectedUser] =
    useState<UserWithCredentials | null>();
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (!dialogOpen && selectedUserId !== "") {
      setSelectedUserId("");
    }
    if (selectedUserId !== "" && data) {
      const user = data?.find((user) => user.userId === selectedUserId);
      setSelectedUser(user);
      setDialogOpen(true);
    }
  }, [data, selectedUserId, dialogOpen]);

  useEffect(() => {
    if (data) {
      setUsers(data);
    }
  }, [data]);

  useEffect(() => {
    if (!data) return;
    if (searchValue.length > 3) {
      const filteredData = data.filter((user) => {
        if (user.user.name?.toLowerCase().includes(searchValue.toLowerCase()))
          return true;
        if (
          user.user.credentials?.username
            .toLowerCase()
            .includes(searchValue.toLowerCase())
        )
          return true;
        if (user.user.email?.toLowerCase().includes(searchValue.toLowerCase()))
          return true;
        return false;
      });
      setUsers(filteredData);
    } else {
      setUsers(data);
    }
  }, [data, searchValue]);

  if (isLoading || !data || checkMembership.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex w-full flex-grow flex-col gap-4">
      <div className="flex flex-col justify-between gap-2 border-b border-gray-300 pb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-semibold text-summit-700">Directory</h3>
          <div className="h-0.5 w-0.5 rounded-full bg-gray-500" />
          <p className="text-sm text-gray-500">
            {data.length > 1 ? (
              <>{`${data.length} members`}</>
            ) : (
              <>{`${data.length} member`}</>
            )}
          </p>
        </div>
        <h4 className="text-sm text-gray-500">
          Search members within your organization to view their information such
          as role, contact information, and more.
        </h4>
        <Input
          className="w-full lg:w-1/2"
          placeholder="Search members by name, username, or email..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>
      <div className="flex flex-col divide-y">
        {users
          ?.sort((a, b) => a.user.name?.localeCompare(b.user.name ?? "") ?? 0)
          .map((user) => (
            <UserOrgListItem
              key={user.userId}
              id={user.userId}
              imageUrl={user.user.image ?? ""}
              title={user.user.name ?? "No name"}
              description={user.user.credentials?.username ?? "No username"}
              actionTitle="Member"
              actionDescription={user.user.email ?? "No email"}
              setClickedId={setSelectedUserId}
            />
          ))}
        {users?.length === 0 && (
          <div className="flex h-32 items-center justify-center">
            <p className="text-gray-500">No members found.</p>
          </div>
        )}
      </div>
      {selectedUser && (
        <UserProfileDialog
          open={dialogOpen}
          setOpen={setDialogOpen}
          user={selectedUser.user}
        />
      )}
    </div>
  );
}
