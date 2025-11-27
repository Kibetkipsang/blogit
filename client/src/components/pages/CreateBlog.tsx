import { useEffect, useState, type FormEvent } from "react";
import useAuthStore from "@/stores/useStore";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { uploadToCloudinary } from "../../lib/cloudinary";
import { api } from "../../axios";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

type BlogContentType = {
  title: string;
  synopsis: string;
  featuredImageUrl: string;
  content: string;
};

const createBlog = async (formData: BlogContentType) => {
  const res = await api.post("/blogs/create", formData);
  return res.data;
};

const fetchCategories = async () => {
  const res = await api.get("/categories");
  return res.data;
}

function CreateBlog() {
  const user = useAuthStore((state) => state.user);
  const [title, setTitle] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [content, setContent] = useState("");
  const [featuredImageUrl, setFeaturedImageUrl] = useState<File | null>(null);
  const [category, setCategory] = useState("");
  const [tab, setTab] = useState("write");
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
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

  const {data, isLoading: isCategoriesLoading, error: categoriesError} = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  useEffect(() => {
  if (data) {
    setCategories(Array.isArray(data) ? data : data.categories || []);
  }
}, [data]);


  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!user) {
      navigate("/login");
      return;
    }

    let imageUrl = "";
    try {
      if (featuredImageUrl) {
        const uploadResult = await uploadToCloudinary(featuredImageUrl);
        imageUrl = uploadResult.secure_url;
      }
      const formData = {
        title,
        synopsis,
        content,
        featuredImageUrl: imageUrl,
      };

      mutate(formData);
    } catch (error) {
      toast.error("Image upload failed. Please try again.");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex flex-col gap-6">
      <h1 className="text-3xl font-bold mb-6">Create New Blog</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="title">Title</Label>
          <Input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter your title"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
  <Label htmlFor="category">Category</Label>
  {isCategoriesLoading ? (
    <p>Loading categories...</p>
  ) : categoriesError ? (
    <p className="text-red-600">Failed to load categories</p>
  ) : (
    <select
      id="category"
      value={category}
      onChange={(e) => setCategory(e.target.value)}
      className="w-full p-2 border border-gray-300 rounded"
      required
    >
      <option value="">Select category</option>
      {categories.map((cat: any) => (
        <option key={cat.id} value={cat.name}>
          {cat.name}
        </option>
      ))}
    </select>
  )}
</div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="synopsis">Synopsis</Label>
          <Textarea
            id="synopsis"
            value={synopsis}
            onChange={(e) => setSynopsis(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="A brief summary of what your blog is about"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="image">Featured Image URL</Label>
<div className="flex flex-col gap-2">
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
      border border-gray-300 rounded-sm
      cursor-pointer
      file:mr-4 file:py-2 file:px-4
      file:rounded-md file:border-0
      file:text-sm file:font-semibold
      file:bg-green-800 file:text-white
      file:hover:bg-green-900
      focus:outline-none focus:ring-2 focus:ring-green-600
      focus:ring-offset-2
      transition-colors
    "
  />
  {featuredImageUrl && (
    <p className="text-sm text-gray-600 truncate">{featuredImageUrl.name}</p>
  )}
</div>

        
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="content">Content</Label>
          <Tabs>
            <TabsList>
              <TabsTrigger value="write">Write</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            <TabsContent value="write">
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-64 p-2 border border-gray-300 rounded"
                placeholder="Write your blog content here..."
                required
              />
            </TabsContent>
            <TabsContent value="preview">
              <div className="w-full h-64 p-4 border border-gray-300 rounded overflow-y-auto bg-white">
                <ReactMarkdown>{content || "Nothing to preview"}</ReactMarkdown>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <Button
          type="submit"
          className="w-full bg-green-800 hover:bg-green-900"
          disabled={isPending}
        >
          {isPending ? "Creating..." : "Create Blog"}
        </Button>
      </form>
    </div>
  );
}

export default CreateBlog;
