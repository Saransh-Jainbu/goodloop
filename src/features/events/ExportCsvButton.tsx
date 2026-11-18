"use client";

// OWNER: Aditya. CSV export button for attendee roster.
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { RegistrationWithUser } from "@/features/registrations/queries";

export function ExportCsvButton({
  eventTitle,
  registrations,
}: {
  eventTitle: string;
  registrations: RegistrationWithUser[];
}) {
  const handleExport = () => {
    if (registrations.length === 0) return;

    const headers = ["Registration ID", "Volunteer Name", "Email Address", "Registered At"];
    const rows = registrations.map((r) => [
      r.id,
      `"${(r.userName ?? "Anonymous").replace(/"/g, '""')}"`,
      `"${r.userEmail.replace(/"/g, '""')}"`,
      `"${new Date(r.createdAt).toISOString()}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const safeTitle = eventTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    link.setAttribute("href", url);
    link.setAttribute("download", `${safeTitle || "event"}-volunteers.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      disabled={registrations.length === 0}
      className="flex items-center gap-1.5"
    >
      <Download className="h-4 w-4" />
      Export CSV
    </Button>
  );
}
