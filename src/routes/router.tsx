import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
} from "react-router-dom";
import AppLayout from "../pages/Layout";
import HomePage from "../pages/Home";
import ProductPage from "../pages/ProductDetails";
import ErrorHandler from "@/components/errors/ErrorHandler";
import LoginPage from "@/pages/Login/Login";
import ProtectedRoute from "@/auth/ProtectedRoute";
import CookieService from "@/services/CookieService";
import LoginLayout from "@/pages/Login/Layout";
import DashboardLayout from "@/pages/Dashboard/Layout";
import DashboardPage from "@/pages/Dashboard/Dashboard";
import DashboardSettingsPage from "@/pages/Dashboard/DashboardSettings";
import DashboardCategoriesPage from "@/pages/Dashboard/DashboardCategories";
import DashboardProductsPage from "@/pages/Dashboard/DashboardProducts";

const getUser = CookieService.get("jwt");
const userData = getUser ? getUser : null;

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<AppLayout />} errorElement={<ErrorHandler />}>
        <Route index element={<HomePage />} />
        <Route path="products/:documentId" element={<ProductPage />} />
      </Route>

      <Route path="/login" element={<LoginLayout />}>
        <Route
          index
          element={
            <ProtectedRoute goto="/" isAllowed={!userData}>
              <LoginPage />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="products" element={<DashboardProductsPage />} />
        <Route path="settings" element={<DashboardSettingsPage />} />
        <Route path="categories" element={<DashboardCategoriesPage />} />
      </Route>
    </>,
  ),
);
export default router;
