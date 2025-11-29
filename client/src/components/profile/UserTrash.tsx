import { useState, useEffect } from "react";
import useAuthStore from "@/stores/useStore";
import { api } from "../../axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "../ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { toast } from "sonner";
import { Eye, Calendar, FileText, Trash2, RotateCcw, Loader2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Blog = {
  id: string;
  title: string;
  synopsis: string;
  content?: string;
  featuredImageUrl?: string;
  createdAt: string;
  category?: {
    id: string;
    name: string;
  };
};

function Trash() {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const [trashedBlogs, setTrashedBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Restore/Permanent Delete States
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (user) {
      fetchTrashedBlogs();
    }
  }, [user]);

  const fetchTrashedBlogs = async () => {
    setLoading(true);
    setError("");
    
    try {
      const response = await api.get("/profile/trash");
      console.log("🔍 Full Trash API response:", response.data);
    console.log("📊 Response structure:", typeof response.data);
    console.log("📝 First blog data:", response.data.blogs?.[0] || response.data?.[0]);
      console.log("Trash API response:", response.data); 
      
      if (response.data.success && Array.isArray(response.data.blogs)) {
        setTrashedBlogs(response.data.blogs);
      } else if (Array.isArray(response.data)) {
        setTrashedBlogs(response.data);
      } else {
        setTrashedBlogs([]);
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || "Failed to fetch trashed blogs";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async () => {
    if (!selectedBlog || !selectedBlog.id) {
      toast.error("Cannot restore: Blog ID is missing");
      return;
    }

    setIsProcessing(true);
    try {
      console.log("Restoring blog with ID:", selectedBlog.id); // Debug log
      const response = await api.patch(`/blogs/restore/${selectedBlog.id}`);
      console.log("Restore response:", response.data); // Debug log
      
      if (response.data.success) {
        setTrashedBlogs(prev => prev.filter(blog => blog.id !== selectedBlog.id));
        toast.success("Blog restored successfully!");
        setRestoreDialogOpen(false);
        setSelectedBlog(null);
      } else {
        toast.error(response.data.message || "Failed to restore blog");
      }
    } catch (err: any) {
      console.error("Restore error:", err);
      toast.error(err?.response?.data?.message || "Failed to restore blog");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePermanentDelete = async () => {
    if (!selectedBlog || !selectedBlog.id) {
      toast.error("Cannot delete: Blog ID is missing");
      return;
    }

    setIsProcessing(true);
    try {
      console.log("Deleting blog with ID:", selectedBlog.id); // Debug log
      const response = await api.delete(`/blogs/${selectedBlog.id}`);
      console.log("Delete response:", response.data); // Debug log
      
      if (response.data.success) {
        setTrashedBlogs(prev => prev.filter(blog => blog.id !== selectedBlog.id));
        toast.success("Blog permanently deleted!");
        setDeleteDialogOpen(false);
        setSelectedBlog(null);
      } else {
        toast.error(response.data.message || "Failed to delete blog");
      }
    } catch (err: any) {
      console.error("Delete error:", err);
      toast.error(err?.response?.data?.message || "Failed to delete blog");
    } finally {
      setIsProcessing(false);
    }
  };

  const openRestoreDialog = (blog: Blog) => {
    console.log("Opening restore dialog for blog:", blog); // Debug log
    setSelectedBlog(blog);
    setRestoreDialogOpen(true);
  };

  const openDeleteDialog = (blog: Blog) => {
    console.log("Opening delete dialog for blog:", blog); // Debug log
    setSelectedBlog(blog);
    setDeleteDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-red-600">Access Denied</CardTitle>
            <CardDescription>Please log in to view trash</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-5 m-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/profile')}
              className="mb-4 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Profile
            </Button>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              <Trash2 className="h-8 w-8 inline mr-3 text-red-600" />
              Trash
            </h1>
            <p className="text-xl text-gray-600">
              Manage your deleted blog posts. Restore or permanently delete them.
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-red-600">{trashedBlogs.length}</div>
            <div className="text-sm text-gray-500">Items in trash</div>
          </div>
        </div>

        {/* Trashed Blogs */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="p-6">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-red-600" />
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-red-500 text-6xl mb-4">⚠️</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Failed to load trashed blogs</h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <Button onClick={fetchTrashedBlogs}>Try Again</Button>
              </div>
            ) : trashedBlogs.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-gray-400 text-6xl mb-4">🗑️</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Trash is empty</h3>
                <p className="text-gray-600 mb-6">No blogs have been moved to trash yet.</p>
                <Button onClick={() => navigate('/profile')}>
                  Back to Profile
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {trashedBlogs.map((blog) => (
                  <Card key={blog.id} className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-red-50 border-l-4 border-l-red-300">
                    {blog.featuredImageUrl && (
                      <div className="h-48 overflow-hidden rounded-t-lg">
                        <img 
                          src={blog.featuredImageUrl} 
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-70"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        {blog.category && (
                          <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                            {blog.category.name}
                          </Badge>
                        )}
                        <Badge variant="destructive" className="bg-red-100 text-red-800">
                          Trashed
                        </Badge>
                      </div>
                      <CardTitle className="text-lg line-clamp-2 text-gray-700">
                        {blog.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-3">
                        {blog.synopsis}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="h-4 w-4" />
                        <span>Deleted {formatDate(blog.createdAt)}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
                        onClick={() => openRestoreDialog(blog)}
                        disabled={!blog.id} // Disable if no ID
                      >
                        <RotateCcw className="h-3 w-3 mr-1" />
                        Restore
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                        onClick={() => openDeleteDialog(blog)}
                        disabled={!blog.id} // Disable if no ID
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Restore Confirmation Dialog */}
        <AlertDialog open={restoreDialogOpen} onOpenChange={setRestoreDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Restore Blog</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to restore "{selectedBlog?.title}"? 
                It will be moved back to your active blogs.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleRestore}
                disabled={isProcessing || !selectedBlog?.id}
                className="bg-green-600 hover:bg-green-700"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Restoring...
                  </>
                ) : (
                  <>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Restore
                  </>
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Permanent Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Permanently Delete</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to permanently delete "{selectedBlog?.title}"? 
                This action cannot be undone and the blog will be lost forever.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handlePermanentDelete}
                disabled={isProcessing || !selectedBlog?.id}
                className="bg-red-600 hover:bg-red-700"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Permanently
                  </>
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </section>
  );
}

export default Trash;