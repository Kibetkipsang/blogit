import { Bell, Menu, Home, User, Key, LogOut, ChevronRight, X, FileText, Trash2, House, Globe, Plus } from "lucide-react";
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

// Helper function to capitalize names
const capitalizeName = (name: string = '') => {
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
};

export default function ProfileHeader({ onEditProfile, onChangePassword }: Props) {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Capitalize user names
  const displayFirstName = capitalizeName(user?.firstName);
  const displayLastName = capitalizeName(user?.lastName);
  const displayFullName = `${displayFirstName} ${displayLastName}`.trim();

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
    { name: "Create Blog", path: "/create-blog", icon: Plus },
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
            {/* Mobile Navigation Links */}
            <nav className="flex items-center gap-3">
              <Link 
                to="/" 
                className="text-green-400 hover:text-green-300 text-sm font-medium transition-colors px-2 py-1 rounded hover:bg-green-900"
              >
                Home
              </Link>
              <Link 
                to="/blogs" 
                className="text-green-400 hover:text-green-300 text-sm font-medium transition-colors px-2 py-1 rounded hover:bg-green-900"
              >
                Blogs
              </Link>
              <Link 
                to="/create-blog" 
                className="text-green-400 hover:text-green-300 text-sm font-medium transition-colors px-2 py-1 rounded hover:bg-green-900"
              >
                Create
              </Link>
            </nav>
            
            <button className="p-2 rounded-full hover:bg-green-900 transition-colors">
              <Bell className="w-5 h-5 text-green-400" />
            </button>
            
            <Avatar 
              className="w-8 h-8 cursor-pointer border-2 border-green-500"
              onClick={() => navigate("/profile")}
            >
              <AvatarFallback className="text-black font-semibold text-xs bg-green-400">
                {displayFirstName?.charAt(0)}{displayLastName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Desktop Header */}
      <header className="hidden lg:flex items-center justify-between px-6 py-4 bg-green-800 border-b border-green-900 text-white">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-bold">{displayFullName || "User Profile"}</h2>
          <div className="h-6 w-px bg-green-600"></div>
          <span className="text-green-200 text-sm">{currentPage}</span>
        </div>

        <div className="flex items-center gap-6">
          {/* Desktop Navigation Links */}
          <nav className="flex items-center gap-4 mr-4">
            <Link 
              to="/" 
              className="text-white hover:text-green-200 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-green-700"
            >
              Home
            </Link>
            <Link 
              to="/blogs" 
              className="text-white hover:text-green-200 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-green-700"
            >
              All Blogs
            </Link>
            <Link 
              to="/create-blog" 
              className="text-white hover:text-green-200 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-green-700"
            >
              Create Blog
            </Link>
            <Link 
              to="/about" 
              className="text-white hover:text-green-200 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-green-700"
            >
              About
            </Link>
            <Link 
              to="/help" 
              className="text-white hover:text-green-200 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-green-700"
            >
              Help
            </Link>
          </nav>
          
          <div className="flex items-center gap-4">
            
            
            <Avatar 
              className="w-10 h-10 cursor-pointer border-2 border-green-400 hover:border-green-300 transition-colors"
              onClick={() => navigate("/profile")}
            >
              <AvatarFallback className="text-black font-semibold bg-green-400">
                {displayFirstName?.charAt(0)}{displayLastName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Mobile Menu Sheet */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-80 p-0 bg-black text-white border-r border-green-900">
          <div className="flex items-center justify-between p-4 border-b border-green-900">
            <div className="flex items-center gap-3">
              <Avatar className="w-8 h-8 border-2 border-green-500">
                <AvatarFallback className="text-black font-semibold text-xs bg-green-400">
                  {displayFirstName?.charAt(0)}{displayLastName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-sm font-bold text-white">{displayFullName}</h2>
                <p className="text-xs text-green-400">Profile Menu</p>
              </div>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 hover:bg-green-900 rounded-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <nav className="p-4 space-y-1">
            {menuItems.map((item) =>
              item.path ? (
                <button
                  key={item.name}
                  onClick={() => {
                    navigate(item.path);
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 w-full text-left hover:bg-green-900 rounded-lg transition-colors text-gray-200 group"
                >
                  <item.icon className="w-5 h-5 text-green-400 group-hover:text-green-300" />
                  <span className="font-medium group-hover:text-white">{item.name}</span>
                </button>
              ) : (
                <button
                  key={item.name}
                  onClick={() => {
                    item.action();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 w-full text-left hover:bg-green-900 rounded-lg transition-colors text-gray-200 group"
                >
                  <item.icon className="w-5 h-5 text-green-400 group-hover:text-green-300" />
                  <span className="font-medium group-hover:text-white">{item.name}</span>
                </button>
              )
            )}
          </nav>

          {/* Additional Links Section */}
          <div className="p-4 border-t border-green-900">
            <h3 className="text-xs font-semibold text-green-400 uppercase tracking-wider mb-3">More</h3>
            <div className="space-y-1">
              <Link 
                to="/about" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2 w-full text-left hover:bg-green-900 rounded-lg transition-colors text-gray-200 text-sm"
              >
                <Globe className="w-4 h-4 text-green-400" />
                About Us
              </Link>
              <Link 
                to="/help" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2 w-full text-left hover:bg-green-900 rounded-lg transition-colors text-gray-200 text-sm"
              >
                <FileText className="w-4 h-4 text-green-400" />
                Help Center
              </Link>
              <Link 
                to="/terms" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2 w-full text-left hover:bg-green-900 rounded-lg transition-colors text-gray-200 text-sm"
              >
                <FileText className="w-4 h-4 text-green-400" />
                Terms of Service
              </Link>
              <Link 
                to="/privacy" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2 w-full text-left hover:bg-green-900 rounded-lg transition-colors text-gray-200 text-sm"
              >
                <FileText className="w-4 h-4 text-green-400" />
                Privacy Policy
              </Link>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}