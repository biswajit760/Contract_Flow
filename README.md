# ContractFlow

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38bdf8)

**ContractFlow** is a modern, high-performance Contract Lifecycle Management (CLM) system built for speed and simplicity. It allows users to design reusable contract templates ("Blueprints"), generate legal documents, and manage their lifecycle from drafting to digital signature.

## 🚀 Key Features

* **🎨 Visual Blueprint Builder**: Drag-and-drop interface to create reusable contract templates. Supports Text, Date, Checkbox, and Signature fields with custom positioning.
* **📄 High-Fidelity Workspace**: A "Paper-UI" environment for editing contracts that mimics physical A4 documents.
* **🚦 Lifecycle Management**: Robust state machine handling contract stages: `Draft` → `Approved` → `Sent` → `Signed` → `Locked`.
* **✍️ Digital Signatures**: Integrated signature simulation with visual verification badges.
* **💾 Auto-Persistence**: Instant state saving via Browser LocalStorage (Zero-config setup).
* **⚡ Reactive UI**: Built with React Context for instant feedback and zero layout shift.

## 🛠️ Tech Stack

* **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
* **Language**: [TypeScript](https://www.typescriptlang.org/)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/)
* **Icons**: [Lucide React](https://lucide.dev/)
* **State Management**: React Context API + Reducers
* **Persistence**: LocalStorage API

## 🏁 Getting Started

Follow these steps to get the project running locally.

### Prerequisites

* Node.js 18.17 or later
* npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/yourusername/contract-flow.git](https://github.com/yourusername/contract-flow.git)
    cd contract-flow
    ```

2.  **Install dependencies**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```

4.  **Open the app**
    Visit [http://localhost:3000](http://localhost:3000) in your browser.

## 📂 Project Structure

```bash
src/
├── app/
│   ├── blueprints/      # Blueprint Builder & List Pages
│   ├── contracts/       # Contract Workspace & Management
│   ├── context/         # Global State (Context + Reducer)
│   ├── layout.tsx       # Main App Shell
│   └── page.tsx         # Dashboard (Home)
├── components/          # Reusable UI Components
│   ├── Button.tsx       # Standard Action Buttons
│   ├── Input.tsx        # Form Fields
│   └── NavBar.tsx       # Main Navigation
└── lib/                 # Utilities & Types

```
## 📖 Usage Workflow

### 1. Create a Blueprint 🏗️
The Blueprint is your master template.
* Go to the **Blueprints** tab and click **"Create New"**.
* **Drag & Drop Fields:** Add Text, Date, Checkbox, or Signature blocks.
* **Customize:** Click any field to rename its label (e.g., change "Text Field" to "Client Name").
* **Reorder:** Use the **Up/Down arrows** to arrange fields exactly how you want them on the final document.
* **Save:** Give your blueprint a name (e.g., "Standard NDA") and save it.

### 2. Generate a Contract 📄
Once you have a blueprint, creating a contract takes seconds.
* Go to your **Dashboard** or **Blueprints List**.
* Find your template and click **"Use Template"**.
* **Name it:** Enter a specific name for this instance (e.g., "NDA - Acme Corp").
* **Launch:** The system instantly generates a unique contract with a dedicated URL, ready for editing and signing.
