"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { env } from "@veterinary-app/env/web";

interface Appointment {
  id: string;
  sessionId: string;
  petOwnerName: string;
  petName: string;
  phoneNumber: string;
  preferredDate: string;
  preferredTime: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function AppointmentsPage() {
  const { data: session } = authClient.useSession();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!session?.user?.id) return;

      try {
        setLoading(true);
        const response = await fetch(
          `${env.NEXT_PUBLIC_SERVER_URL}/api/appointments?clinicId=${session.user.id}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch appointments");
        }

        const data = await response.json();
        setAppointments(data.appointments || []);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch appointments");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [session?.user?.id]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      pending: "bg-orange-50 text-orange-600 border-orange-200",
      confirmed: "bg-emerald-50 text-emerald-600 border-emerald-200",
      cancelled: "bg-red-50 text-red-600 border-red-200",
      completed: "bg-gray-50 text-gray-600 border-gray-200",
    };

    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded border ${
          statusColors[status] || statusColors.pending
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="rounded-lg border border-border bg-white p-6">
        <h1 className="text-2xl font-bold mb-4">Appointments</h1>
        <p className="text-muted-foreground">Loading appointments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-border bg-white p-6">
        <h1 className="text-2xl font-bold mb-4">Appointments</h1>
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-white p-6">
      <h1 className="text-2xl font-bold mb-6">Appointments</h1>

      {appointments.length === 0 ? (
        <p className="text-muted-foreground">No appointments found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Pet Owner
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Pet Name
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Phone
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Date
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Time
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Created
                </th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr
                  key={appointment.id}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="py-3 px-4 text-sm">{appointment.petOwnerName}</td>
                  <td className="py-3 px-4 text-sm">{appointment.petName}</td>
                  <td className="py-3 px-4 text-sm">{appointment.phoneNumber}</td>
                  <td className="py-3 px-4 text-sm">{formatDate(appointment.preferredDate)}</td>
                  <td className="py-3 px-4 text-sm">{appointment.preferredTime}</td>
                  <td className="py-3 px-4">{getStatusBadge(appointment.status)}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">
                    {formatDate(appointment.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
