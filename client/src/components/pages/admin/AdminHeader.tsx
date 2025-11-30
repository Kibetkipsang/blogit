import { useNavigate } from "react-router-dom";
import useAuthStore from "../../../stores/useStore";
import { Button } from "@/components/ui/button";
import { LogOut, User, Home, Menu, ChevronDown, Shield } from "lucide-react";
import { useState } from "react";

function AdminHeader() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((s) => s.clearUser);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navigationLinks = [
    { path: "/", label: "Home", icon: Home },
    { path: "/profile", label: "My Profile", icon: User },
  ];

  return (
    <header className="w-full bg-gray-950 text-white py-4 px-4 sm:px-6 lg:px-8 shadow-lg border-b border-gray-800">
      <div className="flex justify-between items-center">
        {/* Left Section - Logo & Title */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-600 rounded-lg">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl lg:text-2xl text-white font-bold tracking-wide">
                Admin Dashboard
              </h1>
              <p className="text-gray-400 text-xs sm:text-sm hidden sm:block">
                Manage site content & settings
              </p>
            </div>
          </div>
        </div>

        {/* Right Section - User Info & Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* User Info - Hidden on mobile */}
          <div className="hidden sm:flex items-center gap-4">
            <p className="text-gray-300 text-sm">
              Welcome,{" "}
              <span className="text-green-400 font-semibold">
                {user?.userName}
              </span>
            </p>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-2">
              {navigationLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Button
                    key={link.path}
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(link.path)}
                    className="text-gray-300 hover:text-white hover:bg-gray-800"
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {link.label}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* User Menu Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>

            {/* Dropdown Menu */}
            {isUserMenuOpen && (
              <div className="absolute right-0 top-12 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50">
                {/* User Info */}
                <div className="p-3 border-b border-gray-700">
                  <p className="text-sm font-medium text-white">
                    {user?.userName}
                  </p>
                  <p className="text-xs text-gray-400">{user?.emailAdress}</p>
                </div>

                {/* Navigation Links */}
                <div className="p-1">
                  {navigationLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <button
                        key={link.path}
                        onClick={() => {
                          navigate(link.path);
                          setIsUserMenuOpen(false);
                        }}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded-md transition-colors"
                      >
                        <Icon className="h-4 w-4" />
                        {link.label}
                      </button>
                    );
                  })}
                </div>

                {/* Logout */}
                <div className="p-1 border-t border-gray-700">
                  <button
                    onClick={() => {
                      logout();
                      navigate("/login");
                      setIsUserMenuOpen(false);
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-red-950 hover:text-red-300 rounded-md transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden mt-4 pt-4 border-t border-gray-800">
          <div className="flex flex-col gap-2">
            {/* User Info */}
            <div className="px-2 py-1">
              <p className="text-sm font-medium text-white">{user?.userName}</p>
              <p className="text-xs text-gray-400">{user?.emailAdress}</p>
            </div>

            {/* Navigation Links */}
            {navigationLinks.map((link) => {
              const Icon = link.icon;
              return (
                <button
                  key={link.path}
                  onClick={() => {
                    navigate(link.path);
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </button>
              );
            })}

            {/* Mobile Logout Button */}
            <button
              onClick={() => {
                logout();
                navigate("/login");
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-950 hover:text-red-300 rounded-lg transition-colors mt-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </header>
  );
}

export default AdminHeader;
