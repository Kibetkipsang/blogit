import { useParams } from "react-router-dom";
import { api } from "@/axios";
import { useQuery } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { 
  Calendar, 
  User, 
  Clock, 
  ArrowLeft, 
  Share2, 
  Bookmark,
  Eye,
  Tag,
  Facebook,
  Twitter,
  Linkedin,
  Link
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function BlogDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["blog", id],
    queryFn: async () => {
      const res = await api.get(`/blogs/${id}`);
      return res.data;
    },
  });

  const handleShare = async (platform?: string) => {
    const shareUrl = window.location.href;
    const title = data?.title || 'Check out this blog post';
    const text = data?.synopsis || '';

    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied to clipboard!");
        break;
      default:
        if (navigator.share) {
          try {
            await navigator.share({
              title: title,
              text: text,
              url: shareUrl,
            });
          } catch (err) {
            console.log('Error sharing:', err);
          }
        } else {
          navigator.clipboard.writeText(shareUrl);
          toast.success("Link copied to clipboard!");
        }
    }
  };

  const formatReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  if (isLoading) return <BlogDetailsSkeleton />;

  if (isError)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24 flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Blog Not Found</h2>
          <p className="text-gray-600 mb-6">
            {(error as any)?.response?.data?.message || "The blog you're looking for doesn't exist or has been removed."}
          </p>
          <Button onClick={() => navigate('/blogs')} className="bg-green-600 hover:bg-green-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blogs
          </Button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Back Navigation */}
      <div className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {data && (
          <article className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 md:p-8 lg:p-10">
              {/* Pinterest-style Layout */}
              <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                {/* Main Content Area */}
                <div className="flex-1 min-w-0">
                  {/* Category Badge */}
                  {data.category && (
                    <Badge 
                      variant="secondary" 
                      className="mb-6 bg-green-100 text-green-800 hover:bg-green-200 text-sm font-medium"
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {data.category.name}
                    </Badge>
                  )}

                  {/* Title */}
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
                    {data.title}
                  </h1>

                  {/* Synopsis */}
                  {data.synopsis && (
                    <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed border-l-4 border-green-500 pl-6 py-2 bg-gray-50 rounded-r-lg">
                      {data.synopsis}
                    </p>
                  )}

                  {/* Meta Information */}
                  <div className="flex flex-wrap items-center gap-4 md:gap-6 mb-8 text-gray-500">
                    <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg">
                      <User className="h-4 w-4" />
                      <span className="font-medium">{data.authorName || "Unknown Author"}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg">
                      <Calendar className="h-4 w-4" />
                      <span className="font-medium">{new Date(data.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg">
                      <Clock className="h-4 w-4" />
                      <span className="font-medium">{formatReadTime(data.content)}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 mb-8 pb-8 border-b border-gray-200">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <Share2 className="h-4 w-4" />
                          Share
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-48">
                        <DropdownMenuItem onClick={() => handleShare('twitter')}>
                          <Twitter className="h-4 w-4 mr-2" />
                          Share on Twitter
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleShare('facebook')}>
                          <Facebook className="h-4 w-4 mr-2" />
                          Share on Facebook
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleShare('linkedin')}>
                          <Linkedin className="h-4 w-4 mr-2" />
                          Share on LinkedIn
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleShare('copy')}>
                          <Link className="h-4 w-4 mr-2" />
                          Copy Link
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Bookmark className="h-4 w-4" />
                      Save
                    </Button>
                  </div>

                  {/* Blog Content with Markdown */}
                  <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-p:text-lg">
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h1: ({node, ...props}) => <h1 className="text-3xl font-bold text-gray-900 mt-10 mb-6 pb-2 border-b border-gray-200" {...props} />,
                        h2: ({node, ...props}) => <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-5" {...props} />,
                        h3: ({node, ...props}) => <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4" {...props} />,
                        p: ({node, ...props}) => <p className="text-gray-700 leading-relaxed mb-6 text-lg" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-3 mb-6 text-gray-700 text-lg" {...props} />,
                        ol: ({node, ...props}) => <ol className="list-decimal list-inside space-y-3 mb-6 text-gray-700 text-lg" {...props} />,
                        li: ({node, ...props}) => <li className="text-gray-700 leading-relaxed mb-1" {...props} />,
                        blockquote: ({node, ...props}) => (
                          <blockquote className="border-l-4 border-green-500 pl-6 italic text-gray-600 my-8 text-lg bg-gray-50 py-4 rounded-r-lg" {...props} />
                        ),
                        code: ({node, inline, ...props}) => 
                          inline ? 
                            <code className="bg-gray-100 rounded px-2 py-1 text-sm font-mono text-gray-800 border" {...props} /> :
                            <code className="block bg-gray-900 text-gray-100 rounded-lg p-5 my-6 overflow-x-auto text-sm font-mono border-l-4 border-green-500" {...props} />,
                        a: ({node, ...props}) => <a className="text-green-600 hover:text-green-700 underline font-medium" {...props} />,
                        img: ({node, ...props}) => <img className="rounded-xl shadow-md my-8 mx-auto max-w-full h-auto" {...props} />,
                      }}
                    >
                      {data.content}
                    </ReactMarkdown>
                  </div>
                </div>

                {/* Pinterest-style Side Image */}
                {data.featuredImageUrl && (
                  <div className="lg:w-96 xl:w-[480px] flex-shrink-0">
                    <div className="sticky top-24">
                      <div className="rounded-2xl overflow-hidden shadow-lg group cursor-pointer">
                        <img
                          src={data.featuredImageUrl}
                          alt={data.title}
                          className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="eager"
                        />
                      </div>
                      
                      {/* Save Button - Pinterest Style */}
                      <div className="mt-4 flex justify-center">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2 bg-white border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 w-full justify-center"
                        >
                          <Bookmark className="h-4 w-4" />
                          Save
                        </Button>
                      </div>

                      {/* Quick Stats */}
                      <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                        <h3 className="font-semibold text-gray-900 mb-3">Article Details</h3>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex justify-between">
                            <span>Reading time:</span>
                            <span className="font-medium">{formatReadTime(data.content)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Published:</span>
                            <span className="font-medium">{new Date(data.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Author:</span>
                            <span className="font-medium">{data.authorName || "Unknown"}</span>
                          </div>
                          {data.category && (
                            <div className="flex justify-between">
                              <span>Category:</span>
                              <span className="font-medium">{data.category.name}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Share Sidebar */}
                      <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                        <h3 className="font-semibold text-gray-900 mb-3">Share this article</h3>
                        <div className="flex flex-col gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleShare('twitter')}
                            className="flex items-center gap-2 justify-start bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100"
                          >
                            <Twitter className="h-4 w-4" />
                            Share on Twitter
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleShare('facebook')}
                            className="flex items-center gap-2 justify-start bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100"
                          >
                            <Facebook className="h-4 w-4" />
                            Share on Facebook
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleShare('linkedin')}
                            className="flex items-center gap-2 justify-start bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100"
                          >
                            <Linkedin className="h-4 w-4" />
                            Share on LinkedIn
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleShare('copy')}
                            className="flex items-center gap-2 justify-start"
                          >
                            <Link className="h-4 w-4" />
                            Copy Link
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4 text-gray-500">
                    <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg">
                      <Eye className="h-4 w-4" />
                      <span className="text-sm font-medium">Published on {new Date(data.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/blogs')}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Blogs
                  </Button>
                </div>
              </div>
            </div>
          </article>
        )}
      </div>
    </div>
  );
}

// Skeleton Loading Component
function BlogDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 md:p-8 lg:p-10">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
              {/* Main Content Skeleton */}
              <div className="flex-1 min-w-0 space-y-6">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-12 w-1/2" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-2/3" />
                
                <div className="flex flex-wrap gap-4">
                  <Skeleton className="h-10 w-32 rounded-lg" />
                  <Skeleton className="h-10 w-40 rounded-lg" />
                  <Skeleton className="h-10 w-28 rounded-lg" />
                </div>
                
                <div className="flex gap-3">
                  <Skeleton className="h-9 w-20 rounded-md" />
                  <Skeleton className="h-9 w-20 rounded-md" />
                </div>
                
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              </div>

              {/* Sidebar Skeleton */}
              <div className="lg:w-96 xl:w-[480px] flex-shrink-0 space-y-4">
                <Skeleton className="w-full h-64 rounded-2xl" />
                <Skeleton className="w-full h-10 rounded-md" />
                <Skeleton className="w-full h-32 rounded-xl" />
                <Skeleton className="w-full h-40 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogDetails;