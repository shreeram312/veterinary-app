import { VetChatbotSession } from "@veterinary-app/db/models";
import type { Request, Response } from "express";

export const getAppointments = async (req: Request, res: Response) => {
  try {
    const { clinicId } = req.query;

    if (!clinicId) {
      res.status(400).json({ error: "Clinic ID is required" });
      return;
    }

    const sessions = await VetChatbotSession.find({
      clinicId: clinicId as string,
      appointment: { $exists: true },
    })
      .sort({ createdAt: -1 })
      .lean();

    const appointments = sessions
      .filter((session) => session.appointment)
      .map((session) => ({
        id: session.appointment?.id,
        sessionId: session.sessionId,
        petOwnerName: session.appointment?.petOwnerName,
        petName: session.appointment?.petName,
        phoneNumber: session.appointment?.phoneNumber,
        preferredDate: session.appointment?.preferredDate,
        preferredTime: session.appointment?.preferredTime,
        status: session.appointment?.status,
        createdAt: session.appointment?.createdAt,
        updatedAt: session.appointment?.updatedAt,
      }));

    res.json({ appointments });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
};

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const { clinicId } = req.query;

    if (!clinicId) {
      res.status(400).json({ error: "Clinic ID is required" });
      return;
    }

    const totalSessions = await VetChatbotSession.countDocuments({
      clinicId: clinicId as string,
    });

    const totalAppointments = await VetChatbotSession.countDocuments({
      clinicId: clinicId as string,
      appointment: { $exists: true },
    });

    res.json({
      totalSessions,
      totalAppointments,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ error: "Failed to fetch dashboard stats" });
  }
};
