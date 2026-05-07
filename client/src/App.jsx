import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AuditPage from "./pages/AuditPage";
import ResultsPage from "./pages/ResultsPage";
import SharedResultPage from "./pages/SharedResultPage";
import "./index.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/audit" element={<AuditPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/r/:auditId" element={<SharedResultPage />} />
      </Routes>
    </BrowserRouter>
  );
}
