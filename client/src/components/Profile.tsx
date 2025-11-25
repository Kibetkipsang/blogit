import useAuthStore from "@/stores/useStore";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import EditProfileModal from "./EditProfileModal";

function Profile() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.clearUser);
  const navigate = useNavigate();
  const capitalize = (str: string | undefined) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-green-800 font-bold text-center">
            WELCOME TO YOUR PROFILE{" "}
            <span className="uppercase">{user?.firstName}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col bg-gray-50 p-3 rounded-sm hover:shadow-md">
            <span className="text-xs text-gray-900 uppercase tracking-wide">
              Name
            </span>
            <span className="text-lg font-medium text-black">
              {capitalize(user?.firstName)} {capitalize(user?.lastName)}
            </span>
          </div>
          <div className="flex flex-col bg-gray-50 p-3 rounded-sm hover:shadow-md">
            <span className="text-xs text-gray-900 uppercase tracking-wide">
              Username:
            </span>
            <span className="text-lg font-medium text-black">
              {user?.userName}
            </span>
          </div>
          <div className="flex flex-col bg-gray-50 p-3 rounded-sm hover:shadow-md">
            <span className="text-xs text-gray-900 uppercase tracking-wide">
              Email Address:
            </span>
            <span className="text-lg font-medium text-black">
              {user?.emailAdress}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <Button
              className="w-1/3 bg-green-700 hover:bg-green-900 mt-4"
              onClick={() => setIsEditModalOpen(true)}
            >
              Edit Profile
            </Button>
            <Button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="w-1/3 bg-red-600 hover:bg-red-700 mt-4"
            >
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </div>
  );
}

export default Profile;
