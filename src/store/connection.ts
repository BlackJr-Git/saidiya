import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ConnectionState {
  isConnected: boolean;
  setIsConnected: (value: boolean) => void;
}

export const useConnectionStore = create<ConnectionState>()(
  persist(
    (set) => ({
      isConnected: false,
      setIsConnected: (value: boolean) => set({ isConnected: value }),
    }),
    {
      name: "connection-storage", // unique name for localStorage
      getStorage: () => localStorage, // use localStorage for persistence
    }
  )
);
