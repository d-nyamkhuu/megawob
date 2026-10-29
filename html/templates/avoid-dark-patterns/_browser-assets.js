/* avoid-dark-patterns/_browser-assets: unchanged stylesheet, icons, tokens and block dispatch table. */
(function () {
  'use strict';
  const CSS = `
  .sd-win { position: absolute; display: flex; flex-direction: column; overflow: hidden; background: var(--panel); color: var(--fg);
    border: 1px solid var(--line); border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,.05), 0 14px 36px rgba(0,0,0,.13);
    font: 13.5px/1.38 system-ui, -apple-system, 'Segoe UI', sans-serif; user-select: none; -webkit-user-select: none;
    --b: hsl(var(--hue) 62% 40%); --bs: hsl(var(--hue) 60% 94%); --bfg: #fff; --ad: #17a34a; --warn: #c2410c; --bad: #c62828; --good: #15803d; }
  :root[data-theme="dark"] .sd-win { --b: hsl(var(--hue) 58% 62%); --bs: hsl(var(--hue) 30% 22%); --bfg: #0f1218; --warn: #fb923c; --bad: #f87171; --good: #4ade80; }
  :root[data-theme="low"] .sd-win { --b: hsl(var(--hue) 22% 52%); --bs: hsl(var(--hue) 12% 90%); }
  .sd-win * { box-sizing: border-box; }
  .sd-tabs { flex: none; display: flex; align-items: flex-end; gap: 6px; height: 30px; padding: 0 10px; background: color-mix(in srgb, var(--fg) 8%, var(--panel)); }
  .sd-dots { display: flex; gap: 6px; align-self: center; margin-right: 6px; }
  .sd-dots i { width: 11px; height: 11px; border-radius: 50%; background: #ff5f57; }
  .sd-dots i:nth-child(2) { background: #febc2e; } .sd-dots i:nth-child(3) { background: #28c840; }
  .sd-tab { display: flex; align-items: center; gap: 7px; height: 25px; max-width: 240px; padding: 0 12px; border-radius: 8px 8px 0 0;
    background: var(--panel); font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .sd-tab.off { background: transparent; color: var(--muted); }
  .sd-fav { flex: none; width: 14px; height: 14px; border-radius: 4px; background: var(--b); color: var(--bfg); font-size: 9px; font-weight: 800;
    display: grid; place-items: center; }
  .sd-bar { flex: none; display: flex; align-items: center; gap: 8px; height: 36px; padding: 0 10px; border-bottom: 1px solid var(--line); background: var(--panel); }
  .sd-nav { color: var(--muted); font-size: 16px; width: 18px; text-align: center; }
  .sd-omni { flex: 1; display: flex; align-items: center; gap: 7px; height: 26px; padding: 0 12px; border-radius: 13px; font-size: 12.5px;
    background: color-mix(in srgb, var(--fg) 6%, var(--panel)); overflow: hidden; white-space: nowrap; }
  .sd-omni svg { flex: none; width: 12px; height: 12px; fill: var(--muted); }
  .sd-omni .host { color: var(--fg); } .sd-omni .path { color: var(--muted); overflow: hidden; text-overflow: ellipsis; }
  .sd-ext { width: 18px; height: 18px; border-radius: 50%; background: color-mix(in srgb, var(--fg) 14%, var(--panel)); }
  .sd-page { position: relative; flex: 1; min-height: 0; display: flex; flex-direction: column; background: var(--bg); }
  .sd-head { flex: none; display: flex; align-items: center; gap: 18px; height: 46px; padding: 0 18px; background: var(--panel); border-bottom: 1px solid var(--line); }
  .sd-logo { display: flex; align-items: center; gap: 8px; font-weight: 750; font-size: 15.5px; white-space: nowrap; }
  .sd-logo i { width: 24px; height: 24px; border-radius: 7px; background: var(--b); color: var(--bfg); display: grid; place-items: center; font-style: normal; font-size: 13px; }
  .sd-logo.round i { border-radius: 50%; }
  .sd-links { display: flex; gap: 14px; color: var(--muted); font-size: 13px; white-space: nowrap; overflow: hidden; }
  .sd-sp { flex: 1; }
  .sd-search { width: 190px; height: 28px; border: 1px solid var(--line); border-radius: 14px; padding: 0 12px; color: var(--muted); font-size: 12.5px; display: flex; align-items: center; }
  .sd-icon { position: relative; width: 28px; height: 28px; border-radius: 50%; display: grid; place-items: center; background: color-mix(in srgb, var(--fg) 7%, var(--panel)); font-size: 12px; font-weight: 700; color: var(--muted); }
  .sd-icon b { position: absolute; top: -3px; right: -4px; min-width: 16px; height: 16px; border-radius: 8px; background: var(--b); color: var(--bfg); font-size: 10px; display: grid; place-items: center; padding: 0 4px; }
  .sd-news .sd-head { height: 52px; justify-content: center; } .sd-news .sd-logo { font-family: Georgia, 'Times New Roman', serif; font-size: 21px; font-weight: 700; }
  .sd-news .sd-logo i { display: none; }
  .sd-body { flex: 1; min-height: 0; display: flex; gap: 16px; padding: 14px 18px; overflow: hidden; }
  .sd-main { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 9px; overflow: hidden; }
  .sd-side { flex: none; width: 270px; display: flex; flex-direction: column; gap: 10px; overflow: hidden; }
  .sd-card { background: var(--panel); border: 1px solid var(--line); border-radius: 10px; padding: 12px 14px; }
  .sd-main.sd-card { padding: 14px 18px; }
  .sd-appbody { flex: 1; min-height: 0; display: flex; }
  .sd-rail { flex: none; width: 64px; display: flex; flex-direction: column; align-items: center; gap: 16px; padding-top: 14px; background: var(--panel); border-right: 1px solid var(--line); }
  .sd-rail i { width: 30px; height: 30px; border-radius: 9px; background: color-mix(in srgb, var(--fg) 8%, var(--panel)); }
  .sd-rail i.on { background: var(--bs); outline: 2px solid var(--b); outline-offset: -2px; }
  .sd-h { display: flex; align-items: baseline; gap: 12px; margin: 0; font-size: 19px; font-weight: 700; }
  .sd-h2 { margin: 4px 0 0; font-size: 14px; font-weight: 700; }
  .sd-p { margin: 0; color: var(--fg); } .sd-p.muted { color: var(--muted); } .sd-p.warn { color: var(--warn); }
  .sd-note { margin: 0; font-size: 11.5px; color: var(--muted); }
  .sd-kv { display: grid; grid-template-columns: max-content 1fr; gap: 3px 16px; font-size: 13px; }
  .sd-kv dt { color: var(--muted); } .sd-kv dd { margin: 0; font-weight: 600; }
  .sd-ok { display: flex; align-items: center; gap: 10px; font-size: 18px; font-weight: 700; color: var(--good); }
  .sd-ok i { width: 30px; height: 30px; border-radius: 50%; background: var(--good); color: var(--panel); display: grid; place-items: center; font-style: normal; }
  .sd-btns { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; }
  .sd-btns.stack { flex-direction: column; align-items: stretch; }
  .sd-side .sd-btns { flex-direction: column; align-items: stretch; }
  .sd-b { font: inherit; border: 0; cursor: pointer; border-radius: 8px; padding: 8px 16px; font-weight: 600; text-align: center; }
  .sd-b.primary { background: var(--b); color: var(--bfg); }
  .sd-b.big { background: var(--b); color: var(--bfg); padding: 12px 22px; font-size: 15px; border-radius: 10px; box-shadow: 0 3px 10px color-mix(in srgb, var(--b) 35%, transparent); }
  .sd-b.secondary { background: var(--bs); color: var(--b); border: 1px solid color-mix(in srgb, var(--b) 40%, transparent); }
  .sd-b.ghost { background: transparent; color: var(--fg); border: 1px solid var(--line); }
  .sd-b.danger { background: transparent; color: var(--bad); border: 1px solid var(--bad); }
  .sd-b.link { background: none; color: var(--b); padding: 2px 0; font-weight: 500; text-decoration: underline; text-underline-offset: 2px; }
  .sd-b.shame { background: none; color: var(--muted); padding: 2px 0; font-weight: 400; font-size: 11.5px; text-decoration: underline; }
  .sd-b.plain { background: none; color: var(--muted); padding: 3px 0; font-weight: 500; font-size: 12.5px; text-decoration: underline; }
  .sd-b.ad { background: var(--ad); color: #fff; font-size: 16px; padding: 12px 26px; border-radius: 6px; letter-spacing: .02em; }
  .sd-b.ad::before { content: '⬇ '; }
  .sd-b.chip { background: var(--panel); color: var(--fg); border: 1px solid var(--line); border-radius: 16px; padding: 5px 13px; font-weight: 500; }
  .sd-b.chip.on { background: var(--bs); color: var(--b); border-color: var(--b); }
  .sd-back { font-size: 12.5px; align-self: flex-start; }
  .sd-line { display: flex; align-items: center; gap: 12px; padding: 8px 10px; background: var(--panel); border: 1px solid var(--line); border-radius: 9px; }
  .sd-thumb { flex: none; width: 40px; height: 40px; border-radius: 8px; display: grid; place-items: center; font-weight: 700; color: #fff; }
  .sd-line .nm { flex: 1; min-width: 0; } .sd-line .nm div:first-child { font-weight: 600; }
  .sd-line .sub { font-size: 12px; color: var(--muted); }
  .sd-tag { display: inline-block; margin-left: 6px; padding: 0 6px; border-radius: 4px; font-size: 11px; font-weight: 600; background: var(--bs); color: var(--b); }
  .sd-line .amt { font-weight: 700; white-space: nowrap; }
  .sd-step { display: flex; align-items: center; gap: 4px; }
  .sd-step .sd-b { width: 28px; height: 28px; padding: 0; border-radius: 50%; background: var(--panel); border: 1px solid var(--line); color: var(--fg); font-size: 16px; line-height: 1; }
  .sd-step b { min-width: 22px; text-align: center; }
  .sd-stepper { display: flex; align-items: center; gap: 14px; }
  .sd-stepper .sd-step .sd-b { width: 34px; height: 34px; }
  .sd-check { display: flex; align-items: flex-start; gap: 10px; padding: 6px 2px; cursor: pointer; }
  .sd-check .box { flex: none; width: 18px; height: 18px; margin-top: 1px; border: 2px solid var(--muted); border-radius: 4px; display: grid; place-items: center; font-size: 12px; font-weight: 800; color: transparent; }
  .sd-check.on .box { background: var(--b); border-color: var(--b); color: var(--bfg); }
  .sd-check .sw { flex: none; width: 34px; height: 20px; border-radius: 10px; background: color-mix(in srgb, var(--fg) 22%, var(--panel)); position: relative; margin-top: 1px; }
  .sd-check .sw::after { content: ''; position: absolute; top: 3px; left: 3px; width: 14px; height: 14px; border-radius: 50%; background: #fff; }
  .sd-check.on .sw { background: var(--b); } .sd-check.on .sw::after { left: 17px; }
  .sd-check.locked { opacity: .78; cursor: default; }
  .sd-check .tx { flex: 1; min-width: 0; } .sd-check .sub { display: block; font-size: 11.5px; color: var(--muted); }
  .sd-check.locked .sub { color: var(--warn); }
  .sd-check .pr { white-space: nowrap; font-weight: 600; }
  .sd-checks { display: flex; flex-direction: column; }
  .sd-sw-right .sd-check { flex-direction: row-reverse; } .sd-sw-right .sd-check .tx { text-align: left; }
  .sd-opts { display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 8px; }
  .sd-opt { display: flex; align-items: flex-start; gap: 10px; padding: 9px 11px; border: 1px solid var(--line); border-radius: 9px; background: var(--panel); cursor: pointer; position: relative; }
  .sd-opt.on { border-color: var(--b); box-shadow: 0 0 0 1px var(--b) inset; }
  .sd-opt .rd { flex: none; width: 16px; height: 16px; margin-top: 2px; border-radius: 50%; border: 2px solid var(--muted); }
  .sd-opt.on .rd { border: 5px solid var(--b); }
  .sd-opt .tx { flex: 1; min-width: 0; } .sd-opt .tx div:first-child { font-weight: 600; } .sd-opt .sub { font-size: 12px; color: var(--muted); }
  .sd-opt .pr { font-weight: 700; white-space: nowrap; }
  .sd-opt.dis { opacity: .55; cursor: default; } .sd-opt.dis .tx div:first-child { text-decoration: line-through; }
  .sd-opt .bdg { position: absolute; top: -9px; right: 10px; padding: 1px 8px; border-radius: 9px; font-size: 10.5px; font-weight: 700; background: var(--warn); color: #fff; }
  .sd-radios { display: flex; flex-direction: column; gap: 7px; }
  .sd-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px; }
  .sd-lcard { display: flex; flex-direction: column; gap: 6px; padding: 12px; border: 1px solid var(--line); border-radius: 10px; background: var(--panel); }
  .sd-lcard .im { height: 52px; border-radius: 7px; }
  .sd-lcard .t { font-weight: 650; } .sd-lcard .sub { font-size: 12px; color: var(--muted); }
  .sd-lcard .sd-b { align-self: flex-start; padding: 6px 14px; }
  .sd-sum { display: flex; flex-direction: column; gap: 4px; font-size: 13px; }
  .sd-sum .r { display: flex; justify-content: space-between; gap: 10px; } .sd-sum .r span:first-child { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .sd-sum .x { color: var(--muted); } .sd-sum .fee { color: var(--fg); }
  .sd-sum .tot { margin-top: 4px; padding-top: 6px; border-top: 1px solid var(--line); font-weight: 750; font-size: 15px; }
  .sd-sum h4 { margin: 0 0 4px; font-size: 14px; }
  .sd-badge { display: inline-flex; align-self: flex-start; align-items: center; gap: 6px; padding: 3px 10px; border-radius: 6px; font-size: 12.5px; font-weight: 600; }
  .sd-badge.urgent { background: color-mix(in srgb, var(--bad) 14%, var(--panel)); color: var(--bad); }
  .sd-badge.scarce { background: color-mix(in srgb, var(--warn) 15%, var(--panel)); color: var(--warn); }
  .sd-badge.social { background: color-mix(in srgb, var(--fg) 7%, var(--panel)); color: var(--fg); }
  .sd-badge svg { width: 13px; height: 13px; fill: currentColor; }
  .sd-banner { display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 9px; background: linear-gradient(90deg, var(--bs), color-mix(in srgb, var(--warn) 10%, var(--panel))); border: 1px dashed var(--b); }
  .sd-banner span { flex: 1; font-weight: 600; font-size: 13px; }
  .sd-notice { display: flex; flex-direction: column; gap: 4px; padding: 10px 12px; border-radius: 9px; background: color-mix(in srgb, var(--good) 11%, var(--panel)); border: 1px solid color-mix(in srgb, var(--good) 40%, transparent); font-size: 13px; }
  .sd-notice .sd-b { align-self: flex-start; }
  .sd-hero { padding: 16px 18px; border-radius: 12px; background: var(--bs); }
  .sd-hero h3 { margin: 0 0 4px; font-size: 19px; color: var(--b); } .sd-hero p { margin: 0; }
  .sd-plan { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 12px 14px; border: 1px solid var(--line); border-radius: 10px; background: var(--panel); }
  .sd-plan .nm { font-size: 16px; font-weight: 700; } .sd-plan ul { margin: 2px 0 0; padding-left: 16px; color: var(--muted); font-size: 12px; }
  .sd-plan .pr { font-weight: 700; }
  .sd-ad { position: relative; display: flex; align-items: center; gap: 14px; padding: 12px 14px; border-radius: 8px; background: color-mix(in srgb, var(--fg) 4%, var(--panel)); border: 1px solid var(--line); }
  .sd-ad .mk { position: absolute; top: 3px; right: 6px; font-size: 9.5px; color: var(--muted); letter-spacing: .03em; }
  .sd-ad .tx { flex: 1; min-width: 0; } .sd-ad .tx div:first-child { font-weight: 700; } .sd-ad .tx div:last-child { font-size: 12px; color: var(--muted); }
  .sd-ad.button { background: none; border: 0; padding: 4px 0; justify-content: center; } .sd-ad.button .tx { display: none; }
  .sd-ad.tile { flex-direction: column; align-items: stretch; text-align: center; }
  .sd-side .sd-ad, .sd-side .sd-ad.button { flex-direction: column; align-items: stretch; text-align: center; padding: 10px 12px; background: color-mix(in srgb, var(--fg) 4%, var(--panel)); border: 1px solid var(--line); }
  .sd-side .sd-ad.button .tx { display: block; }
  .sd-file { display: flex; align-items: center; gap: 14px; padding: 12px 14px; border-radius: 10px; background: var(--panel); border: 1px solid var(--line); }
  .sd-file .ic { flex: none; width: 40px; height: 48px; border-radius: 4px 12px 4px 4px; background: var(--bs); border: 1px solid var(--b); display: grid; place-items: center; font-size: 10px; font-weight: 800; color: var(--b); }
  .sd-file .nm { font-weight: 700; } .sd-file .sub { font-size: 12px; color: var(--muted); }
  .sd-list { display: flex; flex-direction: column; gap: 0; background: var(--panel); border: 1px solid var(--line); border-radius: 10px; overflow: hidden; }
  .sd-li { display: flex; align-items: center; gap: 12px; padding: 9px 14px; border-bottom: 1px solid var(--line); cursor: pointer; }
  .sd-li:last-child { border-bottom: 0; }
  .sd-li .im { flex: none; width: 46px; height: 34px; border-radius: 6px; }
  .sd-li .tx { flex: 1; min-width: 0; } .sd-li .t { font-weight: 600; } .sd-li .sub { font-size: 11.5px; color: var(--muted); }
  .sd-headline .t { font-family: Georgia, 'Times New Roman', serif; font-size: 15px; }
  .sd-chips { display: flex; flex-wrap: wrap; gap: 7px; }
  .sd-prod { display: flex; gap: 16px; align-items: center; padding: 14px; border-radius: 12px; background: var(--panel); border: 1px solid var(--line); }
  .sd-prod .im { flex: none; width: 110px; height: 86px; border-radius: 10px; }
  .sd-prod .nm { font-size: 17px; font-weight: 700; } .sd-prod .pr { font-size: 22px; font-weight: 800; color: var(--b); } .sd-prod s { color: var(--muted); margin-left: 8px; }
  .sd-canvas { height: 150px; border-radius: 10px; border: 1px solid var(--line); display: grid; place-items: center; font-weight: 700; color: #fff; font-size: 18px; }
  .sd-media { height: 120px; border-radius: 12px; }
  .sd-article h1 { margin: 0 0 6px; font-family: Georgia, 'Times New Roman', serif; font-size: 24px; line-height: 1.2; }
  .sd-article .by { font-size: 12px; color: var(--muted); margin-bottom: 8px; } .sd-article p { margin: 0; font-family: Georgia, serif; font-size: 14.5px; line-height: 1.5; }
  .sd-err { color: var(--bad); font-size: 12.5px; font-weight: 600; }
  .sd-cards2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .sd-dim { position: absolute; inset: 0; background: rgba(12, 16, 24, .5); display: grid; place-items: center; z-index: 5; }
  .sd-dlg { width: min(470px, 92%); max-height: 96%; display: flex; flex-direction: column; gap: 10px; padding: 18px 20px; border-radius: 14px; background: var(--panel); box-shadow: 0 18px 50px rgba(0,0,0,.35); overflow: hidden; }
  .sd-dlg.wide { width: min(560px, 94%); }
  .sd-dlg .sd-btns { justify-content: flex-end; }
  .sd-modal { align-items: center; text-align: center; }
  .sd-modal h3 { margin: 0; font-size: 19px; } .sd-modal p { margin: 0; color: var(--muted); }
  .sd-modal .sd-b { width: 100%; } .sd-modal .sd-b.link, .sd-modal .sd-b.shame { width: auto; }
  .sd-art { width: 54px; height: 54px; border-radius: 50%; background: var(--bs); display: grid; place-items: center; }
  .sd-art svg { width: 28px; height: 28px; fill: var(--b); }
  .sd-under { pointer-events: none; }
  .c1 .sd-body { padding: 10px 14px; gap: 12px; } .c1 .sd-main { gap: 6px; } .c1 .sd-h { font-size: 17px; } .c1 .sd-check { padding: 3px 2px; }
  .c1 .sd-line { padding: 5px 8px; } .c1 .sd-thumb { width: 32px; height: 32px; } .c1 .sd-card { padding: 9px 12px; } .c1 .sd-hero { padding: 11px 14px; }
  .c1 .sd-b.big { padding: 9px 18px; } .c1 .sd-li { padding: 6px 12px; } .c1 .sd-dlg { gap: 7px; padding: 14px 16px; } .c1 .sd-canvas { height: 100px; } .c1 .sd-media { height: 76px; }
  .c1 .sd-lcard .im { height: 30px; } .c1 .sd-art { width: 42px; height: 42px; } .c1 .sd-prod .im { height: 64px; width: 84px; }
  .c2 .sd-tabs { display: none; } .c2 .sd-checks { display: grid; grid-template-columns: 1fr 1fr; column-gap: 14px; } .c2 .sd-head { height: 38px; }
  .c2 .sd-win, .c2 { font-size: 12.5px; } .c2 .sd-check .sub { display: none; } .c2 .sd-ad { padding: 7px 10px; } .c2 .sd-b.ad { padding: 8px 18px; font-size: 14px; }
  .c2 .sd-p { font-size: 12.5px; } .c2 .sd-kv { font-size: 12px; } .c2 .sd-dlg .sd-p { font-size: 12px; }
  .c3 .sd-check .sub, .c3 .sd-note { display: none; } .c3 .sd-head { height: 32px; } .c3 .sd-links { display: none; } .c3 .sd-main { gap: 4px; }
  .c3 .sd-li .sub, .c3 .sd-line .sub { display: none; } .c3 .sd-media, .c3 .sd-canvas { height: 54px; } .c3 .sd-lcard .im { display: none; }
  `;

  const ICONS = {
    lock: '<svg viewBox="0 0 16 16"><path d="M4 7V5a4 4 0 0 1 8 0v2h1v8H3V7h1zm2 0h4V5a2 2 0 0 0-4 0v2z"/></svg>',
    clock: '<svg viewBox="0 0 16 16"><path d="M8 1a7 7 0 1 1 0 14A7 7 0 0 1 8 1zm0 2a5 5 0 1 0 0 10A5 5 0 0 0 8 3zm-.8 1.5h1.6v3.2l2.3 1.4-.8 1.3-3.1-1.9z"/></svg>',
    users: '<svg viewBox="0 0 16 16"><path d="M5.5 8a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm5.5 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4zM1 13c0-2.2 2-3.6 4.5-3.6S10 10.8 10 13v1H1zm10 1v-1c0-1.2-.4-2.2-1.1-3 .4-.1.7-.1 1.1-.1 2.2 0 4 1.2 4 3.1v1z"/></svg>',
    fire: '<svg viewBox="0 0 16 16"><path d="M8 1s4 3.2 4 7.5A4 4 0 0 1 4 8.5C4 6.7 5 5.4 5 5.4S5.3 7 6.5 7.3C6.5 4.4 8 1 8 1z"/></svg>',
    gift: '<svg viewBox="0 0 24 24"><path d="M3 9h18v4H3zm1 5h7v8H4zm9 0h7v8h-7zM11 9h2v13h-2zM12 8C10 4 6 3.5 6 6s4 2 6 2zm0 0c2-4 6-4.5 6-2s-4 2-6 2z"/></svg>',
    shield: '<svg viewBox="0 0 24 24"><path d="M12 2l8 3v6c0 5-3.4 9.4-8 11-4.6-1.6-8-6-8-11V5zm-1.2 13.6l6-6-1.4-1.4-4.6 4.6-2.2-2.2-1.4 1.4z"/></svg>',
    crown: '<svg viewBox="0 0 24 24"><path d="M3 7l5 4 4-6 4 6 5-4-2 11H5zm2 13h14v2H5z"/></svg>',
    truck: '<svg viewBox="0 0 24 24"><path d="M2 5h12v10H2zm12 4h4l4 4v2h-8zM6 20a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm12 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"/></svg>',
    mail: '<svg viewBox="0 0 24 24"><path d="M2 5h20v14H2zm2 2v.5l8 5 8-5V7l-8 5z"/></svg>',
    bell: '<svg viewBox="0 0 24 24"><path d="M12 2a6 6 0 0 1 6 6v5l2 3v1H4v-1l2-3V8a6 6 0 0 1 6-6zm-2.5 17h5a2.5 2.5 0 0 1-5 0z"/></svg>',
    star: '<svg viewBox="0 0 24 24"><path d="M12 2l3 6.6 7.2.8-5.4 4.9 1.5 7.1L12 17.8l-6.3 3.6 1.5-7.1L1.8 9.4 9 8.6z"/></svg>',
    heart: '<svg viewBox="0 0 24 24"><path d="M12 21S2 14.5 2 8.2A5 5 0 0 1 12 5.6a5 5 0 0 1 10 2.6C22 14.5 12 21 12 21z"/></svg>',
    alert: '<svg viewBox="0 0 24 24"><path d="M12 2l11 19H1zm-1 7v6h2V9zm0 8v2h2v-2z"/></svg>',
  };
  const HEAD_LINKS = {
    shop: [['Deals', 'New in', 'Home', 'Electronics', 'Help'], ['Shop all', 'Sale', 'Brands', 'Gift cards'], ['Today\'s deals', 'Home & garden', 'Fashion', 'Support']],
    travel: [['Flights', 'Hotels', 'Cars', 'My trips', 'Help'], ['Book', 'Manage booking', 'Check in', 'Flight status']],
    tickets: [['Concerts', 'Theatre', 'Comedy', 'Sport', 'My tickets'], ['Events', 'Venues', 'Gift cards', 'Help']],
    hotel: [['Stays', 'Deals', 'Rewards', 'Help'], ['Hotels', 'Apartments', 'Offers', 'My bookings']],
    food: [['Restaurants', 'Groceries', 'Offers', 'Orders'], ['Delivery', 'Pick-up', 'Deals', 'Help']],
    rental: [['Cars', 'Locations', 'Deals', 'Help'], ['Rent', 'Manage booking', 'Business', 'Support']],
    news: [['World', 'Local', 'Business', 'Science', 'Culture', 'Opinion'], ['News', 'Sport', 'Weather', 'Puzzles', 'Food']],
    sub: [['Home', 'Browse', 'My list', 'Account'], ['Discover', 'Library', 'Help', 'Account']],
    download: [['Upload', 'Pricing', 'Log in'], ['Files', 'Upload', 'Premium', 'Help']],
    saas: [['Projects', 'Templates', 'Pricing', 'Help'], ['Home', 'Designs', 'Brand kit', 'Learn']],
    app: [['Browse', 'Collections', 'Profile']],
  };
  const THUMB_HUES = [12, 38, 160, 200, 230, 268, 300, 340, 90, 180];

  const TOKENS = {
    font: '13.5px/1.38 system-ui, -apple-system, \'Segoe UI\', sans-serif',
    windowRadius: '10px',
    windowShadow: '0 2px 4px rgba(0,0,0,.05), 0 14px 36px rgba(0,0,0,.13)',
    dimColor: 'rgba(12, 16, 24, .5)',
    colors: {},
    geometry: { margin: 8, minWidth: 360, minHeight: 360, widthBreakpoint: 900, widthMin: 880,
      widthMax: 1080, widthScale: [0.86, 1], heightBreakpoint: 560, heightMin: 540,
      heightMax: 660, heightScale: [0.9, 1], sideBreakpoint: 900, sideNarrow: 240, sideRange: [255, 290] },
    alignments: ['left', 'center', 'center', 'right'],
    radii: [6, 8, 10, 999],
    adMarks: ['Ad', 'Sponsored', 'Advertisement', 'Ad ⓘ'],
    headLinks: HEAD_LINKS,
    bylines: ['By staff reporters', 'By our correspondent', 'By the news desk'],
    extraTabs: ['Inbox (4)', 'Calendar', 'New Tab', 'Weather', 'Maps'],
    icons: ICONS,
    thumbHues: THUMB_HUES,
    summaryTitle: 'Order summary',
    subtotalLabel: 'Subtotal',
    totalLabel: 'Total',
    freeLabel: 'Free',
    soldOutLabel: 'Sold out',
    selectLabel: 'Select',
    searchLabel: 'Search',
    compactClasses: ['c1', 'c2', 'c3'],
  };
  const BLOCK_PARTS = Object.assign(Object.create(null), {
    h: 'h',
    h2: 'h2',
    p: 'p',
    note: 'note',
    error: 'error',
    ok: 'ok',
    kv: 'kv',
    line: 'line',
    also: 'also',
    check: 'check',
    radios: 'options',
    cards: 'cards',
    cards2: 'cards2',
    chips: 'chips',
    stepper: 'stepper',
    list: 'list',
    sum: 'sum',
    badge: 'badge',
    banner: 'banner',
    notice: 'notice',
    hero: 'hero',
    plan: 'plan',
    ad: 'ad',
    file: 'file',
    product: 'product',
    canvas: 'canvas',
    media: 'media',
    article: 'article',
    btns: 'btns',
    opts: 'options',
  });

    env.template('avoid-dark-patterns/_browser-assets', () => ({ CSS, ICONS, HEAD_LINKS, THUMB_HUES, TOKENS, BLOCK_PARTS }));
})();
