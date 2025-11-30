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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import {
  Loader2,
  ArrowLeft,
  Save,
  FileText,
  Image as ImageIcon,
  Edit3,
  Bold,
  Italic,
  List,
  ListOrdered,
  Link,
  Quote,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Eye,
  Type,
  User,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import remarkGfm from "remark-gfm";

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
  user?: {
    id: string;
    firstName?: string;
    lastName?: string;
    name?: string;
    email?: string;
    username?: string;
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
};

// Helper function to extract author name from user data
const getAuthorName = (user: any) => {
  if (!user) return "Unknown Author";

  if (user.name) {
    return user.name;
  }

  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }

  if (user.firstName) {
    return user.firstName;
  }

  if (user.lastName) {
    return user.lastName;
  }

  if (user.username) {
    return user.username;
  }

  if (user.email) {
    const emailName = user.email.split("@")[0];
    return emailName.charAt(0).toUpperCase() + emailName.slice(1);
  }

  return "Unknown Author";
};

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

  // User validation effect
  useEffect(() => {
    if (!user) {
      toast.error("Please log in to create or edit blogs");
      navigate("/login");
      return;
    }
  }, [user, navigate]);

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

      // Authorization check for edit mode
      if (blogData.user && blogData.user.id !== user?.id) {
        toast.error("You can only edit your own blogs");
        navigate("/blogs");
      }
    }
  }, [isEditing, blogData, user, navigate]);

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

  const {
    data,
    isLoading: isCategoriesLoading,
    error: categoriesError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  useEffect(() => {
    if (data) {
      setCategories(Array.isArray(data) ? data : data.categories || []);
    }
  }, [data]);

  const isPending = isCreating || isUpdating;

  // Markdown formatting functions
  const insertText = (
    before: string,
    after: string = "",
    defaultText: string = "",
  ) => {
    const textarea = document.getElementById("content") as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end) || defaultText;

    const newText =
      content.substring(0, start) +
      before +
      selectedText +
      after +
      content.substring(end);
    setContent(newText);

    // Set cursor position after insertion
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + selectedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const insertAtCursor = (text: string) => {
    const textarea = document.getElementById("content") as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newText = content.substring(0, start) + text + content.substring(end);

    setContent(newText);

    // Set cursor position after insertion
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + text.length, start + text.length);
    }, 0);
  };

  // Toolbar buttons configuration
  const toolbarButtons = [
    {
      icon: <Heading1 className="h-4 w-4" />,
      tooltip: "Heading 1",
      action: () => insertAtCursor("# "),
    },
    {
      icon: <Heading2 className="h-4 w-4" />,
      tooltip: "Heading 2",
      action: () => insertAtCursor("## "),
    },
    {
      icon: <Heading3 className="h-4 w-4" />,
      tooltip: "Heading 3",
      action: () => insertAtCursor("### "),
    },
    {
      icon: <Bold className="h-4 w-4" />,
      tooltip: "Bold",
      action: () => insertText("**", "**", "bold text"),
    },
    {
      icon: <Italic className="h-4 w-4" />,
      tooltip: "Italic",
      action: () => insertText("*", "*", "italic text"),
    },
    {
      icon: <List className="h-4 w-4" />,
      tooltip: "Bullet List",
      action: () => insertAtCursor("- "),
    },
    {
      icon: <ListOrdered className="h-4 w-4" />,
      tooltip: "Numbered List",
      action: () => insertAtCursor("1. "),
    },
    {
      icon: <Link className="h-4 w-4" />,
      tooltip: "Link",
      action: () => insertText("[", "](https://)", "link text"),
    },
    {
      icon: <Code className="h-4 w-4" />,
      tooltip: "Code",
      action: () => insertText("`", "`", "code"),
    },
    {
      icon: <Quote className="h-4 w-4" />,
      tooltip: "Blockquote",
      action: () => insertAtCursor("> "),
    },
  ];

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!user) {
      toast.error("Please log in to continue");
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
        ...(categoryId && { categoryId }),
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

  // Markdown guide examples
  const markdownExamples = `# Welcome to Markdown!

## Formatting Tips:

**Bold text** and *italic text*

### Lists:
- Bullet points
- Another point
- Third point

### Numbered lists:
1. First item
2. Second item
3. Third item

### Code:
\`inline code\`

\`\`\`javascript
// Code blocks
function hello() {
  console.log("Hello Markdown!");
}
\`\`\`

### Links and Images:
[Link text](https://example.com)

![Image alt text](https://example.com/image.jpg)

### Blockquotes:
> This is a blockquote
> It can span multiple lines
`;

  const insertMarkdownExample = () => {
    setContent(markdownExamples);
    toast.info("Markdown examples added! Feel free to edit them.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                    : "Share your thoughts and experiences with the world"}
                </CardDescription>
              </div>
            </div>
            {isEditing && (
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800 text-sm py-1 px-3"
              >
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
              {/* Author Display */}
              {user && (
                <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <User className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-800">
                      This blog will be published under:
                    </p>
                    <p className="text-lg font-semibold text-green-900">
                      {getAuthorName(user)}
                    </p>
                  </div>
                </div>
              )}

              {/* Title */}
              <div className="space-y-2">
                <Label
                  htmlFor="title"
                  className="text-base font-semibold text-gray-900"
                >
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
                <Label
                  htmlFor="category"
                  className="text-base font-semibold text-gray-900"
                >
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
                      const selectedCategory = categories.find(
                        (cat: any) => cat.id === e.target.value,
                      );
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
                <Label
                  htmlFor="synopsis"
                  className="text-base font-semibold text-gray-900"
                >
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
                <Label
                  htmlFor="image"
                  className="text-base font-semibold text-gray-900"
                >
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
                            {featuredImageUrl
                              ? featuredImageUrl.name
                              : "Current Image"}
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
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="content"
                    className="text-base font-semibold text-gray-900"
                  >
                    Blog Content
                  </Label>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={insertMarkdownExample}
                      className="text-xs"
                    >
                      Load Examples
                    </Button>
                  </div>
                </div>

                <Tabs value={tab} onValueChange={setTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg">
                    <TabsTrigger
                      value="write"
                      className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all flex items-center gap-2"
                    >
                      <Type className="h-4 w-4" />
                      Write
                    </TabsTrigger>
                    <TabsTrigger
                      value="preview"
                      className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      Preview
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="write" className="mt-4 space-y-3">
                    {/* Markdown Toolbar */}
                    <div className="flex flex-wrap gap-1 p-3 bg-gray-50 border border-gray-300 rounded-lg">
                      {toolbarButtons.map((button, index) => (
                        <Button
                          key={index}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={button.action}
                          className="h-8 w-8 p-0 hover:bg-white"
                          title={button.tooltip}
                        >
                          {button.icon}
                        </Button>
                      ))}
                    </div>

                    <Textarea
                      id="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="w-full min-h-96 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none font-mono text-sm transition-all"
                      placeholder={`# Start writing your blog here...

Use the toolbar above to format your text, or type Markdown directly:

# Header 1
## Header 2  
### Header 3

**Bold text** and *italic text*

- Bullet lists
- Another item

1. Numbered lists
2. Second item

[Links](https://example.com)

> Blockquotes

\`inline code\`

\`\`\`javascript
// Code blocks
console.log("Hello World!");
\`\`\``}
                      required
                    />
                  </TabsContent>

                  <TabsContent value="preview" className="mt-4">
                    <div className="w-full min-h-96 p-6 border border-gray-300 rounded-lg bg-white overflow-y-auto prose prose-sm max-w-none">
                      {content ? (
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {content}
                        </ReactMarkdown>
                      ) : (
                        <div className="text-center text-gray-500 py-16">
                          <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                          <p>
                            Nothing to preview yet. Start writing to see your
                            content here.
                          </p>
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
