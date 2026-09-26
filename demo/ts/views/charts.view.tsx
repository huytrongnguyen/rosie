import { PropsWithChildren, useState } from 'react';
import { Chart, DataStore, Rosie } from 'rosie-ui';
import { CAMPAIGNS, Campaign } from '../data/campaigns';
import { CHANNEL_SERIES, CHANNEL_SERIES_STACK, CHANNEL_SUMMARY, ChannelSummary, DAILY_METRICS, DailyMetric } from '../data/analytics';

const PREVIEW_STATE = { data: 'data', loading: 'loading', empty: 'empty' };

function createStore<T>(data: T[]) {
  const store = new DataStore<T>();
  store.loadData(data);
  return store;
}

export function ChartsView() {
  const [dailyStore] = useState(() => createStore<DailyMetric>(DAILY_METRICS)),
        [channelStore] = useState(() => createStore<ChannelSummary>(CHANNEL_SUMMARY)),
        [campaignStore] = useState(() => createStore<Campaign>(CAMPAIGNS)),
        [emptyStore] = useState(() => createStore<DailyMetric>([])),
        [previewState, setPreviewState] = useState(PREVIEW_STATE.data);

  return <div className="rosie-chart-gallery">
    <ChartCard title="Installs over time">
      <Chart store={dailyStore} xField="date" series={[{ type: 'line', field: 'totalInstalls', title: 'Installs' }]} />
    </ChartCard>

    <ChartCard title="Revenue over time">
      <Chart store={dailyStore} xField="date" series={[{ type: 'area', field: 'totalRevenue', title: 'Revenue', format: 'compact' }]} />
    </ChartCard>

    <ChartCard title="Installs by channel over time">
      <Chart store={dailyStore} xField="date"
             series={CHANNEL_SERIES.map(s => ({ type: 'area', stack: CHANNEL_SERIES_STACK, ...s }))} />
    </ChartCard>

    <ChartCard title="Installs by channel">
      <Chart store={channelStore} xField="channel" series={[{ type: 'bar', field: 'installs', title: 'Installs', format: 'compact' }]} />
    </ChartCard>

    <ChartCard title="Revenue by channel">
      <Chart store={channelStore} xField="channel" axes={[{ type: 'category', position: 'left' }]}
             series={[{ type: 'bar', field: 'revenue', title: 'Revenue', format: 'compact' }]} />
    </ChartCard>

    <ChartCard title="Installs by channel per day">
      <Chart store={dailyStore} xField="date"
             series={CHANNEL_SERIES.map(s => ({ type: 'bar', stack: CHANNEL_SERIES_STACK, ...s }))} />
    </ChartCard>

    <ChartCard title="Installs vs revenue">
      <Chart store={dailyStore} xField="date" series={[
        { type: 'bar', field: 'totalInstalls', title: 'Installs' },
        { type: 'line', field: 'totalRevenue', title: 'Revenue', format: 'compact' },
      ]} />
    </ChartCard>

    <ChartCard title="Installs share by channel">
      <Chart store={channelStore} xField="channel" legend={{ position: 'right' }}
             series={[{ type: 'pie', field: 'installs', title: 'Installs' }]} />
    </ChartCard>

    <ChartCard title="Revenue share by channel">
      <Chart store={channelStore} xField="channel" series={[{ type: 'donut', field: 'revenue', title: 'Revenue', innerRadius: 0.62 }]} />
    </ChartCard>

    <ChartCard title="Cost vs revenue by campaign">
      <Chart store={campaignStore} xField="cost" series={[{ type: 'scatter', field: 'revenue', title: 'Revenue' }]} />
    </ChartCard>

    <ChartCard title="Cost vs revenue, sized by installs">
      <Chart store={campaignStore} xField="cost" series={[{ type: 'bubble', field: 'revenue', title: 'Revenue', sizeField: 'installs' }]} />
    </ChartCard>

    <ChartCard title="Installs over time (loading / empty)">
      <div className="btn-group btn-group-sm demo-chart-preview-toggle" role="group">
        {Object.values(PREVIEW_STATE).map(value =>
          <button key={value} type="button" onClick={() => setPreviewState(value)}
                  className={Rosie.classNames('btn btn-outline-secondary', { active: previewState === value })}>
            {value}
          </button>)}
      </div>

      <Chart store={previewState === PREVIEW_STATE.empty ? emptyStore : dailyStore}
             loading={previewState === PREVIEW_STATE.loading}
             empty={{ title: 'No installs yet', desc: 'Try a different date range.' }}
             xField="date" series={[{ type: 'line', field: 'totalInstalls', title: 'Installs' }]} />
    </ChartCard>
  </div>
}

type ChartCardProps = { title: string }

function ChartCard({ title, children }: Readonly<PropsWithChildren<ChartCardProps>>) {
  return <div className="card rosie-chart-card">
    <div className="card-header">{title}</div>
    <div className="card-body">{children}</div>
  </div>
}
