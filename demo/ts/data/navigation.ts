export type NavEntry = { path: string, label: string, icon: string, title: string };

export const NAVIGATION: NavEntry[] = [
  { path: '/', label: 'Overview', icon: 'chart-line', title: 'Overview' },
  { path: '/reports', label: 'Reports', icon: 'table', title: 'Reports' },
  { path: '/cohort', label: 'Cohort', icon: 'chart-area', title: 'Cohort retention' },
  { path: '/settings', label: 'Settings', icon: 'gear', title: 'Settings' },
];
