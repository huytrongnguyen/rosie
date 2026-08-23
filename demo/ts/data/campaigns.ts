export type Campaign = {
  campaign: string,
  channel: string,
  installs: number,
  cost: number,
  revenue: number | null,
  roas: number | null,
  ctr: number,
  status: string,
}

export const CAMPAIGN_STATUS = { live: 'live', paused: 'paused', ended: 'ended' };

export const CAMPAIGNS: Campaign[] = [
  { campaign: 'Spring Launch — Global', channel: 'Paid Search', installs: 48210, cost: 32400, revenue: 71800, roas: 2.216, ctr: 0.0342, status: CAMPAIGN_STATUS.live },
  { campaign: 'Spring Launch — SEA', channel: 'Paid Social', installs: 31870, cost: 21950, revenue: 40120, roas: 1.828, ctr: 0.0291, status: CAMPAIGN_STATUS.live },
  { campaign: 'Retargeting — Abandoned Cart', channel: 'Paid Social', installs: 12440, cost: 8600, revenue: 29350, roas: 3.413, ctr: 0.0517, status: CAMPAIGN_STATUS.live },
  { campaign: 'Influencer — Tier 1', channel: 'Influencer', installs: 9820, cost: 15000, revenue: 12400, roas: 0.827, ctr: 0.0188, status: CAMPAIGN_STATUS.paused },
  { campaign: 'Brand Awareness Q2', channel: 'Display', installs: 27600, cost: 19800, revenue: 15900, roas: 0.803, ctr: 0.0104, status: CAMPAIGN_STATUS.live },
  { campaign: 'App Store Featured', channel: 'Owned', installs: 54300, cost: 0, revenue: 61200, roas: null, ctr: 0.0876, status: CAMPAIGN_STATUS.live },
  { campaign: 'Referral Programme', channel: 'Owned', installs: 18730, cost: 4200, revenue: 22800, roas: 5.429, ctr: 0.0623, status: CAMPAIGN_STATUS.live },
  { campaign: 'Winter Clearance', channel: 'Paid Search', installs: 21050, cost: 17300, revenue: 18100, roas: 1.046, ctr: 0.0255, status: CAMPAIGN_STATUS.ended },
  { campaign: 'Lookalike — High LTV', channel: 'Paid Social', installs: 15980, cost: 12750, revenue: 34600, roas: 2.714, ctr: 0.0388, status: CAMPAIGN_STATUS.live },
  { campaign: 'Video Prospecting', channel: 'Video', installs: 38420, cost: 28900, revenue: 31500, roas: 1.09, ctr: 0.0212, status: CAMPAIGN_STATUS.live },
  { campaign: 'Podcast Sponsorship', channel: 'Audio', installs: 6210, cost: 9400, revenue: 7100, roas: 0.755, ctr: 0.0097, status: CAMPAIGN_STATUS.paused },
  { campaign: 'Partner Bundle — Telco', channel: 'Partnership', installs: 42900, cost: 11200, revenue: 58700, roas: 5.241, ctr: 0.0709, status: CAMPAIGN_STATUS.live },
  { campaign: 'Search Brand Defence', channel: 'Paid Search', installs: 8340, cost: 3100, revenue: 14200, roas: 4.581, ctr: 0.1134, status: CAMPAIGN_STATUS.live },
  { campaign: 'Holiday Teaser', channel: 'Display', installs: 13760, cost: 10400, revenue: 9800, roas: 0.942, ctr: 0.0143, status: CAMPAIGN_STATUS.ended },
  { campaign: 'Creator Collab — Beta', channel: 'Influencer', installs: 4980, cost: 6800, revenue: null, roas: null, ctr: 0.0166, status: CAMPAIGN_STATUS.paused },
  { campaign: 'Reactivation — 90 day', channel: 'CRM', installs: 11250, cost: 1900, revenue: 19600, roas: 10.316, ctr: 0.0834, status: CAMPAIGN_STATUS.live },
  { campaign: 'Playable Ads Test', channel: 'Paid Social', installs: 17840, cost: 14600, revenue: 21300, roas: 1.459, ctr: 0.0301, status: CAMPAIGN_STATUS.live },
  { campaign: 'Regional Push — LATAM', channel: 'Paid Search', installs: 25610, cost: 16700, revenue: 23400, roas: 1.401, ctr: 0.0227, status: CAMPAIGN_STATUS.live },
  { campaign: 'Regional Push — EMEA', channel: 'Paid Search', installs: 29380, cost: 22100, revenue: 35900, roas: 1.624, ctr: 0.0269, status: CAMPAIGN_STATUS.live },
  { campaign: 'Cross-promotion — Portfolio', channel: 'Owned', installs: 33470, cost: 0, revenue: 27600, roas: null, ctr: 0.0552, status: CAMPAIGN_STATUS.live },
  { campaign: 'Affiliate Network', channel: 'Partnership', installs: 19240, cost: 13800, revenue: 26100, roas: 1.891, ctr: 0.0318, status: CAMPAIGN_STATUS.live },
  { campaign: 'Newsletter Takeover', channel: 'CRM', installs: 3120, cost: 800, revenue: 4900, roas: 6.125, ctr: 0.0741, status: CAMPAIGN_STATUS.ended },
  { campaign: 'Store Listing Optimisation', channel: 'Owned', installs: 7650, cost: 2400, revenue: 8300, roas: 3.458, ctr: 0.0495, status: CAMPAIGN_STATUS.live },
  { campaign: 'UGC Creative Refresh', channel: 'Paid Social', installs: 22890, cost: 18300, revenue: 30700, roas: 1.678, ctr: 0.0356, status: CAMPAIGN_STATUS.live },
];
