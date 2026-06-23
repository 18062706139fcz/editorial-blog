import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, company, phone, email, message } = body ?? {};

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required." },
        { status: 400 }
      );
    }

    await prisma.contactMessage.create({
      data: {
        name: String(name),
        company: company ? String(company) : null,
        phone: phone ? String(phone) : null,
        email: String(email),
        message: message ? String(message) : null,
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
