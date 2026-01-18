import { Blueprint, Contract } from "@/app/context/ContractContext";

export const DEMO_BLUEPRINTS: Blueprint[] = [
  {
    id: "bp-freelance-01",
    name: "Freelance Service Agreement",
    fields: [
      { id: "client_name", type: "text", label: "Client Name", position: 1 },
      { id: "project_scope", type: "text", label: "Project Scope & Deliverables", position: 2 },
      { id: "start_date", type: "date", label: "Start Date", position: 3 },
      { id: "source_code", type: "checkbox", label: "Include Source Code Handover?", position: 4 },
      { id: "client_sig", type: "signature", label: "Client Signature", position: 5 },
    ]
  },
  {
    id: "bp-nda-02",
    name: "Non-Disclosure Agreement (NDA)",
    fields: [
      { id: "party_a", type: "text", label: "Disclosing Party", position: 1 },
      { id: "party_b", type: "text", label: "Receiving Party", position: 2 },
      { id: "effective_date", type: "date", label: "Effective Date", position: 3 },
      { id: "sig_b", type: "signature", label: "Receiving Party Signature", position: 4 },
    ]
  }
];

export const DEMO_CONTRACTS: Contract[] = [
  // 1. A Draft Contract (Editable)
  {
    id: "c-draft-01",
    blueprintId: "bp-freelance-01",
    blueprintName: "Freelance Service Agreement",
    name: "Website Redesign - Acme Corp",
    status: "Created",
    formData: { 
      client_name: "Acme Corp", 
      project_scope: "Full UI overhaul using Next.js and Tailwind CSS." 
    },
    history: [
      { status: "Created", timestamp: new Date(Date.now() - 100000000).toISOString() }
    ],
    createdAt: new Date(Date.now() - 100000000).toISOString(),
  },
  
  // 2. A Sent Contract (Waiting for Signature)
  {
    id: "c-sent-02",
    blueprintId: "bp-freelance-01",
    blueprintName: "Freelance Service Agreement",
    name: "Mobile App - Beta LLC",
    status: "Sent",
    formData: { 
      client_name: "Beta LLC", 
      project_scope: "React Native MVP Development", 
      start_date: "2025-11-01", 
      source_code: true 
    },
    history: [
      { status: "Created", timestamp: new Date(Date.now() - 500000000).toISOString() },
      { status: "Approved", timestamp: new Date(Date.now() - 400000000).toISOString() },
      { status: "Sent", timestamp: new Date(Date.now() - 200000).toISOString() },
    ],
    createdAt: new Date(Date.now() - 500000000).toISOString(),
  },

  // 3. A Completed/Locked Contract (Read-Only)
  {
    id: "c-locked-03",
    blueprintId: "bp-nda-02",
    blueprintName: "Non-Disclosure Agreement (NDA)",
    name: "Confidentiality - Gamma Inc",
    status: "Locked",
    formData: { 
      party_a: "My Agency Ltd", 
      party_b: "Gamma Inc", 
      effective_date: "2025-10-15", 
      sig_b: "Signed by CEO, Gamma Inc" 
    },
    history: [
      { status: "Created", timestamp: new Date(Date.now() - 900000000).toISOString() },
      { status: "Approved", timestamp: new Date(Date.now() - 800000000).toISOString() },
      { status: "Sent", timestamp: new Date(Date.now() - 700000000).toISOString() },
      { status: "Signed", timestamp: new Date(Date.now() - 600000000).toISOString() },
      { status: "Locked", timestamp: new Date(Date.now() - 500000000).toISOString() },
    ],
    createdAt: new Date(Date.now() - 900000000).toISOString(),
  }
];