"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import MockModeBadge from "@/components/MockModeBadge";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <NotificationProvider>
        {children}
        <MockModeBadge />
      </NotificationProvider>
    </AuthProvider>
  );
}
