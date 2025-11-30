import { useQuery } from "@tanstack/react-query";
import { api } from "@/axios";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Users,
  AlertCircle,
  Eye,
  ThumbsUp,
  MessageCircle,
} from "lucide-react";

function Admin() {
  // Fetch data from available endpoints
  const {
    data: blogsData,
    isLoading: blogsLoading,
    error: blogsError,
  } = useQuery({
    queryKey: ["blogs"],
    queryFn: async () => {
      const res = await api.get("/blogs");
      return res.data;
    },
  });

  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("/categories");
      return res.data;
    },
  });

  // Safely extract arrays from API responses
  const blogsArray = Array.isArray(blogsData)
    ? blogsData
    : blogsData?.blogs || blogsData?.data || (blogsData ? [blogsData] : []);

  const categoriesArray = Array.isArray(categoriesData)
    ? categoriesData
    : categoriesData?.categories ||
      categoriesData?.data ||
      (categoriesData ? [categoriesData] : []);

  // Calculate stats from REAL blog data
  const totalBlogs = blogsArray.length || 0;
  const totalCategories = categoriesArray.length || 0;

  // Calculate published vs draft blogs using actual status field
  const publishedBlogs = blogsArray.filter(
    (blog: any) => blog.status === "published" || !blog.status, // Assume published if no status
  ).length;

  const draftBlogs = blogsArray.filter(
    (blog: any) => blog.status === "draft",
  ).length;

  // Calculate REAL total views and likes from blog data
  const totalViews = blogsArray.reduce(
    (sum: number, blog: any) => sum + (blog.viewCount || 0),
    0,
  );

  const totalLikes = blogsArray.reduce(
    (sum: number, blog: any) => sum + (blog.likesCount || 0),
    0,
  );

  // Find most popular blog
  const mostPopularBlog =
    blogsArray.length > 0
      ? blogsArray.reduce((prev: any, current: any) =>
          (prev.viewCount || 0) > (current.viewCount || 0) ? prev : current,
        )
      : null;

  const isLoading = blogsLoading || categoriesLoading;

  return (
    <div className="p-8">
      <div className="flex gap-8">
        <div className="flex-1 bg-white">
          <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
          <p className="text-gray-600 mb-8">
            Real-time overview of your platform's performance metrics.
          </p>

          {/* Error Display */}
          {(blogsError || categoriesError) && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <p className="text-red-700">
                  Error loading data:{" "}
                  {blogsError?.message || categoriesError?.message}
                </p>
              </div>
            </div>
          )}

          {/* Stats Grid - Using REAL data */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Total Blogs */}
            <div className="bg-gray-900 p-6 rounded-xl text-white shadow-lg hover:shadow-2xl transition">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Total Blogs</h3>
                <FileText className="h-5 w-5 text-green-400" />
              </div>
              {isLoading ? (
                <Skeleton className="h-12 bg-gray-700 mt-3 rounded" />
              ) : (
                <p className="text-4xl font-bold mt-3 text-green-400">
                  {totalBlogs}
                </p>
              )}
            </div>

            {/* Published Blogs */}
            <div className="bg-gray-900 p-6 rounded-xl text-white shadow-lg hover:shadow-2xl transition">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Published</h3>
                <Eye className="h-5 w-5 text-blue-400" />
              </div>
              {isLoading ? (
                <Skeleton className="h-12 bg-gray-700 mt-3 rounded" />
              ) : (
                <p className="text-4xl font-bold mt-3 text-blue-400">
                  {publishedBlogs}
                </p>
              )}
            </div>

            {/* Draft Blogs */}
            <div className="bg-gray-900 p-6 rounded-xl text-white shadow-lg hover:shadow-2xl transition">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Drafts</h3>
                <FileText className="h-5 w-5 text-yellow-400" />
              </div>
              {isLoading ? (
                <Skeleton className="h-12 bg-gray-700 mt-3 rounded" />
              ) : (
                <p className="text-4xl font-bold mt-3 text-yellow-400">
                  {draftBlogs}
                </p>
              )}
            </div>

            {/* Total Views - REAL DATA */}
            <div className="bg-gray-900 p-6 rounded-xl text-white shadow-lg hover:shadow-2xl transition">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Total Views</h3>
                <Eye className="h-5 w-5 text-purple-400" />
              </div>
              {isLoading ? (
                <Skeleton className="h-12 bg-gray-700 mt-3 rounded" />
              ) : (
                <div>
                  <p className="text-4xl font-bold mt-3 text-purple-400">
                    {totalViews.toLocaleString()}
                  </p>
                  {mostPopularBlog && (
                    <p className="text-xs text-purple-300 mt-1">
                      Most viewed: {mostPopularBlog.viewCount || 0} views
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Total Likes - REAL DATA */}
            <div className="bg-gray-900 p-6 rounded-xl text-white shadow-lg hover:shadow-2xl transition">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Total Likes</h3>
                <ThumbsUp className="h-5 w-5 text-red-400" />
              </div>
              {isLoading ? (
                <Skeleton className="h-12 bg-gray-700 mt-3 rounded" />
              ) : (
                <p className="text-4xl font-bold mt-3 text-red-400">
                  {totalLikes.toLocaleString()}
                </p>
              )}
            </div>

            {/* Categories */}
            <div className="bg-gray-900 p-6 rounded-xl text-white shadow-lg hover:shadow-2xl transition">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Categories</h3>
                <MessageCircle className="h-5 w-5 text-indigo-400" />
              </div>
              {isLoading ? (
                <Skeleton className="h-12 bg-gray-700 mt-3 rounded" />
              ) : (
                <p className="text-4xl font-bold mt-3 text-indigo-400">
                  {totalCategories}
                </p>
              )}
            </div>
          </div>

          {/* Recent Activity Section with REAL data */}
          <div className="mt-12">
            <h3 className="text-xl font-bold mb-6">Recent Blog Activity</h3>
            <div className="bg-gray-50 rounded-lg p-6">
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-4 bg-gray-200 rounded w-3/4" />
                  <Skeleton className="h-4 bg-gray-200 rounded w-1/2" />
                  <Skeleton className="h-4 bg-gray-200 rounded w-2/3" />
                </div>
              ) : blogsArray.length > 0 ? (
                <div className="space-y-4">
                  {blogsArray.slice(0, 5).map((blog: any) => (
                    <div
                      key={blog.id}
                      className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {blog.title}
                        </h4>
                        <div className="flex flex-wrap gap-4 mt-1 text-sm text-gray-500">
                          <span>👁️ {blog.viewCount || 0} views</span>
                          <span>❤️ {blog.likesCount || 0} likes</span>
                          <span>
                            📅{" "}
                            {blog.createdAt
                              ? new Date(blog.createdAt).toLocaleDateString()
                              : "Unknown date"}
                          </span>
                        </div>
                      </div>
                      <Badge
                        variant={
                          blog.status === "draft" ? "secondary" : "default"
                        }
                        className={
                          blog.status === "draft"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }
                      >
                        {blog.status === "draft" ? "Draft" : "Published"}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No blog posts yet.</p>
                  <Button className="mt-4 bg-green-600 hover:bg-green-700">
                    Create Your First Blog
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Performance Metrics */}
          {blogsArray.length > 0 && (
            <div className="mt-12">
              <h3 className="text-xl font-bold mb-6">Performance Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">
                    Engagement Rate
                  </h4>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-3xl font-bold text-gray-900">
                        {totalViews > 0
                          ? ((totalLikes / totalViews) * 100).toFixed(1)
                          : 0}
                        %
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Likes per view
                      </p>
                    </div>
                    <ThumbsUp className="h-8 w-8 text-green-500" />
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">
                    Average Views per Blog
                  </h4>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-3xl font-bold text-gray-900">
                        {totalBlogs > 0
                          ? Math.round(totalViews / totalBlogs)
                          : 0}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Views per post
                      </p>
                    </div>
                    <Eye className="h-8 w-8 text-blue-500" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions Section */}
          <div className="mt-12">
            <h3 className="text-xl font-bold mb-6">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button className="bg-green-600 hover:bg-green-700 text-white p-4 h-auto flex flex-col gap-2">
                <FileText className="h-6 w-6" />
                <span className="font-medium">Create Blog</span>
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white p-4 h-auto flex flex-col gap-2">
                <MessageCircle className="h-6 w-6" />
                <span className="font-medium">Manage Categories</span>
              </Button>
              <Button className="bg-orange-600 hover:bg-orange-700 text-white p-4 h-auto flex flex-col gap-2">
                <Eye className="h-6 w-6" />
                <span className="font-medium">View Analytics</span>
              </Button>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white p-4 h-auto flex flex-col gap-2">
                <Users className="h-6 w-6" />
                <span className="font-medium">User Management</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Badge component for status display
function Badge({
  variant,
  className,
  children,
}: {
  variant: string;
  className: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}
    >
      {children}
    </span>
  );
}

export default Admin;
