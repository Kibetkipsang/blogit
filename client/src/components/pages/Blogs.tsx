import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import api from "@/axios";
import BlogCard from "./BlogCard";

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
};

type CategoryType = {
  id: string;
  name: string;
};

type BlogsResponse = {
  success: boolean;
  message: string;
  blogs: BlogType[];
  count: number;
};

type CategoriesResponse = {
  message: string;
  categories: CategoryType[];
};

// Define fetchBlogs ONCE outside the component
const fetchBlogs = async (): Promise<BlogType[]> => {
  const res = await api.get("/blogs");
  
  // Handle the new response structure
  if (res.data && Array.isArray(res.data.blogs)) {
    return res.data.blogs; // New structure
  } else if (Array.isArray(res.data)) {
    return res.data; // Fallback to old structure
  } else {
    console.error("Unexpected API response:", res.data);
    return []; // Return empty array as fallback
  }
};

const fetchCategories = async () => {
  const res = await api.get("/categories");
  return res.data;
};

function Blogs() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  
  const { 
    data: blogsData, 
    isPending: blogsLoading, 
    isError: blogsError, 
    error: blogsErr 
  } = useQuery<BlogType[]>({
    queryKey: ["blogs"],
    queryFn: fetchBlogs, // Use the fixed fetchBlogs
  });

  const { 
    data: categoriesData, 
    isLoading: categoriesLoading 
  } = useQuery<CategoriesResponse>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const categories: CategoryType[] = categoriesData?.categories || [];
  const blogs: BlogType[] = blogsData || []; // Ensure blogs is always an array

  // Add filteredBlogs calculation
  const filteredBlogs = 
    selectedCategory === "All" 
      ? blogs 
      : blogs.filter(b => 
          b.category?.name.toLowerCase() === selectedCategory.toLowerCase()
        );

  if (blogsLoading || categoriesLoading) {
    return (
      <p className="mt-24 text-center text-gray-600 text-lg">Loading...</p>
    );
  }

  if (blogsError) {
    return (
      <p className="mt-24 text-center text-red-600">
        {(blogsErr as any)?.response?.data?.message || "Failed to load blogs."}
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 mt-24">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">All Blogs</h1>

      <div className="flex flex-wrap gap-3 mb-6">
        <button
          className={`px-4 py-2 rounded-md font-medium border transition-colors ${
            selectedCategory === "All"
              ? "bg-green-800 text-white border-green-800"
              : "bg-white text-gray-800 border-gray-300 hover:bg-green-100"
          }`}
          onClick={() => setSelectedCategory("All")}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`px-4 py-2 rounded-md font-medium border transition-colors ${
              selectedCategory === cat.name
                ? "bg-green-800 text-white border-green-800"
                : "bg-white text-gray-800 border-gray-300 hover:bg-green-100"
            }`}
            onClick={() => setSelectedCategory(cat.name)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {filteredBlogs.length === 0 ? (
        <p className="text-center text-gray-600 mt-12">No blogs found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.map((blog) => (
            <BlogCard
              key={blog.id}
              id={blog.id}
              title={blog.title}
              synopsis={blog.synopsis}
              featuredImageUrl={blog.featuredImageUrl}
              authorName="Author"
              createdAt={blog.createdAt}
              category={blog.category?.name}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Blogs;