import { useState } from 'react';
import { ConfirmDialog, DataStore, DatePicker, DatePointValue, DateRangePicker, DateRangeValue, DEFAULT_DATE_RANGE, Dialog, Dropdown, DropdownOption, dropdownHeader } from 'rosie-ui';
import { CAMPAIGNS } from '../data/campaigns';

const TIMEZONES: DropdownOption[] = [
  { name: 'UTC', value: 'utc' },
  { name: 'Asia/Ho_Chi_Minh', value: 'ict' },
  { name: 'Europe/London', value: 'gmt' },
  { name: 'America/New_York', value: 'est' },
];

const CHANNELS = [
  dropdownHeader('Paid'),
  { name: 'Paid Search', value: 'paid-search' },
  { name: 'Paid Social', value: 'paid-social' },
  { name: 'Display', value: 'display' },
  { name: 'Video', value: 'video' },
  dropdownHeader('Owned'),
  { name: 'App Store', value: 'app-store' },
  { name: 'Referral', value: 'referral' },
  { name: 'CRM', value: 'crm' },
];

function createCampaignStore() {
  const store = new DataStore<DropdownOption>();
  store.loadData(CAMPAIGNS.map(campaign => ({ name: campaign.campaign, value: campaign.campaign })));
  return store;
}

export function SettingsView() {
  const [timezone, setTimezone] = useState<DropdownOption[]>([TIMEZONES[1]]),
        [channels, setChannels] = useState<DropdownOption[]>([]),
        [campaigns, setCampaigns] = useState<DropdownOption[]>([]),
        [campaignStore] = useState(createCampaignStore),
        [reportDate, setReportDate] = useState<DatePointValue>({ mode: 'rolling', daysAgo: 1, date: '' }),
        [reportRange, setReportRange] = useState<DateRangeValue | null>(DEFAULT_DATE_RANGE),
        [editingProfile, setEditingProfile] = useState(false),
        [confirmingReset, setConfirmingReset] = useState(false);

  return <div className="demo-settings">
    <div className="form-label">Timezone</div>
    <Dropdown options={TIMEZONES} value={timezone} onChange={setTimezone} />

    <div className="form-label">Channels</div>
    <Dropdown options={CHANNELS} value={channels} onChange={setChannels} multiple searchable
              placeholder="All channels" />

    <div className="form-label">Campaigns <small className="text-muted">(from a store)</small></div>
    <Dropdown store={campaignStore} value={campaigns} onChange={setCampaigns} multiple searchable
              placeholder="All campaigns" />

    <div className="form-label">Report date</div>
    <DatePicker value={reportDate} onChange={setReportDate} />

    <div className="form-label">Date range</div>
    <DateRangePicker value={reportRange} onChange={setReportRange} />

    <div className="form-label">Locked</div>
    <Dropdown options={TIMEZONES} value={[TIMEZONES[0]]} disabled />

    <div className="demo-settings-actions">
      <button type="button" className="btn btn-primary btn-sm" onClick={() => setEditingProfile(true)}>Edit profile</button>
      <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => setConfirmingReset(true)}>Reset settings</button>
    </div>

    {editingProfile && <Dialog title="Edit profile" onClose={() => setEditingProfile(false)}>
      <div className="modal-body">
        <div className="form-label">Display name</div>
        <input type="text" name="displayName" className="form-control" defaultValue="Rosie Console" />
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-outline-secondary" onClick={() => setEditingProfile(false)}>Cancel</button>
        <button type="button" className="btn btn-primary" onClick={() => setEditingProfile(false)}>Save</button>
      </div>
    </Dialog>}

    {confirmingReset && <ConfirmDialog title="Reset settings"
                                       message="Every preference on this screen returns to its default. This cannot be undone."
                                       confirmLabel="Reset" variant="danger"
                                       onConfirm={() => setConfirmingReset(false)}
                                       onClose={() => setConfirmingReset(false)} />}
  </div>
}
