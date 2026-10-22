import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";

function csvCell(value: unknown): string {
  const str = value === null || value === undefined ? "" : String(value);
  return `"${str.replace(/"/g, '""')}"`;
}

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const bookings = await prisma.booking.findMany({ orderBy: { createdAt: "desc" } });
  const header = [
    "id",
    "type",
    "name",
    "email",
    "phone",
    "date",
    "startTime",
    "endTime",
    "hall",
    "guests",
    "status",
    "locale",
    "message",
    "createdAt",
  ];

  const rows = bookings.map((b) =>
    [
      b.id,
      b.type,
      b.name,
      b.email,
      b.phone,
      b.date,
      b.startTime,
      b.endTime,
      b.hall,
      b.guests,
      b.status,
      b.locale,
      b.message,
      b.createdAt.toISOString(),
    ]
      .map(csvCell)
      .join(","),
  );

  const csv = [header.join(","), ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="toekomst-bookings-${Date.now()}.csv"`,
    },
  });
}
