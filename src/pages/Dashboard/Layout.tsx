import { useGetDashboardProductsQuery } from "@/app/services/apiSlice";
import SidebarWithHeader from "@/components/ui/SidebarWithHeader";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  const { data } = useGetDashboardProductsQuery({});
  console.log(data);
  return (
    <>
      <SidebarWithHeader>
        <Outlet />
      </SidebarWithHeader>
    </>
  );
};

export default DashboardLayout;
