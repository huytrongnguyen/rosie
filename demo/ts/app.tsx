import { createRoot } from 'react-dom/client';
import { Navigate, Route, Routes } from 'rosie-ui';
import { AppLayout } from './components/app-layout.component';
import { OverviewView } from './views/overview.view';
import { ReportsView } from './views/reports.view';
import { CohortView } from './views/cohort.view';
import { SettingsView } from './views/settings.view';

function App() {
  return <Routes>
    <Route path="/" element={<AppLayout />}>
      <Route index element={<OverviewView />} />
      <Route path="reports" element={<ReportsView />} />
      <Route path="cohort" element={<CohortView />} />
      <Route path="settings" element={<SettingsView />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Route>
  </Routes>
}

createRoot(document.getElementById('root')!).render(<App />);
