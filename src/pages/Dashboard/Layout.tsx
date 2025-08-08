import SidebarWithHeader from "@/components/ui/SidebarWithHeader";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <>
      <SidebarWithHeader>
        <Outlet />
      </SidebarWithHeader>
    </>
  );
};

export default DashboardLayout;
