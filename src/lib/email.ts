import { Resend } from "resend";
import { bookingTypes, halls, org, type Localized } from "./config";
import type { BookingInput } from "./bookings";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const from = process.env.BOOKING_FROM_EMAIL || "VZW De Toekomst <no-reply@toekomst.be>";
const to = process.env.BOOKING_TO_EMAIL || org.email;

function labelOf(
  list: { id: string; label: Localized }[],
  id: string,
): string {
  return list.find((item) => item.id === id)?.label.nl ?? id;
}

function summary(b: BookingInput): string {
  return [
    `Type: ${labelOf(bookingTypes, b.type)}`,
    `Naam: ${b.name}`,
    `E-mail: ${b.email}`,
    `Telefoon: ${b.phone}`,
    `Datum: ${b.date}`,
    `Tijd: ${b.startTime}${b.endTime ? ` – ${b.endTime}` : ""}`,
    `Zaal: ${labelOf(halls, b.hall)}`,
    `Personen: ${b.guests}`,
    b.message ? `Bericht: ${b.message}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

export async function notifyOrg(b: BookingInput): Promise<void> {
  if (!resend) {
    console.warn("[email] RESEND_API_KEY not set — skipping org notification.");
    return;
  }
  await resend.emails.send({
    from,
    to,
    replyTo: b.email,
    subject: `Nieuwe reservering: ${labelOf(bookingTypes, b.type)} — ${b.date}`,
    text: `Er is een nieuwe reserveringsaanvraag ontvangen.\n\n${summary(b)}`,
  });
}

export async function notifyRequester(b: BookingInput): Promise<void> {
  if (!resend) return;
  await resend.emails.send({
    from,
    to: b.email,
    subject: "Bevestiging van uw aanvraag — VZW De Toekomst",
    text: `Beste ${b.name},\n\nBedankt voor uw aanvraag. Wij hebben volgende gegevens goed ontvangen:\n\n${summary(
      b,
    )}\n\nWij nemen zo snel mogelijk contact met u op.\n\nMet vriendelijke groet,\n${org.name.nl}`,
  });
}
