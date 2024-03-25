import {
  AddressBook,
  AddressBookFilled,
  CalendarDays,
  CalendarDaysFilled,
  CalendarSparkle,
  CalendarSparkleFilled,
  Dashboard,
  DashboardFilled,
  FileContent,
  FileContentFilled,
  House,
  HouseFilled,
  Magnfier,
  MagnifierFilled,
  Megaphone,
  MegaphoneFilled,
} from "~/svgs";

export interface navigationLink {
  title: string; // The title of the link
  link: string; // The link to the page
  icon: React.ReactNode; // The icon to display when the link is not active
  filledIcon: React.ReactNode; // The icon to display when the link is active
  organizational: boolean; // Whether or not the link is dependent on an organization
}

/**
 * The configuration for the navigation links in the sidebar.
 */
const navigationConfig: navigationLink[] = [
  {
    title: "Dashboard",
    link: "dashboard",
    icon: <Dashboard className="h-4 w-4 text-inherit" />,
    filledIcon: <DashboardFilled className="h-4 w-4 text-inherit" />,
    organizational: false,
  },
  {
    title: "Explore",
    link: "explore",
    icon: <Magnfier className="h-4 w-4 text-inherit" />,
    filledIcon: <MagnifierFilled className="h-4 w-4 text-inherit" />,
    organizational: false,
  },
  {
    title: "Calendar",
    link: "calendar",
    icon: <CalendarSparkle className="h-4 w-4 text-inherit" />,
    filledIcon: <CalendarSparkleFilled className="h-4 w-4 text-inherit" />,
    organizational: false,
  },
  {
    title: "Home",
    link: "home",
    icon: <House className="h-4 w-4 text-inherit" />,
    filledIcon: <HouseFilled className="h-4 w-4 text-inherit" />,
    organizational: true,
  },
  {
    title: "Announcements",
    link: "announcements",
    icon: <Megaphone className="h-4 w-4 text-inherit" />,
    filledIcon: <MegaphoneFilled className="h-4 w-4 text-inherit" />,
    organizational: true,
  },
  {
    title: "Directory",
    link: "directory",
    icon: <AddressBook className="h-4 w-4 text-inherit" />,
    filledIcon: <AddressBookFilled className="h-4 w-4 text-inherit" />,
    organizational: true,
  },
  {
    title: "Events",
    link: "events",
    icon: <CalendarDays className="h-4 w-4 text-inherit" />,
    filledIcon: <CalendarDaysFilled className="h-4 w-4 text-inherit" />,
    organizational: true,
  },
  {
    title: "Forms",
    link: "forms",
    icon: <FileContent className="h-4 w-4 text-inherit" />,
    filledIcon: <FileContentFilled className="h-4 w-4 text-inherit" />,
    organizational: true,
  },
];

export default navigationConfig;
