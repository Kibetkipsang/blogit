import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import useAuthStore from "@/stores/useStore";
import { useNavigate } from "react-router-dom";
import { Menu, X, Home, User, FileText, Settings, LogOut, LogIn, UserPlus } from "lucide-react";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function Header() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.clearUser);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="w-full bg-black/95 backdrop-blur-sm text-white border-b border-gray-800 h-16 sm:h-20 flex fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto w-full flex justify-between items-center px-4 sm:px-6 lg:px-8">
        
        {/* Logo/Brand */}
        <Link 
  to="/" 
  className="flex items-center gap-3 text-xl sm:text-2xl font-bold text-white hover:text-green-400 transition-colors"
>
  <span className="text-green-500 font-bold text-3xl sm:text-5xl">₿</span>
  <span className="text-2xl sm:text-3xl lg:text-2xl tracking-tight">BlogIt</span>
</Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <Link 
            to="/" 
            className="flex items-center gap-2 px-3 lg:px-4 py-2 text-gray-300 hover:text-green-400 hover:bg-gray-800 rounded-lg transition-colors text-sm lg:text-base font-medium"
          >
            <Home className="h-4 w-4" />
            Home
          </Link>
          <Link 
            to="/blogs" 
            className="flex items-center gap-2 px-3 lg:px-4 py-2 text-gray-300 hover:text-green-400 hover:bg-gray-800 rounded-lg transition-colors text-sm lg:text-base font-medium"
          >
            <FileText className="h-4 w-4" />
            Blogs
          </Link>
          {user && (
            <Link 
              to="/profile" 
              className="flex items-center gap-2 px-3 lg:px-4 py-2 text-gray-300 hover:text-green-400 hover:bg-gray-800 rounded-lg transition-colors text-sm lg:text-base font-medium"
            >
              <User className="h-4 w-4" />
              Profile
            </Link>
          )}
          {user && (
            <Link 
              to="/create-blog" 
              className="flex items-center gap-2 px-3 lg:px-4 py-2 text-gray-300 hover:text-green-400 hover:bg-gray-800 rounded-lg transition-colors text-sm lg:text-base font-medium"
            >
              <FileText className="h-4 w-4" />
              Create
            </Link>
          )}
        </nav>

        {/* Desktop Auth Section */}
        <div className="hidden md:flex items-center gap-2 lg:gap-3">
          {!user ? (
            <>
              <Link to="/register">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-gray-300 border-gray-600 hover:bg-gray-800 hover:text-white hover:border-gray-500"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Register
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Button>
              </Link>
            </>
          ) : (
            <>
              {user?.role === "admin" && (
                <Button
                  onClick={() => navigate("/admin")}
                  size="sm"
                  className="bg-green-600 hover:bg-green-800 text-white"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Admin
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-black border-gray-600 hover:bg-gray-800 hover:text-white hover:border-gray-500"
                  >
                    <User className="h-4 w-4 mr-2" />
                    {user.firstName|| "Account"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-gray-900 border-gray-800">
                  <DropdownMenuItem 
                    onClick={() => navigate("/profile")}
                    className="text-gray-300 hover:bg-gray-800 hover:text-white cursor-pointer"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="text-red-400 hover:bg-red-950 hover:text-red-300 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          {!user ? (
            <Link to="/login">
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white h-9"
              >
                <LogIn className="h-4 w-4" />
              </Button>
            </Link>
          ) : (
            user?.role === "admin" && (
              <Button
                onClick={() => navigate("/admin")}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white h-9"
              >
                <Settings className="h-4 w-4" />
              </Button>
            )
          )}
          
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-gray-800 h-9 w-9 p-0"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-gray-900 border-l border-gray-800 w-80">
              <div className="flex flex-col h-full">
                {/* User Info */}
                {user && (
                  <div className="p-4 border-b border-gray-800">
                    <p className="text-white font-medium">{user.name || "User"}</p>
                    <p className="text-gray-400 text-sm">{user.email}</p>
                    <p className="text-green-400 text-xs capitalize">{user.role}</p>
                  </div>
                )}

                {/* Navigation Links */}
                <div className="flex-1 p-4 space-y-2">
                  <Button
                    variant="ghost"
                    onClick={() => handleNavigation("/")}
                    className="w-full justify-start text-gray-300 hover:text-green-400 hover:bg-gray-800"
                  >
                    <Home className="h-4 w-4 mr-3" />
                    Home
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => handleNavigation("/blogs")}
                    className="w-full justify-start text-gray-300 hover:text-green-400 hover:bg-gray-800"
                  >
                    <FileText className="h-4 w-4 mr-3" />
                    Blogs
                  </Button>
                  {user && (
                    <>
                      <Button
                        variant="ghost"
                        onClick={() => handleNavigation("/profile")}
                        className="w-full justify-start text-gray-300 hover:text-green-400 hover:bg-gray-800"
                      >
                        <User className="h-4 w-4 mr-3" />
                        Profile
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => handleNavigation("/create-blog")}
                        className="w-full justify-start text-gray-300 hover:text-green-400 hover:bg-gray-800"
                      >
                        <FileText className="h-4 w-4 mr-3" />
                        Create Blog
                      </Button>
                    </>
                  )}
                </div>

                {/* Auth Section */}
                <div className="p-4 border-t border-gray-800 space-y-2">
                  {!user ? (
                    <>
                      <Button
                        onClick={() => handleNavigation("/register")}
                        variant="outline"
                        className="w-full justify-start text-gray-300 border-gray-600 hover:bg-gray-800"
                      >
                        <UserPlus className="h-4 w-4 mr-3" />
                        Register
                      </Button>
                      <Button
                        onClick={() => handleNavigation("/login")}
                        className="w-full justify-start bg-green-600 hover:bg-green-700 text-white"
                      >
                        <LogIn className="h-4 w-4 mr-3" />
                        Login
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={handleLogout}
                      variant="outline"
                      className="w-full justify-start text-red-400 border-red-800 hover:bg-red-950 hover:text-red-300"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Logout
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export default Header;