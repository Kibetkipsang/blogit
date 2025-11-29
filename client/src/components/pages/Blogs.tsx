import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";
import api from "@/axios";
import BlogCard from "./BlogCard";
import { Search, Grid3X3, List, Home, User, FileText, Menu, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

type BlogType = {
  id: string;
  title: string;
  synopsis: string;
  featuredImageUrl: string;
  content: string;
  createdAt: string;
  category?: {
    id: string,
    name: string
  };
  authorName?: string;
  readTime?: string;
};

type CategoryType = {
  id: string;
  name: string;
};

// Enhanced fetchBlogs with markdown content handling
const fetchBlogs = async (): Promise<BlogType[]> => {
  const res = await api.get("/blogs");
  
  if (res.data && Array.isArray(res.data.blogs)) {
    return res.data.blogs.map((blog: BlogType) => ({
      ...blog,
      content: blog.content || "",
      synopsis: blog.synopsis || extractSynopsisFromMarkdown(blog.content),
      readTime: calculateReadTime(blog.content)
    }));
  } else if (Array.isArray(res.data)) {
    return res.data.map((blog: BlogType) => ({
      ...blog,
      content: blog.content || "",
      synopsis: blog.synopsis || extractSynopsisFromMarkdown(blog.content),
      readTime: calculateReadTime(blog.content)
    }));
  } else {
    console.error("Unexpected API response:", res.data);
    return [];
  }
};

const extractSynopsisFromMarkdown = (content: string): string => {
  if (!content) return "No description available";
  
  const plainText = content
    .replace(/#{1,6}\s/g, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/`(.*?)`/g, '$1')
    .split('\n')
    .filter(line => line.trim().length > 0)[0] || '';
  
  return plainText.slice(0, 150) + (plainText.length > 150 ? '...' : '');
};

const calculateReadTime = (content: string): string => {
  if (!content) return '1 min read';
  
  const wordsPerMinute = 200;
  const plainText = content
    .replace(/#{1,6}\s/g, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/`(.*?)`/g, '$1')
    .replace(/[^\w\s]/g, ' ');
  
  const words = plainText.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
};

const fetchCategories = async () => {
  const res = await api.get("/categories");
  return res.data;
};

function Blogs() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "masonry">("masonry");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { 
    data: blogsData, 
    isPending: blogsLoading, 
    isError: blogsError, 
    error: blogsErr 
  } = useQuery<BlogType[]>({
    queryKey: ["blogs"],
    queryFn: fetchBlogs,
  });

  const { 
    data: categoriesData, 
    isLoading: categoriesLoading 
  } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const categories: CategoryType[] = categoriesData?.categories || [];
  const blogs: BlogType[] = blogsData || [];

  const filteredBlogs = blogs
    .filter(blog => {
      const matchesCategory = selectedCategory === "All" || 
        blog.category?.name.toLowerCase() === selectedCategory.toLowerCase();
      
      const matchesSearch = searchQuery === "" || 
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.synopsis.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (blogsLoading || categoriesLoading) {
    return <BlogsSkeleton />;
  }

  if (blogsError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 sm:px-6">
        <div className="text-center max-w-md w-full">
          <div className="text-red-500 text-5xl sm:text-6xl mb-4">⚠️</div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Failed to Load Blogs</h2>
          <p className="text-gray-600 mb-6 text-sm sm:text-base">
            {(blogsErr as any)?.response?.data?.message || "Unable to load blogs at this time."}
          </p>
          <Button 
            onClick={() => window.location.reload()} 
            className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Compact Navigation Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          {/* Mobile First Navigation */}
          <div className="flex items-center justify-between py-2 sm:py-3 gap-2 sm:gap-4">
            {/* Mobile Menu Button and Logo */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="sm:hidden h-8 w-8 p-0">
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64">
                  <div className="flex flex-col gap-4 mt-8">
                    <Link 
                      to="/" 
                      className="flex items-center gap-3 text-gray-700 hover:text-green-600 transition-colors p-3 rounded-lg hover:bg-gray-100"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Home className="h-5 w-5" />
                      <span className="font-medium">Home</span>
                    </Link>
                    <Link 
                      to="/profile" 
                      className="flex items-center gap-3 text-gray-700 hover:text-green-600 transition-colors p-3 rounded-lg hover:bg-gray-100"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User className="h-5 w-5" />
                      <span className="font-medium">Profile</span>
                    </Link>
                    <Link 
                      to="/create-blog" 
                      className="flex items-center gap-3 text-gray-700 hover:text-green-600 transition-colors p-3 rounded-lg hover:bg-gray-100"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <FileText className="h-5 w-5" />
                      <span className="font-medium">Create Blog</span>
                    </Link>
                  </div>
                </SheetContent>
              </Sheet>

              {/* Desktop Navigation Links */}
              <div className="hidden sm:flex items-center gap-2 lg:gap-3">
                <Link 
                  to="/" 
                  className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition-colors px-2 lg:px-3 py-1 rounded-lg hover:bg-gray-100 text-sm"
                >
                  <Home className="h-4 w-4" />
                  <span className="font-medium">Home</span>
                </Link>
                <Link 
                  to="/profile" 
                  className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition-colors px-2 lg:px-3 py-1 rounded-lg hover:bg-gray-100 text-sm"
                >
                  <User className="h-4 w-4" />
                  <span className="font-medium">Profile</span>
                </Link>
                <Link 
                  to="/create-blog" 
                  className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition-colors px-2 lg:px-3 py-1 rounded-lg hover:bg-gray-100 text-sm"
                >
                  <FileText className="h-4 w-4" />
                  <span className="font-medium">Create</span>
                </Link>
              </div>
            </div>

            {/* Search - Responsive */}
            <div className="flex-1 max-w-xs sm:max-w-md mx-2 sm:mx-0">
              <div className="relative">
                <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-3.5 sm:h-4 w-3.5 sm:w-4" />
                <Input
                  type="text"
                  placeholder="Search blogs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-7 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 h-8 sm:h-9 text-xs sm:text-sm"
                />
              </div>
            </div>

            {/* View Toggle - Responsive */}
            <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-0.5 sm:p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={`h-6 w-6 sm:h-7 sm:w-7 p-0 ${viewMode === "grid" ? "bg-green-600 text-white" : ""}`}
              >
                <Grid3X3 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              </Button>
              <Button
                variant={viewMode === "masonry" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("masonry")}
                className={`h-6 w-6 sm:h-7 sm:w-7 p-0 ${viewMode === "masonry" ? "bg-green-600 text-white" : ""}`}
              >
                <List className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              </Button>
            </div>
          </div>

          {/* Compact Categories - Responsive */}
          <div className="flex flex-wrap gap-1 sm:gap-1.5 pb-2 sm:pb-3">
            <Badge
              variant={selectedCategory === "All" ? "default" : "outline"}
              className={`cursor-pointer px-2 sm:px-3 py-0.5 sm:py-1 text-xs font-medium transition-colors ${
                selectedCategory === "All" 
                  ? "bg-green-600 text-white hover:bg-green-700" 
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => setSelectedCategory("All")}
            >
              All
              <span className="ml-1 bg-green-100 text-green-800 px-1 sm:px-1.5 py-0.5 rounded-full text-xs">
                {blogs.length}
              </span>
            </Badge>
            
            {categories.map((cat) => {
              const count = blogs.filter(b => b.category?.name === cat.name).length;
              return (
                <Badge
                  key={cat.id}
                  variant={selectedCategory === cat.name ? "default" : "outline"}
                  className={`cursor-pointer px-2 sm:px-3 py-0.5 sm:py-1 text-xs font-medium transition-colors ${
                    selectedCategory === cat.name 
                      ? "bg-green-600 text-white hover:bg-green-700" 
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setSelectedCategory(cat.name)}
                >
                  {cat.name}
                  <span className="ml-1 bg-gray-100 text-gray-600 px-1 sm:px-1.5 py-0.5 rounded-full text-xs">
                    {count}
                  </span>
                </Badge>
              );
            })}
          </div>
        </div>
      </div>

      {/* Blog Content - Responsive */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
        {/* Results Count - Responsive */}
        {filteredBlogs.length > 0 && (
          <div className="mb-3 sm:mb-4">
            <p className="text-xs sm:text-sm text-gray-600">
              Showing {filteredBlogs.length} of {blogs.length} blog{blogs.length !== 1 ? 's' : ''}
              {searchQuery && ` for "${searchQuery}"`}
              {selectedCategory !== "All" && ` in ${selectedCategory}`}
            </p>
          </div>
        )}

        {filteredBlogs.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <div className="text-gray-400 text-4xl sm:text-5xl mb-2 sm:mb-3">📝</div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">No blogs found</h3>
            <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 max-w-sm mx-auto">
              {searchQuery ? `No results for "${searchQuery}"` : "No blogs available in this category"}
            </p>
            {(searchQuery || selectedCategory !== "All") && (
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                Clear filters
              </Button>
            )}
          </div>
        ) : (
          <div className={
            viewMode === "masonry" 
              ? "columns-1 sm:columns-2 lg:columns-3 gap-3 sm:gap-4 lg:gap-5 space-y-3 sm:space-y-4 lg:space-y-5"
              : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5"
          }>
            {filteredBlogs.map((blog) => (
              <div key={blog.id} className="break-inside-avoid">
                <BlogCard
                  id={blog.id}
                  title={blog.title}
                  synopsis={blog.synopsis}
                  featuredImageUrl={blog.featuredImageUrl}
                  authorName={blog.authorName || "Unknown Author"}
                  createdAt={blog.createdAt}
                  category={blog.category?.name}
                  readTime={blog.readTime}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Responsive Skeleton Component
function BlogsSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Skeleton Navigation */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between py-2 sm:py-3 gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <Skeleton className="h-8 w-8 sm:hidden rounded" />
              <div className="hidden sm:flex gap-2">
                <Skeleton className="h-8 w-16 rounded-lg" />
                <Skeleton className="h-8 w-16 rounded-lg" />
                <Skeleton className="h-8 w-16 rounded-lg" />
              </div>
            </div>
            <Skeleton className="h-8 flex-1 max-w-xs sm:max-w-md" />
            <Skeleton className="h-6 w-14 sm:h-7 sm:w-16 rounded-lg" />
          </div>
          <div className="flex flex-wrap gap-1 sm:gap-1.5 pb-2 sm:pb-3">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-5 sm:h-6 w-12 sm:w-16 rounded-full" />
            ))}
          </div>
        </div>
      </div>

      {/* Skeleton Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
        <Skeleton className="h-3 sm:h-4 w-32 sm:w-48 mb-3 sm:mb-4" />
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-3 sm:gap-4 lg:gap-5 space-y-3 sm:space-y-4 lg:space-y-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="break-inside-avoid">
              <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <Skeleton className="w-full h-32 sm:h-40" />
                <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                  <Skeleton className="h-2.5 sm:h-3 w-12 sm:w-16 rounded-full" />
                  <Skeleton className="h-4 sm:h-5 w-full" />
                  <Skeleton className="h-2.5 sm:h-3 w-3/4" />
                  <Skeleton className="h-2.5 sm:h-3 w-full" />
                  <div className="flex justify-between pt-1 sm:pt-2">
                    <Skeleton className="h-2.5 sm:h-3 w-16 sm:w-20" />
                    <Skeleton className="h-2.5 sm:h-3 w-10 sm:w-12" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Blogs;