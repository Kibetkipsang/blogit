import { Bell, Menu, Home, User, Key, LogOut, ChevronRight, X, FileText, Trash2, House, Globe } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import useAuthStore from "@/stores/useStore";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Link } from 'react-router-dom';

type Props = {
  onEditProfile: () => void;
  onChangePassword: () => void;
};

export default function ProfileHeader({ onEditProfile, onChangePassword }: Props) {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getCurrentPageName = () => {
    const path = location.pathname;
    if (path === "/profile") return "Dashboard";
    if (path.includes("/profile/details")) return "Profile Details";
    if (path.includes("/blogs")) return "My Blogs";
    if (path.includes("/trash")) return "Trash";
    return "Profile";
  };

  const menuItems = [
    { name: "Home", path: "/", icon: House }, 
    { name: "All Blogs", path: "/blogs", icon: Globe }, 
    { name: "Dashboard", path: "/profile", icon: Home },
    { name: "My Blogs", path: "/profile", icon: FileText },
    { name: "Trash", path: "/profile/trash", icon: Trash2 },
    { name: "Edit Profile", action: onEditProfile, icon: User },
    { name: "Change Password", action: onChangePassword, icon: Key },
    { name: "Logout", action: () => {
      useAuthStore.getState().clearUser();
      navigate("/blogs");
    }, icon: LogOut },
  ];

  const currentPage = getCurrentPageName();

  return (
    <>
      {/* Mobile Header with Menu */}
      <header className="lg:hidden bg-black text-white border-b border-green-900 sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 hover:bg-green-900 rounded-md transition-colors"
            >
              <Menu className="w-5 h-5 text-green-500" />
            </button>
            
            <div className="flex items-center gap-2 text-sm">
              <span className="text-green-500 font-medium">Profile</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <span className="text-white">{currentPage}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile Navigation Links - Better Styled */}
            <nav className="flex items-center gap-3">
              <Link 
                to="/" 
                className="text-green-400 hover:text-green-300 text-sm font-medium transition-colors"
              >
                Home
              </Link>
              <Link 
                to="/blogs" 
                className="text-green-400 hover:text-green-300 text-sm font-medium transition-colors"
              >
                Blogs
              </Link>
            </nav>
            
            <button className="p-2 rounded-full hover:bg-green-900 transition-colors">
              <Bell className="w-5 h-5 text-green-400" />
            </button>
            
            <Avatar 
              className="w-8 h-8 cursor-pointer border-2 border-green-500"
              onClick={() => navigate("/profile")}
            >
              <AvatarFallback className="text-black font-semibold text-xs">
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Desktop Header */}
      <header className="hidden lg:flex items-center justify-between px-6 py-4 bg-green-800 border-b border-green-900 text-white">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-bold">{user?.firstName} {user?.lastName}</h2>
        </div>

        <div className="flex items-center gap-4">
          {/* Desktop Navigation Links */}
          <nav className="flex items-center gap-4 mr-4">
            <Link 
              to="/" 
              className="text-green-200 hover:text-white transition-colors font-medium"
            >
              Home
            </Link>
            <Link 
              to="/blogs" 
              className="text-green-200 hover:text-white transition-colors font-medium"
            >
              All Blogs
            </Link>
          </nav>
          
          <button className="p-2 rounded-full hover:bg-green-700 transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <Avatar 
            className="w-10 h-10 cursor-pointer border-2 border-green-400"
            onClick={() => navigate("/profile/details")}
          >
            <AvatarFallback className="text-black font-semibold">
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* Mobile Menu Sheet */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-80 p-0 bg-black text-white border-r border-green-900">
          <div className="flex items-center justify-between p-4 border-b border-green-900">
            <h2 className="text-lg font-bold text-green-500">Menu</h2>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 hover:bg-green-900 rounded-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <nav className="p-4 space-y-2">
            {menuItems.map((item) =>
              item.path ? (
                <button
                  key={item.name}
                  onClick={() => {
                    navigate(item.path);
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 w-full text-left hover:bg-green-900 rounded-md transition-colors text-gray-200"
                >
                  <item.icon className="w-5 h-5 text-green-400" />
                  <span className="font-medium">{item.name}</span>
                </button>
              ) : (
                <button
                  key={item.name}
                  onClick={() => {
                    item.action();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 w-full text-left hover:bg-green-900 rounded-md transition-colors text-gray-200"
                >
                  <item.icon className="w-5 h-5 text-green-400" />
                  <span className="font-medium">{item.name}</span>
                </button>
              )
            )}
          </nav>
        </SheetContent>
      </Sheet>
    </>
  );
}