import { Appointment } from '@veterinary-app/db/models';
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

export const createBookAppointmentTool = (sessionId: string, clinicId: string) => tool({
  description: 'Book a veterinary appointment for the patient. Use this when the user wants to schedule an appointment and you have all required information: pet owner name, pet name, phone number, preferred date and time.',
  inputSchema: appointmentParameters,
  execute: async (input) => {
    try {
      const { petOwnerName, petName, phoneNumber, preferredDate, preferredTime } = input;


      const existingAppointment = await Appointment.findOne({
        sessionId,
        clinicId,
        petOwnerName,
        petName,
        phoneNumber,
        preferredDate: new Date(preferredDate),
        preferredTime,
      });

      if (existingAppointment) {
        return `Appointment already booked for ${petOwnerName} and ${petName} on ${preferredDate} at ${preferredTime}. Your appointment ID is ${existingAppointment.id}. Confirmation details have been saved.`;
      }

      const appointment = new Appointment({
        _id: uuidv4(),
        id: uuidv4(),
        sessionId,
        clinicId,
        petOwnerName,
        petName,
        phoneNumber,
        preferredDate: new Date(preferredDate),
        preferredTime,
        status: 'pending',
      });
      
      await appointment.save();

      console.log("tool called successfully");

      return `Appointment booked successfully for ${petOwnerName} and ${petName} on ${preferredDate} at ${preferredTime}. Your appointment ID is ${appointment.id}. Confirmation details have been saved.`;
    } catch (error) {
      console.error('Failed to book appointment:', error);
      throw new Error('Failed to book appointment');
    }
  },
});