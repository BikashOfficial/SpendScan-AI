import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "nanoid";

const defaultEntry = () => ({
  id: nanoid(6),
  toolId: "",
  planId: "",
  monthlySpend: "",
  seats: 1,
  useCase: "mixed",
});

export const useAuditStore = create(
  persist(
    (set, get) => ({
      // Form state
      entries: [defaultEntry()],
      teamSize: 1,
      companyName: "",
      role: "",

      // Audit result
      auditResult: null,
      auditId: null,

      // UI state
      step: "form", // 'form' | 'results'

      addEntry: () =>
        set((state) => ({ entries: [...state.entries, defaultEntry()] })),

      removeEntry: (id) =>
        set((state) => ({
          entries: state.entries.filter((e) => e.id !== id),
        })),

      updateEntry: (id, field, value) =>
        set((state) => ({
          entries: state.entries.map((e) =>
            e.id === id ? { ...e, [field]: value } : e
          ),
        })),

      setTeamSize: (teamSize) => set({ teamSize }),
      setCompanyName: (companyName) => set({ companyName }),
      setRole: (role) => set({ role }),

      setAuditResult: (result, id) =>
        set({ auditResult: result, auditId: id, step: "results" }),

      resetForm: () =>
        set({
          entries: [defaultEntry()],
          teamSize: 1,
          companyName: "",
          role: "",
          auditResult: null,
          auditId: null,
          step: "form",
        }),

      goToForm: () => set({ step: "form" }),
    }),
    {
      name: "ai-audit-store",
      partialize: (state) => ({
        entries: state.entries,
        teamSize: state.teamSize,
        companyName: state.companyName,
        role: state.role,
      }),
    }
  )
);
