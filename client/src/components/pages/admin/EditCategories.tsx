import { useState } from "react";
import { api } from "../../../axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EditCategoryModalProps {
  category: { id: string; name: string };
  open: boolean;
  onClose: () => void;
}

export default function EditCategoryModal({ category, open, onClose }: EditCategoryModalProps) {
  const [name, setName] = useState(category.name);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (updatedName: string) =>
      api.patch(`/categories/${category.id}`, { name: updatedName }),
    onSuccess: () => {
      queryClient.invalidateQueries( { queryKey: ["categories"] }); 
      onClose();
    },
    onError: (error: any) => {
      alert(error?.response?.data?.message || "Failed to update category");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(name);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <Label htmlFor="categoryName">Category Name</Label>
            <Input
              id="categoryName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={mutation.isPending}
            />
          </div>
          <DialogFooter className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="bg-red-600 hover:bg-red-700 hover:text-white text-white">
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending} className="bg-green-700 hover:bg-green-800">
              {mutation.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
