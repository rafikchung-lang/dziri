"use client";

import { useState } from "react";

type Result = { message: string; command: string | null; trigger: string | null };

const TREE = `index.js            ← node index.js
package.json
package-lock.json
.env.example
README.md
commands/
  moderation/   textmute textunmute voicemute voiceunmute
                ban unban kick purge lock unlock role
  leveling/     rank leaderboard
  utility/      history help
bots/           ticketBot.js (second Discord bot)
events/         ready messageCreate interactionCreate
                messageLogs memberLogs voiceStateUpdate
services/       commandService moderationService levelingService
                loggingService historyService automodService
                rankCardService broadcastService configService
                ticketService tempRoomService
                botRegistry panelDelivery
database/       store.js (atomic JSON storage)
config/         defaults.js
dashboard/      server.js api.js
public/         index.html login.html assets/
utils/          commandParser normalize duration logger …
assets/fonts/   Noto Sans + Noto Sans Arabic
tests/          dispatcher.test.js`;

const FEATURES = [
  ["Command system", "Slash and prefix commands plus unlimited aliases (Arabic and Unicode included). The prefix can be empty. Every trigger runs one shared handler with the same permission checks."],
  ["Reply targeting", "Reply to a member's message and type !mute, !ban, !kick or !role ods. An explicit mention always takes priority over the reply."],
  ["Custom role names", "Give a Discord role extra names such as ods or أوديسي. The role is never renamed and its ID is stored, so renaming it in Discord changes nothing."],
  ["Tickets (2nd bot)", "A separate ticket bot with its own token: panel with banner, ticket types and categories, private channels, claim/close/reopen/transcript, and one moderator notification per ticket."],
  ["Panel sender & delivery", "Pick per system which bot posts the panel (Dziri System or Ticket Bot) and whether it is a normal Discord message or an application-owned webhook. The sender always handles its own buttons."],
  ["Temporary voice rooms", "Join-to-create rooms with a fully editable control panel: add, delete, reorder, relabel and restyle buttons for lock, hide, allow, deny, disconnect, limit, rename, transfer and delete."],
  ["Moderation", "Text and voice mutes with timers that survive restarts, temporary and permanent bans, kick, purge, lock and unlock, and a role command. Role hierarchy is enforced."],
  ["Reason menus", "Each command has its own list of reasons and durations, edited in the dashboard and shown as a Discord select menu."],
  ["AutoMod", "Anti-spam, anti-link, anti-invite, bad words, mention spam, caps and duplicate messages. Each rule has its own thresholds and action."],
  ["Leveling", "Separate text and voice XP, level rewards and a leaderboard. Level-up messages are OFF by default."],
  ["Rank card", "Dark-purple glass design rendered with canvas, fully editable in the dashboard, including an uploaded background image that is saved on the server."],
  ["Logs and history", "Logs messages, members, roles, nicknames, voice moves and disconnects, and every moderation action. Member history is searchable and paginated."],
  ["Dashboard", "Liquid-glass interface where every section has its own URL. Role and channel selectors use real Discord data, and saves are confirmed by the server."],
];

