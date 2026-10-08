import { NextResponse } from "next/server";
import JSZip from "jszip";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BOT_DIR = path.join(process.cwd(), "bot");
const EXCLUDE = new Set(["node_modules", "data", ".env"]);

function addDir(zip: JSZip, dir: string, rel: string) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (EXCLUDE.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    const zipPath = rel ? `${rel}/${entry.name}` : entry.name; // files go at the ZIP ROOT (no wrapper folder)
    if (entry.isDirectory()) addDir(zip, full, zipPath);
    else zip.file(zipPath, fs.readFileSync(full));
  }
}

export async function GET() {
  if (!fs.existsSync(path.join(BOT_DIR, "index.js"))) {
    return NextResponse.json({ error: "Bot sources not found." }, { status: 500 });
  }
  const zip = new JSZip();
  addDir(zip, BOT_DIR, "");
  const buf = await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE", compressionOptions: { level: 9 } });
  return new NextResponse(new Uint8Array(buf), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": 'attachment; filename="dziri-system.zip"',
      "Cache-Control": "no-store",
    },
  });
}
