DZIRI SYSTEM UPDATE v2.9.0
==========================

This is an IN-PLACE PATCH for your existing Dziri System installation.
It is not a complete project and does not contain node_modules, .env, data, logs,
package.json, package-lock.json, or unchanged project files.

BACK UP FIRST
-------------
Back up every existing file listed under "FILES TO REPLACE" below. Also keep your
existing data/ directory and .env file backed up. Do not delete either one.

FILES TO REPLACE
----------------
commands/moderation/purge.js
commands/utility/help.js
commands/utility/history.js
config/defaults.js
dashboard/api.js
events/ready.js
public/assets/app.js
services/loggingService.js
services/tempRoomService.js
services/ticketService.js
utils/logger.js

FILES TO ADD
------------
commands/moderation/move.js
commands/utility/moveme.js
commands/utility/crimeshistory.js
commands/utility/currentcrime.js
services/crimeService.js
utils/discordOutput.js

WISPBYTE UPDATE STEPS
---------------------
1. Back up the files listed above.
2. Stop the bot.
3. Open this update package and enter the files/ folder.
4. Copy the CONTENTS of files/ over your existing project root while preserving the
   exact folder structure. Replace the existing files when prompted.
5. Do NOT upload the outer DZIRI-UPDATE-v2.9.0 folder as a nested bot project.
6. Do NOT replace .env or data/.
7. Do NOT run npm install. Dependencies did not change.
8. Start the bot normally:

   node index.js

9. Check the startup log and test the features listed below.

WHAT CHANGED
------------
PURGE
- Purge is no longer limited to 100 messages.
- The bot fetches and deletes in Discord-safe pages/batches until the requested amount
  is deleted or no eligible messages remain.
- Messages older than Discord's bulk-delete limit are deleted individually.
- Existing aliases, permissions, optional user filter, history and logging are preserved.

NEW COMMANDS
- move @User: moves another connected member into the executor's voice channel.
- moveme @User: moves the executor into the target member's voice channel.
- crimeshistory @User: full stored punishment history in one Discord message whenever
  it fits; automatically uses the minimum number of messages when it does not.
- currentcrime @User: current active punishment, reason, start/end, remaining time and
  moderator using existing moderation history and mute/ban state.
- The commands automatically appear in Dashboard -> Commands and use the existing
  command permission/alias configuration architecture.

TEMPORARY ROOM CHAT CLEANUP
- Temporary Rooms -> Settings now includes chat cleanup and retention controls.
- Default retention is 24 hours.
- Only the associated chats of channels tracked as temporary voice rooms are cleaned.
- Normal server text channels and the voice rooms themselves are never deleted.
- Cleanup runs after startup and hourly.

LOG CLEANUP
- Logs -> Storage / Cleanup now includes manual Clear Logs with confirmation.
- Automatic retention options: Disabled, 1, 3, 7, 14, 30 and 90 days.
- Cleanup removes only bot-generated Dziri log embeds from configured log channels and
  local Dziri process log files.
- It never deletes configuration, moderation/member history, ticket state, room state,
  AutoRole, leveling, rank-card data, or stored user data.

OUTPUT LIMITS
- help, history and crimeshistory use one message whenever the content fits Discord's
  actual limits, and split automatically into the minimum number of messages otherwise.

TICKET NOTIFICATION ACCEPTANCE
- Untaken notifications now include Accept Ticket directly in the notification channel.
- Open Ticket is kept for backward-compatible convenience.
- Accepting verifies staff permissions, persists the handler, updates the ticket, logs
  the claim and deletes the untaken notification.
- Simultaneous clicks are re-checked atomically; only one staff member can win.
- Existing tickets created before this update use the configured notification channel as
  a backward-compatible fallback.

CONFIG / DATA MIGRATION
-----------------------
No command or reset is required. Existing JSON configuration is deep-merged with these
new defaults:
- logging.retentionDays = 0 (disabled)
- tempRooms.chatCleanup.enabled = true
- tempRooms.chatCleanup.retentionHours = 24

All existing guild settings, commands, aliases, role custom names, reasons, tickets,
temporary rooms, AutoRole, moderation, logs, leveling, rank card and user data remain.

DEPENDENCIES
------------
Unchanged. DO NOT run npm install for this patch.

RECOMMENDED TESTS
-----------------
- !purge 150 and !purge 500
- move @User and moveme @User
- crimeshistory @User and currentcrime @User
- Save Logs retention, refresh the dashboard, then restart the bot
- Use Clear Logs and confirm member history remains
- Save Temporary Room chat retention, refresh, then restart
- Open a ticket and accept it directly from the notification channel
