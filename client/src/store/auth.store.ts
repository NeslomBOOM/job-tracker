import { create } from "zustand";

type AuthState = {
    token: string | null;
    login: () => void;
    logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
    token: localStorage.getItem("token"),
    login: () => {
        localStorage.setItem("token", "mock-token");
        set({ token: "mock-token" });
    },
    logout: () => {
        localStorage.removeItem("token");
        set({ token: null });
    },
}));
