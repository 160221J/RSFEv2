import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layout/MainLayout";

import Dashboard from "./pages/Dashboard";
import Sales from "./pages/Sales";
import StockManagement from "./pages/StockManagement";
import Withdrawals from "./pages/Withdrawals";
import DailyProfit from "./pages/DailyProfit";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/stocks" element={<StockManagement />} />
          <Route path="/withdrawals" element={<Withdrawals />} />
          <Route path="/profit" element={<DailyProfit />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
