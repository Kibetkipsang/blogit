import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Share2, Home, User, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

function BlogArticleHeader() {
  const navigate = useNavigate();

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled the share
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // You can add a toast notification here if needed
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-black/95 backdrop-blur-sm border-b border-gray-800 z-50 h-20">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 h-full">
        {/* Left Section - Back Button */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="text-green-400 hover:text-green-300 hover:bg-gray-800 p-2 sm:px-3 sm:py-2 h-9 sm:h-10"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline ml-1 sm:ml-2 text-sm font-medium">
              Back
            </span>
          </Button>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-300 hover:text-green-400 hover:bg-gray-800 px-3 py-2 h-9 text-sm font-medium"
              >
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
            </Link>
            <Link to="/blogs">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-300 hover:text-green-400 hover:bg-gray-800 px-3 py-2 h-9 text-sm font-medium"
              >
                <FileText className="h-4 w-4 mr-2" />
                Blogs
              </Button>
            </Link>
            <Link to="/profile">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-300 hover:text-green-400 hover:bg-gray-800 px-3 py-2 h-9 text-sm font-medium"
              >
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
            </Link>
          </div>
        </div>

        {/* Center - Logo/Brand */}
        <div className="flex-1 flex justify-center">
          <Link
            to="/"
            className="text-lg sm:text-xl font-bold tracking-tight text-green-400 hover:text-green-300 transition-colors"
          >
            BLOG-IT
          </Link>
        </div>

        {/* Right Section - Share & Mobile Menu */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Share Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="text-green-400 hover:text-green-300 hover:bg-gray-800 p-2 sm:px-3 sm:py-2 h-9 sm:h-10"
          >
            <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline ml-1 sm:ml-2 text-sm font-medium">
              Share
            </span>
          </Button>

          {/* Mobile Navigation Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden text-green-400 hover:text-green-300 hover:bg-gray-800 p-2 h-9"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="bg-gray-900 border-l border-gray-800 w-64"
            >
              <div className="flex flex-col gap-2 mt-8">
                <Link to="/">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-300 hover:text-green-400 hover:bg-gray-800"
                  >
                    <Home className="h-4 w-4 mr-3" />
                    Home
                  </Button>
                </Link>
                <Link to="/blogs">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-300 hover:text-green-400 hover:bg-gray-800"
                  >
                    <FileText className="h-4 w-4 mr-3" />
                    All Blogs
                  </Button>
                </Link>
                <Link to="/profile">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-300 hover:text-green-400 hover:bg-gray-800"
                  >
                    <User className="h-4 w-4 mr-3" />
                    Profile
                  </Button>
                </Link>
                <Link to="/create-blog">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-300 hover:text-green-400 hover:bg-gray-800"
                  >
                    <FileText className="h-4 w-4 mr-3" />
                    Create Blog
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>

          {/* Desktop Create Blog Link */}
          <Link to="/create-blog" className="hidden md:block">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-300 hover:text-green-400 hover:bg-gray-800 px-3 py-2 h-9 text-sm font-medium"
            >
              <FileText className="h-4 w-4 mr-2" />
              Create
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default BlogArticleHeader;
