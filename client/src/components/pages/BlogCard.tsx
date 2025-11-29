import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

type BlogCardType = {
  id: string;
  title: string;
  synopsis: string;
  featuredImageUrl: string;
  authorName: string;
  createdAt: string;
  category?: string; // Change this to string since you're passing category name directly
};

export default function BlogCard({
  id,
  title,
  category, // This is now a string
  synopsis,
  featuredImageUrl,
  authorName,
  createdAt,
}: BlogCardType) {
  const navigate = useNavigate();

  return (
    <div
      className="
        bg-white rounded-sm shadow-md 
        hover:shadow-xl transition-all duration-300 
        overflow-hidden border border-gray-100 
        cursor-pointer
      "
      onClick={() => navigate(`/blogs/${id}`)}
    >
      <div className="h-56 w-full overflow-hidden">
        <img
          src={featuredImageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>

      <div className="p-5 pt-5 space-y-3">
        <h2 className="text-lg font-bold text-gray-900">
          {title}
        </h2>
        
        {/* Fixed category display - now using category directly as string */}
        {category && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-md">
              {category}
            </span>
          </div>
        )}
        
        <p className="text-gray-600 text-sm line-clamp-3">
          {synopsis}
        </p>
        
        <div className="flex justify-between items-center text-xs text-gray-500 pt-2">
          <div>
            <p className="text-gray-700 font-medium">{authorName}</p>
            <p>{new Date(createdAt).toDateString()}</p>
          </div>

          <Button
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/blogs/${id}`);
            }}
          >
            Read More
          </Button>
        </div>
      </div>
    </div>
  );
}