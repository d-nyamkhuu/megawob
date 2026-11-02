/* base / use-calendar / classic: a responsive team calendar. A calendar rail and
 * mini month flank the week/day/month workspace, with attendee colors, working hours,
 * a secondary zone ruler, an all-day strip, a seeded current-time marker, a details
 * inspector with guests/RSVPs and month overflow popovers. Nearby dates can be browsed;
 * the task oracle restores the shared dates before task actions. Grid
 * creation, event-body movement and bottom-edge resizing use pointer capture and
 * 15-minute snapping. Inner time panes support both wheel and a custom scrollbar.
 * locate() only reads geometry; sync() reconciles external hook/model changes.
 */
(function () {
  'use strict';
  let current;
  const CSS=`
  .ac-app {position:absolute;inset:10px;display:flex;flex-direction:column;min-width:0;min-height:0;background:var(--panel);border:1px solid var(--line);border-radius:10px;overflow:hidden;color:var(--fg);font-size:12px;box-shadow:0 4px 18px #0000000c}
  .ac-app button {font:inherit;color:inherit;border:1px solid var(--line);border-radius:5px;background:var(--panel);padding:5px 9px;cursor:pointer}
  .ac-app button:hover {background:color-mix(in srgb,var(--accent) 10%,var(--panel))}
  .ac-toolbar {height:52px;flex:none;display:flex;align-items:center;gap:12px;padding:0 14px;border-bottom:1px solid var(--line)}
  .ac-logo {background:var(--accent);color:white;border-radius:7px;width:30px;height:30px;text-align:center;padding:5px;font-weight:750;font-size:15px}
  .ac-brand {font-size:17px;font-weight:650}.ac-period {font-size:16px;font-weight:600;margin-right:auto;white-space:nowrap}
  .ac-toolbar .ac-tab {color:var(--accent);border-color:var(--accent)}
  .ac-body {flex:1;display:flex;min-height:0}.ac-sidebar {width:166px;flex:none;padding:14px 13px;background:color-mix(in srgb,var(--bg) 45%,var(--panel));border-right:1px solid var(--line);overflow:auto;scrollbar-width:thin}
  .ac-mini {display:grid;grid-template-columns:repeat(7,1fr);gap:3px;text-align:center;margin:10px 0 18px;font-size:10px}.ac-mini span {padding:2px 0}.ac-mini .today {border-radius:50%;background:var(--accent);color:white}
  .ac-subtitle {color:var(--muted);font-size:10px;text-transform:uppercase;letter-spacing:.08em;font-weight:700;margin:14px 0 7px}
  .ac-person {display:flex;align-items:center;gap:7px;padding:5px 0;overflow:hidden}.ac-person span:last-child {overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.ac-check {flex:none;width:11px;height:11px;border-radius:3px;background:var(--tone)}
  .ac-muted {color:var(--muted)}.ac-main {flex:1;display:flex;flex-direction:column;min-width:0;min-height:0;position:relative}
  .ac-context {height:31px;flex:none;display:flex;align-items:center;gap:10px;padding:0 12px;border-bottom:1px solid var(--line);color:var(--muted);font-size:11px;white-space:nowrap;overflow:hidden}
  .ac-context b {color:var(--fg);font-weight:500}.ac-saved {margin-left:auto;color:var(--muted)}
  .ac-head {display:flex;flex:none;height:45px;padding-right:12px;border-bottom:1px solid var(--line)}.ac-axis-head {flex:none;color:var(--muted);font-size:9px;display:flex;align-items:center;justify-content:center;white-space:pre-line;text-align:center}
  .ac-day-head {flex:1;text-align:center;border-left:1px solid var(--line);min-width:0;padding:5px 1px;color:var(--muted);font-size:10px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.ac-day-head b {display:block;font-size:15px;color:var(--fg);font-weight:550}
  .ac-scroll-wrap {flex:1;position:relative;min-height:0}.ac-pane {position:absolute;inset:0 12px 0 0;overflow:hidden}.ac-time-grid {position:relative;min-height:100%;touch-action:none}.ac-rulers {position:absolute;top:0;bottom:0;left:0;color:var(--muted);font-size:10px}.ac-hour-label {position:absolute;left:0;width:100%;display:flex;justify-content:space-around;line-height:16px;transform:translateY(-7px)}
  .ac-columns {position:absolute;top:0;right:0;bottom:0;display:flex}.ac-column {flex:1;position:relative;border-left:1px solid var(--line);min-width:0;background:repeating-linear-gradient(to bottom,transparent 0px,transparent 11px,color-mix(in srgb,var(--line) 45%,transparent) 11px,color-mix(in srgb,var(--line) 45%,transparent) 12px)}
  .ac-hour-line {position:absolute;left:0;right:0;border-top:1px solid var(--line);pointer-events:none}
  .ac-event {position:absolute;border-radius:4px;border-left:3px solid var(--tone);background:color-mix(in srgb,var(--tone) 22%,var(--panel));color:var(--fg);overflow:hidden;cursor:grab;touch-action:none;font-size:11px;line-height:14px;padding:3px 5px;z-index:2}
  .ac-event[data-selected] {outline:1px solid var(--tone);z-index:5}.ac-event b {display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:650}.ac-event small {font-size:10px;white-space:nowrap;display:block}.ac-edge {position:absolute;bottom:0;left:0;right:0;height:7px;cursor:ns-resize;z-index:2}.ac-edge::after {content:'';position:absolute;left:40%;right:40%;bottom:2px;border-top:2px solid var(--tone);opacity:.75}
  .ac-draft {position:absolute;background:color-mix(in srgb,var(--accent) 22%,transparent);border:1px dashed var(--accent);pointer-events:none;z-index:8;display:none;border-radius:4px}
  .ac-scrollbar {position:absolute;right:1px;top:2px;bottom:2px;width:10px;border-radius:5px;background:color-mix(in srgb,var(--fg) 5%,transparent)}.ac-thumb {position:absolute;left:2px;right:2px;min-height:22px;background:color-mix(in srgb,var(--muted) 55%,var(--panel));border-radius:5px;cursor:ns-resize}
  .ac-details {flex:none;min-height:76px;border-top:1px solid var(--line);padding:8px 12px;display:grid;grid-template-columns:minmax(110px,1fr) minmax(190px,1.6fr) minmax(100px,1fr);gap:5px 15px;background:color-mix(in srgb,var(--bg) 35%,var(--panel));font-size:10px;line-height:15px}.ac-details strong {font-size:12px}.ac-details div {min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.ac-details label {color:var(--muted);margin-right:6px}.ac-details .ac-when {white-space:normal}
  .ac-month {flex:1;min-height:0;display:grid;grid-template-columns:repeat(7,minmax(0,1fr));grid-template-rows:22px repeat(var(--weeks),minmax(0,1fr));overflow:hidden}.ac-weekday {font-size:10px;color:var(--muted);padding:3px 7px;border-bottom:1px solid var(--line)}.ac-date {min-width:0;min-height:0;border-right:1px solid var(--line);border-bottom:1px solid var(--line);padding:2px 3px;position:relative;overflow:hidden}.ac-date.out {background:color-mix(in srgb,var(--bg) 65%,var(--panel));color:var(--muted)}.ac-number {font-size:10px;display:block;height:15px;line-height:14px}.ac-month-event {height:17px;line-height:15px;font-size:10px;border-left:3px solid var(--tone);background:color-mix(in srgb,var(--tone) 20%,var(--panel));border-radius:3px;margin-bottom:2px;padding:0 3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;cursor:grab;touch-action:none}.ac-month button.ac-more {padding:0 3px;border:0;background:transparent;color:var(--muted);height:15px;font-size:10px;display:block}
  .ac-popover {position:absolute;z-index:20;left:12px;top:80px;width:245px;padding:12px;background:var(--panel);border:1px solid var(--line);border-radius:8px;box-shadow:0 8px 30px #0003}.ac-popover[hidden] {display:none}.ac-popover header {display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;font-weight:650}.ac-popover .ac-month-event {height:27px;line-height:25px;font-size:12px;margin:4px 0}
  .ac-short-month .ac-month-event {height:13px;line-height:12px;margin-bottom:1px;font-size:9px}.ac-short-month .ac-number {height:13px;line-height:12px}.ac-short-month .ac-month button.ac-more {height:13px;line-height:12px}
  .ac-status {flex:none;height:22px;display:flex;align-items:center;gap:10px;padding:0 12px;border-top:1px solid var(--line);font-size:10px;color:var(--muted)}.ac-status span:last-child {margin-left:auto}
  .ac-compact .ac-toolbar {gap:7px;padding:0 9px}.ac-compact .ac-brand {display:none}.ac-compact .ac-period {font-size:14px}.ac-compact .ac-details {grid-template-columns:minmax(90px,1fr) minmax(170px,1.7fr) minmax(140px,1.2fr);gap:5px 8px;font-size:9px}

  .ac-app [hidden] {display:none!important}
  /* Product chrome, calendar density and a persistent meeting inspector. */
  .ac-app {border-radius:8px;font-size:12px}
  .ac-icon {width:16px;height:16px;flex:none;vertical-align:middle;pointer-events:none;stroke:currentColor;fill:none;stroke-width:1.65;stroke-linecap:round;stroke-linejoin:round}
  .ac-app button.ac-icon-button {display:inline-flex;align-items:center;justify-content:center;padding:5px;width:29px;height:29px;background:transparent;border-color:transparent}
  .ac-app button.ac-icon-button:hover {background:color-mix(in srgb,var(--fg) 7%,transparent)}
  .ac-toolbar {height:50px;gap:9px;padding:0 12px}.ac-logo {display:flex;align-items:center;justify-content:center;padding:0;position:relative;font-size:13px;width:28px;height:29px;border-radius:5px}
  .ac-logo::before {content:'';position:absolute;top:5px;left:4px;right:4px;border-top:1px solid #ffffff70}.ac-logo span {padding-top:5px}
  .ac-brand {font-size:16px;font-weight:550;letter-spacing:-.3px;margin-right:5px}.ac-period {font-size:15px;letter-spacing:-.2px;min-width:0;overflow:hidden;text-overflow:ellipsis}
  .ac-nav-pair {display:flex;gap:0}.ac-toolbar .ac-tab {display:flex;align-items:center;gap:7px;color:var(--fg);border-color:var(--line);height:29px;font-size:11px}
  .ac-profile {width:27px;height:27px;display:flex;align-items:center;justify-content:center;border-radius:50%;background:color-mix(in srgb,var(--accent) 17%,var(--panel));color:var(--accent);font-size:10px;font-weight:700;flex:none}
  .ac-utility {display:flex;gap:2px;align-items:center}.ac-notify {position:relative}.ac-notify::after {content:'';position:absolute;top:4px;right:5px;width:5px;height:5px;border-radius:50%;background:#c96d46;border:1px solid var(--panel)}
  .ac-sidebar {width:156px;padding:12px 10px;position:relative}.ac-mini {gap:2px;margin:8px 0 12px;font-size:9px}.ac-mini span {padding:2px 0}.ac-mini .ac-range {background:color-mix(in srgb,var(--accent) 10%,transparent);border-radius:3px}
  .ac-mini-head {display:flex;align-items:center;justify-content:space-between;font-size:11px}.ac-create {display:flex;align-items:center;gap:7px;width:100%;font-weight:600!important;border-radius:7px!important;box-shadow:0 1px 2px #00000010;margin-bottom:15px;text-align:left;padding:8px!important}
  .ac-subtitle {margin:13px 0 5px;display:flex;align-items:center;gap:5px;font-size:9px;letter-spacing:.07em}.ac-subtitle .ac-icon {height:12px;width:12px;margin-left:auto}
  .ac-person {gap:7px;padding:4px 0;font-size:11px}.ac-check {width:10px;height:10px;display:flex;align-items:center;justify-content:center}.ac-check .ac-icon {width:9px;height:9px;color:white;stroke-width:2.8}
  .ac-avatar {height:22px;width:22px;flex:none;display:inline-flex;align-items:center;justify-content:center;border-radius:50%;font-size:9px;font-weight:650;color:var(--fg);background:color-mix(in srgb,var(--tone) 20%,var(--panel))}
  .ac-sidebar-note {border-top:1px solid var(--line);margin-top:13px;padding-top:9px;font-size:9px;color:var(--muted);line-height:1.6}.ac-room-dot {height:7px;width:7px;background:#299b88;border-radius:50%;flex:none}
  .ac-context {font-size:10px;height:30px;gap:7px}.ac-context .ac-icon {width:13px;height:13px}.ac-saved {display:flex;align-items:center;gap:4px;font-size:9px}.ac-context-badge {border:1px solid var(--line);border-radius:3px;padding:1px 4px;font-size:9px}
  .ac-head {height:47px}.ac-day-head {padding:4px 2px;font-size:9px}.ac-day-head b {font-size:17px;line-height:22px}.ac-day-head.today b {display:inline-flex;align-items:center;justify-content:center;width:25px;height:25px;background:var(--accent);color:#fff;border-radius:50%;font-size:15px}
  .ac-day-head .ac-avatar {height:18px;width:18px;font-size:8px;margin-right:4px}.ac-day-head .ac-head-name {display:flex;align-items:center;justify-content:center;overflow:hidden;white-space:nowrap}.ac-head-name span:last-child {overflow:hidden;text-overflow:ellipsis}
  .ac-allday {display:flex;height:29px;flex:none;border-bottom:1px solid var(--line);padding-right:12px}.ac-all-label {flex:none;display:flex;align-items:center;justify-content:center;font-size:8px;color:var(--muted)}.ac-all-cell {flex:1;min-width:0;border-left:1px solid var(--line);padding:4px 2px}
  .ac-all-event {font-size:8px;line-height:18px;border-radius:3px;padding:0 4px;color:var(--fg);background:color-mix(in srgb,var(--tone) 15%,var(--panel));white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .ac-now {position:absolute;right:0;height:0;border-top:1px solid #d76058;z-index:7;pointer-events:none}.ac-now::before {content:'';position:absolute;top:-4px;left:-4px;width:7px;height:7px;background:#d76058;border-radius:50%}.ac-now span {position:absolute;right:3px;top:-12px;font-size:8px;color:#d76058;background:var(--panel);padding:0 2px}
  .ac-event {padding:3px 4px;border-left-width:3px;border-radius:3px;background:color-mix(in srgb,var(--tone) 17%,var(--panel));font-size:11px;line-height:14px}.ac-event b {padding-right:12px;font-weight:600}.ac-event small {font-size:10px}.ac-event .ac-recur {position:absolute;right:3px;top:3px;width:10px;height:10px;color:var(--muted)}
  .ac-event-location {display:block;font-size:9px;color:var(--muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;line-height:13px}.ac-event-location .ac-icon {height:10px;width:10px;margin-right:2px}
  .ac-event[data-short] .ac-event-location {display:none}.ac-event[data-tiny] small {display:none}.ac-event[data-tiny] b {line-height:10px}
  .ac-event[data-halfhour] {padding:1px 4px}.ac-event[data-halfhour] b {font-size:10px;line-height:11px}.ac-event[data-halfhour] small {font-size:9px;line-height:10px}
  .ac-edge::after {opacity:0}.ac-event:hover .ac-edge::after,.ac-event[data-selected] .ac-edge::after {opacity:.65}
  .ac-inspector {width:230px;flex:none;min-height:0;border-left:1px solid var(--line);display:flex;flex-direction:column;overflow:hidden;background:var(--panel)}
  .ac-inspector-head {height:41px;flex:none;display:flex;align-items:center;gap:8px;padding:0 12px;border-bottom:1px solid var(--line);font-size:11px;font-weight:600}.ac-inspector-head .ac-icon {width:14px;height:14px;color:var(--muted)}.ac-inspector-head .ac-badge {margin-left:auto}
  .ac-badge {font-size:8px;font-weight:550;color:var(--muted);border:1px solid var(--line);padding:1px 5px;border-radius:3px;white-space:nowrap}
  .ac-inspector .ac-details {display:flex;flex-direction:column;border:0;background:transparent;padding:12px;gap:9px;min-height:0;font-size:10px;line-height:16px}
  .ac-inspector .ac-details div {white-space:normal;overflow:visible}.ac-inspector .ac-details strong {font-size:15px;line-height:1.3;font-weight:600;display:block;margin-bottom:5px;overflow-wrap:anywhere}
  .ac-inspector .ac-details .ac-when {border-top:1px solid var(--line);padding-top:8px;font-size:10px}.ac-inspector .ac-details .ac-meta {font-size:10px;line-height:17px;overflow-wrap:anywhere}
  .ac-inspector .ac-details .ac-meta div:last-child {color:var(--muted);font-size:9px;margin-top:2px}.ac-inspector .ac-details .ac-detail-duration {display:flex;align-items:center;gap:5px;font-size:10px}
  .ac-detail-icon {display:flex;align-items:flex-start;gap:6px}.ac-detail-icon .ac-icon {width:13px;height:13px;color:var(--muted);margin-top:2px}
  .ac-inspector-extra {overflow-y:auto;min-height:0;padding:0 12px 12px;scrollbar-width:thin;flex:1;font-size:10px}.ac-guests {border-top:1px solid var(--line);padding-top:9px}.ac-section-heading {font-size:10px;font-weight:600;display:flex;align-items:center;gap:6px;margin:0 0 6px}.ac-section-heading span {color:var(--muted);font-weight:400;font-size:9px;margin-left:auto}
  .ac-guest {display:flex;align-items:center;gap:6px;margin:7px 0;min-width:0}.ac-guest-name {flex:1;min-width:0}.ac-guest-name b {display:block;font-size:11px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:500}.ac-guest-name small {font-size:9px;color:var(--muted)}.ac-rsvp {color:#299b88}.ac-rsvp .ac-icon {width:12px;height:12px}
  .ac-note {border-top:1px solid var(--line);margin-top:10px;padding-top:9px;line-height:1.6;color:var(--muted);font-size:9px}.ac-empty-note {font-size:10px;color:var(--muted);padding:8px 0;line-height:1.6}.ac-resource {display:flex;align-items:center;gap:5px;font-size:9px;color:var(--muted);padding-top:5px}.ac-resource .ac-icon {width:12px;height:12px}
  .ac-activity {border-top:1px solid var(--line);margin-top:10px;padding-top:9px}.ac-activity-item {font-size:9px;margin:7px 0;line-height:1.5}.ac-activity-item small {display:block;color:var(--muted);font-size:8px}
  .ac-reminder {padding:3px 1px;color:var(--muted);font-size:9px;line-height:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;pointer-events:none}.ac-reminder::before {content:'';display:inline-block;width:5px;height:5px;border-radius:50%;background:var(--tone);margin-right:4px}
  .ac-popover {top:78px;left:12px;width:225px;padding:10px}.ac-popover .ac-month-event {font-size:11px;height:25px;line-height:23px}.ac-month-event .ac-icon {height:10px;width:10px;margin-right:3px}
  .ac-floating-menu {position:absolute;right:12px;top:44px;z-index:30;width:230px;padding:6px;background:var(--panel);border:1px solid var(--line);border-radius:7px;box-shadow:0 8px 24px #0003}.ac-floating-menu[hidden] {display:none}.ac-menu-heading {padding:7px 8px;font-size:11px;font-weight:600}.ac-menu-row {display:flex;align-items:center;gap:8px;padding:7px 8px;font-size:11px;border-radius:4px}.ac-menu-row .ac-icon {width:14px;height:14px}.ac-menu-row small {color:var(--muted);font-size:9px;margin-left:auto}.ac-menu-row:hover {background:color-mix(in srgb,var(--fg) 5%,transparent)}
  .ac-menu-row[aria-disabled=true] {color:var(--muted);opacity:.7}.ac-menu-check {color:var(--accent)}.ac-menu-row button {padding:2px 5px;font-size:9px;margin-left:auto}.ac-menu-notice {font-size:10px;line-height:1.6;padding:8px;border-top:1px solid var(--line);color:var(--muted)}
  .ac-status {height:23px;font-size:9px;gap:8px}.ac-status>span {display:flex;align-items:center;gap:4px}.ac-status .ac-icon {width:11px;height:11px;color:#299b88}
  .ac-compact .ac-toolbar {gap:5px}.ac-compact .ac-brand {display:none}.ac-compact .ac-toolbar .ac-optional {display:none}.ac-compact .ac-period {font-size:13px}.ac-compact .ac-inspector {width:220px}.ac-compact .ac-context-badge {display:none}.ac-compact .ac-context {font-size:9px}
  .ac-narrow .ac-utility {display:none}.ac-narrow .ac-toolbar {gap:4px}.ac-narrow .ac-head-name .ac-avatar {display:none}.ac-narrow .ac-details {min-height:74px;font-size:9px;gap:4px 6px}.ac-narrow .ac-context .ac-saved {display:none}
  .ac-wide .ac-sidebar {width:176px;padding:14px}.ac-wide .ac-inspector {width:258px}.ac-wide .ac-event {font-size:11px;line-height:14px}.ac-wide .ac-event small,.ac-wide .ac-event-location {font-size:10px}.ac-wide .ac-person {font-size:11px}
  `;
  const colors=['#6e70dc','#299b88','#cd8844','#b95987'];

  const ICONS={
    menu:'M4 6h16M4 12h16M4 18h16',plus:'M12 4v16M4 12h16',chevron:'m9 5 7 7-7 7',down:'m6 9 6 6 6-6',
    search:'M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',check:'m5 12 4 4L19 6',
    cloud:'M6 18a4 4 0 0 1-1-8 7 7 0 0 1 13-1 4.5 4.5 0 0 1 0 9H6',
    bell:'M5 17h14l-2-3V9a5 5 0 0 0-10 0v5l-2 3M10 21h4',
    settings:'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8M9 3l-1 3-3 1-2 3 2 2-1 3 2 3 3-1 3 3 3-1 1-3 3-1 2-3-2-2 1-3-2-3-3 1-3-3z',
    calendar:'M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1M4 10h16M8 2v6M16 2v6',
    clock:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M12 7v5l4 2',
    location:'M12 22s7-8 7-13A7 7 0 0 0 5 9c0 5 7 13 7 13M12 6a3 3 0 1 0 0 6 3 3 0 0 0 0-6',
    video:'M3 6h12v12H3zM15 10l6-4v12l-6-4',
    repeat:'m17 2 4 4-4 4M3 11V8a2 2 0 0 1 2-2h16M7 22l-4-4 4-4M21 13v3a2 2 0 0 1-2 2H3',
    guests:'M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8M2 21v-3a6 6 0 0 1 12 0v3M17 4a4 4 0 0 1 0 8M18 15a5 5 0 0 1 4 5',
    close:'m6 6 12 12M6 18 18 6',lock:'M5 10h14v11H5zM8 10V6a4 4 0 0 1 8 0v4',
    info:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M12 11v6M12 7v1',dots:'M5 12h.1M12 12h.1M19 12h.1'
  };
  function icon(u,parent,name,cls='') {
    const svg=u.svg('svg',{viewBox:'0 0 24 24','aria-hidden':'true',class:`ac-icon ${cls}`},parent);
    u.svg('path',{d:ICONS[name]||ICONS.calendar},svg);return svg;
  }
  const initials=name=>name.split(/\s+/).map(w=>w[0]).slice(0,2).join('').toUpperCase();
  env.widget({task:'use-calendar',site:'base',name:'classic',split:'train',
    scenarios:['freeslot','move','resize','timezone','month'],
    render(ctx) {
      const {spec:s,util:u}=ctx, f=env.taskDef;
      ctx.css('app-calendar-classic',CSS);
      const root=u.el('section','ac-app',ctx.stage); root.setAttribute('aria-label','Team calendar');
      if(ctx.size.width<1050) root.classList.add('ac-compact');
      if(ctx.size.width<790) root.classList.add('ac-narrow');
      if(ctx.size.width>=1250) root.classList.add('ac-wide');
      const cr=ctx.rng.fork('workspace'), C=ctx.content;
      const projects=['Cedar launch','Northstar research','Client reviews','Personal reminders','Operations'];
      const roomNames=new Map(s.events.map(e=>[e.id,C.pick(cr,C.VENUES,{csplit:s.csplit})]));
      const top=u.el('div','ac-toolbar',root);
      const ib=(parent,name,label,action,extra='')=>{
        const b=u.el('button',`ac-icon-button ${extra}`,parent);b.type='button';b.title=label;b.setAttribute('aria-label',label);icon(u,b,name);
        if(action) b.addEventListener('click',action);return b;
      };
      const logo=u.el('span','ac-logo',top);u.el('span','',logo,'8');u.el('span','ac-brand',top,'Daywell');
      const today=u.el('button','',top,'Today');today.addEventListener('click',()=>browse(0));today.title='Return to the shared dates';
      const nav=u.el('div','ac-nav-pair',top);
      const previous=ib(nav,'chevron','Previous '+(s.scenario==='month'?'month':'week'),()=>browse(-1));previous.firstChild.style.transform='rotate(180deg)';
      const next=ib(nav,'chevron','Next '+(s.scenario==='month'?'month':'week'),()=>browse(1));
      const period=u.el('span','ac-period',top,`${s.month} 2027`);
      const utilities=u.el('div','ac-utility',top);
      ib(utilities,'bell','Notifications',()=>openMenu('notifications'),'ac-notify');
      ib(utilities,'settings','Calendar settings',()=>openMenu('settings'),'ac-optional');
      const viewButton=u.el('button','ac-tab',top,s.scenario==='month'?'Month':s.scenario==='freeslot'?'Schedule':'Week');icon(u,viewButton,'down');viewButton.addEventListener('click',()=>openMenu('view'));
      const profile=u.el('span','ac-profile',top,initials(s.people[0]));profile.title=s.people[0];
      const menu=u.el('div','ac-floating-menu',root);menu.hidden=true;
      const body=u.el('div','ac-body',root);
      if(ctx.size.width>=950) {
        const side=u.el('aside','ac-sidebar',body);
        const create=u.el('button','ac-create',side);icon(u,create,'plus');u.el('span','',create,'Create');
        create.addEventListener('click',()=>{menu.hidden=true;commit({...ctx.model,selected:s.target});});
        const minihead=u.el('div','ac-mini-head',side);u.el('strong','',minihead,`${s.month} 2027`);icon(u,minihead,'calendar');
        const mini=u.el('div','ac-mini',side);
        for(const w of ['M','T','W','T','F','S','S']) u.el('span','ac-muted',mini,w);
        for(let k=0;k<s.firstWeekday;k++) u.el('span','',mini,'');
        for(let d=1;d<=s.monthDays;d++) u.el('span',d===8?'today':s.scenario!=='month'&&d>8&&d<=12?'ac-range':'',mini,String(d));
        const subtitle=txt=>{const h=u.el('div','ac-subtitle',side,txt);icon(u,h,'down');};
        subtitle('My calendars');
        ['Your calendar',...projects.slice(0,3)].forEach((name,i)=>{
          const row=u.el('div','ac-person',side);row.style.setProperty('--tone',colors[i%4]);const check=u.el('i','ac-check',row);icon(u,check,'check');u.el('span','',row,name);
        });
        subtitle('Team availability');
        s.people.forEach((name,i)=>{const row=u.el('div','ac-person',side);row.style.setProperty('--tone',colors[i]);u.el('span','ac-avatar',row,initials(name));u.el('span','',row,name);});
        subtitle('Rooms & resources');
        const rr=u.el('div','ac-person',side);u.el('i','ac-room-dot',rr);u.el('span','',rr,'Team meeting rooms');
        const note=u.el('div','ac-sidebar-note',side);u.el('b','',note,'Working hours');u.el('div','',note,`${f.helpers.time(s.open)} - ${f.helpers.time(s.close)}`);u.el('div','',note,'Monday - Friday');u.el('div','',note,'Shared with your workspace');
      }
      const main=u.el('div','ac-main',body), context=u.el('div','ac-context',main);
      icon(u,context,s.scenario==='freeslot'?'guests':'calendar');
      const contextTitle=u.el('b','',context,s.scenario==='freeslot'?`${s.month} 8 / Find a time`:'Team calendar');
      u.el('span','ac-context-badge',context,'Shared');
      const saved=u.el('span','ac-saved',context);icon(u,saved,'cloud');u.el('span','',saved,'All changes saved');
      const refs={root,ctx,s,f,today,events:new Map(),edges:new Map(),dates:new Map(),more:new Map(),popupEvents:new Map(),scroll:null};current=refs;
      let inspector;
      if(ctx.size.width>=790) {
        inspector=u.el('aside','ac-inspector',body);inspector.setAttribute('aria-label','Meeting details');
        const h=u.el('div','ac-inspector-head',inspector);icon(u,h,'calendar');u.el('span','',h,'Event details');
        const badge=u.el('span','ac-badge',h,'Team calendar');refs.detailBadge=badge;
      }
      const details=u.el('div','ac-details');
      const summary=u.el('div','',details);const detailTitle=u.el('strong','',summary);const detailDuration=u.el('div','ac-muted ac-detail-duration',summary);
      const when=u.el('div','ac-when',details), startLine=u.el('div','',when),endLine=u.el('div','',when);
      const meta=u.el('div','ac-meta',details), room=u.el('div','',meta), code=u.el('div','',meta);
      function browse(direction) {
        const v=direction===0?0:Math.max(-1,Math.min(1,(ctx.model.browse||0)+direction));
        commit({...ctx.model,browse:v,popover:null});
        if(refs.scroll) refs.scroll.to(0);
        if(refs.monthGrid) updateMonthDensity();
      }
      function openMenu(kind) {
        if(!menu.hidden && menu.dataset.kind===kind) {menu.hidden=true;return;}
        menu.replaceChildren();menu.dataset.kind=kind;menu.hidden=false;
        const heading=u.el('div','ac-menu-heading',menu,kind==='notifications'?'Notifications':kind==='settings'?'Calendar settings':'View options');
        const close=ib(heading,'close','Close menu',()=>{menu.hidden=true;});close.style.float='right';
        if(kind==='notifications') {
          const notices=[['Room booking confirmed',`${s.people[0]} / 12 min ago`],['Updated invitation',`${projects[0]} / 35 min ago`],['Calendar shared with you',`${projects[1]} / Yesterday`]];
          for(const [title,sub] of notices) {const row=u.el('div','ac-menu-row',menu);icon(u,row,'calendar');const text=u.el('div','',row,title);u.el('div','ac-muted',text,sub);}
          u.el('div','ac-menu-notice',menu,'You are up to date. Invitations are sent only after the organizer confirms the guest list.');
        } else if(kind==='settings') {
          for(const text of ['Working hours','Time zone: UTC+00:00','Default meeting: 30 minutes','Visibility: Workspace members']) {const row=u.el('div','ac-menu-row',menu);icon(u,row,text.startsWith('Visibility')?'lock':'clock');u.el('span','',row,text);}
          u.el('div','ac-menu-notice',menu,'Managed by your workspace. Your calendar is shared with team members.');
        } else {
          const row=u.el('div','ac-menu-row',menu);icon(u,row,'check','ac-menu-check');u.el('span','',row,s.scenario==='month'?'Month':s.scenario==='freeslot'?'Schedule':'Working week');
          for(const txt of ['Show weekends','Show declined events']) {const r=u.el('div','ac-menu-row',menu);r.setAttribute('aria-disabled','true');icon(u,r,'calendar');u.el('span','',r,txt);}
          u.el('div','ac-menu-notice',menu,"Availability is shown within your team's working hours.");
        }
      }
      root.addEventListener('pointerdown',e=>{if(!menu.contains(e.target) && !e.target.closest('.ac-toolbar')) menu.hidden=true;});
      function commit(m) {ctx.update(m);paint(ctx.model);}
      function eventInfo(id) {return s.events.find(e=>e.id===id)||{id:s.target,title:s.title,tone:0};}
      function attach(el,id,isEdge=false) {
        let original,grab;
        env.ui.track(el,{
          start(p,e) {
            if(!isEdge && e.target.closest('.ac-edge')) return false;
            e.stopPropagation();original={...ctx.model.events[id]};grab={x:p.x,y:p.y};
            if(refs.popover) refs.popover.style.pointerEvents='none';
          },
          move(p) {
            if(s.scenario==='month') return;
            const patch=isEdge?{duration:Math.max(15,Math.round((original.duration+p.dy/.8)/15)*15)}:
              {day:s.scenario==='freeslot'?s.date:Uday(p.x),start:original.start+Math.round(p.dy/.8/15)*15};
            const candidate=f.helpers.change(ctx.model,id,patch,s).events[id];
            positionEvent(el.closest('.ac-event'),candidate,id);
          },
          end(p) {
            if(refs.popover) refs.popover.style.pointerEvents='';
            let patch;
            if(s.scenario==='month') {
              const d=monthDay(p.x,p.y);if(d===null) {paint(ctx.model);return;} patch={day:d};
            } else if(isEdge) patch={duration:original.duration+Math.round(p.dy/.8/15)*15};
            else patch={day:s.scenario==='freeslot'?s.date:Uday(p.x),start:original.start+Math.round((p.y-grab.y)/.8/15)*15};
            if(Math.abs(p.dx)+Math.abs(p.dy)<3) commit({...ctx.model,selected:id});
            else commit(f.helpers.change(ctx.model,id,patch,s));
          }
        },isEdge?'calendar-duration':'calendar-event');
      }
      function Uday(x) {
        const r=refs.columns.getBoundingClientRect();
        return Math.max(8,Math.min(12,8+Math.floor((x-r.left)/r.width*5)));
      }
      function monthDay(x,y) {
        const r=refs.monthGrid.getBoundingClientRect(), row=Math.floor((y-r.top-22)/((r.height-22)/refs.weeks));
        const col=Math.floor((x-r.left)/(r.width/7)),d=row*7+col-s.firstWeekday+1;
        return row<0||col<0||col>6||d<1||d>s.monthDays?null:d;
      }
      function positionEvent(el,e,id) {
        if(!el) return;
        const cols=refs.count, owner=eventInfo(id).owner;
        const col=s.scenario==='freeslot'?(id===s.target?cols-1:owner):e.day-8;
        el.style.left=`calc(${100*col/cols}% + 3px)`;el.style.width=`calc(${100/cols}% - 6px)`;
        el.style.top=`${(e.start-s.open)*.8}px`;el.style.height=`${Math.max(12,e.duration*.8)}px`;
        el.querySelector('small').textContent=`${f.helpers.time(e.start)} - ${f.helpers.time(e.start+e.duration)}`;
        el.toggleAttribute('data-short',e.duration<60);el.toggleAttribute('data-halfhour',e.duration===30);el.toggleAttribute('data-tiny',e.duration<30);
      }
      function buildTime() {
        const header=u.el('div','ac-head',main),axis=s.scenario==='timezone'?100:52;refs.axis=axis;
        const ah=u.el('div','ac-axis-head',header,s.scenario==='timezone'?`UTC+00:00\nUTC${s.offset<0?'−':'+'}${f.helpers.time(Math.abs(s.offset))}`:'UTC+00');ah.style.width=`${axis}px`;
        const names=s.scenario==='freeslot'?s.people.concat('Your calendar'):['Mon','Tue','Wed','Thu','Fri'];refs.count=names.length;
        refs.dayHeads=[];
        names.forEach((name,i)=>{
          const h=u.el('div',`ac-day-head ${i===0?'today':''}`,header);h.title=name;refs.dayHeads.push(h);
          const label=u.el('span','ac-head-name',h);
          if(s.scenario==='freeslot'&&i<s.people.length) {const a=u.el('span','ac-avatar',label,initials(name));a.style.setProperty('--tone',colors[i]);}
          u.el('span','',label,name);u.el('b','',h,s.scenario==='freeslot'?'8':String(8+i));
        });
        const allday=u.el('div','ac-allday',main),allLabel=u.el('div','ac-all-label',allday,'all-day');allLabel.style.width=`${axis}px`;
        names.forEach((name,i)=>{
          const c=u.el('div','ac-all-cell',allday);
          if(i===1||i===names.length-1) {const event=u.el('div','ac-all-event',c,s.scenario==='freeslot'?(i===1?'Remote / Free':'Team reminders'):(i===1?'Cedar launch / FYI':'Client milestone'));event.style.setProperty('--tone',colors[i%4]);event.title='Reminder calendar: does not block availability';}
        });
        const wrap=u.el('div','ac-scroll-wrap',main),pane=u.el('div','ac-pane',wrap),grid=u.el('div','ac-time-grid',pane);
        refs.pane=pane;refs.grid=grid;grid.style.height=`${(s.close-s.open)*.8+1}px`;
        const rulers=u.el('div','ac-rulers',grid);rulers.style.width=`${axis}px`;
        for(let t=s.open;t<s.close;t+=60) {const label=u.el('div','ac-hour-label',rulers);label.style.top=`${Math.max(7,(t-s.open)*.8)}px`;u.el('span','',label,f.helpers.time(t));if(s.scenario==='timezone') u.el('span','',label,f.helpers.time(t+s.offset));}
        const columns=u.el('div','ac-columns',grid);columns.style.left=`${axis}px`;refs.columns=columns;
        names.forEach(()=>{const col=u.el('div','ac-column',columns);for(let t=s.open;t<s.close;t+=60) {const line=u.el('div','ac-hour-line',col);line.style.top=`${(t-s.open)*.8}px`;}});
        const now=u.el('div','ac-now',grid);refs.now=now;now.style.top=`${135*.8}px`;now.style.left=`${axis}px`;now.style.width=s.scenario==='freeslot'?`calc(100% - ${axis}px)`:`calc((100% - ${axis}px) / 5)`;now.setAttribute('aria-label',`Current time ${f.helpers.time(s.open+135)} UTC`);
        const eventLayer=u.el('div','ac-columns',grid);eventLayer.style.left=`${axis}px`;eventLayer.style.pointerEvents='none';refs.eventLayer=eventLayer;
        for(const e of s.events.concat(s.events.some(e=>e.id===s.target)?[]:[{id:s.target,title:s.title,tone:0}])) {
          const el=u.el('div','ac-event',eventLayer);el.style.pointerEvents='auto';el.style.setProperty('--tone',colors[e.tone%4]);el.setAttribute('aria-label',e.title);
          u.el('b','',el,e.title);u.el('small','',el);
          if(e.id!==s.target && env.util.hash32(e.id)%3===0) icon(u,el,'repeat','ac-recur');
          const place=u.el('span','ac-event-location',el);icon(u,place,'location');u.el('span','',place,e.id===s.target?s.room:roomNames.get(e.id));
          const edge=u.el('div','ac-edge',el);edge.setAttribute('aria-label',`Resize ${e.title}`);
          refs.events.set(e.id,el);refs.edges.set(e.id,edge);attach(el,e.id);attach(edge,e.id,true);
        }
        const adjacent=u.el('div','ac-columns',grid);adjacent.style.left=`${axis}px`;adjacent.style.pointerEvents='none';refs.adjacent=adjacent;
        for(let i=0;i<refs.count;i++) {const ev=u.el('div','ac-event',adjacent);ev.style.setProperty('--tone',colors[i%4]);ev.style.left=`calc(${100*i/refs.count}% + 3px)`;ev.style.width=`calc(${100/refs.count}% - 6px)`;ev.style.top=`${(90+i*45)*.8}px`;ev.style.height='48px';u.el('b','',ev,projects[i%projects.length]);u.el('small','',ev,`${f.helpers.time(s.open+90+i*45)} - ${f.helpers.time(s.open+150+i*45)}`);}
        const draft=u.el('div','ac-draft',grid);let begin;
        function minute(y) {const r=grid.getBoundingClientRect();return Math.max(s.open,Math.min(s.close,Math.round((y-r.top)/.8/15)*15+s.open));}
        env.ui.track(grid,{
          start(p,e) {
            if(ctx.model.browse||!['freeslot','timezone'].includes(s.scenario)||e.target.closest('.ac-event')) return false;
            const r=columns.getBoundingClientRect();if(p.x<r.left) return false;
            begin={day:s.scenario==='freeslot'?s.date:Uday(p.x),start:minute(p.y)};
            return true;
          },
          move(p) {
            const r=columns.getBoundingClientRect(), col=s.scenario==='freeslot'?refs.count-1:begin.day-8;
            draft.style.display='block';draft.style.left=`${refs.axis+r.width*col/refs.count+2}px`;draft.style.width=`${r.width/refs.count-4}px`;
            draft.style.top=`${(Math.min(begin.start,minute(p.y))-s.open)*.8}px`;draft.style.height=`${Math.max(15,Math.abs(minute(p.y)-begin.start))*.8}px`;
          },
          end(p) {
            draft.style.display='none';const end=minute(p.y),start=Math.min(begin.start,end),duration=Math.max(15,Math.abs(end-begin.start));
            commit(f.helpers.change(ctx.model,s.target,{day:begin.day,start,duration},s));
          }
        },'calendar-create');
        const track=u.el('div','ac-scrollbar',wrap),thumb=u.el('div','ac-thumb',track);refs.track=track;refs.thumb=thumb;
        function mirror(px) {
          const h=pane.clientHeight, total=grid.offsetHeight, th=Math.max(24,track.clientHeight*h/total);
          thumb.style.height=`${th}px`;thumb.style.top=`${(track.clientHeight-th)*px/Math.max(1,total-h)}px`;
          ctx.patch({view:{top:s.open+px/.8,bottom:s.open+(px+h)/.8,px}});
        }
        refs.scroll=env.ui.scrollPane(pane,{thumb,track,onScroll:mirror,label:'calendar-scroll'});
        refs.scroll.to(ctx.model.view.px||0);
      }
      const months=['January','February','March','April','May','June','July','August','September','October','November','December'];
      const monthLengths=[31,28,31,30,31,30,31,31,30,31,30,31];
      function shownMonth(m) {
        const i=months.indexOf(s.month),offset=m.browse||0;
        if(!offset) return {name:s.month,days:s.monthDays,first:s.firstWeekday};
        const j=i+offset,days=monthLengths[j];
        const first=offset>0?(s.firstWeekday+s.monthDays)%7:(s.firstWeekday-days%7+7)%7;
        return {name:months[j],days,first};
      }
      function buildMonth() {
        refs.monthGrid=u.el('div','ac-month',main);refs.weeks=Math.ceil((s.firstWeekday+s.monthDays)/7);
        refs.popover=u.el('div','ac-popover',main);
      }
      function monthCells(m) {
        const mo=shownMonth(m),key=mo.name;
        if(refs.monthKey===key) return;
        refs.monthKey=key;refs.weeks=Math.ceil((mo.first+mo.days)/7);
        const g=refs.monthGrid;g.replaceChildren();refs.dates.clear();g.style.setProperty('--weeks',refs.weeks);
        for(const w of ['MON','TUE','WED','THU','FRI','SAT','SUN']) u.el('div','ac-weekday',g,w);
        for(let k=0;k<refs.weeks*7;k++) {
          const d=k-mo.first+1,cell=u.el('div',d<1||d>mo.days?'ac-date out':'ac-date',g);
          if(d>=1&&d<=mo.days) {refs.dates.set(d,cell);u.el('span','ac-number',cell,String(d));}
        }
      }
      function updateMonthDensity() {
        const row=(refs.monthGrid.clientHeight-22)/refs.weeks;
        refs.monthLimit=row<69?1:2;root.classList.toggle('ac-short-month',row<53);
        ctx.patch({monthLimit:refs.monthLimit});
      }
      function paintMonth(m) {
        monthCells(m);updateMonthDensity();
        refs.events.clear();refs.more.clear();refs.popupEvents.clear();
        for(const [day,cell] of refs.dates) {
          while(cell.children.length>1) cell.lastChild.remove();
          const events=m.browse?[]:s.events.filter(e=>m.events[e.id].day===day);
          events.slice(0,refs.monthLimit||2).forEach(e=>{
            const node=u.el('div','ac-month-event',cell,e.title);node.style.setProperty('--tone',colors[e.tone%4]);node.title=e.title;refs.events.set(e.id,node);attach(node,e.id);
          });
          if(!events.length && day%4===1) {const note=u.el('div','ac-reminder',cell,`${s.scenario==='month'&&day%3===0?'09:00':'16:00'} ${projects[day%projects.length]}`);note.style.setProperty('--tone',colors[day%4]);}
          if(events.length>(refs.monthLimit||2)) {const more=u.el('button','ac-more',cell,`+${events.length-(refs.monthLimit||2)} more`);refs.more.set(day,more);more.addEventListener('click',()=>commit({...ctx.model,popover:day}));}
        }
        const pop=refs.popover;pop.replaceChildren();pop.hidden=m.popover===null;
        if(m.popover!==null) {
          const h=u.el('header','',pop,f.helpers.dateLabel(s,m.popover)),close=ib(h,'close','Close event list',()=>commit({...ctx.model,popover:null}));
          for(const e of s.events.filter(e=>m.events[e.id].day===m.popover)) {const node=u.el('div','ac-month-event',pop,e.title);node.style.setProperty('--tone',colors[e.tone%4]);node.title=e.title;refs.popupEvents.set(e.id,node);attach(node,e.id);}
        }
      }
      let guestState;
      function paint(m) {
        const offset=m.browse||0;
        previous.disabled=offset<=-1;next.disabled=offset>=1;
        period.textContent=s.scenario==='month'?`${shownMonth(m).name} 2027`:`${s.month} ${8+offset*7}${s.scenario==='freeslot'?'':` - ${12+offset*7}`}, 2027`;
        contextTitle.textContent=offset?'Team calendar / '+(offset<0?'Previous':'Next')+' '+(s.scenario==='month'?'month':'week'):s.scenario==='freeslot'?`${s.month} 8 / Find a time`:'Team calendar / Working '+(s.scenario==='month'?'month':'week');
        if(s.scenario==='month') paintMonth(m);
        else {
          refs.adjacent.hidden=!offset;refs.now.hidden=!!offset;
          refs.dayHeads.forEach((h,i)=>{h.querySelector('b').textContent=String((s.scenario==='freeslot'?8:8+i)+offset*7);h.classList.toggle('today',!offset&&i===0);});
          for(const [id,el] of refs.events) {
            el.hidden=!!offset||(id===s.target&&!m.created);el.toggleAttribute('data-selected',m.selected===id);positionEvent(el,m.events[id],id);
          }
        }
        const id=m.selected||s.target,e=m.events[id], exists=id!==s.target||m.created;
        detailTitle.textContent=exists?eventInfo(id).title:'New meeting';
        detailDuration.textContent=exists?(s.scenario==='month'?'All day / Busy':`${e.duration} minutes / Busy`):'No time selected';
        startLine.textContent=exists?`Start  ${f.helpers.dateLabel(s,e.day)} / ${s.scenario==='month'?'All day':f.helpers.time(e.start)}`:'Start  Not scheduled';
        endLine.textContent=exists?`End  ${f.helpers.endLabel(s,e)}`:'End  Not scheduled';
        room.textContent=`Room  ${id===s.target?s.room:roomNames.get(id)}`;
        code.textContent=exists?`Booking reference  ${s.code}`:'Booking reference  Not booked';
        room.title=room.textContent;code.title=code.textContent;
        if(refs.detailBadge) refs.detailBadge.textContent=exists?'Saved':'Draft';
        if(refs.extra && guestState!==`${id}/${exists}`) {
          guestState=`${id}/${exists}`;refs.extra.replaceChildren();
          const resource=u.el('div','ac-resource',refs.extra);icon(u,resource,'video');u.el('span','',resource,exists?'Daywell Meet / Video meeting':'Video meeting added when scheduled');
          if(!exists) u.el('div','ac-empty-note',refs.extra,'Choose a time that works for your guests. Working hours and shared availability are shown alongside your calendar.');
          const guests=u.el('div','ac-guests',refs.extra),heading=u.el('div','ac-section-heading',guests,'Guests');u.el('span','',heading,`${s.people.length} guests`);
          s.people.forEach((name,i)=>{
            const newMeeting=['freeslot','timezone'].includes(s.scenario);
            const g=u.el('div','ac-guest',guests),a=u.el('span','ac-avatar',g,initials(name));a.style.setProperty('--tone',colors[i]);
            const text=u.el('div','ac-guest-name',g);u.el('b','',text,name);u.el('small','',text,i===0?'Organizer':exists?(newMeeting||i===s.people.length-1?'Awaiting response':'Accepted'):'Availability shared');
            if(exists&&(i===0||(!newMeeting&&i<s.people.length-1))) {const r=u.el('span','ac-rsvp',g);icon(u,r,'check');r.title=i===0?'Organizer':'Accepted';}
          });
          const note=u.el('div','ac-note',refs.extra);u.el('div','ac-section-heading',note,'Description');u.el('div','',note,exists?'Review progress, discuss open questions and agree on next steps. Notes are shared with invited guests.':'An agenda can be added after the meeting is scheduled.');
          const recurrence=u.el('div','ac-resource',refs.extra);icon(u,recurrence,'repeat');u.el('span','',recurrence,id!==s.target&&env.util.hash32(id)%3===0?'Repeats weekly':'Does not repeat');
          const reminder=u.el('div','ac-resource',refs.extra);icon(u,reminder,'bell');u.el('span','',reminder,'Notification / 10 minutes before');
          const privacy=u.el('div','ac-resource',refs.extra);icon(u,privacy,'lock');u.el('span','',privacy,'Workspace visibility / Busy');
          const activity=u.el('div','ac-activity',refs.extra);u.el('div','ac-section-heading',activity,'Workspace activity');
          for(const [title,sub] of [['Room reservation updated','12 minutes ago'],[`${projects[1]} invitation received`,'35 minutes ago']]) {const row=u.el('div','ac-activity-item',activity,title);u.el('small','',row,sub);}
        }
      }
      if(s.scenario==='month') buildMonth(); else buildTime();
      if(inspector) {inspector.appendChild(details);refs.extra=u.el('div','ac-inspector-extra',inspector);} else main.appendChild(details);
      const status=u.el('div','ac-status',root),connected=u.el('span','',status);icon(u,connected,'check');u.el('span','',connected,'Connected');
      const share=u.el('span','',status);icon(u,share,'guests');u.el('span','',share,'Team workspace');
      u.el('span','',status,`Today: ${s.month} 8 / ${f.helpers.time(s.open+135)} UTC`);
      paint(ctx.model);
      if(refs.scroll) refs.scroll.to(ctx.model.view.px||0);
      return {anchors:[root],sync:paint};
    },
    locate(t) {
      const r=current,{ctx,s}=r,m=ctx.model;
      const center=el=>{if(!el) throw new Error(`use-calendar target not rendered: ${JSON.stringify(t)}`);const b=el.getBoundingClientRect();return [b.left+b.width/2,b.top+b.height/2];};
      if(t.today) return center(r.today);
      if(t.more!==undefined) return center(r.more.get(t.more));
      if(t.date!==undefined) {const b=r.dates.get(t.date).getBoundingClientRect();return [b.left+b.width/2,b.top+9];}
      if(t.event) {
        if(s.scenario==='month') return center(r.popupEvents.get(t.event)||r.events.get(t.event));
        const e=m.events[t.event],b=r.events.get(t.event).getBoundingClientRect();
        return [b.left+b.width/2,b.top+Math.min(8,e.duration*.8/3)];
      }
      if(t.edge) {const b=r.edges.get(t.edge).getBoundingClientRect();return [b.left+b.width/2,b.bottom-2];}
      if(t.pane) {const b=r.pane.getBoundingClientRect();return [b.left+20,b.top+b.height/2];}
      if(t.thumb) return r.scroll.locateThumb();
      if(t.scroll!==undefined) {
        const b=r.thumb.getBoundingClientRect(),max=r.scroll.max(),travel=r.track.clientHeight-b.height;
        return [b.left+b.width/2,b.top+b.height/2+(t.scroll-r.scroll.get())/Math.max(1,max)*travel];
      }
      const cell=t.cell||t.end;
      if(cell) {
        const b=r.columns.getBoundingClientRect(),grid=r.grid.getBoundingClientRect();
        const col=s.scenario==='freeslot'?r.count-1:cell[0]-8;
        return [b.left+b.width*(col+.5)/r.count,grid.top+(cell[1]-s.open)*.8+(t.cell&&m.created?8:t.end?-2:0)];
      }
      throw new Error(`use-calendar unknown target ${JSON.stringify(t)}`);
    }
  });
})();
