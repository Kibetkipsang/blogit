import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthStore from "@/stores/useStore";
import { useState, useEffect } from "react";
import { api } from "../../axios";
import { capitalize } from "../../lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "../ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { toast } from "sonner";
import {
  Edit,
  Trash2,
  Eye,
  Calendar,
  User,
  Mail,
  FileText,
  Plus,
  Loader2,
  BarChart3,
  Heart,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

type Blog = {
  id?: string;
  title: string;
  synopsis: string;
  content?: string;
  featuredImageUrl?: string;
  createdAt: string;
  viewCount?: number;
  likesCount?: number;
  category?: {
    id: string;
    name: string;
  };
};

function Profile() {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Delete Blog State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingBlog, setDeletingBlog] = useState<Blog | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // React Query for blogs - with auto-refresh
  const {
    data: blogs = [],
    isLoading: blogsLoading,
    isError: blogsError,
    error: blogsErrorData,
    refetch: refetchBlogs,
  } = useQuery({
    queryKey: ["user-blogs"],
    queryFn: async (): Promise<Blog[]> => {
      const response = await api.get("/profile/blogs");

      if (response.data.success && Array.isArray(response.data.blogs)) {
        return response.data.blogs;
      } else if (Array.isArray(response.data)) {
        return response.data;
      } else {
        return [];
      }
    },
    enabled: !!user,
    refetchOnWindowFocus: true, // Refresh when tab becomes active
    staleTime: 30000, // Consider data stale after 30 seconds
  });

  // Auto-refresh stats every 2 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ["user-blogs"] });
      setLastUpdated(new Date());
    }, 120000); // 2 minutes

    return () => clearInterval(interval);
  }, [queryClient]);

  // Manual refresh function
  const handleRefreshStats = () => {
    queryClient.invalidateQueries({ queryKey: ["user-blogs"] });
    setLastUpdated(new Date());
    toast.success("Stats refreshed!");
  };

  // Delete mutation with proper invalidation
  const deleteMutation = useMutation({
    mutationFn: async (blogId: string) => {
      const response = await api.patch(`/blogs/trash/${blogId}`);
      return response.data;
    },
    onMutate: async (blogId) => {
      await queryClient.cancelQueries({ queryKey: ["user-blogs"] });
      const previousBlogs = queryClient.getQueryData<Blog[]>(["user-blogs"]);

      queryClient.setQueryData<Blog[]>(["user-blogs"], (old = []) =>
        old.filter((blog) => blog.id !== blogId),
      );

      return { previousBlogs };
    },
    onError: (err, blogId, context) => {
      if (context?.previousBlogs) {
        queryClient.setQueryData<Blog[]>(["user-blogs"], context.previousBlogs);
      }
      toast.error(err?.response?.data?.message || "Failed to delete blog");
    },
    onSuccess: () => {
      toast.success("Blog moved to trash successfully!");
      // Invalidate to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ["user-blogs"] });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["user-blogs"] });
      queryClient.invalidateQueries({ queryKey: ["trash"] });
    },
  });

  // Calculate real-time stats from current blog data
  const stats = {
    totalBlogs: blogs.length,
    totalViews: blogs.reduce((total, blog) => total + (blog.viewCount || 0), 0),
    totalLikes: blogs.reduce(
      (total, blog) => total + (blog.likesCount || 0),
      0,
    ),
    avgViewsPerBlog:
      blogs.length > 0
        ? Math.round(
            blogs.reduce((total, blog) => total + (blog.viewCount || 0), 0) /
              blogs.length,
          )
        : 0,
    avgLikesPerBlog:
      blogs.length > 0
        ? Math.round(
            blogs.reduce((total, blog) => total + (blog.likesCount || 0), 0) /
              blogs.length,
          )
        : 0,
    engagementRate:
      blogs.reduce((total, blog) => {
        const views = blog.viewCount || 0;
        const likes = blog.likesCount || 0;
        return views > 0 ? total + (likes / views) * 100 : total;
      }, 0) / Math.max(blogs.length, 1),
  };

  // Find most popular blogs
  const mostPopularBlog =
    blogs.length > 0
      ? blogs.reduce((prev, current) =>
          (prev.viewCount || 0) > (current.viewCount || 0) ? prev : current,
        )
      : null;

  const mostLikedBlog =
    blogs.length > 0
      ? blogs.reduce((prev, current) =>
          (prev.likesCount || 0) > (current.likesCount || 0) ? prev : current,
        )
      : null;

  // Edit Blog Function
  const handleEditBlog = (blog: Blog) => {
    if (!blog.id) {
      toast.error("Cannot edit blog: Missing blog ID");
      return;
    }
    navigate("/create-blog", {
      state: {
        isEditing: true,
        blogId: blog.id,
        blogData: blog,
      },
    });
  };

  // View Blog Function
  const handleViewBlog = (blog: Blog) => {
    if (blog.id) {
      navigate(`/blogs/${blog.id}`);
    } else {
      toast.error("Cannot view blog: Missing blog ID");
    }
  };

  // Delete Blog Functions
  const openDeleteDialog = (blog: Blog) => {
    setDeletingBlog(blog);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingBlog || !deletingBlog.id) return;
    deleteMutation.mutate(deletingBlog.id);
    setDeleteDialogOpen(false);
    setDeletingBlog(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    }
    return num.toString();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-red-600">Access Denied</CardTitle>
            <CardDescription>
              Please log in to view your profile
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-5 m-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header with Refresh Button */}
        <div className="text-center relative">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshStats}
            disabled={blogsLoading}
            className="absolute right-0 top-0"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${blogsLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome back,{" "}
            <span className="text-green-600">
              {capitalize(user.firstName)}!
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Track your blog performance with real-time analytics on views and
            likes.
          </p>
          <div className="text-sm text-gray-500 mt-2">
            Last updated: {formatTime(lastUpdated)}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Blogs</CardTitle>
              <FileText className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBlogs}</div>
              <p className="text-xs text-green-100">Published articles</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatNumber(stats.totalViews)}
              </div>
              <p className="text-xs text-blue-100">All-time readers</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
              <Heart className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatNumber(stats.totalLikes)}
              </div>
              <p className="text-xs text-purple-100">Reader appreciation</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Engagement</CardTitle>
              <BarChart3 className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.engagementRate.toFixed(1)}%
              </div>
              <p className="text-xs text-orange-100">Likes per view ratio</p>
            </CardContent>
          </Card>
        </div>

        {/* Rest of your component remains the same... */}
        {/* User Profile Card */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <User className="h-6 w-6 text-green-600" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-500">
                  Full Name
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  {capitalize(user.firstName)} {capitalize(user.lastName)}
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-500">
                  Username
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  @{user.userName}
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-500">Email</div>
                <div className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-green-600" />
                  {user.emailAdress}
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-500">Role</div>
                <Badge
                  variant={user.role === "admin" ? "default" : "secondary"}
                  className="text-sm"
                >
                  {capitalize(user.role)}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Blogs Section */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <FileText className="h-6 w-6 text-green-600" />
                Your Blogs
              </CardTitle>
              <CardDescription>
                Manage and track performance of your blog posts
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button asChild className="bg-green-600 hover:bg-green-700">
                <a href="/create-blog" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  New Blog
                </a>
              </Button>
              <Button
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-50 hover:text-red-800"
                onClick={() => navigate("/profile/trash")}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Trash
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {blogsLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-green-600" />
              </div>
            ) : blogsError ? (
              <div className="text-center py-12">
                <div className="text-red-500 text-6xl mb-4">⚠️</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Failed to load blogs
                </h3>
                <p className="text-gray-600 mb-4">
                  {(blogsErrorData as any)?.response?.data?.message ||
                    "Failed to load blogs"}
                </p>
                <Button onClick={() => refetchBlogs()}>Try Again</Button>
              </div>
            ) : blogs.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-gray-400 text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No blogs yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Start your writing journey by creating your first blog post.
                </p>
                <Button asChild className="bg-green-600 hover:bg-green-700">
                  <a href="/create-blog" className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Create Your First Blog
                  </a>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {blogs.map((blog, index) => (
                  <Card
                    key={blog.id || `blog-${index}`}
                    className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50"
                  >
                    {blog.featuredImageUrl && (
                      <div className="h-48 overflow-hidden rounded-t-lg">
                        <img
                          src={blog.featuredImageUrl}
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        {blog.category && (
                          <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-800"
                          >
                            {blog.category.name}
                          </Badge>
                        )}
                      </div>
                      <CardTitle
                        className="text-lg line-clamp-2 group-hover:text-green-700 transition-colors cursor-pointer"
                        onClick={() => handleViewBlog(blog)}
                      >
                        {blog.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-3">
                        {blog.synopsis}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="h-4 w-4" />
                        <span>Published {formatDate(blog.createdAt)}</span>
                      </div>

                      {/* Blog Analytics - Real-time counts */}
                      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Eye className="h-3 w-3" />
                          <span>{blog.viewCount || 0} views</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Heart className="h-3 w-3" />
                          <span>{blog.likesCount || 0} likes</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleEditBlog(blog)}
                        disabled={!blog.id}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                        onClick={() => openDeleteDialog(blog)}
                        disabled={!blog.id || deleteMutation.isPending}
                      >
                        {deleteMutation.isPending &&
                        deletingBlog?.id === blog.id ? (
                          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        ) : (
                          <Trash2 className="h-3 w-3 mr-1" />
                        )}
                        Delete
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Move to Trash</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to move "{deletingBlog?.title}" to trash?
                This action can be undone from the trash section.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleteMutation.isPending}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="bg-red-600 hover:bg-red-700"
              >
                {deleteMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Moving...
                  </>
                ) : (
                  "Move to Trash"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </section>
  );
}

export default Profile;
