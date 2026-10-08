DZIRI SYSTEM HOTFIX v2.9.1 — AUTOROLE
======================================

WHY AUTOROLE STOPPED
--------------------
This was an incremental update mismatch; your stored AutoRole configuration was not lost.

- dashboard/api.js from the newer patch calls autoRoleService.status().
- The previous v2.9.0 patch did not include services/autoRoleService.js, so your server kept
  an older service file without the status() export.
- public/assets/app.js had the AutoRole route but no autorole icon entry, so the dashboard
  rendered the JavaScript value "undefined" before the label.

FILES TO REPLACE
----------------
public/assets/app.js
public/index.html
services/autoRoleService.js

UPDATE STEPS
------------
1. Back up the three existing files listed above.
2. Stop the bot.
3. Open this package and copy the CONTENTS of files/ over the existing project root.
4. Preserve the exact folder structure and replace all three files.
5. Do NOT replace .env or data/.
6. Do NOT run npm install; dependencies are unchanged.
7. Start normally:

   node index.js

8. Reload /dashboard/autorole. public/index.html now loads app.js?v=2.9.1 to bypass the
   old browser cache. If your browser still shows the previous page, press Ctrl+F5 once.

CONFIG / DATA
-------------
No migration is required. Existing AutoRole enabled state and selected role IDs remain in
data/guilds/<guildId>.json and are not modified by this hotfix.

DISCORD REQUIREMENTS
--------------------
- Server Members Intent enabled.
- Dziri System has Manage Roles.
- Bot role is above every selected AutoRole role.
