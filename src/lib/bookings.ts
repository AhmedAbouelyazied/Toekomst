import { z } from "zod";
import { bookingTypes, halls } from "./config";

const typeIds = bookingTypes.map((t) => t.id);
const hallIds = halls.map((h) => h.id);

export const bookingSchema = z.object({
  type: z.enum(typeIds as [string, ...string[]]),
  name: z.string().min(2).max(120),
  email: z.email().max(160),
  phone: z.string().min(6).max(40),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/).optional().or(z.literal("")),
  hall: z.enum(hallIds as [string, ...string[]]),
  guests: z.coerce.number().int().min(1).max(5000),
  message: z.string().max(2000).optional().or(z.literal("")),
  consent: z.literal(true),
  locale: z.enum(["nl", "ar", "en", "fr"]).default("nl"),
  // honeypot — must stay empty
  website: z.string().max(0).optional().or(z.literal("")),
});

export type BookingInput = z.infer<typeof bookingSchema>;

export const bookingStatuses = ["PENDING", "CONFIRMED", "DECLINED"] as const;
export type BookingStatus = (typeof bookingStatuses)[number];
