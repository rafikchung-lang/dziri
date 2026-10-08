import { NextResponse } from "next/server";
import { createRequire } from "module";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Parsed = { commandName: string; trigger: string; args: string[] } | null;
type ParserModule = {
  buildTriggerMap: (names: string[], aliases: Record<string, string[]>) => Map<string, string>;
  parseMessage: (content: string, prefix: string, map: Map<string, string>) => Parsed;
};

const COMMANDS = ["textmute", "textunmute", "voicemute", "voiceunmute", "ban", "unban", "kick", "purge", "lock", "unlock", "role", "rank", "leaderboard", "history", "help"];

function loadParser(): ParserModule {
  // Load the bot's REAL parser at runtime (same file the Discord bot uses).
  const req = createRequire(path.join(process.cwd(), "bot", "index.js"));
  return req("./utils/commandParser.js") as ParserModule;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { prefix?: unknown; aliases?: unknown; messages?: unknown };
    const prefix = typeof body.prefix === "string" ? body.prefix : "";
    const aliases = Array.isArray(body.aliases) ? body.aliases.map(String).slice(0, 25) : [];
    const messages = Array.isArray(body.messages) ? body.messages.map(String).slice(0, 30) : [];
    const { buildTriggerMap, parseMessage } = loadParser();
    const map = buildTriggerMap(COMMANDS, { textmute: aliases });
    const results = messages.map((m) => {
      const r = parseMessage(m, prefix, map);
      return { message: m, command: r ? r.commandName : null, trigger: r ? r.trigger : null };
    });
    return NextResponse.json({ prefix, results });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed" }, { status: 400 });
  }
}
