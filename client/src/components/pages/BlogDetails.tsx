import { useParams } from "react-router-dom";
import { api } from "@/axios";
import { useQuery } from "@tanstack/react-query";

function BlogDetails() {
  const { id } = useParams();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["blog", id],
    queryFn: async () => {
      const res = await api.get(`/blogs/${id}`);
      return res.data;
    },
  });

  if (isLoading)
    return (
      <p className="mt-24 text-center text-gray-600 text-lg">Loading...</p>
    );

  if (isError)
    return (
      <p className="mt-24 text-center text-red-600">
        {(error as any)?.response?.data?.message || "An unexpected error occurred"}
      </p>
    );

  return (
    <div className="min-h-screen bg-white w-full pt-24 px-6 md:px-10">
      {data && (
        <div className="max-w-5xl mx-auto">

          <h1 className="text-4xl font-extrabold text-gray-900 mb-8">
            {data.title}
          </h1>

    
          <div className="clearfix">

            <img
              src={data.featuredImageUrl}
              alt={data.title}
              className="
                w-full max-w-md 
                rounded-xl shadow-md mb-6 
                float-right ml-6 
                object-cover
              "
            />

            <div className="text-gray-800 text-lg leading-relaxed">
              <p className="whitespace-pre-line">{data.content}</p>
            </div>

          </div>

      
          <div className="clear-both mt-8 text-gray-500 text-sm border-t pt-4">
            <p>Author: {data.authorName}</p>
            <p>{new Date(data.createdAt).toDateString()}</p>
          </div>

        </div>
      )}
    </div>
  );
}

export default BlogDetails;
