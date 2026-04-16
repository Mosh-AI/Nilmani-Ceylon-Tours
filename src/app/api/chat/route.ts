import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { db } from "@/db";
import { tours, siteSettings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const bodySchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string().max(2000),
    })
  ).max(20),
});

async function buildSystemPrompt(): Promise<string> {
  // Fetch live tours from DB
  const allTours = await db
    .select({
      title: tours.title,
      subtitle: tours.subtitle,
      duration: tours.duration,
      price: tours.price,
      category: tours.category,
      difficulty: tours.difficulty,
      maxGroup: tours.maxGroup,
      highlights: tours.highlights,
      whatsIncluded: tours.whatsIncluded,
      available: tours.available,
    })
    .from(tours)
    .where(eq(tours.available, true));

  // Fetch WhatsApp number from settings
  const whatsappSetting = await db
    .select({ value: siteSettings.value })
    .from(siteSettings)
    .where(eq(siteSettings.key, "whatsapp_number"))
    .limit(1);

  const whatsapp = whatsappSetting[0]?.value ?? "94787829952";

  const toursText = allTours.map((t) => {
    const highlights = Array.isArray(t.highlights)
      ? (t.highlights as string[]).slice(0, 4).join(", ")
      : "";
    return `- ${t.title}${t.subtitle ? ` (${t.subtitle})` : ""}: ${t.duration} days, from $${t.price}/person. Category: ${t.category ?? "General"}. Difficulty: ${t.difficulty ?? "Easy"}. Max group: ${t.maxGroup ?? 8}. Highlights: ${highlights}`;
  }).join("\n");

  return `You are the friendly AI assistant for Nilmani Ceylon Tours, a luxury private tour operator in Sri Lanka run by Roshan Jayasuriya, based in Seeduwa, Sri Lanka.

Your job is to help potential travellers learn about our tours, answer questions about Sri Lanka, and guide them towards booking.

ABOUT US:
- We offer private, personalised tours of Sri Lanka with an expert local driver-guide (Roshan)
- Every tour is customisable — itineraries can be adjusted to guest preferences
- We serve international travellers (UK, Germany, Australia, USA and beyond)
- All tours include: private air-conditioned vehicle, English-speaking driver-guide, hotel accommodation, daily breakfast
- Not included: international flights, travel insurance, entrance fees, lunch and dinner
- Deposit: 20% to confirm, balance before tour starts
- We accept bank transfer and major cards

OUR CURRENT TOURS:
${toursText}

CONTACT & BOOKING:
- WhatsApp: +${whatsapp} (fastest response)
- Booking form: available on our website at /booking
- Email enquiries welcome

SRI LANKA TRAVEL TIPS YOU KNOW:
- Best time to visit: Dec–April (west/south coast), May–Sept (east coast), Cultural Triangle year-round
- Currency: Sri Lankan Rupee (LKR). Most hotels accept USD/EUR
- Visa: ETA required for most nationalities, apply online at eta.gov.lk
- Flights: Colombo Bandaranaike International Airport (CMB)

RULES:
- Be warm, friendly and helpful
- Keep answers concise — 2-4 sentences unless more detail is asked
- If asked about pricing, always mention it's per person and customisable
- If asked something you don't know, suggest contacting Roshan on WhatsApp
- Never make up tour details not listed above
- Always end booking-intent messages by offering to connect them with Roshan on WhatsApp
- Do not discuss politics, religion controversially, or unrelated topics
- Respond in the same language the user writes in`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = bodySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { messages } = parsed.data;
    const systemPrompt = await buildSystemPrompt();

    const stream = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
      max_tokens: 500,
      temperature: 0.7,
      stream: true,
    });

    // Stream the response
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content ?? "";
          if (text) {
            controller.enqueue(encoder.encode(text));
          }
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
