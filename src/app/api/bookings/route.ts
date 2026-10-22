import { NextResponse, type NextRequest } from "next/server";
import { bookingSchema } from "@/lib/bookings";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { notifyOrg, notifyRequester } from "@/lib/email";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";

function clientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const raw = body as Record<string, unknown>;

  // Honeypot: pretend success for bots.
  if (typeof raw.website === "string" && raw.website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  if (!rateLimit(`booking:${clientIp(request)}`, 5, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation", issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }
  const data = parsed.data;

  const conflict = await prisma.booking.findFirst({
    where: {
      hall: data.hall,
      date: data.date,
      status: { in: ["PENDING", "CONFIRMED"] },
      startTime: data.startTime,
    },
  });
  if (conflict) {
    return NextResponse.json({ error: "conflict" }, { status: 409 });
  }

  const booking = await prisma.booking.create({
    data: {
      type: data.type,
      name: data.name,
      email: data.email,
      phone: data.phone,
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime || null,
      hall: data.hall,
      guests: data.guests,
      message: data.message || null,
      locale: data.locale,
    },
  });

  await Promise.allSettled([notifyOrg(data), notifyRequester(data)]).catch(() => {});

  return NextResponse.json({ ok: true, id: booking.id });
}

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const status = request.nextUrl.searchParams.get("status");
  const bookings = await prisma.booking.findMany({
    where: status && status !== "ALL" ? { status } : undefined,
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ bookings });
}
