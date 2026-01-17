import { VetChatbotSession } from '@veterinary-app/db/models';
import { tool } from 'ai';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

const appointmentParameters = z.object({
  petOwnerName: z.string().describe('The name of the pet owner'),
  petName: z.string().describe('The name of the pet'),
  phoneNumber: z.string().describe('The phone number of the pet owner'),
  preferredDate: z.string().describe('The preferred date of the appointment in YYYY-MM-DD format'),
  preferredTime: z.string().describe('The preferred time of the appointment (e.g., "10:00 AM", "2:30 PM")'),
});

export const createBookAppointmentTool = (sessionId: string) => tool({
  description: 'Book a veterinary appointment for the patient. Use this when the user wants to schedule an appointment and you have all required information: pet owner name, pet name, phone number, preferred date and time.',
  inputSchema: appointmentParameters,
  execute: async (input) => {
    try {
      const { petOwnerName, petName, phoneNumber, preferredDate, preferredTime } = input;

      const session = await VetChatbotSession.findOne({ sessionId });
      
      if (!session) {
        throw new Error('Session not found');
      }

      const appointmentId = uuidv4();
      const appointmentData = {
        id: appointmentId,
        petOwnerName,
        petName,
        phoneNumber,
        preferredDate: new Date(preferredDate),
        preferredTime,
        status: 'pending' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      if (session.appointment) {
        session.appointment.petOwnerName = petOwnerName;
        session.appointment.petName = petName;
        session.appointment.phoneNumber = phoneNumber;
        session.appointment.preferredDate = new Date(preferredDate);
        session.appointment.preferredTime = preferredTime;
        session.appointment.updatedAt = new Date();
        session.updatedAt = new Date();
        
        await session.save();
        
        return `Appointment updated successfully for ${petOwnerName} and ${petName} on ${preferredDate} at ${preferredTime}. Your appointment ID is ${session.appointment.id}.`;
      }

      session.appointment = appointmentData;
      session.updatedAt = new Date();
      await session.save();

      //debugging purpose 
      console.log("tool called successfully");

      return `Appointment booked successfully for ${petOwnerName} and ${petName} on ${preferredDate} at ${preferredTime}. Your appointment ID is ${appointmentId}. Confirmation details have been saved.`;
    } catch (error) {
      console.error('Failed to book appointment:', error);
      throw new Error('Failed to book appointment');
    }
  },
});