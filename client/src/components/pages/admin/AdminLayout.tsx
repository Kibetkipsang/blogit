import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSideBar";
import { Outlet } from "react-router-dom";

function AdminLayout() {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1">
        <AdminHeader />
        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
