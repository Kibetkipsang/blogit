import { useEffect, useState, type FormEvent } from "react";
import useAuthStore from "@/stores/useStore";
import { useNavigate, useLocation } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { uploadToCloudinary } from "../../lib/cloudinary";
import { api } from "../../axios";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Loader2, ArrowLeft, Save, FileText, Image as ImageIcon, Edit3 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

type BlogContentType = {
  title: string;
  synopsis: string;
  featuredImageUrl: string;
  content: string;
  categoryId?: string;
};

type BlogData = {
  id?: string;
  title: string;
  synopsis: string;
  content: string;
  featuredImageUrl?: string;
  category?: {
    id: string;
    name: string;
  };
};

const createBlog = async (formData: BlogContentType) => {
  const res = await api.post("/blogs/create", formData);
  return res.data;
};

const updateBlog = async (blogId: string, formData: BlogContentType) => {
  const res = await api.patch(`/blogs/${blogId}`, formData);
  return res.data;
};

const fetchCategories = async () => {
  const res = await api.get("/categories");
  return res.data;
}

function CreateBlog() {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get edit mode from navigation state
  const { isEditing, blogId, blogData } = location.state || {};
  
  const [title, setTitle] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [content, setContent] = useState("");
  const [featuredImageUrl, setFeaturedImageUrl] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState("");
  const [category, setCategory] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [tab, setTab] = useState("write");
  const [categories, setCategories] = useState([]);

  // Initialize form with blog data if in edit mode
  useEffect(() => {
    if (isEditing && blogData) {
      setTitle(blogData.title || "");
      setSynopsis(blogData.synopsis || "");
      setContent(blogData.content || "");
      setExistingImageUrl(blogData.featuredImageUrl || "");
      if (blogData.category) {
        setCategory(blogData.category.name);
        setCategoryId(blogData.category.id);
      }
    }
  }, [isEditing, blogData]);

  const { mutate: createMutate, isPending: isCreating } = useMutation({
    mutationKey: ["createBlog"],
    mutationFn: createBlog,
    onSuccess: (data) => {
      toast.success("Blog Created Successfully!");
      navigate(`/blogs/${data.blogId}`);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Blog Creation Failed!");
    },
  });

  const { mutate: updateMutate, isPending: isUpdating } = useMutation({
    mutationKey: ["updateBlog", blogId],
    mutationFn: (formData: BlogContentType) => updateBlog(blogId!, formData),
    onSuccess: (data) => {
      toast.success("Blog Updated Successfully!");
      navigate(`/blogs/${blogId}`);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Blog Update Failed!");
    },
  });

  const { data, isLoading: isCategoriesLoading, error: categoriesError } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  useEffect(() => {
    if (data) {
      setCategories(Array.isArray(data) ? data : data.categories || []);
    }
  }, [data]);

  const isPending = isCreating || isUpdating;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!user) {
      navigate("/login");
      return;
    }

    let imageUrl = existingImageUrl;
    try {
      if (featuredImageUrl) {
        const uploadResult = await uploadToCloudinary(featuredImageUrl);
        imageUrl = uploadResult.secure_url;
      }
      
      const formData: BlogContentType = {
        title,
        synopsis,
        content,
        featuredImageUrl: imageUrl,
        ...(categoryId && { categoryId })
      };

      if (isEditing && blogId) {
        updateMutate(formData);
      } else {
        createMutate(formData);
      }
    } catch (error) {
      toast.error("Image upload failed. Please try again.");
    }
  }

  const handleImageRemove = () => {
    setFeaturedImageUrl(null);
    setExistingImageUrl("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(-1)}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div>
                <CardTitle className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                  <FileText className="h-8 w-8 text-green-600" />
                  {isEditing ? "Edit Blog" : "Create New Blog"}
                </CardTitle>
                <CardDescription className="text-lg">
                  {isEditing 
                    ? "Update your blog content and information" 
                    : "Share your thoughts and experiences with the world"
                  }
                </CardDescription>
              </div>
            </div>
            {isEditing && (
              <Badge variant="secondary" className="bg-green-100 text-green-800 text-sm py-1 px-3">
                <Edit3 className="h-3 w-3 mr-1" />
                Editing Mode
              </Badge>
            )}
          </CardHeader>
        </Card>

        {/* Main Form */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-base font-semibold text-gray-900">
                  Blog Title
                </Label>
                <Input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="Enter a compelling title for your blog..."
                  required
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category" className="text-base font-semibold text-gray-900">
                  Category
                </Label>
                {isCategoriesLoading ? (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading categories...
                  </div>
                ) : categoriesError ? (
                  <p className="text-red-600">Failed to load categories</p>
                ) : (
                  <select
                    id="category"
                    value={categoryId}
                    onChange={(e) => {
                      const selectedCategory = categories.find((cat: any) => cat.id === e.target.value);
                      setCategoryId(e.target.value);
                      setCategory(selectedCategory?.name || "");
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white transition-all"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat: any) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Synopsis */}
              <div className="space-y-2">
                <Label htmlFor="synopsis" className="text-base font-semibold text-gray-900">
                  Synopsis
                </Label>
                <Textarea
                  id="synopsis"
                  value={synopsis}
                  onChange={(e) => setSynopsis(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                  placeholder="Write a brief summary that captures the essence of your blog..."
                  rows={3}
                  required
                />
              </div>

              {/* Featured Image */}
              <div className="space-y-2">
                <Label htmlFor="image" className="text-base font-semibold text-gray-900">
                  Featured Image
                </Label>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      id="image"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setFeaturedImageUrl(e.target.files[0]);
                        }
                      }}
                      className="
                        block w-full text-gray-700
                        border border-gray-300 rounded-lg
                        cursor-pointer
                        file:mr-4 file:py-3 file:px-4
                        file:rounded-lg file:border-0
                        file:text-sm file:font-semibold
                        file:bg-green-600 file:text-white
                        file:hover:bg-green-700
                        focus:outline-none focus:ring-2 focus:ring-green-500
                        focus:ring-offset-2
                        transition-all
                      "
                    />
                  </div>
                  
                  {/* Image Preview */}
                  {(featuredImageUrl || existingImageUrl) && (
                    <div className="relative group">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
                        <ImageIcon className="h-8 w-8 text-green-600" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {featuredImageUrl ? featuredImageUrl.name : "Current Image"}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {existingImageUrl || "New image selected"}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleImageRemove}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="space-y-2">
                <Label htmlFor="content" className="text-base font-semibold text-gray-900">
                  Blog Content
                </Label>
                <Tabs value={tab} onValueChange={setTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg">
                    <TabsTrigger 
                      value="write" 
                      className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all"
                    >
                      Write
                    </TabsTrigger>
                    <TabsTrigger 
                      value="preview"
                      className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all"
                    >
                      Preview
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="write" className="mt-4">
                    <Textarea
                      id="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="w-full min-h-96 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none font-mono text-sm transition-all"
                      placeholder="Write your amazing content here... (Markdown supported)"
                      required
                    />
                  </TabsContent>
                  <TabsContent value="preview" className="mt-4">
                    <div className="w-full min-h-96 p-6 border border-gray-300 rounded-lg bg-white overflow-y-auto prose prose-sm max-w-none">
                      {content ? (
                        <ReactMarkdown>{content}</ReactMarkdown>
                      ) : (
                        <div className="text-center text-gray-500 py-16">
                          <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                          <p>Nothing to preview yet. Start writing to see your content here.</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                  className="flex-1"
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 text-base transition-all"
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      {isEditing ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {isEditing ? "Update Blog" : "Create Blog"}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default CreateBlog;