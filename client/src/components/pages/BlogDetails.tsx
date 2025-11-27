import { useParams } from "react-router-dom";
import {api} from "@/axios";
import { useQuery } from "@tanstack/react-query";

function BlogDetails() {
  const { id } = useParams();
  const {data, isLoading, isError, error} = useQuery({
    queryKey: ["blog", id],
    queryFn: async () => {
      const response = await api.get(`/blogs/${id}`);
      return response.data;
    },
  })

  if (isLoading){
    return <p className="mt-24 text-center text-gray-600 text-lg">Loading blog details...</p>
  }

  if (isError){
    return <p className="mt-24 text-center text-red-600">{(error as any)?.response?.data?.message || "An unexpected error occurred"}</p>
  }

  return (
    <div className="min-h-screen bg-green-600 w-full">
  {data && (
    <div className="w-full max-w-full mx-auto p-8 mt-24">

    
      <h1 className="text-4xl font-bold text-white mb-6">{data.title}</h1>

      <div className="flex flex-col md:flex-row gap-6 w-full">

 
        <img
          src={data.featuredImageUrl}
          alt={data.title}
          className="
            w-full md:w-1/2
            h-16 md:h-auto object-cover rounded-md shadow-md
          "
          loading="lazy"
        />
        <div className="flex-1 text-white text-lg leading-relaxed">
          <p className="whitespace-pre-line">{data.content}</p>       
        </div>
      </div>
      <div className="mt-6 md:mt-8 text-white text-lg leading-relaxed">
        <p className="whitespace-pre-line">{data.content}</p>
      </div>
      <div className="mt-6 text-white/80 text-sm space-y-1">
            <p>Author: {data.authorName}</p>
            <p>{new Date(data.createdAt).toDateString()}</p>
          </div>
    </div>
  )}
</div>

  )
}

export default BlogDetails