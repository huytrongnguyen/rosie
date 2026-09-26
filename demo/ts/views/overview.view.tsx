import { useState } from 'react';
import { Chart, DataStore } from 'rosie-ui';
import { CAMPAIGNS, CAMPAIGN_STATUS } from '../data/campaigns';
import { CHANNEL_SERIES, CHANNEL_SERIES_STACK, DAILY_METRICS, DailyMetric } from '../data/analytics';

function createTrendStore() {
  const store = new DataStore<DailyMetric>();
  store.loadData(DAILY_METRICS);
  return store;
}

export function OverviewView() {
  const [store] = useState(createTrendStore);

  const totalInstalls = DAILY_METRICS.reduce((sum, day) => sum + day.totalInstalls, 0),
        totalRevenue = DAILY_METRICS.reduce((sum, day) => sum + day.totalRevenue, 0),
        avgRetention = DAILY_METRICS.reduce((sum, day) => sum + day.retention, 0) / DAILY_METRICS.length,
        activeCampaigns = CAMPAIGNS.filter(campaign => campaign.status === CAMPAIGN_STATUS.live).length;

  return <div className="demo-overview">
    <div className="rosie-widget-grid">
      <StatTile label="Total installs" value={totalInstalls.format()} />
      <StatTile label="Total revenue" value={`$${totalRevenue.format()}`} />
      <StatTile label="Avg. day-1 retention" value={`${(avgRetention * 100).format(0)}%`} />
      <StatTile label="Active campaigns" value={String(activeCampaigns)} />
    </div>

    <div className="card demo-overview-trend">
      <div className="card-header">Installs by channel</div>
      <div className="card-body">
        <Chart store={store} xField="date"
               series={CHANNEL_SERIES.map(s => ({ type: 'area', stack: CHANNEL_SERIES_STACK, ...s }))} />
      </div>
    </div>
  </div>
}

function StatTile({ label, value }: Readonly<{ label: string, value: string }>) {
  return <div className="rosie-widget">
    <span className="rosie-widget-label">{label}</span>
    <span className="rosie-widget-value">{value}</span>
  </div>
}
