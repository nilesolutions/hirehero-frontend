import {
  mdiAvTimer,
  mdiBriefcaseOutline,
  mdiCogOutline,
  mdiCreditCardOutline,
  mdiMessageOutline,
  mdiVideoOutline,
  mdiViewDashboardOutline,
} from "@mdi/js";

export default [
  {
    type: "NavigationItem",
    title: "Dashboard",
    icon: mdiViewDashboardOutline,
    to: "dashboard",
  },
  {
    type: "NavigationSubheader",
    subheader: "Workspace",
  },
  {
    type: "NavigationItem",
    title: "Projects",
    icon: mdiBriefcaseOutline,
    to: "projects",
  },
  {
    type: "NavigationItem",
    title: "Training Videos",
    icon: mdiVideoOutline,
    to: "videos",
  },
  {
    type: "NavigationItem",
    title: "Activity",
    icon: mdiAvTimer,
    to: "activity",
  },
  {
    type: "NavigationSubheader",
    subheader: "Personal",
  },
  {
    type: "NavigationItem",
    title: "Plans",
    icon: mdiCreditCardOutline,
    to: "subscription",
  },
  {
    type: "NavigationItem",
    title: "Inbox",
    icon: mdiMessageOutline,
    to: "home",
  },
  {
    type: "NavigationItem",
    title: "Settings",
    icon: mdiCogOutline,
    to: "home",
  },
];
