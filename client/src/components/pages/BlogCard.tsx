import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";


type BlogCardType = {
  id: string;
  title: string;
  synopsis: string;
  featuredImageUrl: string;
  authorName: string;
  createdAt: string;
};

export default function BlogCard({
  id,
  title,
  synopsis,
  featuredImageUrl,
  authorName,
  createdAt,
}: BlogCardType) {
  const navigate = useNavigate();


  return (
    <div className="bg-black rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 ">
      <img
        src={featuredImageUrl}
        alt={title}
        className="h-64 w-full object-cover"
        loading="lazy"
      />
      <div className="p-4 flex flex-col flex-1">
        <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
        <p className="text-gray-100 mb-4 flex-1">{synopsis}</p>
        <div className="flex justify-between items-center mt-auto gap-2">
          <p className="text-sm text-gray-300">Author: {authorName}</p>
          <p className="text-sm text-gray-300">Created At: {createdAt}</p>
          <Button
            size="sm"
            className="bg-green-800 hover:bg-green-900"
            onClick={() => navigate(`/blogs/${id}`)}
          >
            Read More
          </Button>
        </div>
      </div>
    </div>
  );
}