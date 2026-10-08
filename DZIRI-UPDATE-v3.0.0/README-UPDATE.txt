DZIRI SYSTEM UPDATE v3.0.0
==========================

This is an IN-PLACE PATCH for the existing Dziri System installation.
It is not a complete project and does not contain node_modules, .env, data, logs,
package.json, package-lock.json, or unchanged application files.

FILES TO BACK UP / REPLACE
--------------------------
config/defaults.js
dashboard/api.js
dashboard/server.js
public/assets/app.js
public/index.html
services/broadcastService.js
services/tempRoomService.js

NEW APPLICATION FILES
---------------------
None.

WISPBYTE UPDATE STEPS
---------------------
1. Back up the seven existing files listed above.
2. Stop the bot.
3. Open DZIRI-UPDATE-v3.0.0.zip and enter its files/ directory.
4. Copy the CONTENTS of files/ over the existing project root while preserving the exact
   folder structure. Replace the seven files when prompted.
5. Do NOT replace or delete .env, data/, guild configuration, uploads, or logs.
6. Do NOT run npm install. package.json/package-lock.json and dependencies are unchanged.
7. Start normally:

   node index.js

8. Reload the dashboard. public/index.html loads app.js?v=3.0.0, so a normal reload should
   load the new UI. If a proxy/browser still shows the old UI, press Ctrl+F5 once.

FEATURE 1 — AUTOMATIC VOICE-CHAT MESSAGE CLEANUP
-------------------------------------------------
Location: Dashboard -> AutoMod -> Message Cleanup
Route: /dashboard/automod/message-cleanup

Independent settings:
- Temporary Voice Room Chats
- Public Voice Channel Chats

For each type:
- Enable/disable
- Numeric interval
- Hours/days unit
- Last cleanup time
- Next scheduled cleanup time
- Last deleted/failed/channel totals
- Last error
- Confirmed Clear Now action

Public channels are selected using the existing real Discord voice-channel selector. Only
selected Discord voice channels are processed. Normal text channels, ticket channels, log
channels and unrelated channels are not selected or scanned.

The scheduler:
- Uses the existing temporary-room cleanup scheduler (no competing worker).
- Checks persisted schedules every minute.
- Persists last run/results/errors in the existing temporary-room state JSON.
- Calculates next run after restart.
- Retries failures after 15 minutes.
- Locks each scope and channel to prevent concurrent deletion jobs.
- Fetches/deletes beyond 100 messages in batches.
- Deletes messages older than Discord's 14-day bulk limit individually.

Backward compatibility:
- Existing tempRooms.chatCleanup values are used until the new AutoMod cleanup settings are
  first saved, preserving the previous enabled state/interval.
- Public cleanup defaults to OFF with a 24-hour interval.

FEATURE 2 — MEMBER MESSAGING
----------------------------
The existing queued member messaging card under Moderation is extended; recipient filters,
rate limiting, cancellation, cap and job history remain.

Delivery modes:
- Normal Bot Message: private DM from the selected bot.
- Webhook: personalised messages in the selected real Discord text channel, using an
  application-owned webhook from the selected bot.

Attachments:
- Up to 10 files.
- Up to 10 MB each, 20 MB combined.
- Supported: PNG, JPEG, GIF, WEBP, PDF, TXT, CSV, ZIP, MP3, OGG, WAV, MP4, WEBM.
- Uploads are stored under existing data/uploads/broadcast storage.
- They survive dashboard refresh through saved draft IDs.
- They are removed after campaign completion or manual removal; abandoned uploads are pruned
  after seven days.

Placeholders:
{user} {username} {displayname} {userid} {server} {serverid} {membercount} {bot}

Placeholder buttons insert at the current cursor. Expansion occurs independently per recipient.
{user} becomes the intended recipient mention. allowedMentions has parse=[] and permits only
that recipient ID, preventing @everyone, @here and unrelated role/user pings.

The editor includes:
- Draft persistence per guild in browser localStorage
- Attachment image/file previews and removal
- Optional embed title, description and colour
- Example preview clearly labelled as sample data
- Bot and delivery selection
- Accurate sent/failed/skipped/queued counts and last error

DISCORD PERMISSIONS
-------------------
Public/temporary cleanup:
- Manage Messages
- Read Message History
in every voice channel being cleaned.

Webhook delivery:
- View Channel
- Send Messages
- Embed Links
- Attach Files
- Manage Webhooks
in the selected delivery channel.

Normal Bot Message delivery sends DMs and does not need a webhook.

CONFIG / DATA MIGRATION
-----------------------
No migration command is required. Existing JSON configuration is deep-merged with the new
AutoMod cleanup defaults. Existing bot tokens, commands, AutoRole, AutoMod rules, moderation,
reasons, role mappings, tickets, temporary rooms/buttons, logs/retention, leveling, rank card,
member history and stored user data are preserved.

DEPENDENCIES
------------
Unchanged. Do NOT run npm install for this patch.

RECOMMENDED TESTS
-----------------
1. Enable public cleanup, select one public voice channel, set 6 hours, Save and refresh.
2. Verify Last/Next schedule; restart the bot and verify the timestamps remain.
3. Use Clear Now and confirm only the selected voice chat is cleared.
4. Upload an image in Member Messaging and send one normal-message test campaign.
5. Send a webhook test campaign to a selected staff test channel.
6. Test: Hello {user}, welcome to {server}! with two recipients.
7. Confirm @everyone/@here text is not converted into mass pings.
