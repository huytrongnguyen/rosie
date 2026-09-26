export type DailyMetric = {
  date: string,
  paidSearchInstalls: number,
  paidSocialInstalls: number,
  ownedInstalls: number,
  influencerInstalls: number,
  partnershipInstalls: number,
  paidSearchRevenue: number,
  paidSocialRevenue: number,
  ownedRevenue: number,
  influencerRevenue: number,
  partnershipRevenue: number,
  totalInstalls: number,
  totalRevenue: number,
  retention: number,
}

const RAW_DAILY = [
  { date: '2026-08-01', paidSearchInstalls: 1620, paidSocialInstalls: 980, ownedInstalls: 640, paidSearchRevenue: 2380, paidSocialRevenue: 1240, ownedRevenue: 1080, retention: 0.42 },
  { date: '2026-08-02', paidSearchInstalls: 1580, paidSocialInstalls: 1020, ownedInstalls: 610, paidSearchRevenue: 2290, paidSocialRevenue: 1310, ownedRevenue: 1020, retention: 0.41 },
  { date: '2026-08-03', paidSearchInstalls: 1710, paidSocialInstalls: 1105, ownedInstalls: 690, paidSearchRevenue: 2510, paidSocialRevenue: 1420, ownedRevenue: 1160, retention: 0.43 },
  { date: '2026-08-04', paidSearchInstalls: 1690, paidSocialInstalls: 1180, ownedInstalls: 705, paidSearchRevenue: 2480, paidSocialRevenue: 1510, ownedRevenue: 1190, retention: 0.44 },
  { date: '2026-08-05', paidSearchInstalls: 1755, paidSocialInstalls: 1230, ownedInstalls: 720, paidSearchRevenue: 2600, paidSocialRevenue: 1580, ownedRevenue: 1220, retention: 0.43 },
  { date: '2026-08-06', paidSearchInstalls: 1820, paidSocialInstalls: 1290, ownedInstalls: 740, paidSearchRevenue: 2710, paidSocialRevenue: 1660, ownedRevenue: 1250, retention: 0.45 },
  { date: '2026-08-07', paidSearchInstalls: 1690, paidSocialInstalls: 1250, ownedInstalls: 715, paidSearchRevenue: 2540, paidSocialRevenue: 1600, ownedRevenue: 1210, retention: 0.44 },
  { date: '2026-08-08', paidSearchInstalls: 1880, paidSocialInstalls: 1340, ownedInstalls: 760, paidSearchRevenue: 2810, paidSocialRevenue: 1720, ownedRevenue: 1290, retention: 0.46 },
  { date: '2026-08-09', paidSearchInstalls: 1940, paidSocialInstalls: 1405, ownedInstalls: 780, paidSearchRevenue: 2900, paidSocialRevenue: 1810, ownedRevenue: 1330, retention: 0.47 },
  { date: '2026-08-10', paidSearchInstalls: 1905, paidSocialInstalls: 1380, ownedInstalls: 775, paidSearchRevenue: 2860, paidSocialRevenue: 1780, ownedRevenue: 1310, retention: 0.46 },
  { date: '2026-08-11', paidSearchInstalls: 2010, paidSocialInstalls: 1460, ownedInstalls: 810, paidSearchRevenue: 3010, paidSocialRevenue: 1890, ownedRevenue: 1380, retention: 0.48 },
  { date: '2026-08-12', paidSearchInstalls: 2080, paidSocialInstalls: 1520, ownedInstalls: 830, paidSearchRevenue: 3120, paidSocialRevenue: 1970, ownedRevenue: 1420, retention: 0.49 },
  { date: '2026-08-13', paidSearchInstalls: 1960, paidSocialInstalls: 1480, ownedInstalls: 800, paidSearchRevenue: 2960, paidSocialRevenue: 1910, ownedRevenue: 1370, retention: 0.47 },
  { date: '2026-08-14', paidSearchInstalls: 2140, paidSocialInstalls: 1580, ownedInstalls: 850, paidSearchRevenue: 3220, paidSocialRevenue: 2040, ownedRevenue: 1450, retention: 0.5 },
  { date: '2026-08-15', paidSearchInstalls: 2205, paidSocialInstalls: 1640, ownedInstalls: 870, paidSearchRevenue: 3320, paidSocialRevenue: 2120, ownedRevenue: 1490, retention: 0.51 },
  { date: '2026-08-16', paidSearchInstalls: 2160, paidSocialInstalls: 1610, ownedInstalls: 860, paidSearchRevenue: 3260, paidSocialRevenue: 2080, ownedRevenue: 1470, retention: 0.5 },
  { date: '2026-08-17', paidSearchInstalls: 2270, paidSocialInstalls: 1690, ownedInstalls: 900, paidSearchRevenue: 3430, paidSocialRevenue: 2190, ownedRevenue: 1540, retention: 0.52 },
  { date: '2026-08-18', paidSearchInstalls: 2340, paidSocialInstalls: 1750, ownedInstalls: 920, paidSearchRevenue: 3540, paidSocialRevenue: 2270, ownedRevenue: 1580, retention: 0.53 },
  { date: '2026-08-19', paidSearchInstalls: 2225, paidSocialInstalls: 1705, ownedInstalls: 895, paidSearchRevenue: 3370, paidSocialRevenue: 2210, ownedRevenue: 1530, retention: 0.51 },
  { date: '2026-08-20', paidSearchInstalls: 2410, paidSocialInstalls: 1820, ownedInstalls: 945, paidSearchRevenue: 3650, paidSocialRevenue: 2360, ownedRevenue: 1620, retention: 0.54 },
  { date: '2026-08-21', paidSearchInstalls: 2480, paidSocialInstalls: 1880, ownedInstalls: 965, paidSearchRevenue: 3760, paidSocialRevenue: 2440, ownedRevenue: 1660, retention: 0.55 },
];

