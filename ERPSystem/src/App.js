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
import CreateOrder from "./pages/CreateOrders"; 
import ViewSuppliers from "./pages/ViewSuppliers";
import TrackDeliverySchedules from "./pages/TrackDeliverySchedules";
import { TrackSales } from "./components/Sales/TrackSales";
import { AnalyseSales } from "./components/Sales/AnalyseSales";
import ManagingEmployees, {
ManageEmployee,
} from "./components/ManagingEmployees";
import ManageSchedule from "./components/ManageSchedule";
import Inventory from "./pages/Inventory";
import PurchaseOrder from "./pages/PurchaseOrder";
import TrackExpenses from "./pages/TrackExpenses";
import StockTransfer from "./pages/StockTransfer";
import Products from "./components/Product/Product";
import Suppliers from "./components/Supplier/Supplier";
import AddProduct from "./components/Product/AddProduct";
import AddSupplier from "./components/Supplier/AddSupplier";
import AddSalesRecord from "./components/Sales/AddSales";

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
        <Route path="/warehouse-manager/manage-employees" element={<ManageEmployee />} />
        <Route path="/warehouse-manager/receive-purchase-orders" element={<PurchaseOrder />} />
        <Route path="/warehouse-manager/manage-stock-transfers" element={<StockTransfer />} />
        <Route path="/warehouse-manager/place-purchase-orders" element={<CreateOrder />} />
        <Route path="/sales-manager" element={<SalesStaffLanding />} />
        <Route path="/hr-manager" element={<HRTeamLanding />} />
        <Route path="/finance-manager" element={<FinanceTeamLanding />} />
        <Route path="/finance-manager/track-expenses" element={<TrackExpenses />} />
        <Route path="/executive" element={<ExecutiveLanding />} />
        <Route path="/store-manager/managing-employees" element={<ManageEmployee />} />
        <Route path="/store-manager/request-stock-transfers" element={<CreateOrder />} />
        <Route path="/store-manager/recieve-stock-transfers" element={<StockTransfer />} />
        <Route path="/store-manager/track-sales" element={<TrackSales />} />
        <Route path="/schedule/:employeeId" element={<ManageSchedule />} />
        <Route path="/store-manager/schedule" element={<EmployeeSchedule />} />
        <Route path="/store-manager/track-inventory" element={<Inventory />} />
        <Route path="/hr-team/payrolls" element={<PayrollPage />} />
        <Route path="/hr-team/managing-employees" element={<ManageEmployee />} />
        <Route path="/procurement-manager/track-inventory" element={<Inventory />} />
        <Route path="/procurement-staff/view-suppliers" element={<ViewSuppliers />} />
        <Route path="/procurement-manager/track-purchase-orders" element={<PurchaseOrder />} />
        <Route path="/procurement-manager/manage-products" element={<Products />} />
        <Route path="/procurement-manager/manage-products/add-product" element={<AddProduct />} />
        <Route path="/procurement-manager/manage-suppliers" element={<Suppliers />} />
        <Route path="/procurement-manager/manage-suppliers/add-supplier" element={<AddSupplier />} />
        <Route path="/sales-staff/track-sales" element={<TrackSales />} />
        <Route path="/sales-staff/analyse-sales" element={<AnalyseSales />} />
        <Route path="/add-sales-record" element={<AddSalesRecord />} />

      </Routes>
    </Router>
  );
}

export default App;
