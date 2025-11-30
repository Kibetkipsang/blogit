import { useState } from "react";
import ProfileSidebar from "./ProfileSideBar";
import ProfileHeader from "./ProfileHeader";
import { Outlet } from "react-router-dom";
import EditProfileModal from "./EditProfileModal";
import ChangePasswordModal from "./ChangePasswordModal";

export default function ProfileLayout() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar - Hidden on mobile, visible on desktop */}
      <div className="hidden lg:block">
        <ProfileSidebar
          onEditProfile={() => setIsEditModalOpen(true)}
          onChangePassword={() => setIsPasswordModalOpen(true)}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Pass the modal functions to ProfileHeader */}
        <ProfileHeader
          onEditProfile={() => setIsEditModalOpen(true)}
          onChangePassword={() => setIsPasswordModalOpen(true)}
        />
        <main className="p-4 sm:p-6 flex-1 bg-gray-50">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </div>
  );
}