// Influencer and Partnership are generated rather than hand-authored like the three channels
// above — a small deterministic wiggle keeps them from being a bare straight line without
// pretending to be real per-day noise.
function wiggle(index: number, amplitude: number) {
  return Math.round(Math.sin(index * 1.3) * amplitude);
}

export const DAILY_METRICS: DailyMetric[] = RAW_DAILY.map((day, index) => {
  const influencerInstalls = 360 + index * 6 + wiggle(index, 15),
        partnershipInstalls = 500 + index * 8 + wiggle(index, 20),
        influencerRevenue = Math.round(influencerInstalls * 0.95) + wiggle(index, 15),
        partnershipRevenue = Math.round(partnershipInstalls * 1.25) + wiggle(index, 18);

  return {
    ...day,
    influencerInstalls,
    partnershipInstalls,
    influencerRevenue,
    partnershipRevenue,
    totalInstalls: day.paidSearchInstalls + day.paidSocialInstalls + day.ownedInstalls + influencerInstalls + partnershipInstalls,
    totalRevenue: day.paidSearchRevenue + day.paidSocialRevenue + day.ownedRevenue + influencerRevenue + partnershipRevenue,
  };
});

export type ChannelSummary = {
  channel: string,
  installs: number,
  revenue: number,
}

const CHANNEL_FIELDS = [
  { channel: 'Paid Search', installsField: 'paidSearchInstalls', revenueField: 'paidSearchRevenue' },
  { channel: 'Paid Social', installsField: 'paidSocialInstalls', revenueField: 'paidSocialRevenue' },
  { channel: 'Owned', installsField: 'ownedInstalls', revenueField: 'ownedRevenue' },
  { channel: 'Influencer', installsField: 'influencerInstalls', revenueField: 'influencerRevenue' },
  { channel: 'Partnership', installsField: 'partnershipInstalls', revenueField: 'partnershipRevenue' },
] as const;

// Derived from DAILY_METRICS, not a separate fixture — every stat tile, chart and tooltip in the
// demo reads from this one dataset, so their totals can never disagree with each other.
export const CHANNEL_SUMMARY: ChannelSummary[] = CHANNEL_FIELDS.map(({ channel, installsField, revenueField }) => ({
  channel,
  installs: DAILY_METRICS.reduce((sum, day) => sum + day[installsField], 0),
  revenue: DAILY_METRICS.reduce((sum, day) => sum + day[revenueField], 0),
}));

export const CHANNEL_SERIES_STACK = 'installs';

export const CHANNEL_SERIES = CHANNEL_FIELDS.map(({ channel, installsField }) => ({
  field: installsField as string,
  title: channel as string,
}));
