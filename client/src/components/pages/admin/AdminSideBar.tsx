import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  FolderTree,
  FileText,
  ArrowLeft,
  Shield,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

function AdminSidebar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    {
      path: "/admin",
      label: "Dashboard",
      icon: Home,
      description: "Overview",
    },
    {
      path: "/admin/manageUsers",
      label: "Users",
      icon: Users,
      description: "Manage users",
    },
    {
      path: "/admin/adminCategories",
      label: "Categories",
      icon: FolderTree,
      description: "Content categories",
    },
    {
      path: "/admin/manageBlogs",
      label: "Blogs",
      icon: FileText,
      description: "Manage posts",
    },
  ];

  const isActive = (path: string) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 bg-gray-900 rounded-lg text-white shadow-lg"
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`
        bg-gradient-to-b from-gray-900 to-gray-800 text-gray-200 
        w-64 lg:w-72 xl:w-80 flex-shrink-0 p-4 shadow-2xl border-r border-gray-700 
        overflow-y-auto
        fixed lg:sticky top-0 left-0 h-screen z-40
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        {/* Header - Compact */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-600 rounded-lg">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-white truncate">
                Admin Panel
              </h2>
              <p className="text-green-400 text-xs truncate">
                Content Management
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Menu - Compact */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group ${
                  active
                    ? "bg-green-600 text-white shadow-lg shadow-green-600/25"
                    : "hover:bg-gray-700 hover:text-white text-gray-300"
                }`}
              >
                <Icon
                  className={`h-4 w-4 flex-shrink-0 ${
                    active
                      ? "text-white"
                      : "text-gray-400 group-hover:text-white"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm leading-tight truncate">
                    {item.label}
                  </div>
                  <div
                    className={`text-xs transition-all truncate ${
                      active
                        ? "text-green-100"
                        : "text-gray-500 group-hover:text-gray-300"
                    }`}
                  >
                    {item.description}
                  </div>
                </div>
                {active && (
                  <div className="w-1.5 h-1.5 bg-white rounded-full flex-shrink-0"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Quick Stats - Very Compact */}
        {location.pathname === "/admin" && (
          <div className="mt-6 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
            <h3 className="text-xs font-semibold text-gray-300 mb-2">
              Quick Stats
            </h3>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Blogs</span>
                <span className="text-green-400 font-medium">Active</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Users</span>
                <span className="text-blue-400 font-medium">Managed</span>
              </div>
            </div>
          </div>
        )}

        {/* Back Button - Compact */}
        <div className="mt-6 pt-4 border-t border-gray-700">
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              window.history.back();
            }}
            className="flex items-center gap-2 w-full p-2 text-gray-200 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-200 group text-sm"
          >
            <ArrowLeft className="h-4 w-4 flex-shrink-0" />
            <span className="font-medium truncate">Back</span>
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}

export default AdminSidebar;
