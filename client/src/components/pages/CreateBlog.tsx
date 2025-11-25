import { useState, type FormEvent } from "react";
import useAuthStore from "@/stores/useStore";
import { useNavigate } from "react-router-dom";
import { api } from "../../axios";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { uploadToCloudinary } from "../../lib/cloudinary";

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

function CreateBlog() {
  const user = useAuthStore((state) => state.user);
  const [title, setTitle] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [content, setContent] = useState("");
  const [featuredImageUrl, setFeaturedImageUrl] = useState<File | null>(null);
  const [tab, setTab] = useState("write");
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
          <Input
            type="file"
            id="image"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setFeaturedImageUrl(e.target.files[0]);
              }
            }}
          />
          {featuredImageUrl && (
            <p className="text-sm text-gray-600">{featuredImageUrl.name}</p>
          )}
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
