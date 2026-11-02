/* use-shop/_base-style: reference stylesheet constants (text preserved). */
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
      .se-cmeta { margin-top: 2px; display: flex; gap: 6px 14px; font-size: 13px; color: var(--muted); white-space: nowrap; overflow: hidden; }
      .se-cmeta b { color: var(--fg); font-weight: 700; }
      .se-empty { margin: 50px auto 0; text-align: center; color: var(--muted); font-size: 14.5px; line-height: 1.6; }
      .se-empty svg { width: 54px; height: 54px; color: color-mix(in srgb, var(--muted) 60%, transparent); }
      .se-pane .se-card { padding: 8px 14px 0; background: var(--panel); border-bottom: 1px solid var(--line); }
      .se-pane .as-list { background: var(--panel); }
      .se-pane.idle { background: transparent; border-color: transparent; }
      .se-foot { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; padding: 0 10px; font-size: 13px; color: var(--muted); text-align: center; background: var(--panel); }
      .se-foot i { font-style: normal; letter-spacing: .25em; color: var(--accent); font-size: 12px; }
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
      .fl-crow { flex: none; display: flex; align-items: center; justify-content: space-between; gap: 12px; margin: 8px 2px 6px; }
      .fl-crow .fl-count { margin: 0; }
      .fl-crow .tk-trigger { height: 30px; min-width: 190px; }
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
      .mk-lead { flex: none; display: flex; align-items: center; gap: 12px; height: 46px; margin-bottom: 12px; padding: 0 12px; border-radius: 8px; cursor: pointer;
        border: 1px solid var(--line); background: color-mix(in srgb, var(--accent) 6%, var(--panel)); white-space: nowrap; overflow: hidden; }
      .mk-tag { flex: none; padding: 1px 6px; border-radius: 3px; font-size: 10px; font-weight: 800; letter-spacing: .04em; color: #fff; background: #8a8f98; text-transform: uppercase; }
      .mk-art { flex: none; width: 30px; height: 30px; border-radius: 7px; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 800; }
      .mk-art.big { width: 100%; height: 92px; font-size: 28px; }
      .mk-tx { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; font-size: 13.5px; }
      .mk-cta { flex: none; height: 28px; padding: 0 14px; border: 0; border-radius: 6px; color: #fff; font: inherit; font-size: 13px; font-weight: 700; cursor: pointer; }
      .mk-side { margin-top: 18px; display: flex; flex-direction: column; gap: 6px; padding: 10px; border: 1px solid var(--line); border-radius: 10px; cursor: pointer; }
      .mk-tile { cursor: pointer; background: color-mix(in srgb, #f0b400 8%, var(--panel)); }
      .mk-b { font-size: 14px; }
      .mk-side .mk-tag, .mk-tile .mk-tag { align-self: flex-start; }
      .mk-h { flex: 1; font-size: 12.5px; line-height: 1.35; color: var(--muted); }
      .mk-steps { flex: none; display: flex; align-items: center; list-style: none; margin: 0 0 14px; padding: 0; }
      .mk-steps li { flex: 1; display: flex; align-items: center; gap: 8px; font-size: 13.5px; color: var(--muted); }
      .mk-steps li + li::before { content: ''; flex: 1; height: 2px; margin-right: 8px; background: var(--line); }
      .mk-steps .dot { flex: none; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700;
        border: 2px solid var(--line); background: var(--panel); }
      .mk-steps li.now { color: var(--fg); font-weight: 700; }
      .mk-steps li.now .dot { color: #fff; border-color: var(--accent); background: var(--accent); }
      .mk-steps li.done .dot { color: #fff; border-color: #2f9e44; background: #2f9e44; }
      .mk-steps li.done + li::before, .mk-steps li.now + li.todo::before { background: var(--line); }
      .mk-steps li.done + li::before { background: #2f9e44; }
      .sh-tabs { flex: none; display: flex; height: 52px; border-top: 1px solid var(--line); background: color-mix(in srgb, var(--fg) 2.5%, var(--panel)); border-radius: 0 0 12px 12px; }
      .sh-tab { flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px; border: 0; background: transparent; color: var(--muted); font: inherit; font-size: 14px; cursor: pointer; }
      .sh-tab.on { color: var(--accent); font-weight: 700; box-shadow: inset 0 3px 0 var(--accent); }
      .sh-tab svg { width: 17px; height: 17px; }
      .sh-wrap { position: absolute; inset: 0; z-index: 8; display: flex; align-items: flex-end; justify-content: center; }
      .sh-scrim { position: absolute; inset: 0; background: rgba(15,17,21,.42); }
      .sh-sheet { position: relative; display: flex; flex-direction: column; width: min(880px, 100%); max-height: 92%; box-sizing: border-box; padding: 12px 22px 14px;
        background: var(--panel); border-radius: 18px 18px 0 0; box-shadow: 0 -8px 30px rgba(0,0,0,.28); }
      .sh-grab { flex: none; align-self: center; width: 44px; height: 5px; margin-bottom: 8px; border-radius: 3px; background: color-mix(in srgb, var(--fg) 22%, var(--line)); }
      .sh-x { position: absolute; top: 10px; right: 12px; width: 30px; height: 30px; border: 0; border-radius: 50%; background: color-mix(in srgb, var(--fg) 8%, var(--panel));
        color: var(--fg); font: inherit; font-size: 19px; line-height: 1; cursor: pointer; }
      .sh-body { flex: 1; min-height: 0; display: flex; flex-direction: column; }
      .co-compact .co-back { height: 28px; }
      .co-compact .co-sec { font-size: 14px; margin: 2px 0 6px; }
      .co-compact .co-tiles { gap: 8px; }
      .co-compact .co-tile { min-height: 64px; padding: 6px 9px; font-size: 12px; line-height: 1.25; }
      .co-compact .co-form { gap: 6px 10px; margin-top: 8px; }
      .co-compact .co-fl { gap: 2px; }
      .co-compact .co-fl .co-input { height: 30px; }
      .co-compact .co-radio { height: 40px; }
      .co-compact .co-delivery-title { margin-top: 10px !important; }
      /* Under 340px (a long instruction header plus the sheet skin's tab bar) the new-address form still pushes the
         delivery options under the frame: lay its four fields out in one row. */
      .co-tight .co-form { grid-template-columns: repeat(4, minmax(0, 1fr)); }
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
  const POLISH_CSS = `
      /* Second-pass commerce density and secondary content, scoped to this skin. */
      .as-masthead { gap:16px; }
      .as-inline-icon { display:inline-flex; flex:none; color:var(--accent); }
      .as-inline-icon svg,.as-btn>svg,.fd-st>svg,.co-sb>svg,.se-pg>svg { width:15px; height:15px; vertical-align:middle; }
      .as-btn:has(>svg) { align-items:center; justify-content:center; gap:6px; }
      .as-account { display:flex; align-items:center; gap:12px; margin-left:auto; }
      .as-account-label { display:flex; flex-direction:column; white-space:nowrap; font-size:11px; }
      .as-account-label span { color:var(--muted); }
      .as-account-label b { font-size:12px; }
      .as-notifications { position:relative; }
      .as-notifications>summary { display:flex; position:relative; cursor:pointer; padding:6px; list-style:none; }
      .as-notifications>summary svg { width:19px; height:19px; }
      .as-dot { position:absolute; top:0; right:0; min-width:13px; height:13px; font:9px/13px system-ui; text-align:center; border-radius:50%; background:var(--accent); color:white; }
      .as-account-pop { position:absolute; z-index:50; top:35px; right:0; width:260px; padding:14px; background:var(--panel); border:1px solid var(--line); border-radius:7px; box-shadow:0 7px 25px #0003; font-size:12px; }
      .as-browse-search { flex:1; max-width:420px; display:flex; align-items:center; gap:9px; height:33px; border:1px solid var(--line); border-radius:5px; padding:0 12px; color:var(--muted); font-size:12px; background:var(--panel); }
      .as-browse-search svg { width:15px; height:15px; }
      .as-masthead:has(.as-browse-search)>.as-right { display:none; }
      .as-service { display:flex; align-items:flex-start; gap:7px; margin:8px 0; line-height:1.4; font-size:11px; color:var(--muted); }
      .as-service b { color:var(--fg); }
      .as-micro { font-size:10px; color:var(--muted); line-height:1.45; }
      .as-disclosure { border-top:1px solid var(--line); padding:10px 0; font-size:12px; }
      .as-disclosure>summary { font-weight:650; cursor:pointer; }
      .as-disclosure>p { font-size:11px; color:var(--muted); line-height:1.55; margin:8px 0 0; }
      .as-recommendations { padding-top:16px; margin-top:18px; border-top:1px solid var(--line); }
      .as-recommendations h3 { margin:0 0 10px; font-size:14px; }
      .as-rec-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:10px; }
      .as-rec-item { padding:8px; border:1px solid var(--line); border-radius:6px; min-width:0; }
      .as-rec-art { height:62px; border-radius:4px; background:color-mix(in srgb,var(--fg) 3%,var(--panel)); }
      .as-rec-art svg { width:100%; height:100%; }
      .as-rec-item b { display:block; font-size:10px; line-height:1.35; margin-top:6px; }
      .as-rec-item>span { display:block; font-size:9px; color:var(--muted); margin-top:4px; }
      .ax-shell { font-size:12px; }
      .ax-toolbar { flex-wrap:wrap; gap:7px 15px; padding:8px 16px; font-size:11px; }
      .ax-departments { width:100%; display:flex; gap:17px; padding-top:6px; border-top:1px solid var(--line); color:var(--fg); font-size:11px; white-space:nowrap; overflow:hidden; }
      .ax-departments span:last-child { color:var(--accent); font-weight:650; }
      .ax-main { padding:17px 20px; }
      .ax-main h2 { font-size:23px; font-weight:700; letter-spacing:-.025em; }
      .ax-summary { width:226px; padding:16px; }
      .ax-narrow .ax-summary { width:194px; }
      .ax-summary h3 { font-weight:700; font-size:15px; }
      .ax-summary .as-disclosure { margin-top:12px; }
      .ax-summary .ax-total { font-size:16px; }
      .ax-product { gap:22px; align-items:stretch; }
      .ax-product>.ax-gallery { width:40%; max-width:250px; flex:none; }
      .ax-art { width:100%; height:190px; border-radius:6px; background:color-mix(in srgb,var(--fg) 3%,var(--panel)); }
      .ax-gallery-thumbs { display:flex; gap:5px; margin-top:7px; }
      .ax-gallery-thumbs>div { width:44px; height:44px; padding:3px; border:1px solid var(--line); border-radius:4px; background:var(--panel); }
      .ax-gallery-thumbs>div:first-child { border-color:var(--accent); }
      .ax-gallery-thumbs svg { width:100%; height:100%; }
      .ax-product>div:last-child { padding-top:4px; }
      .ax-product .ax-price { margin:12px 0 3px; font-size:24px; }
      .ax-rating { display:flex; align-items:center; gap:5px; color:var(--muted); font-size:11px; margin:9px 0; }
      .ax-rating svg { width:13px; height:13px; color:#bd882f; }
      .ax-price-sub { color:var(--muted); font-size:10px; margin-bottom:8px; }
      .ax-size-chart { margin-top:10px; font-size:11px; color:var(--muted); }
      .ax-size-chart table { border-collapse:collapse; width:100%; margin-top:8px; }
      .ax-size-chart td,.ax-size-chart th { border:1px solid var(--line); padding:5px; text-align:left; }
      .ax-mini { width:56px; height:56px; background:color-mix(in srgb,var(--fg) 3%,var(--panel)); }
      .ax-mini svg { width:100%; height:100%; }
      .ax-line { padding:10px 12px; border-radius:5px; }
      .ax-line .ax-actions { margin:4px 0 0 66px; }
      .ax-fulfilment { margin-left:66px; margin-top:5px; font-size:10px; color:var(--muted); }
      .ax-fulfilment .as-service { margin:3px 0; }
      .ax-bag-message { margin:12px 0; padding:9px 11px; border:1px solid var(--line); border-radius:5px; background:color-mix(in srgb,var(--accent) 4%,var(--panel)); }
      .ax-bag-message .as-service { margin:0; }
      .ax-order-products { display:flex; gap:5px; margin-top:8px; }
      .ax-order-products>div { width:48px; height:43px; background:color-mix(in srgb,var(--fg) 3%,var(--panel)); border:1px solid var(--line); border-radius:4px; }
      .ax-order-products svg { width:100%; height:100%; }
      .ax-order .ax-chips { width:100%; padding-top:9px; border-top:1px solid var(--line); }
      .ax-order-info { flex:1; min-width:0; }
      .ax-return-rail { margin-top:20px; padding-top:12px; border-top:1px solid var(--line); }
      .ax-return-rail .as-service { margin:12px 0; }
      .ax-offer-terms { width:100%; color:var(--muted); font-size:10px; padding-top:7px; border-top:1px dashed var(--line); }
      .ax-compare .ax-table { margin-top:12px; font-size:11px; }
      .ax-compare .ax-table th,.ax-compare .ax-table td { padding:8px 7px; }
      .ax-compare .ax-table thead th { background:var(--panel); }
      .ax-pack-art { height:85px; margin:0 auto 8px; background:color-mix(in srgb,var(--fg) 3%,var(--panel)); border-radius:5px; }
      .ax-pack-art svg { width:100%; height:100%; }
      .ax-pack-rating { font-size:10px; color:var(--muted); margin-top:5px; }
      .ax-compare .ax-summary .as-disclosure,.ax-compare .ax-summary>.as-service,.ax-compare .ax-summary>.ax-summary-benefits { display:none; }
      .as-special-note { margin-top:10px; padding:10px; border:1px solid var(--line); border-radius:6px; }
      .se-empty { margin-top:26px; }
      .se-empty-browse { margin-top:20px; text-align:left; }
      .se-empty-browse b { display:block; font-size:11px; color:var(--fg); margin-bottom:8px; }
      .se-empty-browse .se-chips { display:flex; flex-wrap:wrap; gap:7px; }
      .se-empty-browse .se-chips span { border:1px solid var(--line); border-radius:14px; padding:4px 10px; font-size:11px; }
      .se-context { font-size:10px; color:var(--muted); padding:6px 0 8px; }
      .se-vpage .as-service { margin-top:12px; }
      .tk-row { border-left:3px solid color-mix(in srgb,var(--accent) 32%,var(--panel)); }
      .tk-extra { font-size:10px; color:var(--muted); overflow:hidden; white-space:nowrap; text-overflow:ellipsis; }
      .tk-head .tk-sub { max-width:540px; }
      .fd-card { padding-right:66px; position:relative; }
      .fd-card .fd-foot { position:absolute; z-index:1; left:12px; right:12px; bottom:8px; margin:0; }
      .fd-card .fd-price { min-width:0; }
      .fd-card .fd-opts { display:block; margin-left:0; font-size:10px; line-height:1.15; }
      .fd-food-art { position:absolute; right:8px; top:8px; width:51px; height:51px; background:color-mix(in srgb,var(--accent) 5%,var(--panel)); border-radius:7px; }
      .fd-food-art svg { width:100%; height:100%; }
      .fd-rmeta svg { width:12px; height:12px; vertical-align:middle; color:#bd882f; }
      .fd-empty .as-service { justify-content:center; }
      .fd-menu .fd-hero { border-bottom:1px solid var(--line); margin-bottom:9px; }
      .fd-grid { gap:9px; }
      .fl-deal i { display:flex; justify-content:center; align-items:center; overflow:hidden; }
      .fl-deal i svg { width:50px; height:45px; color:#fff; }
      .fl-form .as-special-note { display:flex; align-items:center; gap:20px; padding:7px 10px; }
      .fl-form .as-special-note .as-service { margin:2px 0; }
      .fl-fare { font-size:11px; }
      .fl-air { position:relative; padding-left:28px; }
      .fl-air>.as-inline-icon { position:absolute; left:0; top:4px; }
      .co-thumb { border-radius:5px; color:var(--fg); background:color-mix(in srgb,var(--fg) 4%,var(--panel)); }
      .co-thumb svg { width:100%; height:100%; }
      .co-hero { background:color-mix(in srgb,var(--fg) 4%,var(--panel)); color:var(--fg); }
      .co-hero svg { width:85%; height:85%; }
      .co-info .co-meta { font-size:11px; }
      .co-service-info { order:10; margin-top:14px; border-top:1px solid var(--line); padding-top:8px; overflow:hidden; }
      .co-service-info .as-service { font-size:10px; margin:7px 0; }
      .co-product-detail { font-size:10px; color:var(--muted); margin-top:3px; }
      `;
  const SHOPPING_CSS = `
          .ax-shell { position:absolute; inset:0; display:flex; flex-direction:column; min-height:0; font-size:13px; }
          .ax-toolbar { display:flex; align-items:center; justify-content:space-between; gap:10px; padding:10px 16px; border-bottom:1px solid var(--line); color:var(--muted); }
          .ax-toolbar b { color:var(--fg); }
          .ax-work { flex:1; min-height:0; display:flex; }
          .ax-main { flex:1; min-width:0; overflow:auto; overscroll-behavior:contain; padding:16px; scrollbar-width:thin; }
          .ax-summary { flex:none; width:210px; padding:16px; border-left:1px solid var(--line); background:color-mix(in srgb,var(--fg) 2%,var(--panel)); overflow:auto; }
          .ax-narrow .ax-summary { width:176px; padding:12px; }
          .ax-main h2 { font-size:21px; line-height:1.2; margin:0 0 5px; }
          .ax-main h3,.ax-summary h3 { font-size:14px; margin:0 0 10px; }
          .ax-muted { color:var(--muted); font-size:12px; }
          .ax-kicker { font-size:10px; text-transform:uppercase; letter-spacing:.12em; color:var(--muted); margin-bottom:6px; }
          .ax-pair { display:flex; justify-content:space-between; gap:10px; margin:8px 0; }
          .ax-total { padding-top:10px; margin-top:12px; border-top:1px solid var(--line); font-size:16px; font-weight:750; }
          .ax-summary .as-btn { width:100%; margin-top:12px; height:auto; min-height:34px; white-space:normal; padding:7px; font-size:12px; }
          .ax-summary .ax-muted { margin-top:10px; }
          .ax-product { display:flex; align-items:center; gap:15px; margin-bottom:15px; }
          .ax-art { flex:none; width:96px; height:108px; border-radius:10px; display:flex; align-items:center; justify-content:center; background:color-mix(in srgb,var(--accent) 9%,var(--panel)); }
          .ax-art svg { width:80%; height:80%; }
          .ax-product>div:last-child { min-width:0; }
          .ax-price { font-size:21px; font-weight:750; margin:7px 0; }
          .ax-options { border:0; padding:0; margin:13px 0; }
          .ax-options legend { padding:0; margin-bottom:6px; font-size:12px; font-weight:650; }
          .ax-chips { display:flex; flex-wrap:wrap; gap:6px; }
          .ax-chip { border:1px solid var(--line); background:var(--panel); color:var(--fg); border-radius:6px; min-height:32px; padding:5px 10px; font:inherit; font-size:12px; cursor:pointer; display:flex; gap:5px; align-items:center; }
          .ax-chip[aria-pressed=true] { border-color:var(--accent); box-shadow:inset 0 0 0 1px var(--accent); background:color-mix(in srgb,var(--accent) 9%,var(--panel)); }
          .ax-dot { width:13px; height:13px; border:1px solid #8888; border-radius:50%; }
          .ax-stock,.ax-notice { border:1px solid var(--line); border-radius:7px; padding:8px 10px; margin:10px 0; font-size:12px; background:color-mix(in srgb,var(--accent) 6%,var(--panel)); }
          .ax-stock.bad,.ax-notice.bad { color:var(--fg); border-color:#c64e55; background:color-mix(in srgb,#d84c4c 10%,var(--panel)); }
          .ax-qty { display:inline-flex; align-items:center; border:1px solid var(--line); border-radius:6px; overflow:hidden; }
          .ax-qty button { width:30px; height:30px; border:0; background:var(--panel); color:var(--fg); font:inherit; cursor:pointer; }
          .ax-qty output { min-width:30px; text-align:center; font-weight:650; }
          .ax-actions { display:flex; align-items:center; flex-wrap:wrap; gap:8px; margin:12px 0; }
          .ax-line { border:1px solid var(--line); border-radius:8px; padding:12px; margin:10px 0; }
          .ax-line-top { display:flex; align-items:center; gap:10px; margin-bottom:8px; }
          .ax-mini { width:32px; height:36px; flex:none; border-radius:5px; background:color-mix(in srgb,var(--accent) 12%,var(--panel)); display:grid; place-items:center; color:var(--accent); }
          .ax-line-top b { display:block; font-size:13px; }
          .ax-line-top>div:nth-child(2) { flex:1; min-width:0; }
          .ax-line .as-link { font-size:12px; }
          .ax-tag { font-size:10px; border:1px solid var(--line); border-radius:12px; padding:2px 7px; color:var(--muted); }
          .ax-table { width:100%; border-collapse:collapse; table-layout:fixed; font-size:12px; margin-top:15px; }
          .ax-table th,.ax-table td { padding:10px 7px; border:1px solid var(--line); text-align:center; overflow-wrap:anywhere; }
          .ax-table th:first-child { width:85px; text-align:left; color:var(--muted); font-weight:500; }
          .ax-table thead th { background:color-mix(in srgb,var(--accent) 5%,var(--panel)); vertical-align:top; }
          .ax-table .ax-chip { width:100%; justify-content:center; padding:5px; font-size:11px; }
          .ax-compare .ax-work { flex-direction:column; }
          .ax-compare .ax-summary { width:auto; flex:none; border-left:0; border-top:1px solid var(--line); padding:9px 16px; display:flex; align-items:center; flex-wrap:wrap; gap:8px 20px; }
          .ax-compare .ax-summary h3 { margin:0; }
          .ax-compare .ax-summary .ax-pair { margin:0; gap:6px; }
          .ax-compare .ax-summary .ax-total { padding:0; border:0; }
          .ax-compare .ax-summary .as-btn { width:auto; min-height:30px; margin:0; }
          .ax-compare .ax-summary .ax-muted { display:none; }
          .ax-compare .ax-summary .ax-bagline { font-size:11px; max-width:180px; }
          .ax-form { display:flex; gap:6px; margin:12px 0; }
          .ax-form input { width:100%; min-width:0; height:36px; background:var(--panel); color:var(--fg); border:1px solid var(--line); border-radius:6px; padding:0 9px; font:inherit; user-select:text; }
          .ax-order { display:flex; flex-wrap:wrap; align-items:center; gap:8px; justify-content:space-between; border:1px solid var(--line); border-radius:8px; padding:10px; margin:8px 0; }
          .ax-order.on { border-color:var(--accent); background:color-mix(in srgb,var(--accent) 6%,var(--panel)); }
          .ax-steps { color:var(--muted); font-size:11px; margin-bottom:12px; }
          .ax-review { display:grid; grid-template-columns:auto 1fr; gap:10px; margin:15px 0; }
          .ax-review dt { color:var(--muted); }
          .ax-review dd { margin:0; overflow-wrap:anywhere; }
          .ax-help { padding-top:12px; margin-top:15px; border-top:1px solid var(--line); font-size:11px; color:var(--muted); }
        `;
  env.template('use-shop/_base-style', () => ({ CSS, POLISH_CSS, SHOPPING_CSS }));
})();