export default function Home() {
  const [prefix, setPrefix] = useState("");
  const [aliases, setAliases] = useState<string[]>(["mute", "كتم", "اسكات", "silence"]);
  const [aliasInput, setAliasInput] = useState("");
  const [messages, setMessages] = useState("textmute @User\nmute @User\nكتم @User\nاسكات @User\nhello everyone\nhow are you\ngood morning");
  const [results, setResults] = useState<Result[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addAlias = () => {
    const parts = aliasInput.split(/\s+/u).map((a) => a.trim()).filter(Boolean);
    if (!parts.length) return;
    setAliases((prev) => [...prev, ...parts.filter((p) => !prev.some((x) => x.toLowerCase() === p.toLowerCase()))]);
    setAliasInput("");
  };

  const run = async () => {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/dispatcher-test", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prefix, aliases, messages: messages.split("\n").filter((m) => m.length) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setResults(data.results);
    } catch (e) { setError(e instanceof Error ? e.message : "Failed"); }
    finally { setLoading(false); }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07040d] text-violet-50">
      <div className="pointer-events-none absolute -left-40 -top-40 h-[520px] w-[520px] animate-pulse rounded-full bg-purple-700/40 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 top-1/3 h-[460px] w-[460px] animate-pulse rounded-full bg-fuchsia-700/30 blur-[120px]" />

      <div className="relative mx-auto max-w-6xl px-6 py-14">
        <header className="flex flex-wrap items-center gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-xl font-extrabold shadow-[0_10px_40px_-8px_rgba(168,85,247,.8)]">DZ</div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dziri System</h1>
            <p className="text-sm text-violet-300/80">Discord moderation &amp; server-management bot · Wispbyte-ready · Node.js 20</p>
          </div>
          <div className="flex-1" />
          <a href="/api/download" className="rounded-xl border border-white/15 bg-gradient-to-br from-purple-600 to-fuchsia-600 px-5 py-3 font-semibold shadow-[0_10px_30px_-10px_rgba(168,85,247,.9)] transition hover:-translate-y-0.5 active:translate-y-0">
            ⬇ Download dziri-system.zip
          </a>
        </header>

        <section className="mt-10 grid gap-5 md:grid-cols-3">
          {[["Start command", "node index.js", "index.js sits at the root of the ZIP, with no wrapper folder"], ["Dependencies", "≈ 65 MB", "discord.js · express · @napi-rs/canvas · dotenv"], ["Storage", "JSON files", "Atomic writes · capped history · rotated logs"]].map(([k, v, s]) => (
            <div key={k} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
              <div className="text-xs font-semibold uppercase tracking-widest text-violet-300/70">{k}</div>
              <div className="mt-1 bg-gradient-to-br from-white to-purple-300 bg-clip-text font-mono text-2xl font-bold text-transparent">{v}</div>
              <div className="mt-1 text-xs text-violet-300/60">{s}</div>
            </div>
          ))}
        </section>

        <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
          <h2 className="text-lg font-semibold">Live dispatcher test</h2>
          <p className="mt-1 text-sm text-violet-300/70">This calls the bot&apos;s real <code className="rounded bg-purple-500/15 px-1.5 text-purple-200">utils/commandParser.js</code>, the same file the Discord bot uses. Clear the prefix to test empty-prefix mode.</p>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <div className="space-y-4">
              <label className="block text-sm font-semibold">Prefix
                <input value={prefix} onChange={(e) => setPrefix(e.target.value)} placeholder="(empty)" className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 outline-none focus:border-purple-400/60" />
              </label>
              <div>
                <div className="text-sm font-semibold">textmute aliases</div>
                <div className="mt-1.5 flex min-h-11 flex-wrap items-center gap-1.5 rounded-xl border border-white/10 bg-black/30 p-1.5">
                  {aliases.map((a) => (
                    <span key={a} dir="auto" className="inline-flex items-center gap-1.5 rounded-full border border-purple-300/30 bg-purple-500/20 py-1 pl-3 pr-1.5 text-sm">
                      {a}
                      <button onClick={() => setAliases(aliases.filter((x) => x !== a))} className="grid h-4 w-4 place-items-center rounded-full bg-white/15 text-xs hover:bg-red-400/70" aria-label={`Remove ${a}`}>×</button>
                    </span>
                  ))}
                  <input value={aliasInput} dir="auto" onChange={(e) => setAliasInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); addAlias(); } }} placeholder="Type an alias and press Enter..." className="min-w-40 flex-1 bg-transparent px-1 py-1 text-sm outline-none" />
                </div>
              </div>
              <label className="block text-sm font-semibold">Messages (one per line)
                <textarea dir="auto" value={messages} onChange={(e) => setMessages(e.target.value)} rows={7} className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 font-mono text-sm outline-none focus:border-purple-400/60" />
              </label>
              <button onClick={run} disabled={loading} className="rounded-xl bg-gradient-to-br from-purple-600 to-fuchsia-600 px-5 py-2.5 font-semibold disabled:opacity-60">{loading ? "Testing..." : "Run dispatcher"}</button>
              {error && <p className="text-sm text-red-300">{error}</p>}
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-violet-300/70">Result</div>
              {!results && <p className="text-sm text-violet-300/60">Run the dispatcher to see which messages trigger a command.</p>}
              <ul className="space-y-2">
                {results?.map((r, i) => (
                  <li key={i} className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2 text-sm">
                    <span dir="auto" className="truncate font-mono">{r.message}</span>
                    {r.command
                      ? <span className="shrink-0 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-0.5 text-xs text-emerald-200">▶ /{r.command} via “{r.trigger}”</span>
                      : <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-violet-300/70">ignored</span>}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
            <h2 className="text-lg font-semibold">Deploy to Wispbyte</h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-violet-200/85">
              <li>Download the ZIP and upload its <b>contents</b> to <code className="text-purple-200">/home/container/</code>. The ZIP has no wrapper folder.</li>
              <li>Copy <code className="text-purple-200">.env.example</code> to <code className="text-purple-200">.env</code>. Set MAIN_DISCORD_TOKEN, MAIN_CLIENT_ID, CLIENT_SECRET, PORT, SESSION_SECRET, DASHBOARD_URL — plus TICKET_DISCORD_TOKEN and TICKET_CLIENT_ID for the second (ticket) bot.</li>
              <li>Add <code className="text-purple-200">DASHBOARD_URL/auth/callback</code> as an OAuth2 redirect in the Discord developer portal.</li>
              <li>Enable the <b>Server Members</b> and <b>Message Content</b> intents.</li>
              <li>Start with <code className="text-purple-200">npm install --omit=dev &amp;&amp; node index.js</code>.</li>
              <li>Optional: run <code className="text-purple-200">npm test</code>. It runs 71 tests across the dispatcher, role names, tickets, temporary rooms and panel delivery.</li>
            </ol>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
            <h2 className="text-lg font-semibold">ZIP root structure</h2>
            <pre className="mt-3 overflow-x-auto text-xs leading-relaxed text-violet-200/85">{TREE}</pre>
          </div>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(([t, d]) => (
            <div key={t} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-purple-300/30">
              <h3 className="font-semibold">{t}</h3>
              <p className="mt-1.5 text-sm text-violet-300/75">{d}</p>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
