"use client";
import { create } from "zustand";

type Store = {
  isAdventure: boolean;
  handleIsAdventure: () => void;
};

const useAdventure = create<Store>((set) => ({
  isAdventure: true,
  handleIsAdventure: () => set(() => ({ isAdventure: false })),
}));
export default useAdventure;
