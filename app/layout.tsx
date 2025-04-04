import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import WalletProviderWrapper from "./components/WalletProviderWrapper"; // Import the WalletProviderWrapper

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletProviderWrapper>
          <Navbar />
          <main className="p-4 bg-gray-100 min-h-screen">
            {children}
          </main>
        </WalletProviderWrapper>
      </body>
    </html>
  );
}