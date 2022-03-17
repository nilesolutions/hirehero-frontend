import {
  mdiAvTimer,
  mdiBriefcaseOutline,
  mdiCogOutline,
  mdiMessageOutline,
  mdiVideoOutline,
} from "@mdi/js";

export default [
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
