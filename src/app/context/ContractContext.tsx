"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";

// --- 1. TYPES (The Schema) ---

export type ContractStatus = "Created" | "Approved" | "Sent" | "Signed" | "Locked" | "Revoked";

export interface FieldDefinition {
  id: string;
  type: "text" | "date" | "checkbox" | "signature";
  label: string;
  position?: number; // <--- NEW: Added to support your reordering feature
}

export interface Blueprint {
  id: string;
  name: string;
  fields: FieldDefinition[];
}

export interface Contract {
  id: string;
  blueprintId: string;
  blueprintName: string;
  name: string;
  status: ContractStatus;
  formData: Record<string, any>;
  createdAt: string;
}

interface ContractState {
  blueprints: Blueprint[];
  contracts: Contract[];
}

// --- 2. ACTIONS ---
type Action =
  | { type: "ADD_BLUEPRINT"; payload: Blueprint }
  | { type: "CREATE_CONTRACT"; payload: Contract }
  | { type: "UPDATE_STATUS"; payload: { id: string; newStatus: ContractStatus } }
  | { type: "UPDATE_FORM_DATA"; payload: { id: string; data: Record<string, any> } }
  | { type: "LOAD_FROM_STORAGE"; payload: ContractState };

// --- 3. LOGIC (State Machine & Transitions) ---
const initialState: ContractState = { blueprints: [], contracts: [] };

const VALID_TRANSITIONS: Record<ContractStatus, ContractStatus[]> = {
  Created: ["Approved", "Revoked"],
  Approved: ["Sent", "Revoked"],
  Sent: ["Signed", "Revoked"],
  Signed: ["Locked", "Revoked"],
  Locked: [],
  Revoked: [],
};

function contractReducer(state: ContractState, action: Action): ContractState {
  switch (action.type) {
    case "ADD_BLUEPRINT":
      return { ...state, blueprints: [...state.blueprints, action.payload] };

    case "CREATE_CONTRACT":
      return { ...state, contracts: [...state.contracts, action.payload] };

    case "UPDATE_FORM_DATA":
      return {
        ...state,
        contracts: state.contracts.map((c) =>
          c.id === action.payload.id ? { ...c, formData: { ...c.formData, ...action.payload.data } } : c
        ),
      };

    case "UPDATE_STATUS":
      const { id, newStatus } = action.payload;
      const contract = state.contracts.find(c => c.id === id);
      if (!contract) return state;

      // Strict State Machine Check
      if (!VALID_TRANSITIONS[contract.status].includes(newStatus)) {
        alert(`INVALID MOVE: You cannot go from ${contract.status} to ${newStatus}`);
        return state; 
      }
      return {
        ...state,
        contracts: state.contracts.map((c) => (c.id === id ? { ...c, status: newStatus } : c)),
      };

    case "LOAD_FROM_STORAGE":
      return action.payload;

    default:
      return state;
  }
}

// --- 4. PROVIDER ---
const ContractContext = createContext<{
  state: ContractState;
  blueprints: Blueprint[]; // Helpers for easier access
  contracts: Contract[];   // Helpers for easier access
  dispatch: React.Dispatch<Action>;
} | undefined>(undefined);

export function ContractProvider({ children }: { children: React.ReactNode }) {
  
  // Initialize state lazily to avoid hydration mismatch
  const [state, dispatch] = useReducer(contractReducer, initialState);

  // Load from LocalStorage on mount (Client Side Only)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("contract-platform-db");
      if (saved) {
        try {
          dispatch({ type: "LOAD_FROM_STORAGE", payload: JSON.parse(saved) });
        } catch (e) {
          console.error("Failed to load data", e);
        }
      }
    }
  }, []);

  // Save to LocalStorage whenever state changes
  useEffect(() => {
    if (state.blueprints.length > 0 || state.contracts.length > 0) {
      localStorage.setItem("contract-platform-db", JSON.stringify(state));
    }
  }, [state]);

  return (
    <ContractContext.Provider value={{ 
      state, 
      dispatch,
      blueprints: state.blueprints, // Shortcut
      contracts: state.contracts    // Shortcut
    }}>
      {children}
    </ContractContext.Provider>
  );
}

// --- 5. HOOK ---
export function useContract() {
  const context = useContext(ContractContext);
  if (!context) throw new Error("useContract must be used within a ContractProvider");
  return context;
}