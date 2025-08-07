import CartDrawer from "@/components/ui/Drawer";
import Navbar from "@/components/ui/Navbar";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <>
      <Navbar />
      <CartDrawer />
      <Outlet />
    </>
  );
};

export default AppLayout;
