import { api } from "../../../axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import EditCategoryModal from "./EditCategories";

const fetchCategories = async () => {
  const res = await api.get("/categories");
  return res.data;
};

function AdminCategories() {
  const queryClient = useQueryClient();
  const [categories, setCategories] = useState<any[]>([]);
  const [editingCategory, setEditingCategory] = useState<any>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  useEffect(() => {
    if (data) setCategories(Array.isArray(data) ? data : data.categories || []);
  }, [data]);


  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/categories/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this category?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <p>Loading categories...</p>;
  if (error) return <p className="text-red-600">Failed to load categories</p>;

  return (
    <div className="p-8">
      <div className="flex justify-between border-b border-b-gray-100 pb-4 mb-6">
        <h2 className="text-2xl font-bold mb-6">All Categories</h2>
        <Link to="/admin/createCategories" className="text-blue-600 hover:underline">
          Create Category
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">ID</th>
              <th className="border p-2 text-left">Name</th>
              <th className="border p-2 text-left">Created At</th>
              <th className="border p-2 text-left">Edit</th>
              <th className="border p-2 text-left">Delete</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center p-4">
                  No categories found.
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="border p-2">{category.id}</td>
                  <td className="border p-2">{category.name}</td>
                  <td className="border p-2">
                    {new Date(category.createdAt).toLocaleDateString()}
                  </td>
                  <td className="border p-2">
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => setEditingCategory(category)} 
                    >
                      Edit
                    </button>
                  </td>
                  <td className="border p-2">
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => handleDelete(category.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

   
      {editingCategory && (
        <EditCategoryModal
          category={editingCategory}
          open={!!editingCategory}
          onClose={() => setEditingCategory(null)}
        />
      )}
    </div>
  );
}

export default AdminCategories;
