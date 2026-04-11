import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Routes are defined in src/routes/
// Features are implemented in src/features/
// See docs/council_tax_call_coach_screen_by_screen_ux_specification_v_0.md for screen contracts

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Scenario selection / home */}
        <Route path="/" element={<div>Scenarios — TODO</div>} />
        <Route path="/scenarios" element={<div>Scenario List — TODO</div>} />

        {/* Call session routes */}
        <Route path="/session/:sessionId/intake" element={<div>Call Intake — TODO</div>} />
        <Route path="/session/:sessionId/live" element={<div>Live Guidance — TODO</div>} />
        <Route path="/session/:sessionId/escalation" element={<div>Escalation — TODO</div>} />
        <Route path="/session/:sessionId/wrap-up" element={<div>Wrap-Up — TODO</div>} />

        {/* QA and admin */}
        <Route path="/qa" element={<div>QA Review Queue — TODO</div>} />
        <Route path="/qa/:sessionId" element={<div>QA Review Detail — TODO</div>} />
        <Route path="/admin" element={<div>Admin / Config — TODO</div>} />
      </Routes>
    </BrowserRouter>
  );
}
