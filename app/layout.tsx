import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AuthProvider from "./providers/AuthProvider";
import { UserProfileProvider } from "./context/UserProfileContext";

export const metadata: Metadata = {
  title: "FitTrack - Your Fitness Journey",
  description:
    "A comprehensive fitness tracking application with workout plans, progress tracking, and social features",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased min-h-screen flex flex-col bg-gray-900 text-white">
        <AuthProvider>
          <UserProfileProvider>
            <Navbar />
            <main className="flex-grow pt-16">{children}</main>
            <Footer />
          </UserProfileProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
