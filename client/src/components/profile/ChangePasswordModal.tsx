import React, { useState } from "react";
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

const ChangePasswordModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const user = useAuthStore((state) => state.user);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setIsLoading(true);
    try {
      await api.patch(`/auth/changePassword/${user?.id}`, {
        currentPassword,
        newPassword,
      });
      toast.success("Password updated successfully!");
      onClose();
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Password update failed!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-bold mb-4 text-red-600">Change Password</h2>
      <form className="space-y-4" onSubmit={handlePasswordChange}>
        <div className="flex flex-col gap-1">
          <Label htmlFor="currentPassword">Current Password</Label>
          <Input
            id="currentPassword"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            placeholder="Enter current password"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="newPassword">New Password</Label>
          <Input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            placeholder="Enter new password"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Confirm new password"
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 mt-2"
          disabled={isLoading}
        >
          {isLoading ? "Updating..." : "Change Password"}
        </Button>
      </form>
    </Modal>
  );
};

export default ChangePasswordModal;
