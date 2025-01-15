import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import StoreManagerLanding from "./pages/StoreManagerLanding";
import ProcurementStaffLanding from "./pages/ProcurementStaffLanding";
import WarehouseManagerLanding from "./pages/WarehouseManagerLanding";
import SalesStaffLanding from "./pages/SalesStaffLanding";
import HRTeamLanding from "./pages/HRTeamLanding";
import FinanceTeamLanding from "./pages/FinanceTeamLanding";
import ExecutiveLanding from "./pages/ExecutiveLanding";
import EmployeeSchedule from "./components/EmployeeSchedule";
import PayrollPage from "./pages/PayrollPage";
import CreatePurchaseOrder from "./pages/CreatePurchaseOrders"; 
import ViewSuppliers from "./pages/ViewSuppliers";
import TrackDeliverySchedules from "./pages/TrackDeliverySchedules";
import { TrackSales } from "./components/TrackSales";
import { AnalyseSales } from "./components/AnalyseSales";
import ManagingEmployees, {
ManageEmployee,
} from "./components/ManagingEmployees";
import ManageSchedule from "./components/ManageSchedule";
import Inventory from "./pages/Inventory";
import PurchaseOrder from "./pages/PurchaseOrder";
import TrackExpenses from "./pages/TrackExpenses";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/store-manager" element={<StoreManagerLanding />} />
        <Route
          path="/procurement-manager"
          element={<ProcurementStaffLanding />}
        />
        <Route
          path="/warehouse-manager"
          element={<WarehouseManagerLanding />}
        />
        <Route path="/warehouse-manager/track-inventory" element={<Inventory />} />
        <Route path="/warehouse-manager/receive-purchase-orders" element={<PurchaseOrder />} />
        <Route path="/warehouse-manager/place-purchase-orders" element={<CreatePurchaseOrder />} />
        <Route path="/sales-manager" element={<SalesStaffLanding />} />
        <Route path="/hr-manager" element={<HRTeamLanding />} />
        <Route path="/finance-manager" element={<FinanceTeamLanding />} />
        <Route path="/finance-manager/track-expenses" element={<TrackExpenses />} />
        <Route path="/executive" element={<ExecutiveLanding />} />
        <Route path="/store-manager/managing-employees" element={<ManageEmployee />} />
        <Route path="/schedule/:employeeId" element={<ManageSchedule />} />
        <Route path="/store-manager/schedule" element={<EmployeeSchedule />} />
        <Route path="/store-manager/track-inventory" element={<Inventory />} />
        <Route path="/hr-team/payrolls" element={<PayrollPage />} />
        <Route path="/hr-team/managing-employees" element={<ManageEmployee />} />
        <Route path="/procurement-manager/track-inventory" element={<Inventory />} />
        <Route
          path="/procurement-staff/view-suppliers"
          element={<ViewSuppliers />}
        />
        <Route path="/procurement-manager/track-purchase-orders" element={<PurchaseOrder />} />
        <Route path="/sales-staff/track-sales" element={<TrackSales />} />
        <Route path="/sales-staff/analyse-sales" element={<AnalyseSales />} />
      </Routes>
    </Router>
  );
}

export default App;
