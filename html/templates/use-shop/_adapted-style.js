/* use-shop/_adapted-style: adapted stylesheet constants (text preserved). */
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

  /* food */
  .fd-wrap { position: absolute; inset: 0; display: flex; }
  .fd-wrap.left { flex-direction: row-reverse; }
  .fd-menu { flex: 1; min-width: 0; display: flex; flex-direction: column; padding: 14px 22px 16px; }
  .fd-hero { flex: none; display: flex; align-items: baseline; gap: 14px; flex-wrap: nowrap; white-space: nowrap; }
  .fd-rname { font-size: 21px; font-weight: 750; }
  .fd-rmeta { font-size: 13.5px; color: var(--muted); overflow: hidden; text-overflow: ellipsis; }
  .fd-tabs { flex: none; display: flex; flex-wrap: wrap; gap: 0 4px; margin: 10px 0 14px; border-bottom: 1px solid var(--line); }
  .fd-tab { height: 36px; padding: 0 12px; border: 0; border-bottom: 2px solid transparent; margin-bottom: -1px; background: transparent;
    font: inherit; font-size: 14px; font-weight: 600; color: var(--muted); cursor: pointer; white-space: nowrap; }
  .fd-tab:hover { color: var(--fg); }
  .fd-tab[data-active] { color: var(--fg); border-bottom-color: var(--accent); }
  .fd-grid { display: grid; grid-template-columns: repeat(var(--cols), minmax(0, 1fr)); gap: 12px; }
  .fd-card { display: flex; flex-direction: column; gap: 4px; padding: 10px 14px 11px; border: 1px solid var(--line); border-radius: 10px; background: var(--panel); }
  .fd-card.compact { padding: 7px 10px; gap: 2px; }
  .fd-card.compact .fd-desc { display: none; }
  .fd-card.compact .fd-add { height: 28px; }
  .fd-name { font-size: 15px; font-weight: 650; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .fd-desc { font-size: 13px; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .fd-tags { display: flex; gap: 5px; flex-wrap: wrap; height: 20px; overflow: hidden; }
  .fd-tag { height: 19px; padding: 0 7px; border-radius: 10px; font-size: 11.5px; font-weight: 600; line-height: 19px;
    color: color-mix(in srgb, var(--tc) 80%, var(--fg)); background: color-mix(in srgb, var(--tc) 15%, var(--panel)); }
  .fd-foot { margin-top: auto; display: flex; align-items: center; justify-content: space-between; gap: 6px; }
  .fd-price { font-weight: 750; font-variant-numeric: tabular-nums; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .fd-opts { margin-left: 8px; font-size: 12px; color: var(--muted); font-weight: 400; }
  .fd-add { flex: none; display: inline-flex; align-items: center; gap: 5px; height: 31px; padding: 0 13px 0 10px; border-radius: 16px; cursor: pointer;
    border: 1.5px solid var(--accent); background: transparent; color: var(--accent); font: inherit; font-size: 13.5px; font-weight: 700; }
  .fd-add:hover { background: color-mix(in srgb, var(--accent) 10%, var(--panel)); }
  .fd-add svg { width: 13px; height: 13px; }
  .fd-add:disabled { opacity: .4; cursor: default; }
  .fd-cart { flex: none; width: 300px; display: flex; flex-direction: column; padding: 16px 18px 18px; background: color-mix(in srgb, var(--fg) 2.5%, var(--panel)); }
  .fd-wrap:not(.left) .fd-cart { border-left: 1px solid var(--line); }
  .fd-wrap.left .fd-cart { border-right: 1px solid var(--line); }
  .fd-ch { display: flex; align-items: center; gap: 8px; font-size: 17px; font-weight: 750; }
  .fd-ch svg { width: 18px; height: 18px; }
  .fd-cn { margin-left: auto; font-size: 13px; font-weight: 600; color: var(--muted); }
  .fd-lines { flex: 1; min-height: 0; overflow-y: auto; overscroll-behavior: contain; margin: 8px -4px 0; padding: 0 4px; scrollbar-width: thin; }
  .fd-line { padding: 9px 0; border-bottom: 1px solid var(--line); }
  .fd-l1 { display: flex; gap: 10px; align-items: baseline; }
  .fd-lname { flex: 1; min-width: 0; font-weight: 600; font-size: 14.5px; }
  .fd-lopt { display: block; font-size: 12.5px; font-weight: 400; color: var(--muted); }
  .fd-lp { font-weight: 650; font-variant-numeric: tabular-nums; white-space: nowrap; }
  .fd-l2 { display: flex; align-items: center; gap: 8px; margin-top: 6px; }
  .fd-st { width: 28px; height: 28px; border-radius: 50%; border: 1px solid color-mix(in srgb, var(--fg) 20%, var(--line)); background: var(--panel);
    color: var(--fg); font: inherit; font-size: 16px; line-height: 1; cursor: pointer; display: flex; align-items: center; justify-content: center; }
  .fd-st:hover { background: color-mix(in srgb, var(--fg) 7%, var(--panel)); }
  .fd-q { min-width: 22px; text-align: center; font-weight: 700; font-variant-numeric: tabular-nums; }
  .fd-rm { margin-left: auto; border: 0; background: transparent; color: var(--muted); font: inherit; font-size: 13px; cursor: pointer; text-decoration: underline; text-underline-offset: 2px; }
  .fd-rm:hover { color: #e03131; }
  .fd-st:disabled, .fd-rm:disabled { opacity: .35; cursor: default; }
  .fd-empty { margin-top: 26px; text-align: center; font-size: 13.5px; color: var(--muted); line-height: 1.6; }
  .fd-sum { flex: none; display: flex; justify-content: space-between; padding: 12px 0 4px; font-size: 14px; color: var(--muted); }
  .fd-sum.total { padding-top: 2px; font-size: 16px; font-weight: 800; color: var(--fg); }
  .fd-order { flex: none; height: 44px; margin-top: 10px; border-radius: 9px; font-size: 15px; }
  .fd-done { flex: none; margin-top: 10px; padding: 10px 14px; border-radius: 9px; font-size: 13.5px; line-height: 1.5;
    background: color-mix(in srgb, #2f9e44 12%, var(--panel)); color: color-mix(in srgb, #2f9e44 70%, var(--fg)); }
  .fd-done b { display: block; font-size: 15px; }
  .fd-done .as-link { margin-top: 4px; font-size: 13px; }
  .fd-dlg { width: 400px; }
  .fd-dd { font-size: 13.5px; color: var(--muted); margin-bottom: 12px; }
  .fd-gl { font-size: 12px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); margin-bottom: 7px; }
  .fd-otiles { display: flex; flex-direction: column; gap: 6px; }
  .fd-ot { display: flex; align-items: center; gap: 10px; height: 36px; padding: 0 12px; border: 1px solid var(--line); border-radius: 8px; cursor: pointer; font-size: 14px; }
  .fd-ot i { width: 16px; height: 16px; border-radius: 50%; border: 2px solid color-mix(in srgb, var(--fg) 35%, var(--line)); flex: none; }
  .fd-ot[aria-checked="true"] { border-color: var(--accent); background: color-mix(in srgb, var(--accent) 8%, var(--panel)); }
  .fd-ot[aria-checked="true"] i { border: 5px solid var(--accent); }
  .fd-ot em { margin-left: auto; font-style: normal; font-size: 13px; color: var(--muted); }
  .fd-qty { display: flex; align-items: center; gap: 12px; margin-top: 14px; }
  .fd-qty .fd-st { width: 34px; height: 34px; font-size: 18px; }
  .fd-qty .fd-q { font-size: 17px; min-width: 26px; }
  .fd-dlg.compact .as-dlg-h { padding: 10px 12px 8px 16px; }
  .fd-dlg.compact .as-dlg-b { padding: 10px 16px; }
  .fd-dlg.compact .fd-dd { margin-bottom: 8px; }
  .fd-dlg.compact .fd-gl { margin-bottom: 4px; }
  .fd-dlg.compact .fd-otiles { gap: 4px; }
  .fd-dlg.compact .fd-ot { height: 30px; }
  .fd-dlg.compact .fd-qty .fd-st { width: 30px; height: 30px; }
  .fd-dlg.compact .as-dlg-f { padding: 8px 16px 10px; }
  .fd-dlg.compact .as-dlg-f .as-btn { height: 32px; }

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

  /* checkout store */
  .co-search { flex: 1; min-width: 150px; max-width: 440px; display: flex; align-items: center; gap: 6px; height: 36px; padding: 0 4px 0 12px;
    border-radius: 18px; border: 1px solid color-mix(in srgb, var(--fg) 20%, var(--line)); background: var(--panel); }
  .co-search:focus-within { border-color: var(--accent); box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 18%, transparent); }
  .co-search svg { flex: none; width: 15px; height: 15px; color: var(--muted); }
  .co-search input { flex: 1; min-width: 0; height: 100%; border: 0; outline: none; background: transparent; color: var(--fg); font: inherit; font-size: 14px;
    user-select: text; -webkit-user-select: text; }
  .co-search .as-btn { height: 28px; padding: 0 12px; border-radius: 14px; font-size: 13px; }
  .co-navs { display: flex; align-items: center; gap: 2px; margin-left: auto; }
  .co-nb { height: 32px; padding: 0 10px; border: 0; border-radius: 8px; background: transparent; color: var(--muted); font: inherit; font-size: 13.5px;
    font-weight: 600; cursor: pointer; white-space: nowrap; }
  .co-nb:hover { color: var(--fg); background: color-mix(in srgb, var(--fg) 6%, transparent); }
  .co-nb.on { color: var(--fg); }
  .co-cart { display: flex; align-items: center; gap: 7px; height: 34px; padding: 0 12px; border-radius: 17px; border: 1px solid var(--line);
    background: var(--panel); color: var(--fg); font: inherit; font-size: 13.5px; font-weight: 600; cursor: pointer; white-space: nowrap; }
  .co-cart svg { width: 16px; height: 16px; }
  .co-cart.on { border-color: var(--accent); }
  .co-badge { min-width: 19px; height: 19px; padding: 0 5px; border-radius: 10px; background: var(--accent); color: #fff; font-size: 11.5px;
    font-weight: 800; line-height: 19px; text-align: center; }
  .co-page { position: absolute; inset: 0; display: flex; flex-direction: column; padding: 14px 22px 16px; overflow: hidden; }
  .as-app.flow .co-page { position: relative; inset: auto; overflow: visible; }
  .co-banner { flex: none; display: flex; align-items: center; gap: 10px; padding: 7px 14px; margin-bottom: 10px; border-radius: 8px; font-size: 13.5px;
    background: color-mix(in srgb, #f59f00 16%, var(--panel)); border: 1px solid color-mix(in srgb, #f59f00 40%, var(--line)); white-space: nowrap; overflow: hidden; }
  .co-code { font-family: ui-monospace, Menlo, Consolas, monospace; font-weight: 750; padding: 1px 7px; border: 1px dashed currentColor; border-radius: 5px;
    user-select: text; -webkit-user-select: text; }
  .co-shop { flex: 1; min-height: 0; display: flex; gap: 22px; }
  .co-filters { flex: none; width: 184px; display: flex; flex-direction: column; }
  .co-fh { font-size: 11.5px; font-weight: 750; letter-spacing: .07em; text-transform: uppercase; color: var(--muted); margin: 4px 0 6px; }
  .co-fh + .co-fh, .co-check + .co-fh { margin-top: 14px; }
  .co-check { display: flex; align-items: center; gap: 9px; min-height: 28px; font-size: 13.5px; cursor: pointer; }
  .co-check input { flex: none; width: 16px; height: 16px; margin: 0; accent-color: var(--accent); cursor: pointer; }
  .co-check span { min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .co-check em { margin-left: auto; font-style: normal; font-size: 12px; color: var(--muted); }
  .co-range { position: relative; height: 30px; margin: 2px 0 0; cursor: pointer; touch-action: none; }
  .co-rail, .co-fill { position: absolute; top: 13px; height: 4px; border-radius: 2px; pointer-events: none; }
  .co-rail { left: 9px; right: 9px; background: color-mix(in srgb, var(--fg) 15%, var(--line)); }
  .co-fill { background: var(--accent); }
  .co-knob { position: absolute; top: 50%; width: 18px; height: 18px; margin: -9px 0 0 -9px; border-radius: 50%; background: var(--panel);
    border: 2px solid var(--accent); box-shadow: 0 1px 4px rgba(0,0,0,.2); cursor: grab; touch-action: none; }
  .co-prices { display: flex; justify-content: space-between; gap: 8px; font-size: 12.5px; color: var(--muted); font-variant-numeric: tabular-nums; white-space: nowrap; }
  .co-main { flex: 1; min-width: 0; display: flex; flex-direction: column; }
  .co-rh { flex: none; display: flex; align-items: center; gap: 12px; height: 32px; margin-bottom: 6px; font-size: 13.5px; color: var(--muted); white-space: nowrap; overflow: hidden; }
  .co-rh b { color: var(--fg); }
  .co-note { margin-left: auto; color: #2f9e44; font-weight: 650; overflow: hidden; text-overflow: ellipsis; }
  .co-pane .as-list { background: var(--panel); }
  .co-pane .co-row + .co-row { box-shadow: 0 -1px 0 var(--line); }
  .co-row { display: flex; align-items: center; gap: 12px; padding: 0 14px 0 12px; background: var(--panel); }
  .co-thumb { flex: none; width: 44px; height: 44px; border-radius: 9px; display: flex; align-items: center; justify-content: center; color: #fff;
    font-weight: 800; font-size: 14px; letter-spacing: .02em; background: linear-gradient(135deg, hsl(var(--h) 62% 68%), hsl(var(--h) 52% 42%)); }
  .co-info { flex: 1; min-width: 0; }
  .co-name { display: block; max-width: 100%; color: var(--fg); font-weight: 650; font-size: 14.5px; cursor: pointer; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .co-name:hover { color: var(--accent); text-decoration: underline; text-underline-offset: 2px; }
  .co-meta { margin-top: 2px; font-size: 12.5px; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .co-stars { color: #e8a200; }
  .co-low { color: #e8590c; font-weight: 650; }
  .co-out { color: #e03131; font-weight: 650; }
  .co-price { flex: none; width: 86px; text-align: right; font-weight: 800; font-size: 15.5px; font-variant-numeric: tabular-nums; white-space: nowrap; }
  .co-was { display: block; font-size: 12px; font-weight: 400; color: var(--muted); text-decoration: line-through; }
  .co-step { flex: none; display: flex; align-items: center; gap: 3px; }
  .co-sb { width: 26px; height: 26px; border-radius: 50%; border: 1px solid color-mix(in srgb, var(--fg) 20%, var(--line)); background: var(--panel);
    color: var(--fg); font: inherit; font-size: 15px; line-height: 1; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 0; }
  .co-sb:hover { background: color-mix(in srgb, var(--fg) 7%, var(--panel)); }
  .co-sb:disabled { opacity: .35; cursor: default; }
  .co-q { min-width: 20px; text-align: center; font-weight: 700; font-variant-numeric: tabular-nums; }
  .co-add { flex: none; height: 32px; padding: 0 12px; border-radius: 8px; font-size: 13px; }
  .co-add.incart { box-shadow: inset 0 0 0 2px color-mix(in srgb, #2f9e44 70%, transparent); }
  .co-grid { display: grid; grid-template-columns: repeat(var(--cols), minmax(0, 1fr)); gap: 14px; }
  .co-card { display: flex; flex-direction: column; gap: 6px; padding: 12px; border: 1px solid var(--line); border-radius: 10px; background: var(--panel); }
  .co-card .co-thumb { width: 100%; height: 92px; font-size: 24px; }
  .co-card .co-name { white-space: normal; height: 2.7em; line-height: 1.35; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
  .co-card .co-price { width: auto; text-align: left; }
  .co-cardfoot { display: flex; align-items: center; justify-content: space-between; gap: 6px; margin-top: 4px; }
  .co-empty { margin: 40px auto; text-align: center; color: var(--muted); font-size: 14px; line-height: 1.6; }
  .co-load { display: flex; flex-direction: column; gap: 1px; background: var(--line); }
  .co-skrow { display: flex; align-items: center; gap: 12px; padding: 0 14px; background: var(--panel); }
  .co-back { align-self: flex-start; display: inline-flex; align-items: center; gap: 6px; height: 32px; padding: 0 12px; }
  .co-back svg { width: 14px; height: 14px; }
  .co-detail { flex: 1; min-height: 0; display: flex; gap: 26px; margin-top: 12px; }
  .co-hero { flex: none; border-radius: 14px; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 54px; font-weight: 800;
    background: linear-gradient(135deg, hsl(var(--h) 62% 70%), hsl(var(--h) 52% 40%)); }
  .co-dinfo { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 7px; }
  .co-crumb { font-size: 12.5px; color: var(--muted); }
  .co-h1 { font-size: 21px; font-weight: 750; line-height: 1.25; }
  .co-dprice { font-size: 25px; font-weight: 800; font-variant-numeric: tabular-nums; }
  .co-dprice .co-was { display: inline; margin-left: 10px; font-size: 15px; }
  .co-desc { font-size: 13.5px; line-height: 1.5; color: var(--muted); overflow: hidden; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; }
  .co-buy { display: flex; align-items: center; gap: 14px; margin-top: 4px; }
  .co-buy .co-sb { width: 32px; height: 32px; font-size: 17px; }
  .co-ok { color: #2f9e44; font-weight: 650; font-size: 13.5px; min-height: 20px; }
  .co-h { flex: none; font-size: 20px; font-weight: 750; margin-bottom: 10px; }
  .co-two { flex: 1; min-height: 0; display: flex; gap: 22px; }
  .co-col { flex: 1; min-width: 0; display: flex; flex-direction: column; }
  .co-lines { flex: 1; min-height: 0; overflow-y: auto; scrollbar-width: thin; }
  .co-line { display: flex; align-items: center; gap: 12px; padding: 10px 2px; border-bottom: 1px solid var(--line); }
  .co-line .co-thumb { width: 40px; height: 40px; font-size: 13px; }
  .co-lt { flex: none; width: 86px; text-align: right; font-weight: 750; font-variant-numeric: tabular-nums; white-space: nowrap; }
  .co-side { flex: none; width: 280px; align-self: flex-start; display: flex; flex-direction: column; gap: 7px; padding: 14px 16px;
    border: 1px solid var(--line); border-radius: 12px; background: color-mix(in srgb, var(--fg) 2%, var(--panel)); }
  .co-sum { display: flex; justify-content: space-between; gap: 10px; font-size: 13.5px; color: var(--muted); font-variant-numeric: tabular-nums; }
  .co-sum span:last-child { white-space: nowrap; }
  .co-sum.total { padding-top: 7px; border-top: 1px solid var(--line); font-size: 16.5px; font-weight: 800; color: var(--fg); }
  .co-sum.disc { color: #2f9e44; }
  .co-mini { display: flex; justify-content: space-between; gap: 8px; font-size: 13px; }
  .co-mini span:first-child { min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .co-lab { font-size: 12px; font-weight: 650; color: var(--muted); }
  .co-promo { display: flex; gap: 6px; }
  .co-input { flex: 1; min-width: 0; height: 36px; padding: 0 10px; border-radius: 8px; border: 1px solid color-mix(in srgb, var(--fg) 22%, var(--line));
    background: var(--panel); color: var(--fg); font: inherit; font-size: 14px; outline: none; user-select: text; -webkit-user-select: text; }
  .co-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 18%, transparent); }
  .co-input.bad { border-color: #e03131; }
  .co-msg { font-size: 12.5px; min-height: 17px; }
  .co-msg.good { color: #2f9e44; }
  .co-msg.bad { color: #e03131; }
  .co-big { height: 42px; font-size: 15px; }
  .co-sec { font-size: 15px; font-weight: 750; margin: 4px 0 8px; }
  .co-tiles { display: grid; grid-template-columns: repeat(var(--n), minmax(0, 1fr)); gap: 9px; }
  .co-tile { min-width: 0; min-height: 72px; padding: 8px 11px; border: 1px solid var(--line); border-radius: 10px; font-size: 12.5px; line-height: 1.38;
    color: var(--muted); cursor: pointer; overflow: hidden; }
  .co-tile b { display: block; font-size: 13px; color: var(--fg); }
  .co-tile div { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .co-tile[aria-checked="true"] { border-color: var(--accent); box-shadow: 0 0 0 2px color-mix(in srgb, var(--accent) 25%, transparent);
    background: color-mix(in srgb, var(--accent) 5%, var(--panel)); }
  .co-tile.new { display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; border-style: dashed; }
  .co-form { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 12px; margin-top: 10px; }
  .co-fl { display: flex; flex-direction: column; gap: 3px; font-size: 12px; font-weight: 650; color: var(--muted); }
  .co-fl .co-input { flex: none; height: 34px; }
  .co-fl i { font-style: normal; color: #e03131; font-weight: 600; min-height: 0; }
  .co-ships { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
  .co-radio { display: flex; align-items: center; gap: 8px; min-width: 0; height: 44px; padding: 0 10px; border: 1px solid var(--line); border-radius: 8px;
    font-size: 12.5px; line-height: 1.25; cursor: pointer; }
  .co-radio input { flex: none; margin: 0; accent-color: var(--accent); cursor: pointer; }
  .co-radio span { min-width: 0; overflow: hidden; }
  .co-radio b { display: block; font-size: 12.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .co-radio:has(input:checked) { border-color: var(--accent); background: color-mix(in srgb, var(--accent) 6%, var(--panel)); }
  /* Long goals and a footer can leave a short fixed frame. Keep the complete address and delivery
     form visible instead of clipping the last row beneath the app's rounded edge. */
  .co-page.co-compact { padding: 10px 18px 12px; }
  .co-compact .co-back { height: 28px; }
  .co-compact .co-sec { font-size: 14px; margin: 2px 0 6px; }
  .co-compact .co-tiles { gap: 8px; }
  .co-compact .co-tile { min-height: 64px; padding: 6px 9px; font-size: 12px; line-height: 1.25; }
  .co-compact .co-form { gap: 6px 10px; margin-top: 8px; }
  .co-compact .co-fl { gap: 2px; }
  .co-compact .co-fl .co-input { height: 30px; }
  .co-compact .co-radio { height: 40px; }
  .co-compact .co-delivery-title { margin-top: 10px !important; }
  .co-reasons { display: flex; flex-direction: column; gap: 6px; max-width: 520px; }
  .co-reasons .co-radio { height: 38px; font-size: 13.5px; }
  .co-conf { flex: none; display: flex; align-items: center; gap: 12px; }
  .co-check-big { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; background: #2f9e44; }
  .co-check-big svg { width: 22px; height: 22px; }
  .co-check-big.off { background: #868e96; }
  .co-no { display: inline-block; margin: 4px 0; padding: 4px 12px; border-radius: 8px; font-family: ui-monospace, Menlo, Consolas, monospace; font-size: 19px;
    font-weight: 800; letter-spacing: .02em; color: var(--fg); background: color-mix(in srgb, var(--accent) 10%, var(--panel)); user-select: text; -webkit-user-select: text; }
  .co-facts { display: grid; grid-template-columns: auto 1fr; gap: 5px 18px; margin: 10px 0 12px; font-size: 13.5px; max-width: 640px; }
  .co-facts dt { color: var(--muted); }
  .co-facts dd { margin: 0; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .co-acts { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
  .co-muted { color: var(--muted); font-size: 13.5px; line-height: 1.5; }
  .co-trackrow { display: flex; gap: 8px; max-width: 460px; margin: 10px 0 14px; }
  .co-result { max-width: 520px; padding: 12px 14px; border: 1px solid var(--line); border-radius: 10px; font-size: 13.5px; line-height: 1.55; }
  .co-result b { font-size: 15px; }
  .co-result.bad { border-color: color-mix(in srgb, #e03131 50%, var(--line)); color: #e03131; }
  .co-alert { flex: none; padding: 8px 12px; margin-bottom: 10px; border-radius: 8px; font-size: 13px; background: color-mix(in srgb, var(--accent) 9%, var(--panel)); }
  `;
const FIT_CSS =
    '\n.as-app{left:0!important;right:0!important;top:0!important;bottom:0!important;width:auto!important;border:0;border-radius:0;box-shadow:none}.as-top{display:none}.as-body{min-height:0}.as-btn{border-radius:3px;font-size:14px}.as-pane{border-radius:0}.se-main{padding:17px 22px!important;gap:0}.se-col{width:100%;max-width:none}.se-side{display:none}.se-box{border-radius:3px;box-shadow:none;height:39px;padding:0 12px}.se-go{border-radius:3px;height:39px;padding:0 22px}.se-card{border-bottom:1px solid var(--line);padding:8px 8px 4px}.se-card .se-title{font-family:inherit;font-size:19px}.se-pager{justify-content:center}.se-pg{border-radius:2px;width:32px;min-width:32px;height:32px}.se-fav{width:22px;height:22px;border-radius:1px}.se-url{font-size:12px}.se-desc{font-size:14px}.tk-main{padding:18px 22px}.tk-title{font-size:24px}.tk-date{border-radius:0;background:transparent}.tk-row{gap:12px;border-bottom:1px solid var(--line);padding:0 12px}.tk-name{font-size:15px}.tk-price{font-size:18px;width:68px}.tk-buy{width:65px}.tk-when{width:125px}.tk-trigger{border-radius:0;min-width:175px}.fd-wrap.left{flex-direction:row}.fd-cart{width:28%!important;border-left:3px solid var(--fg);border-radius:0;background:var(--panel)}.fd-menu{padding:12px 18px}.fd-card{border-radius:0}.fd-add{border-radius:2px}.fd-order{border-radius:2px}.fd-rname{font-size:22px}.fd-rmeta{font-size:12px}.fd-dialog,.as-dialog{border-radius:4px}.fl-form{border-radius:0}.at-win{left:0!important;top:0!important;width:100%!important;height:100%!important;border-radius:0;box-shadow:none}.at-title{height:30px;border-radius:0;background:var(--header,var(--panel));font-size:14px}.at-rail{display:none}.at-body{flex:1;min-height:0}.at-main{min-width:0}.at-pane-h{border-radius:0}.at-explorer{width:46%!important;max-width:none}.at-preview{padding:10px}.at-tree{font-family:inherit}.at-row svg{color:var(--fg)}.at-ed{padding:0!important}.at-pagearea{background:var(--panel);padding:0!important}.at-sheet{border:0;box-shadow:none;background:var(--panel);margin:0!important;width:100%!important;max-width:none!important;padding:26px 32px!important}.at-sheet h2{font-family:inherit}.at-tb{border-radius:0;padding:10px;background:var(--header,var(--panel))}.at-tool{border-radius:3px;font-family:inherit}.at-status{background:var(--panel)}.at-term{border-radius:0;border:0}.at-tscroll{padding:20px;font:15px/1.5 monospace}.at-term-tabs{background:var(--header,var(--panel))}.as-page{inset:0!important;display:flex;justify-content:stretch!important}.as-rail,.as-side{display:none}.as-col{flex:1!important;width:100%!important;border:0}.as-head{height:43px;background:var(--header,var(--panel));font-size:14px}.as-post{padding:13px 18px;gap:14px;border-bottom:1px solid var(--line)}.as-text{font-size:16px;line-height:1.4}.as-av{width:48px;height:48px;border-radius:4px;font-size:17px}.as-acts{max-width:440px;justify-content:flex-start;gap:22px}.as-act{border-radius:3px;height:30px;font-size:14px;padding:0 8px}.as-act svg{width:20px;height:20px}.as-photos{height:100px!important;border-radius:4px}.as-menu{border-radius:3px;min-width:210px}.as-mi{height:35px;font-size:14px}.as-confirm{border-radius:4px}.as-confirm button{border-radius:3px}.as-track{border-radius:0;width:15px;background:var(--line)}.as-thumb{border-radius:0}.as-name{font-size:16px}.as-handle,.as-time{font-size:13px}.as-quote{border-radius:3px}.as-link{border-radius:3px}.as-link.tall .as-link-img{height:65px}.as-post:has(.as-photos){min-height:200px}';
  env.template('use-shop/_adapted-style', () => ({ CSS, FIT_CSS }));
})();
