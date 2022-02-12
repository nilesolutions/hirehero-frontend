import { mdiBriefcaseOutline, mdiCogOutline, mdiMessageOutline, mdiVideoOutline } from "@mdi/js";

export default [
  {
    subheader: "Workspace",
  },
  {
    title: "Projects",
    icon: mdiBriefcaseOutline,
    to: "projects",
  },
  {
    title: "Training Videos",
    icon: mdiVideoOutline,
    to: "videos",
  },
  {
    subheader: "Personal",
  },
  {
    title: "Inbox",
    icon: mdiMessageOutline,
    to: "home",
  },
  {
    title: "Settings",
    icon: mdiCogOutline,
    to: "home",
  },
];
