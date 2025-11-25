import { create } from "zustand";

type UserType = {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  emailAdress: string;
};

type AuthStore = {
  user: UserType | null;
  setUser: (user: UserType) => void;
  clearUser: () => void;
};

const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));

export default useAuthStore;
