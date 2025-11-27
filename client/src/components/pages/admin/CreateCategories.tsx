import { useState } from "react";
import { api } from "../../../axios";
import { useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";


const createCategory = async (name: string) => {
  const res = await api.post("/categories/create", { name });
  return res.data;
};

function CreateCategories() {
  const [name, setName] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const { mutate, isPending } = useMutation({
    mutationKey: ["createCategory"],
    mutationFn: () => createCategory(name),
    onSuccess: () => {
      setName(""); 
      toast.success("Category created successfully");
    },
    onError: (error: any) => {
      console.error(error?.response?.data?.message || "Error creating category");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    mutate();
  };

  return (
    <div className="p-8">
  
      <div className="flex justify-between border-b border-b-gray-100 pb-4 mb-6">
        <h2 className="text-2xl font-bold mb-4">Create and Manage Categories</h2>
        <nav>
          <Link to="/admin/adminCategories" className="text-blue-600 hover:underline">
            Manage Categories
          </Link>
        </nav>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-4">
          <Label htmlFor="categoryName">Category Name</Label>
          <Input
            id="categoryName"
            type="text"
            placeholder="Enter category name"
            value={name}
            onChange={handleChange}
            disabled={isPending}
          />
        </div>
        <Button type="submit" disabled={isPending} className="bg-green-700 hover:bg-green-800">
          {isPending ? "Creating..." : "Create Category"}
        </Button>
      </form>
    </div>
  );
}

export default CreateCategories;
