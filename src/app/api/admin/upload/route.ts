import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { apiHeaders } from "@/lib/api-headers";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
// Magic bytes for JPEG, PNG, WebP
const MAGIC_BYTES: [string, string[]][] = [
  ["image/jpeg", ["ffd8ff"]],
  ["image/png", ["89504e47"]],
  ["image/webp", ["52494646"]], // RIFF prefix for WebP
];

function checkMagicBytes(buffer: ArrayBuffer, mimeType: string): boolean {
  const bytes = new Uint8Array(buffer.slice(0, 4));
  const hex = Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
  const entry = MAGIC_BYTES.find(([t]) => t === mimeType);
  if (!entry) return false;
  return entry[1].some((magic) => hex.startsWith(magic));
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: apiHeaders() });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400, headers: apiHeaders() });
  }

  // Validate file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Only JPEG, PNG, and WebP images are allowed" },
      { status: 400, headers: apiHeaders() }
    );
  }

  // Validate file size
  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "File size must be under 5MB" },
      { status: 400, headers: apiHeaders() }
    );
  }

  const buffer = await file.arrayBuffer();

  // Validate magic bytes (prevent content-type spoofing)
  if (!checkMagicBytes(buffer, file.type)) {
    return NextResponse.json(
      { error: "File content does not match its type" },
      { status: 400, headers: apiHeaders() }
    );
  }

  // Generate safe UUID filename
  const ext = file.type.split("/")[1].replace("jpeg", "jpg");
  const filename = `${crypto.randomUUID()}.${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");

  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), Buffer.from(buffer));

  const url = `/uploads/${filename}`;
  return NextResponse.json({ url }, { headers: apiHeaders() });
}
