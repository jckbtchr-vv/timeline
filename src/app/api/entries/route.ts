import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const entries = await prisma.entry.findMany({
      orderBy: [
        { date: "desc" },
        { createdAt: "desc" },
      ],
    });
    return NextResponse.json(entries);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch entries" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const password = request.headers.get("x-admin-password");

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { date, title, consequence, url } = body;

    if (!date || !title || !consequence) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Basic URL validation if provided
    if (url && !url.startsWith("http://") && !url.startsWith("https://")) {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    const entry = await prisma.entry.create({
      data: {
        date,
        title,
        consequence,
        url: url || null,
      },
    });

    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    console.error("POST /api/entries error:", error);
    return NextResponse.json({ error: "Failed to create entry" }, { status: 500 });
  }
}

