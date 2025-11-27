import { useQuery } from "@tanstack/react-query";
import api from "@/axios";
import BlogCard from "./BlogCard";

const fetchBlogs = async () => {
  const response = await api.get("/blogs");
  return response.data;
};

type DataType = {
  id: string;
  title: string;
  synopsis: string;
  featuredImageUrl: string;
  content: string;
  createdAt: string;
};

function Blogs() {
  const { data, isPending, isError, error } = useQuery<DataType[]>({
    queryKey: ["blogs"],
    queryFn: fetchBlogs,
  });

  if (isPending) {
    return (
      <p className="mt-24 text-center text-gray-600 text-lg">
        Loading blogs...
      </p>
    );
  }

  if (isError) {
    return (
      <p className="mt-24 text-center text-red-600">
        {(error as any)?.response?.data?.message ||
          "An unexpected error occurred"}
      </p>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">No blogs found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-24">
      {data.map((blog) => (
        <BlogCard
          id={blog.id}
          title={blog.title}
          synopsis={blog.synopsis}
          featuredImageUrl={blog.featuredImageUrl}
          authorName={"Author"}
          createdAt={blog.createdAt}
        />
      ))}
    </div>
  );
}

export default Blogs;
