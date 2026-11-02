/* use-shop/_store-style: store stylesheet constants (text preserved). */
(function () {
  'use strict';
const CSS = `
  .as-app { position: absolute; display: flex; flex-direction: column; overflow: hidden;
    background: var(--panel); border: 1px solid var(--line); border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0,0,0,.06), 0 12px 32px rgba(0,0,0,.06); }
  .as-app.flow { position: relative; overflow: visible; align-self: flex-start; flex: none; }
  .as-app [hidden] { display: none !important; }
  .as-top { flex: none; display: flex; align-items: center; gap: 22px; height: 52px; padding: 0 18px;
    border-bottom: 1px solid var(--line); background: color-mix(in srgb, var(--fg) 2.5%, var(--panel)); border-radius: 12px 12px 0 0; }
  .as-brand { display: flex; align-items: center; gap: 9px; font-weight: 750; font-size: 16px; letter-spacing: .005em; white-space: nowrap; cursor: default; }
  .as-logo { width: 26px; height: 26px; border-radius: 7px; display: flex; align-items: center; justify-content: center;
    color: #fff; font-size: 14px; font-weight: 800; background: var(--accent); }
  .as-logo svg { width: 16px; height: 16px; }
  .as-word span { font-weight: 800; }
  .as-nav { display: flex; gap: 18px; font-size: 14px; color: var(--muted); white-space: nowrap; }
  .as-nav span.on { color: var(--fg); font-weight: 600; }
  .as-right { margin-left: auto; display: flex; align-items: center; gap: 14px; font-size: 13.5px; color: var(--muted); white-space: nowrap; }
  .as-right .pill { display: flex; align-items: center; gap: 6px; height: 30px; padding: 0 12px; border: 1px solid var(--line); border-radius: 15px; color: var(--fg); }
  .as-right svg { width: 15px; height: 15px; }
  .as-ava { width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
    color: #fff; font-size: 12px; font-weight: 700; background: color-mix(in srgb, var(--accent) 70%, #333); }
  .as-body { flex: 1; min-height: 0; position: relative; }
  .as-app.flow .as-body { flex: none; }
  .as-btn { height: 36px; padding: 0 16px; border-radius: 8px; font: inherit; font-size: 14px; font-weight: 600; cursor: pointer;
    border: 1px solid color-mix(in srgb, var(--fg) 18%, var(--line)); color: var(--fg); background: var(--panel); white-space: nowrap; }
  .as-btn:hover { background: color-mix(in srgb, var(--fg) 6%, var(--panel)); }
  .as-btn.primary { border-color: var(--accent); background: var(--accent); color: #fff; }
  .as-btn.primary:hover { background: color-mix(in srgb, var(--accent) 88%, #000); }
  .as-btn:disabled { opacity: .45; cursor: default; }
  .as-btn.sm { height: 30px; padding: 0 11px; font-size: 13px; }
  .as-pane { flex: none; display: flex; border: 1px solid var(--line); border-radius: 10px; overflow: hidden; background: var(--line); }
  .as-list { flex: 1; min-width: 0; overflow-y: auto; overscroll-behavior: contain; scrollbar-width: none; }
  .as-list::-webkit-scrollbar { display: none; }
  .as-track { position: relative; flex: none; width: 15px; border-left: 1px solid var(--line);
    background: color-mix(in srgb, var(--fg) 4%, var(--panel)); cursor: pointer; touch-action: none; }
  .as-thumb { position: absolute; left: 3px; right: 3px; border-radius: 5px; cursor: grab; touch-action: none;
    background: color-mix(in srgb, var(--fg) 30%, var(--panel)); }
  .as-thumb:hover, .as-thumb.drag { background: color-mix(in srgb, var(--fg) 48%, var(--panel)); }
  .as-track.idle .as-thumb { visibility: hidden; }
  .as-backdrop { position: absolute; inset: 0; z-index: 40; background: rgba(15, 18, 25, .38); }
  .as-dialog { position: absolute; z-index: 41; left: 0; top: 0; background: var(--panel); border: 1px solid var(--line);
    border-radius: 12px; box-shadow: 0 20px 60px rgba(0,0,0,.3); overflow: hidden; }
  .as-dlg-h { display: flex; align-items: center; gap: 10px; padding: 14px 12px 12px 18px; border-bottom: 1px solid var(--line); }
  .as-dlg-t { font-size: 17px; font-weight: 700; }
  .as-x { margin-left: auto; width: 30px; height: 30px; border: 0; border-radius: 6px; background: transparent; color: var(--muted);
    font: inherit; font-size: 21px; line-height: 1; cursor: pointer; }
  .as-x:hover { background: color-mix(in srgb, var(--fg) 9%, transparent); color: var(--fg); }
  .as-dlg-b { padding: 14px 18px; }
  .as-dlg-f { display: flex; justify-content: flex-end; gap: 8px; padding: 12px 18px 16px; }
  .as-link { border: 0; padding: 0; background: transparent; color: var(--accent); font: inherit; font-weight: 600; cursor: pointer;
    text-decoration: underline; text-underline-offset: 2px; }
  .as-link.danger { color: #e03131; }
  .as-skel, .as-skel.co-thumb { border-radius: 6px; background: color-mix(in srgb, var(--fg) 8%, var(--panel)); }

  /* search */
  .se-main { position: absolute; inset: 0; display: flex; gap: 40px; padding: 18px 34px 14px; }
  .se-col { flex: 1; min-width: 0; max-width: 690px; display: flex; flex-direction: column; }
  .se-bar { flex: none; display: flex; gap: 10px; align-items: center; }
  .se-box { flex: 1; display: flex; align-items: center; gap: 10px; height: 46px; padding: 0 18px; border-radius: 23px;
    border: 1px solid color-mix(in srgb, var(--fg) 20%, var(--line)); background: var(--panel); box-shadow: 0 1px 5px rgba(0,0,0,.07); }
  .se-box:focus-within { border-color: var(--accent); box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 20%, transparent); }
  .se-box svg { flex: none; width: 17px; height: 17px; color: var(--muted); }
  .se-input { flex: 1; min-width: 0; height: 100%; border: 0; outline: none; background: transparent; color: var(--fg);
    font: inherit; font-size: 16px; user-select: text; -webkit-user-select: text; }
  .se-input::placeholder { color: var(--muted); }
  .se-go { height: 46px; padding: 0 24px; border-radius: 23px; }
  .se-meta { flex: none; height: 20px; margin: 12px 6px 8px; font-size: 13px; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .se-list { flex: none; display: flex; flex-direction: column; }
  .se-card { padding: 6px 6px 0; overflow: hidden; }
  .se-url { display: flex; align-items: center; gap: 9px; font-size: 13px; color: var(--muted); white-space: nowrap; overflow: hidden; }
  .se-fav { flex: none; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 800; color: #fff; }
  .se-host { color: var(--fg); }
  .se-path { overflow: hidden; text-overflow: ellipsis; }
  .se-title { display: inline-block; max-width: 100%; margin-top: 4px; font-size: 18.5px; line-height: 1.3; color: var(--accent); cursor: pointer;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis; vertical-align: top; }
  .se-title:hover { text-decoration: underline; text-underline-offset: 2px; }
  .se-desc { margin-top: 3px; font-size: 13.5px; line-height: 1.45; color: var(--muted); overflow: hidden;
    display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: var(--se-lines, 2); }
  .se-empty { margin: 50px auto 0; text-align: center; color: var(--muted); font-size: 14.5px; line-height: 1.6; }
  .se-empty svg { width: 54px; height: 54px; color: color-mix(in srgb, var(--muted) 60%, transparent); }
  .se-pager { flex: none; display: flex; gap: 6px; align-items: center; margin-top: 6px; }
  .se-pg { min-width: 38px; height: 38px; padding: 0 8px; border-radius: 19px; border: 1px solid var(--line); background: var(--panel);
    color: var(--fg); font: inherit; font-size: 14px; cursor: pointer; }
  .se-pg:hover { background: color-mix(in srgb, var(--fg) 6%, var(--panel)); }
  .se-pg.on { background: var(--accent); border-color: var(--accent); color: #fff; font-weight: 700; }
  .se-pg:disabled { opacity: .4; cursor: default; }
  .se-side { flex: none; width: 270px; margin-top: 70px; }
  .se-box2 { border: 1px solid var(--line); border-radius: 10px; padding: 14px 16px; margin-bottom: 14px; }
  .se-box2 h4 { margin: 0 0 10px; font-size: 14px; }
  .se-chips { display: flex; flex-wrap: wrap; gap: 7px; }
  .se-chips span { padding: 4px 11px; border-radius: 14px; font-size: 13px; background: color-mix(in srgb, var(--fg) 6%, var(--panel)); }
  .se-box2 p { margin: 0; font-size: 13px; line-height: 1.5; color: var(--muted); }
  .se-visit { flex: 1; min-height: 0; display: flex; flex-direction: column; border: 1px solid var(--line); border-radius: 12px; overflow: hidden; }
  .se-vbar { flex: none; display: flex; align-items: center; gap: 12px; padding: 8px 10px; border-bottom: 1px solid var(--line);
    background: color-mix(in srgb, var(--fg) 3%, var(--panel)); font-size: 13px; color: var(--muted); white-space: nowrap; overflow: hidden; }
  .se-vpage { flex: 1; min-height: 0; overflow: hidden; padding: 16px 22px; }
  .se-vsite { display: flex; align-items: center; gap: 10px; font-weight: 750; font-size: 15px; margin-bottom: 12px; }
  .se-vpage h2 { margin: 0 0 10px; font-size: 21px; line-height: 1.3; }
  .se-vpage p { margin: 0 0 10px; font-size: 14px; line-height: 1.55; color: var(--muted); }

  /* ticket */
  .tk-main { position: absolute; inset: 0; display: flex; flex-direction: column; padding: 16px 26px 18px; }
  .tk-head { flex: none; display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; margin-bottom: 12px; }
  .tk-title { font-size: 21px; font-weight: 750; }
  .tk-sub { margin-top: 2px; font-size: 13.5px; color: var(--muted); }
  .tk-sort { position: relative; display: flex; align-items: center; gap: 9px; font-size: 13.5px; color: var(--muted); }
  .tk-trigger { display: flex; align-items: center; gap: 10px; min-width: 200px; height: 36px; padding: 0 12px; border-radius: 8px; cursor: pointer;
    border: 1px solid color-mix(in srgb, var(--fg) 20%, var(--line)); background: var(--panel); color: var(--fg); font-size: 14px; }
  .tk-trigger span { flex: 1; }
  .tk-trigger svg { width: 14px; height: 14px; color: var(--muted); }
  .tk-pop { position: absolute; right: 0; top: calc(100% + 5px); z-index: 30; min-width: 220px; padding: 4px; background: var(--panel);
    border: 1px solid var(--line); border-radius: 8px; box-shadow: 0 12px 30px rgba(0,0,0,.16); }
  .tk-opt { display: flex; align-items: center; height: 33px; padding: 0 11px; border-radius: 5px; font-size: 14px; color: var(--fg); cursor: pointer; }
  .tk-opt:hover { background: color-mix(in srgb, var(--accent) 11%, var(--panel)); }
  .tk-opt.sel { color: var(--accent); font-weight: 650; }
  .tk-row { display: flex; align-items: center; gap: 20px; padding: 0 18px 0 14px; background: var(--panel); }
  .tk-row.bought { background: color-mix(in srgb, #2f9e44 8%, var(--panel)); }
  .tk-date { flex: none; width: 54px; padding: 5px 0; text-align: center; border-radius: 8px; background: color-mix(in srgb, var(--accent) 8%, var(--panel)); }
  .tk-dw { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .06em; color: var(--muted); }
  .tk-dd { font-size: 21px; font-weight: 800; line-height: 1.1; }
  .tk-dm { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: .06em; color: var(--accent); }
  .tk-info { flex: 1; min-width: 0; }
  .tk-name { font-size: 15.5px; font-weight: 650; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .tk-place { margin-top: 2px; font-size: 13px; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .tk-when { flex: none; width: 150px; }
  .tk-time { font-weight: 650; font-variant-numeric: tabular-nums; }
  .tk-time sup { font-size: 10px; color: var(--muted); margin-left: 2px; }
  .tk-dur { margin-top: 2px; font-size: 13px; color: var(--muted); }
  .tk-price { flex: none; width: 92px; text-align: right; font-size: 18px; font-weight: 800; font-variant-numeric: tabular-nums; white-space: nowrap; }
  .tk-buy { flex: none; width: 86px; }
  .as-btn.mine, .as-btn.mine:disabled { opacity: 1; border-color: #2f9e44; background: #2f9e44; color: #fff; }
  .as-foot { flex: none; display: flex; align-items: center; gap: 10px; min-height: 30px; margin-top: 8px; font-size: 12.5px; color: var(--muted); }
  .as-foot b { color: var(--fg); font-weight: 600; }
  .as-receipt { flex: 1; min-width: 0; padding: 6px 12px; border-radius: 8px; color: color-mix(in srgb, #2f9e44 70%, var(--fg));
    background: color-mix(in srgb, #2f9e44 11%, var(--panel)); font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .tk-dlg { width: 390px; }
  .tk-sum { display: grid; grid-template-columns: auto 1fr; gap: 6px 16px; font-size: 14px; }
  .tk-sum dt { color: var(--muted); }
  .tk-sum dd { margin: 0; font-weight: 600; text-align: right; }
  .tk-total { display: flex; justify-content: space-between; margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--line); font-weight: 800; font-size: 16px; }

  /* flight */
  .fl-form { position: absolute; inset: 0; padding: 20px 30px; overflow: hidden;
    background: linear-gradient(180deg, color-mix(in srgb, var(--accent) 13%, var(--panel)) 0, var(--panel) 240px); }
  .fl-h { font-size: 25px; font-weight: 800; }
  .fl-hs { margin-top: 2px; font-size: 14px; color: var(--muted); }
  .fl-card { position: relative; z-index: 2; margin-top: 16px; padding: 14px 18px 26px; background: var(--panel); border: 1px solid var(--line);
    border-radius: 12px; box-shadow: 0 8px 26px rgba(0,0,0,.08); }
  .fl-pills { display: flex; gap: 8px; margin-bottom: 12px; font-size: 13px; }
  .fl-pill { height: 28px; padding: 0 12px; display: flex; align-items: center; border-radius: 14px; border: 1px solid var(--line); color: var(--muted); }
  .fl-pill.on { border-color: var(--accent); color: var(--accent); font-weight: 650; background: color-mix(in srgb, var(--accent) 9%, var(--panel)); }
  .fl-row { display: flex; gap: 12px; align-items: flex-end; }
  .fl-field { position: relative; flex: 1; min-width: 0; }
  .fl-field.date { flex: .8; }
  .fl-lab { display: block; margin-bottom: 6px; font-size: 12px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); }
  .fl-ctl { display: flex; align-items: center; gap: 9px; height: 46px; padding: 0 12px; border-radius: 8px; background: var(--panel);
    border: 1px solid color-mix(in srgb, var(--fg) 22%, var(--line)); }
  .fl-ctl:focus-within, .fl-ctl.open { border-color: var(--accent); box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 20%, transparent); }
  .fl-ctl.bad { border-color: #e03131; box-shadow: 0 0 0 3px rgba(224, 49, 49, .15); }
  .fl-ctl svg { flex: none; width: 17px; height: 17px; color: var(--muted); }
  .fl-input { flex: 1; min-width: 0; height: 100%; border: 0; outline: none; background: transparent; color: var(--fg);
    font: inherit; font-size: 15px; user-select: text; -webkit-user-select: text; }
  .fl-input::placeholder, .fl-dval.empty { color: var(--muted); }
  .fl-dctl { cursor: pointer; }
  .fl-dval { flex: 1; font-size: 15px; font-variant-numeric: tabular-nums; }
  .fl-err { position: absolute; left: 2px; top: calc(100% + 3px); font-size: 12px; color: #e03131; white-space: nowrap; }
  .fl-go { height: 46px; padding: 0 28px; border-radius: 8px; font-size: 15px; }
  .fl-pop { position: absolute; left: 0; right: 0; top: calc(100% + 4px); z-index: 30; padding: 4px; background: var(--panel);
    border: 1px solid var(--line); border-radius: 8px; box-shadow: 0 12px 30px rgba(0,0,0,.16); }
  .fl-sug { display: flex; align-items: center; gap: 9px; height: 34px; padding: 0 10px; border-radius: 6px; font-size: 14px; cursor: pointer; white-space: nowrap; overflow: hidden; }
  .fl-sug:hover { background: color-mix(in srgb, var(--accent) 10%, var(--panel)); }
  .fl-sug svg { flex: none; width: 15px; height: 15px; color: var(--muted); }
  .fl-sug b { font-weight: 750; }
  .fl-cal { position: absolute; right: 0; top: calc(100% + 6px); z-index: 30; width: 300px; padding: 12px 12px 10px; background: var(--panel);
    border: 1px solid var(--line); border-radius: 10px; box-shadow: 0 14px 34px rgba(0,0,0,.18); }
  .fl-calh { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; font-weight: 750; }
  .fl-nav { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border: 1px solid var(--line);
    border-radius: 7px; cursor: pointer; color: var(--fg); }
  .fl-nav:hover { background: color-mix(in srgb, var(--fg) 6%, var(--panel)); }
  .fl-nav.off { opacity: .3; cursor: default; }
  .fl-nav svg { width: 14px; height: 14px; }
  .fl-wk, .fl-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; }
  .fl-wk span { height: 22px; font-size: 11.5px; font-weight: 600; text-align: center; color: var(--muted); }
  .fl-day { height: 34px; display: flex; align-items: center; justify-content: center; border-radius: 6px; font-size: 14px; cursor: pointer; font-variant-numeric: tabular-nums; }
  .fl-day:hover { background: color-mix(in srgb, var(--accent) 12%, var(--panel)); }
  .fl-day.blank { visibility: hidden; }
  .fl-cal.compact .fl-day { height: 29px; }
  .fl-cal.compact { padding-top: 8px; }
  .fl-day.today { box-shadow: inset 0 0 0 1.5px color-mix(in srgb, var(--accent) 60%, transparent); }
  .fl-day.sel { background: var(--accent); color: #fff; font-weight: 750; }
  .fl-deals { position: relative; z-index: 1; display: flex; gap: 14px; margin-top: 22px; }
  .fl-deal { flex: 1; min-width: 0; padding: 12px 14px; border: 1px solid var(--line); border-radius: 10px; background: var(--panel); }
  .fl-deal b { display: block; font-size: 14.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .fl-deal span { font-size: 13px; color: var(--muted); }
  .fl-deal i { display: block; height: 46px; margin-bottom: 9px; border-radius: 7px; background: linear-gradient(135deg, var(--c1), var(--c2)); }
  .fl-res { position: absolute; inset: 0; display: flex; flex-direction: column; padding: 14px 26px 18px; }
  .fl-sum { flex: none; display: flex; align-items: center; gap: 16px; padding: 10px 14px; border: 1px solid var(--line); border-radius: 10px;
    background: color-mix(in srgb, var(--fg) 3%, var(--panel)); }
  .fl-back { display: inline-flex; align-items: center; gap: 6px; height: 34px; padding: 0 12px; }
  .fl-back svg { width: 14px; height: 14px; }
  .fl-route { font-size: 17px; font-weight: 750; white-space: nowrap; }
  .fl-sdate { flex: 1; min-width: 0; color: var(--muted); font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .fl-cancel { flex: none; }
  .fl-count { flex: none; display: flex; align-items: center; gap: 10px; margin: 12px 2px 8px; font-size: 13.5px; color: var(--muted); }
  .fl-cover { position: absolute; z-index: 5; display: flex; flex-direction: column; gap: 10px; padding: 14px 16px; border: 1px solid var(--line);
    border-radius: 10px; background: var(--panel); }
  .fl-cover .as-skel { height: 20px; }
  .fl-frow { display: flex; align-items: center; gap: 22px; padding: 0 18px; background: var(--panel); }
  .fl-frow.booked { background: color-mix(in srgb, #2f9e44 8%, var(--panel)); }
  .fl-air { flex: none; width: 150px; }
  .fl-air b { display: block; font-size: 14.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .fl-air span { font-size: 12.5px; color: var(--muted); }
  .fl-times { flex: 1; min-width: 0; display: flex; align-items: center; gap: 12px; }
  .fl-t { font-size: 19px; font-weight: 750; font-variant-numeric: tabular-nums; }
  .fl-t sup { font-size: 10.5px; color: var(--muted); font-weight: 600; margin-left: 1px; }
  .fl-line { flex: 1; min-width: 40px; max-width: 150px; text-align: center; font-size: 12px; color: var(--muted); }
  .fl-line i { display: block; height: 2px; margin: 3px 0; border-radius: 1px; background: color-mix(in srgb, var(--fg) 22%, var(--line)); }
  .fl-fare { flex: none; width: 120px; font-size: 12.5px; color: var(--muted); line-height: 1.45; }
  .fl-fare b { color: #e8590c; font-weight: 600; }
  .fl-fp { flex: none; width: 84px; text-align: right; font-size: 19px; font-weight: 800; font-variant-numeric: tabular-nums; white-space: nowrap; }
  .fl-book { flex: none; width: 92px; }

  `;
  env.template('use-shop/_store-style', () => ({ CSS }));
})();
