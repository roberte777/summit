import { useRouter } from "next/router";
import { useState, type ReactNode, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useLocalStorage } from "usehooks-ts";
import { api } from "~/utils/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../shadcn/ui/dialog";
import { OnboardingForm } from "../forms/OnboardingForm";
import WebTopNav from "./WebTopNav";
import MobileTopNav from "./MobileTopNav";
import WebSideNav from "./WebSideNav";
import MobileSheetNav from "./MobileSheetNav";

//non layout pages
const nonLayoutPages = ["/", "/signin"];

export default function LayoutProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { data, status } = useSession();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [onboarded, setOnboarded] = useLocalStorage<boolean>(
    "onboarded",
    false,
  );
  const [onboardDialogOpen, setOnboardDialogOpen] = useState(false);
  const userOnboarded = api.user.getUserOnboarding.useQuery(
    {
      id: data?.user?.id ?? "",
    },
    { enabled: onboarded === false && !!data?.user?.id },
  );
  const userOrganizations = api.user.getUserOrganizationsForCombos.useQuery({
    id: data?.user?.id ?? "",
  });

  const [selectedOrganizationId, setSelectedOrganizationId] =
    useState<string>("");

  useEffect(() => {
    if (status === "authenticated" && !onboarded) {
      if (userOnboarded.data) {
        setOnboarded(userOnboarded.data.onboarded);
      }
    }
  }, [onboarded, setOnboarded, status, userOnboarded.data]);

  useEffect(() => {
    if (!onboarded) {
      setOnboardDialogOpen(true);
    } else {
      setOnboardDialogOpen(false);
    }
  }, [onboarded]);

  useEffect(() => {
    if (router.pathname.includes("/organization/")) {
      if (router.pathname === "/organization/create") {
        return setSelectedOrganizationId("");
      }
      const organizationId = router.asPath.split("/")[2];
      setSelectedOrganizationId(organizationId ?? "");
    } else {
      setSelectedOrganizationId("");
    }
  }, [router.asPath, router.pathname]);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [selectedOrganizationId]);

  // if route is not in nonLayoutPages return children, else return layout
  if (nonLayoutPages.includes(router.pathname)) {
    return <>{children}</>;
  }

  return (
    <>
      <div className="flex h-full w-full flex-col">
        <WebTopNav
          selectedOrganizationId={selectedOrganizationId}
          setSelectedOrganizationId={setSelectedOrganizationId}
          organizations={
            userOrganizations.data?.organizations.map(
              (org) => org.organization,
            ) ?? []
          }
        />
        <MobileTopNav
          mobileNavOpen={mobileNavOpen}
          setMobileNavOpen={setMobileNavOpen}
        />
        <div className="h-px w-screen bg-gray-200" />
        <div className="flex sm:h-[calc(100vh-5rem-1px)]">
          <div className="mx-auto flex min-w-0 max-w-7xl grow flex-col sm:flex-row sm:py-6">
            <WebSideNav selectedOrganizationId={selectedOrganizationId} />
            <div className="flex w-screen grow flex-col overflow-y-auto px-4 sm:w-full sm:p-6">
              {children}
            </div>
          </div>
        </div>
      </div>
      <MobileSheetNav
        mobileNavOpen={mobileNavOpen}
        setMobileNavOpen={setMobileNavOpen}
        selectedOrganizationId={selectedOrganizationId}
        setSelectedOrganizationId={setSelectedOrganizationId}
        organizations={
          userOrganizations.data?.organizations.map(
            (org) => org.organization,
          ) ?? []
        }
      />
      <Dialog open={onboardDialogOpen}>
        <DialogContent
          hideCloseButton
          className="max-h-screen overflow-auto py-16 sm:max-h-[90vh] sm:py-8"
        >
          <DialogHeader>
            <DialogTitle>Welcome to Summit!</DialogTitle>
            <DialogDescription>
              Please take a moment to fill out your profile.
            </DialogDescription>
          </DialogHeader>
          <div>
            <OnboardingForm
              userId={data?.user.id ?? ""}
              setOnboarded={setOnboarded}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
