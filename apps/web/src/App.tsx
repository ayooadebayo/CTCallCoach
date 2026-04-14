import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ScenarioListPage } from './features/scenarios/ScenarioListPage';
import { CallIntakePage } from './features/call-intake/CallIntakePage';
import { LiveGuidancePage } from './features/live-guidance/LiveGuidancePage';
import { WrapUpPage } from './features/wrap-up/WrapUpPage';
import { SupportReviewPage } from './features/escalation-support/SupportReviewPage';
import { AdminPage } from './features/admin-demo/AdminPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ScenarioListPage />} />
        <Route path="/scenarios" element={<Navigate to="/" replace />} />
        <Route path="/admin" element={<AdminPage />} />

        <Route path="/session/:sessionId/intake" element={<CallIntakePage />} />
        <Route path="/session/:sessionId/live" element={<LiveGuidancePage />} />
        <Route path="/session/:sessionId/support" element={<SupportReviewPage />} />
        <Route path="/session/:sessionId/wrap-up" element={<WrapUpPage />} />
      </Routes>
    </BrowserRouter>
  );
}
