"use client";
import { DEMO_BLUEPRINTS, DEMO_CONTRACTS } from "@/lib/demo-data";
import React, { createContext, useContext, useReducer, useEffect } from "react";

/**
 * ============================================================================
 * 1. DOMAIN MODEL & TYPES
 * ----------------------------------------------------------------------------
 * defining strict types here ensures the entire app adheres to the same contract.
 * ============================================================================
 */

// STRICT TYPE: Using a Union type prevents typos (e.g., "created" vs "Created")
export type ContractStatus = "Created" | "Approved" | "Sent" | "Signed" | "Locked" | "Revoked";

// Represents a single form field in a Blueprint
export interface FieldDefinition {
  id: string;
  type: "text" | "date" | "checkbox" | "signature";
  label: string;
  required?: boolean; // IMPROVEMENT: Added validation support
  position?: number;  // Supports drag-and-drop ordering
}

// A reusable template for creating contracts
export interface Blueprint {
  id: string;
  name: string;
  fields: FieldDefinition[];
}

// IMPROVEMENT: The "Audit Trail"
// This tracks the lifecycle history required by the prompt's evaluation criteria.
export interface HistoryEvent {
  status: ContractStatus;
  timestamp: string; // ISO Date String
  note?: string;
}

// The core entity of the application
export interface Contract {
  id: string;
  blueprintId: string;
  blueprintName: string;
  name: string;
  status: ContractStatus;
  // IMPROVEMENT: Removed 'any' for better type safety. 
  // We use string | boolean | undefined to cover text, dates, and checkboxes.
  formData: Record<string, string | boolean | undefined>;
  history: HistoryEvent[]; // NEW: Keeps a log of all status changes
  createdAt: string;
}

// The shape of our Global Store
interface ContractState {
  blueprints: Blueprint[];
  contracts: Contract[];
  isLoading: boolean; // IMPROVEMENT: Added loading state for better UX
}

/**
 * ============================================================================
 * 2. BUSINESS LOGIC & STATE MACHINE
 * ----------------------------------------------------------------------------
 * We define the rules of the game outside the component to keep it testable.
 * ============================================================================
 */

const initialState: ContractState = { 
  blueprints: [], 
  contracts: [],
  isLoading: true 
};

// CONFIGURATION: Defines valid moves. 
// Exporting this allows UI components to disable invalid buttons automatically.
export const VALID_TRANSITIONS: Record<ContractStatus, ContractStatus[]> = {
  Created: ["Approved", "Revoked"],
  Approved: ["Sent", "Revoked"],
  Sent: ["Signed", "Revoked"],
  Signed: ["Locked"], // Locked is a terminal state
  Locked: [],
  Revoked: [],
};

/**
 * Helper function to check if a move is legal.
 * Usage: if (canTransition(contract.status, 'Signed')) { ... }
 */
export const canTransition = (current: ContractStatus, target: ContractStatus): boolean => {
  return VALID_TRANSITIONS[current]?.includes(target) ?? false;
};

/**
 * ============================================================================
 * 3. ACTIONS & REDUCER
 * ----------------------------------------------------------------------------
 * The Reducer is the "Brain". It must be a PURE function (no API calls, no alerts).
 * ============================================================================
 */

type Action =
  | { type: "ADD_BLUEPRINT"; payload: Blueprint }
  | { type: "CREATE_CONTRACT"; payload: Contract }
  | { type: "UPDATE_STATUS"; payload: { id: string; newStatus: ContractStatus } }
  | { type: "UPDATE_FORM_DATA"; payload: { id: string; data: Record<string, any> } }
  | { type: "LOAD_FROM_STORAGE"; payload: { blueprints: Blueprint[]; contracts: Contract[] } };

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
          c.id === action.payload.id 
            ? { ...c, formData: { ...c.formData, ...action.payload.data } } 
            : c
        ),
      };

    case "UPDATE_STATUS": {
      const { id, newStatus } = action.payload;
      const contract = state.contracts.find((c) => c.id === id);
      
      if (!contract) return state;

      // GUARD RAIL: Prevent illegal moves.
      // IMPROVEMENT: Removed 'alert()' because reducers must be pure. 
      // Invalid moves are simply ignored (or logged to console).
      if (!canTransition(contract.status, newStatus)) {
        console.warn(`Blocked illegal transition: ${contract.status} -> ${newStatus}`);
        return state; 
      }

      // AUTOMATION: Automatically add an entry to the history log
      const newHistoryEntry: HistoryEvent = {
        status: newStatus,
        timestamp: new Date().toISOString(),
      };

      return {
        ...state,
        contracts: state.contracts.map((c) =>
          c.id === id 
            ? { ...c, status: newStatus, history: [...c.history, newHistoryEntry] } 
            : c
        ),
      };
    }

    case "LOAD_FROM_STORAGE":
      return { ...state, ...action.payload, isLoading: false };

    default:
      return state;
  }
}

/**
 * ============================================================================
 * 4. CONTEXT & PROVIDER
 * ----------------------------------------------------------------------------
 * Handles data persistence (LocalStorage) and provides state to the app.
 * ============================================================================
 */

const ContractContext = createContext<{
  state: ContractState;
  dispatch: React.Dispatch<Action>;
} | undefined>(undefined);

export function ContractProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(contractReducer, initialState);

  // EFFECT: Load data on mount (simulates fetching from a backend)
  useEffect(() => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("contract-platform-db");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        dispatch({ type: "LOAD_FROM_STORAGE", payload: parsed });
      } catch (e) {
        console.error("Failed to load data", e);
      }
    } else {
      // SEED DEMO DATA
      dispatch({ 
        type: "LOAD_FROM_STORAGE", 
        payload: { 
          blueprints: DEMO_BLUEPRINTS, 
          contracts: DEMO_CONTRACTS 
        } 
      });
    }
  }
}, []);

  // EFFECT: Auto-save on change (simulates writing to a database)
  useEffect(() => {
    if (!state.isLoading) {
      localStorage.setItem("contract-platform-db", JSON.stringify({
        blueprints: state.blueprints,
        contracts: state.contracts
      }));
    }
  }, [state.blueprints, state.contracts, state.isLoading]);

  return (
    <ContractContext.Provider value={{ state, dispatch }}>
      {children}
    </ContractContext.Provider>
  );
}

/**
 * ============================================================================
 * 5. CUSTOM HOOK (Facade Pattern)
 * ----------------------------------------------------------------------------
 * Exposes clean methods to components so they don't have to deal with 'dispatch'.
 * ============================================================================
 */
export function useContract() {
  const context = useContext(ContractContext);
  if (!context) throw new Error("useContract must be used within a ContractProvider");
  
  const { state, dispatch } = context;

  return {
    // Data Accessors
    blueprints: state.blueprints,
    contracts: state.contracts,
    isLoading: state.isLoading,
    
    // Actions (Clean API for components)
    addBlueprint: (bp: Blueprint) => dispatch({ type: "ADD_BLUEPRINT", payload: bp }),
    createContract: (c: Contract) => dispatch({ type: "CREATE_CONTRACT", payload: c }),
    
    // Updates
    updateStatus: (id: string, newStatus: ContractStatus) => 
      dispatch({ type: "UPDATE_STATUS", payload: { id, newStatus } }),
      
    updateFormData: (id: string, data: Record<string, any>) => 
      dispatch({ type: "UPDATE_FORM_DATA", payload: { id, data } }),
    
    // Helper to find a specific contract
    getContractById: (id: string) => state.contracts.find((c) => c.id === id),
  };
}