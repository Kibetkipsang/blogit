import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Search,
  Eye,
  EyeOff,
  MoreVertical,
  User,
  Calendar,
  MessageSquare,
  ThumbsUp,
  Trash2,
  Undo,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import api from "@/axios";

type Blog = {
  id: string;
  title: string;
  synopsis: string;
  featuredImageUrl: string;
  content: string;
  isDeleted: boolean;
  isDisabled: boolean;
  disabledReason?: string;
  disabledAt?: string;
  createdAt: string;
  viewCount: number;
  likesCount: number;
  commentsCount: number;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    userName: string;
  };
  category?: {
    id: string;
    name: string;
  };
};

const AdminBlogs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const queryClient = useQueryClient();

  const { data: blogsData, isLoading } = useQuery({
    queryKey: ["admin-blogs"],
    queryFn: async (): Promise<{ blogs: Blog[] }> => {
      const res = await api.get("/admin/blogs");
      return res.data;
    },
  });

  const disableBlog = useMutation({
    mutationFn: async ({
      blogId,
      reason,
    }: {
      blogId: string;
      reason: string;
    }) => {
      const res = await api.patch(`/admin/blogs/${blogId}/disable`, { reason });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
    },
  });

  const enableBlog = useMutation({
    mutationFn: async (blogId: string) => {
      const res = await api.patch(`/admin/blogs/${blogId}/enable`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
    },
  });

  const trashBlog = useMutation({
    mutationFn: async (blogId: string) => {
      const res = await api.patch(`/blogs/trash/${blogId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
    },
  });

  const restoreBlog = useMutation({
    mutationFn: async (blogId: string) => {
      const res = await api.patch(`/blogs/restore/${blogId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
    },
  });

  const deleteBlogPermanently = useMutation({
    mutationFn: async (blogId: string) => {
      const res = await api.delete(`/admin/blogs/${blogId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
    },
  });

  const blogs = blogsData?.blogs || [];

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      searchQuery === "" ||
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.synopsis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.user.userName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && !blog.isDisabled && !blog.isDeleted) ||
      (statusFilter === "disabled" && blog.isDisabled) ||
      (statusFilter === "trashed" && blog.isDeleted);

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (blog: Blog) => {
    if (blog.isDeleted) {
      return (
        <Badge variant="secondary" className="bg-red-100 text-red-800">
          Trashed
        </Badge>
      );
    }
    if (blog.isDisabled) {
      return (
        <Badge variant="secondary" className="bg-orange-100 text-orange-800">
          Disabled
        </Badge>
      );
    }
    return (
      <Badge variant="default" className="bg-green-100 text-green-800">
        Active
      </Badge>
    );
  };

  if (isLoading) {
    return <BlogsSkeleton />;
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Blog Moderation</h1>
        <p className="text-gray-600">Manage and moderate blog content</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search blogs by title, description, or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="disabled">Disabled</option>
            <option value="trashed">Trashed</option>
          </select>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">{blogs.length}</div>
          <div className="text-sm text-gray-600">Total Blogs</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-green-600">
            {blogs.filter((b) => !b.isDisabled && !b.isDeleted).length}
          </div>
          <div className="text-sm text-gray-600">Active</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-orange-600">
            {blogs.filter((b) => b.isDisabled).length}
          </div>
          <div className="text-sm text-gray-600">Disabled</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-red-600">
            {blogs.filter((b) => b.isDeleted).length}
          </div>
          <div className="text-sm text-gray-600">Trashed</div>
        </div>
      </div>

      {/* Blogs Grid */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
          {filteredBlogs.map((blog) => (
            <div
              key={blog.id}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Blog Image */}
              {blog.featuredImageUrl && (
                <div className="h-48 bg-gray-200 overflow-hidden">
                  <img
                    src={blog.featuredImageUrl}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Blog Content */}
              <div className="p-4">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {blog.synopsis}
                    </p>
                  </div>
                </div>

                {/* Author and Category */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {blog.user.firstName} {blog.user.lastName}
                    </span>
                  </div>
                  {blog.category && (
                    <Badge variant="outline" className="text-xs">
                      {blog.category.name}
                    </Badge>
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {blog.viewCount}
                  </div>
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="h-3 w-3" />
                    {blog.likesCount}
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" />
                    {blog.commentsCount}
                  </div>
                </div>

                {/* Status and Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  {getStatusBadge(blog)}

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {/* Active Blog Options */}
                      {!blog.isDisabled && !blog.isDeleted && (
                        <>
                          <DropdownMenuItem
                            onClick={() =>
                              disableBlog.mutate({
                                blogId: blog.id,
                                reason: "Violation of community guidelines",
                              })
                            }
                            className="text-orange-600"
                          >
                            <EyeOff className="h-4 w-4 mr-2" />
                            Disable Blog
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => trashBlog.mutate(blog.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Move to Trash
                          </DropdownMenuItem>
                        </>
                      )}

                      {/* Disabled Blog Options */}
                      {blog.isDisabled && !blog.isDeleted && (
                        <>
                          <DropdownMenuItem
                            onClick={() => enableBlog.mutate(blog.id)}
                            className="text-green-600"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Enable Blog
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => trashBlog.mutate(blog.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Move to Trash
                          </DropdownMenuItem>
                        </>
                      )}

                      {/* Trashed Blog Options */}
                      {blog.isDeleted && (
                        <>
                          <DropdownMenuItem
                            onClick={() => restoreBlog.mutate(blog.id)}
                            className="text-green-600"
                          >
                            <Undo className="h-4 w-4 mr-2" />
                            Restore from Trash
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              deleteBlogPermanently.mutate(blog.id)
                            }
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Permanently
                          </DropdownMenuItem>
                        </>
                      )}

                      <DropdownMenuItem>View Details</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Disabled Reason */}
                {blog.disabledReason && (
                  <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded text-xs text-orange-800">
                    <strong>Reason:</strong> {blog.disabledReason}
                    {blog.disabledAt && (
                      <div className="text-orange-600 mt-1">
                        Disabled on:{" "}
                        {new Date(blog.disabledAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredBlogs.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-4xl mb-3">📝</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No blogs found
            </h3>
            <p className="text-gray-600">
              {searchQuery
                ? `No results for "${searchQuery}"`
                : "No blogs match the current filters"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Skeleton component
function BlogsSkeleton() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>

      <div className="flex gap-4 mb-6">
        <Skeleton className="h-10 flex-1 max-w-md" />
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-lg" />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <Skeleton className="h-48 w-full" />
            <div className="p-4 space-y-3">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <div className="flex gap-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-8 w-8 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminBlogs;
