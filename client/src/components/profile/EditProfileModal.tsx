import React, { useState, useEffect } from "react";
import Modal from "../modal";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import useAuthStore from "@/stores/useStore";
import { toast } from "sonner";
import { api } from "../../axios";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const EditProfileModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [userName, setUserName] = useState(user?.userName || "");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setUserName(user.userName);
    }
  }, [isOpen, user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.patch(`/auth/updateProfile/${user?.id}`, {
        firstName,
        lastName,
        userName,
      });
      setUser(response.data);
      toast.success("Profile updated successfully!");
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Update failed!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-bold mb-4 text-green-800">Edit Profile</h2>
      <form className="space-y-4" onSubmit={handleProfileUpdate}>
        <div className="flex flex-col gap-1">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-green-800 hover:bg-green-900 mt-2"
          disabled={isLoading}
        >
          {isLoading ? "Updating..." : "Update Profile"}
        </Button>
      </form>
    </Modal>
  );
};

export default EditProfileModal;
