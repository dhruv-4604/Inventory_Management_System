// App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { Box, CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import TopBar from "./Components/navigation/TopBar.jsx";
import Sidebar from "./Components/navigation/SideBar.jsx";
import Dashboard from "./Components/dashboard/Dashboard.js";
import ItemPage from "./Components/inventory/ItemPage.js";
import SignInPage from "./Components/login/SignInPage.jsx";
import SignUpPage from "./Components/login/SignUpPage.jsx";
import "./fonts.css";
import InvoiceGenerator from "./Components/sales/InvoiceGenerator.jsx";
import CustomerPage from "./Components/sales/CustomerPage.jsx";
import SalesOrderPage from "./Components/sales/SaleOrdersPage.jsx";
import ShipmentsPage from "./Components/sales/ShipmentsPage.jsx";
import CategoriesPage from "./Components/inventory/CategoriesPage.jsx";
import PriceListPage from "./Components/inventory/PriceList.jsx";
import PurchaseOrdersPage from "./Components/purchase/PurchaseOrdersPage.jsx";
import VendorsPage from "./Components/purchase/VendorsPage.jsx";

const theme = createTheme({
  typography: {
    fontFamily: [
      "ClashGrotesk-Medium",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Arial",
      "sans-serif",
    ].join(","),
    h6: {
      fontWeight: 600,
    },
    button: {
      textTransform: "none",
    },
  },
});

const DRAWER_WIDTH = 260;

function MainContent() {
  const location = useLocation();

  const getTitle = () => {
    if (location.pathname.includes("/inventory/items")) return "Items";
    if (location.pathname.includes("/inventory/categories"))
      return "Categories";
    if (location.pathname.includes("/inventory/price_list"))
      return "Price List";
    if (location.pathname.includes("/sales/customerpage")) return "Customers";
    if (location.pathname.includes("/sales/sale_orders")) return "Sale Orders";
    if (location.pathname.includes("/sales/shipments")) return "Shipments";
    if (location.pathname.includes("/sales")) return "Sales";
    if (location.pathname.includes("/dashboard")) return "Dashboard";
    // Add more conditions for other routes
    return "SupplySync";
  };

  return (
    <>
      <TopBar title={getTitle()} />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          mt: "64px", // Adjust this value based on your TopBar height
        }}
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/inventory/items" element={<ItemPage />} />
          <Route path="/inventory/categories" element={<CategoriesPage />} />
          <Route path="/inventory/price_list" element={<PriceListPage />} />
          <Route path="/sales/customerpage" element={<CustomerPage />} />
          <Route path="/sales/sale_orders" element={<SalesOrderPage />} />
          <Route path="/sales/shipments" element={<ShipmentsPage />} />
          <Route
            path="purchases/purchase_orders"
            element={<PurchaseOrdersPage />}
          />
          <Route path="purchases/vendors" element={<VendorsPage />} />
        </Routes>
      </Box>
    </>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          <Routes>
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="*" element={<MainContent />} />
          </Routes>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
