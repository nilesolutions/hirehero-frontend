import {
  mdiAvTimer,
  mdiBriefcaseOutline,
  mdiCogOutline,
  mdiMessageOutline,
  mdiVideoOutline,
  mdiViewDashboardOutline,
} from '@mdi/js'

export default [
  {
    type: 'NavigationItem',
    title: 'Dashboard',
    icon: mdiViewDashboardOutline,
    to: 'dashboard',
  },
  {
    type: 'NavigationSubheader',
    subheader: 'Workspace',
  },
  {
    type: 'NavigationItem',
    title: 'Projects',
    icon: mdiBriefcaseOutline,
    to: 'projects',
  },
  {
    type: 'NavigationItem',
    title: 'Training Videos',
    icon: mdiVideoOutline,
    to: 'videos',
  },
  {
    type: 'NavigationItem',
    title: 'Activity',
    icon: mdiAvTimer,
    to: 'activity',
  },
  {
    type: 'NavigationSubheader',
    subheader: 'Personal',
  },
  {
    type: 'NavigationItem',
    title: 'Inbox',
    icon: mdiMessageOutline,
    to: 'inbox',
  },
  {
    type: 'NavigationItem',
    title: 'Settings',
    icon: mdiCogOutline,
    to: 'settings',
  },
]
