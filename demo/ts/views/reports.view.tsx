import { useState } from 'react';
import { DataStore, Grid, GridColumn } from 'rosie-ui';
import { Campaign, CAMPAIGNS, CAMPAIGN_STATUS } from '../data/campaigns';

const STATUS_BADGE_CLASS: Record<string, string> = {
  [CAMPAIGN_STATUS.live]: 'text-bg-success',
  [CAMPAIGN_STATUS.paused]: 'text-bg-warning',
  [CAMPAIGN_STATUS.ended]: 'text-bg-secondary',
};

function createCampaignStore() {
  const store = new DataStore<Campaign>();
  store.loadData(CAMPAIGNS);
  return store;
}

export function ReportsView() {
  const [store] = useState(createCampaignStore);

  return <Grid store={store} className="demo-grid"
               empty={{ title: 'No campaigns', desc: 'Adjust the date range or filters.' }}>
    <GridColumn field="campaign" header="Campaign" flex />
    <GridColumn field="channel" header="Channel" />
    <GridColumn field="installs" header="Installs" format="integer" alignClass="text-end" />
    <GridColumn field="cost" header="Cost (USD)" format="integer" alignClass="text-end" />
    <GridColumn field="revenue" header="Revenue (USD)" format="integer" alignClass="text-end" />
    <GridColumn field="roas" header="ROAS" format="decimal" alignClass="text-end"
                headerTooltip="Revenue divided by cost" />
    <GridColumn field="ctr" header="CTR" format="percent" alignClass="text-end" />
    <GridColumn field="status" header="Status" width={110}
                renderer={value => <span className={`badge ${STATUS_BADGE_CLASS[value]}`}>{value}</span>} />
  </Grid>
}
