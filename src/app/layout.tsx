import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { ContractProvider } from "./context/ContractContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Contract Platform",
  description: "Assessment Submission",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Plug in the power here! */}
        <ContractProvider>
          <main className="min-h-screen bg-slate-50 text-slate-900">
            {children}
          </main>
        </ContractProvider>
      </body>
    </html>
  );
}