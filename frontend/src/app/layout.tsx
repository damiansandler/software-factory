import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Estado del backend",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-gray-100 text-gray-800 antialiased">{children}</body>
    </html>
  );
}
