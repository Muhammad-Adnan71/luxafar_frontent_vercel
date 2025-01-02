"use client";

import { BespokeResponse } from "@utils/types";
import { create } from "zustand";

type Store = {
  bespokeResponse: BespokeResponse;
  setBespokeResponse: (form: BespokeResponse) => void;
  reset: () => void;
};

const useBespokeStore = create<Store>((set) => ({
  bespokeResponse: {
    name: "",
    email: "",
    phoneNumber: "",
    tripDays: "",
    selectedCode: "",
    selectedDestination: "",
    bespokeFormQuestionAndAnswer: [],
  },
  reset: () =>
    set({
      bespokeResponse: {
        name: "",
        email: "",
        phoneNumber: "",
        tripDays: "",
        selectedCode: "",
        selectedDestination: "",
        bespokeFormQuestionAndAnswer: [],
      },
    }),

  setBespokeResponse: (form) =>
    set((state) => ({ ...state, bespokeResponse: form })),
}));

export default useBespokeStore;
