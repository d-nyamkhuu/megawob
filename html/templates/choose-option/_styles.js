/* choose-option/_styles: byte-identical CSS constants used by the choose-option templates. */
(function () {
  'use strict';
  env.template('choose-option/_styles', () => ({
    CSS: `
      .fp-wrap { position: absolute; inset: 0; }
      .fp-card {
        position: absolute; display: flex; flex-direction: column;
        background: var(--panel); border: 1px solid var(--line); border-radius: var(--fp-r);
        box-shadow: 0 1px 3px rgba(0,0,0,.07), 0 10px 28px rgba(0,0,0,.06);
        padding: 20px 26px 22px;
      }
      .fp-title { font-size: 19px; font-weight: 650; }
      .fp-note { margin-top: 3px; font-size: 13.5px; color: var(--muted); }
      .fp-field { position: relative; margin-top: 18px; }
      .fp-field + .fp-field { margin-top: 14px; }
      .fp-label { display: block; margin-bottom: 8px; font-size: 14px; font-weight: 600; }
      .fp-label.caps { font-size: 12px; letter-spacing: .07em; text-transform: uppercase; color: var(--muted); }
      .fp-status { margin-top: 10px; height: 20px; font-size: 13.5px; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .fp-status b { color: var(--fg); font-weight: 600; }
      .fp-ctl {
        display: flex; align-items: center; gap: 10px; height: 42px; padding: 0 12px;
        border: 1px solid color-mix(in srgb, var(--fg) 22%, var(--line)); border-radius: var(--fp-rc);
        background: var(--panel); color: var(--fg);
      }
      .fp-ctl:focus, .fp-ctl:focus-within { outline: none; border-color: var(--accent); box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 22%, transparent); }
      .fp-trigger { cursor: pointer; }
      .fp-trigger.disabled { pointer-events: none; opacity: .5; background: color-mix(in srgb, var(--fg) 4%, var(--panel)); }
      .fp-trigger .fp-val { flex: 1; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
      .fp-trigger .fp-val.empty { color: var(--muted); }
      .fp-chev { flex: none; width: 14px; height: 14px; color: var(--muted); }
      .fp-trigger.open .fp-chev { transform: rotate(180deg); }
      .fp-pop {
        position: absolute; left: 0; right: 0; z-index: 20; padding: 4px;
        background: var(--panel); border: 1px solid var(--line); border-radius: var(--fp-rc);
        box-shadow: 0 10px 28px rgba(0,0,0,.16), 0 2px 6px rgba(0,0,0,.08);
      }
      .fp-pop[hidden] { display: none; }
      .fp-pop.cols { display: grid; grid-auto-flow: column; column-gap: 4px; }
      .fp-opt {
        display: flex; align-items: center; gap: 8px; padding: 0 10px; border-radius: 5px; cursor: pointer;
        white-space: nowrap; overflow: hidden; min-width: 0;
      }
      .fp-opt > span { overflow: hidden; text-overflow: ellipsis; }
      .fp-opt:hover, .fp-opt.active { background: color-mix(in srgb, var(--accent) 12%, var(--panel)); }
      .fp-opt.sel { color: var(--accent); font-weight: 600; }
      .fp-opt.off { cursor: not-allowed; color: var(--muted); opacity: .6; }
      .fp-opt.off:hover { background: transparent; }
      .fp-badge { margin-left: auto; flex: none; padding: 1px 7px; border-radius: 9px; font-size: 11px; font-weight: 600;
        background: color-mix(in srgb, var(--fg) 8%, var(--panel)); color: var(--muted); }
      .fp-ghead { display: flex; align-items: flex-end; padding: 0 10px 4px; font-size: 11.5px; font-weight: 700;
        letter-spacing: .06em; text-transform: uppercase; color: var(--muted); white-space: nowrap; overflow: hidden; }
      .fp-msg { display: flex; align-items: center; gap: 8px; height: 34px; padding: 0 10px; color: var(--muted); font-size: 14px; }
      .fp-spin { width: 14px; height: 14px; border-radius: 50%; border: 2px solid var(--line); border-top-color: var(--accent); }
      .fp-tick { flex: none; width: 14px; height: 14px; visibility: hidden; }
      .fp-opt.sel .fp-tick { visibility: visible; }
      .fp-opt .fp-m { font-weight: 700; }
      .fp-input { flex: 1; min-width: 0; height: 100%; border: 0; outline: none; background: transparent; color: var(--fg);
        font: inherit; user-select: text; -webkit-user-select: text; }
      .fp-input::placeholder { color: var(--muted); }
      .fp-icon { flex: none; width: 16px; height: 16px; color: var(--muted); }
      .fp-ok { flex: none; width: 16px; height: 16px; color: #2f9e44; visibility: hidden; }
      .fp-ac.committed .fp-ok { visibility: visible; }
      .fp-group { display: grid; gap: 10px 18px; }
      .fp-choice { display: flex; align-items: center; gap: 10px; min-height: 26px; cursor: pointer; }
      .fp-choice input { flex: none; width: 18px; height: 18px; margin: 0; accent-color: var(--accent); cursor: pointer; }
      .fp-choice .fp-det { display: block; font-size: 12.5px; color: var(--muted); }
      .fp-group.tiles .fp-choice {
        padding: 9px 12px; border: 1px solid var(--line); border-radius: var(--fp-rc);
        background: color-mix(in srgb, var(--fg) 2%, var(--panel));
      }
      .fp-group.tiles .fp-choice.on { border-color: var(--accent); background: color-mix(in srgb, var(--accent) 8%, var(--panel)); }
      .fp-lb { display: flex; border: 1px solid color-mix(in srgb, var(--fg) 22%, var(--line)); border-radius: var(--fp-rc); overflow: hidden; background: var(--panel); }
      .fp-list { flex: 1; overflow-y: auto; overscroll-behavior: contain; scrollbar-width: none; }
      .fp-list::-webkit-scrollbar { display: none; }
      .fp-row { display: flex; align-items: center; gap: 10px; padding: 0 12px; cursor: pointer; white-space: nowrap;
        border-bottom: 1px solid color-mix(in srgb, var(--line) 55%, transparent); }
      .fp-row:hover { background: color-mix(in srgb, var(--accent) 8%, var(--panel)); }
      .fp-row.sel { background: color-mix(in srgb, var(--accent) 16%, var(--panel)); font-weight: 600; }
      .fp-row.single.sel { background: var(--accent); color: #fff; }
      .fp-box { flex: none; width: 15px; height: 15px; border-radius: 4px; border: 1.5px solid color-mix(in srgb, var(--fg) 40%, var(--line));
        display: flex; align-items: center; justify-content: center; }
      .fp-row.sel .fp-box { background: var(--accent); border-color: var(--accent); }
      .fp-box svg { width: 11px; height: 11px; visibility: hidden; }
      .fp-row.sel .fp-box svg { visibility: visible; }
      .fp-track { position: relative; flex: none; width: 14px; border-left: 1px solid var(--line);
        background: color-mix(in srgb, var(--fg) 4%, var(--panel)); cursor: pointer; touch-action: none; }
      .fp-thumb { position: absolute; left: 2px; right: 2px; border-radius: 5px; cursor: grab; touch-action: none;
        background: color-mix(in srgb, var(--fg) 32%, var(--panel)); }
      .fp-thumb:hover, .fp-thumb.dragging { background: color-mix(in srgb, var(--fg) 50%, var(--panel)); }
      .fp-gpop { display: flex; padding: 0; overflow: hidden; }
      .fp-glist { flex: 1; min-width: 0; overflow: hidden; }
      .fp-search { margin: 4px 4px 6px; height: 36px; }
      .fp-clist { overflow: hidden; }
      .fp-chipbox { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; min-height: 44px; padding: 5px 8px; cursor: text;
        border: 1px solid color-mix(in srgb, var(--fg) 22%, var(--line)); border-radius: var(--fp-rc); background: var(--panel); }
      .fp-chipbox.open { border-color: var(--accent); box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 22%, transparent); }
      .fp-chip { display: inline-flex; align-items: center; gap: 4px; height: 28px; padding: 0 4px 0 10px; border-radius: 14px; font-size: 13.5px;
        background: color-mix(in srgb, var(--accent) 14%, var(--panel)); color: var(--fg); white-space: nowrap; }
      .fp-chip.sq { border-radius: 5px; }
      .fp-x { display: grid; place-items: center; width: 20px; height: 20px; border-radius: 50%; cursor: pointer; font-size: 15px; line-height: 1; color: var(--muted); }
      .fp-x:hover { background: color-mix(in srgb, var(--fg) 14%, transparent); color: var(--fg); }
      .fp-chipin { flex: 1; min-width: 90px; height: 30px; border: 0; outline: none; background: transparent; color: var(--fg); font: inherit; }
      .fp-chippop { display: grid; grid-auto-flow: column; column-gap: 4px; }
      .fp-trows { display: grid; column-gap: 28px; }
      .fp-trow { display: flex; align-items: center; gap: 14px; padding: 9px 0; border-bottom: 1px solid color-mix(in srgb, var(--line) 70%, transparent); }
      .fp-ttext { flex: 1; min-width: 0; }
      .fp-tl { font-size: 14.5px; font-weight: 600; }
      .fp-td { font-size: 12.5px; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .fp-switch { flex: none; position: relative; width: 42px; height: 24px; margin: 0; border-radius: 12px; cursor: pointer;
        appearance: none; -webkit-appearance: none; border: 0; padding: 0;
        background: color-mix(in srgb, var(--fg) 25%, var(--line)); transition: none; }
      .fp-switch::after { content: ''; position: absolute; top: 3px; left: 3px; width: 18px; height: 18px; border-radius: 50%; background: #fff;
        box-shadow: 0 1px 2px rgba(0,0,0,.3); }
      .fp-switch:checked, .fp-switch[aria-checked="true"] { background: var(--accent); }
      .fp-switch:checked::after, .fp-switch[aria-checked="true"]::after { left: 21px; }
      .fp-switch.sq { border-radius: 5px; }
      .fp-switch.sq::after { border-radius: 3px; }
      .fp-onoff { flex: none; width: 34px; font-size: 12px; font-weight: 700; color: var(--muted); text-align: right; }
      .fp-tgroups { display: grid; column-gap: 26px; align-items: start; }
      .fp-tg { min-width: 0; }
      .fp-thead { display: flex; align-items: center; gap: 10px; padding: 8px 0 6px; border-bottom: 1px solid var(--line); font-weight: 650; }
      .fp-thead input, .fp-tkid input { flex: none; width: 17px; height: 17px; margin: 0; accent-color: var(--accent); cursor: pointer; }
      .fp-tcount { margin-left: auto; font-size: 12px; font-weight: 500; color: var(--muted); white-space: nowrap; }
      .fp-links { margin-left: auto; display: flex; gap: 10px; font-size: 13px; font-weight: 500; }
      .fp-link { color: var(--accent); cursor: pointer; text-decoration: underline; text-underline-offset: 2px; }
      .fp-tkid { display: flex; align-items: center; gap: 10px; height: var(--fp-kid); padding-left: 26px; font-size: 14px; cursor: pointer; white-space: nowrap; }
      .fp-tkid span { overflow: hidden; text-overflow: ellipsis; }
      .fp-card.compact { padding-top: 14px; padding-bottom: 14px; }
      .fp-card.compact .fp-note { display: none; }
      .fp-card.compact .fp-field { margin-top: 10px; }
      .fp-card.compact .fp-trow { padding: 5px 0; }
      .fp-card.compact .fp-td { display: none; }
      .fp-card.compact .fp-group.tiles .fp-choice { padding: 6px 10px; }
      `,
    CSS3: `
      .fp-more { border: 1px dashed color-mix(in srgb, var(--fg) 35%, var(--line)); background: transparent; color: var(--fg); padding: 0 10px;
        font: inherit; font-size: 13px; cursor: pointer; }
      .fp-more:hover { background: color-mix(in srgb, var(--accent) 10%, transparent); }
      .fp-clr { flex: none; }
      .fp-tags .fp-chipbox { align-content: flex-start; }
      .s2.fp-card { border-radius: 4px; padding: 22px 26px 24px; box-shadow: 0 1px 2px rgba(0,0,0,.12); }
      .s2 .fp-title { font-size: 17px; font-weight: 600; }
      .s2 .fp-label { font-size: 13px; font-weight: 700; margin-bottom: 5px; }
      .s2 .fp-ctl { height: 34px; border-radius: 4px; padding: 0 6px 0 9px; }
      .s2 .fp-pop { padding: 0; border-radius: 0 0 4px 4px; box-shadow: 0 6px 12px rgba(0,0,0,.14); top: calc(100% - 1px) !important;
        border-color: color-mix(in srgb, var(--accent) 55%, var(--line)); }
      .s2 .fp-opt { border-radius: 0; padding: 0 9px; }
      .s2 .fp-opt:hover { background: transparent; }
      .s2 .fp-opt.active, .s2 .fp-opt.active:hover { background: var(--accent); color: #fff; }
      .s2 .fp-opt.sel { background: color-mix(in srgb, var(--fg) 10%, var(--panel)); font-weight: 400; color: var(--fg); }
      .s2 .fp-opt .fp-tick { display: none; }
      .s2 .fp-search { margin: 6px; height: 30px; padding: 0 6px; }
      .s2 .fp-chipbox { min-height: 34px; padding: 3px 5px; border-radius: 4px; gap: 4px; }
      .s2 .fp-chip { height: 24px; border-radius: 3px; padding: 0 7px 0 3px; flex-direction: row-reverse; gap: 5px; font-size: 13px;
        border: 1px solid color-mix(in srgb, var(--fg) 18%, var(--line)); background: color-mix(in srgb, var(--fg) 7%, var(--panel)); }
      .s2 .fp-x { width: 16px; height: 16px; border-radius: 2px; font-size: 14px; font-weight: 700; }
      .s2 .fp-chipin { height: 24px; min-width: 80px; }
      .s2 .fp-more { height: 24px; border-radius: 3px; padding: 0 8px; }
      .s2 .fp-chippop .fp-opt { height: 28px !important; }
      .dn-card { position: absolute; display: flex; flex-direction: column; background: var(--panel); border: 1px solid color-mix(in srgb, var(--fg) 28%, var(--line));
        border-radius: 2px; font-size: 12.5px; user-select: none; }
      .dn-bar { display: flex; align-items: center; gap: 10px; padding: 7px 12px; font-size: 13px; font-weight: 700;
        background: color-mix(in srgb, var(--accent) 14%, var(--panel)); border-bottom: 1px solid color-mix(in srgb, var(--fg) 20%, var(--line)); }
      .dn-bar .n { margin-left: auto; font-weight: 500; color: var(--muted); font-size: 12px; }
      .dn-body { padding: 8px 12px 10px; }
      .dn-sub { font-size: 12px; color: var(--muted); }
      .dn-lab { display: flex; align-items: center; margin: 8px 0 5px; font-size: 11.5px; font-weight: 700; letter-spacing: .05em; text-transform: uppercase; color: var(--muted); }
      .dn-lab .dn-link { margin-left: auto; text-transform: none; letter-spacing: 0; font-weight: 500; font-size: 12px; color: var(--accent); cursor: pointer; text-decoration: underline; }
      .dn-grid { display: grid; border-top: 1px solid var(--line); border-left: 1px solid var(--line); }
      .dn-cell { display: flex; align-items: center; gap: 6px; height: var(--dn-row); padding: 0 6px; cursor: pointer; white-space: nowrap; min-width: 0;
        border-right: 1px solid var(--line); border-bottom: 1px solid var(--line); }
      .dn-cell:hover { background: color-mix(in srgb, var(--accent) 8%, transparent); }
      .dn-cell.on { background: color-mix(in srgb, var(--accent) 13%, var(--panel)); }
      .dn-cell input { flex: none; width: 13px; height: 13px; margin: 0; accent-color: var(--accent); cursor: pointer; }
      .dn-cell > span { overflow: hidden; text-overflow: ellipsis; min-width: 0; }
      .dn-cell .fp-det { margin-left: auto; padding-left: 10px; flex: none; font-size: 12px; color: var(--muted); }
      .dn-foot { margin-top: 7px; font-size: 12px; color: var(--muted); height: 16px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      `,
    CSS_MX: `
      .fp-mx { width: 100%; border-collapse: collapse; margin-top: 4px; }
      .fp-mx th, .fp-mx td { padding: 0; text-align: center; }
      .fp-mx thead th { padding: 6px 4px 8px; font-size: 12px; font-weight: 600; color: var(--muted); line-height: 1.2; vertical-align: bottom; }
      .fp-mx th.r { text-align: left; padding: 0 12px 0 10px; font-size: 14px; font-weight: 500; }
      .fp-mx tbody tr:nth-child(odd) { background: color-mix(in srgb, var(--fg) 4%, var(--panel)); }
      .fp-mx tbody tr { height: var(--fp-mxh, 44px); }
      .fp-mx label { display: flex; align-items: center; justify-content: center; height: var(--fp-mxh, 44px); cursor: pointer; }
      .fp-mx input { width: 17px; height: 17px; margin: 0; accent-color: var(--accent); cursor: pointer; }
      `,
    CSS2: `
      .fs-wrap { position: absolute; inset: 0; }
      .fs-panel {
        position: absolute; display: flex; flex-direction: column; background: var(--panel);
        border: 2px solid var(--fg); box-shadow: 6px 6px 0 color-mix(in srgb, var(--fg) 80%, transparent);
        font-family: "DejaVu Sans", Verdana, sans-serif;
      }
      .fs-head { display: flex; align-items: baseline; justify-content: space-between; gap: 18px; padding: 11px 18px;
        background: var(--fg); color: var(--panel); }
      .fs-head b { font-size: 16px; letter-spacing: .02em; white-space: nowrap; }
      .fs-head span { font-size: 12px; opacity: .78; text-align: right; }
      .fs-body { display: grid; grid-template-columns: var(--fs-lab) minmax(0, 1fr); column-gap: 20px; padding: 22px 18px 20px; }
      .fs-lab { padding-top: 10px; font-size: 11px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--muted); }
      .fs-foot { height: 34px; padding: 8px 18px; border-top: 2px dashed var(--line); color: var(--muted);
        font: 12.5px "DejaVu Sans Mono", "Liberation Mono", monospace; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .fs-foot b { color: var(--fg); font-weight: 700; }

      .fs-seg { display: flex; flex-wrap: wrap; gap: 2px; background: var(--accent); border: 2px solid var(--accent); border-radius: 10px; overflow: hidden; }
      .fs-segbtn { flex: 1 1 auto; padding: 10px 16px; text-align: center; white-space: nowrap; cursor: pointer; font-size: 14px;
        color: var(--accent); background: var(--panel); user-select: none; }
      .fs-segbtn small { display: block; font-size: 11px; opacity: .75; }
      .fs-segbtn:hover { background: color-mix(in srgb, var(--accent) 10%, var(--panel)); }
      .fs-segbtn[aria-checked="true"] { background: var(--accent); color: #fff; font-weight: 700; }

      .fs-chips { display: flex; flex-wrap: wrap; gap: 9px 8px; }
      .fs-chip { display: inline-flex; align-items: center; gap: 6px; padding: 7px 14px 7px 10px; border-radius: 999px; cursor: pointer;
        border: 1.5px solid color-mix(in srgb, var(--fg) 30%, var(--line)); font-size: 13.5px; white-space: nowrap; user-select: none; }
      .fs-chip::before { content: "+"; width: 12px; text-align: center; font-weight: 700; color: var(--muted); }
      .fs-chip[aria-checked="true"] { border-color: var(--accent); color: var(--accent); font-weight: 600;
        background: color-mix(in srgb, var(--accent) 13%, var(--panel)); }
      .fs-chip[aria-checked="true"]::before { content: "\\2713"; color: var(--accent); }

      .fs-picker { display: flex; align-items: center; justify-content: space-between; gap: 12px; height: 46px; padding: 0 14px;
        border: 2px solid var(--fg); background: var(--panel); cursor: pointer; font-size: 15px; }
      .fs-picker:focus { outline: 3px solid color-mix(in srgb, var(--accent) 40%, transparent); }
      .fs-picker .ph { color: var(--muted); font-style: italic; }
      .fs-picker .go { font-size: 22px; line-height: 1; color: var(--muted); }
      .fs-scrim { position: absolute; inset: 0; z-index: 40; background: rgba(10, 12, 16, .45); }
      .fs-sheet { position: absolute; left: 50%; bottom: 0; z-index: 41; transform: translateX(-50%); width: min(760px, calc(100% - 32px));
        padding: 10px 20px 20px; background: var(--panel); border-radius: 18px 18px 0 0; box-shadow: 0 -10px 30px rgba(0,0,0,.28); }
      .fs-scrim[hidden], .fs-sheet[hidden], .fs-sugg[hidden] { display: none; }
      .fs-grab { width: 46px; height: 5px; margin: 0 auto 12px; border-radius: 3px; background: var(--line); }
      .fs-sheet h3 { margin: 0 0 12px; font-size: 15px; }
      .fs-tiles { display: grid; gap: 8px; }
      .fs-tile { padding: 11px 12px; border: 1.5px solid var(--line); border-radius: 10px; cursor: pointer; font-size: 14px;
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .fs-tile:hover, .fs-tile.active { border-color: color-mix(in srgb, var(--accent) 60%, var(--line)); }
      .fs-tile.sel { border-color: var(--accent); color: var(--accent); font-weight: 700; background: color-mix(in srgb, var(--accent) 8%, var(--panel)); }

      .fs-cmdbox { position: relative; }
      .fs-cmd { display: flex; align-items: center; gap: 10px; height: 44px; padding: 0 12px; border: 2px solid var(--fg); background: var(--panel); }
      .fs-cmd .pr { font: 700 15px "DejaVu Sans Mono", monospace; color: var(--accent); }
      .fs-cmd input { flex: 1; min-width: 0; height: 100%; border: 0; outline: none; background: transparent; color: var(--fg);
        font: 15px "DejaVu Sans Mono", "Liberation Mono", monospace; user-select: text; -webkit-user-select: text; }
      .fs-cmd input::placeholder { color: var(--muted); }
      .fs-cmd .ok { font: 700 11px "DejaVu Sans Mono", monospace; color: #2f9e44; visibility: hidden; }
      .fs-cmdbox.committed .ok { visibility: visible; }
      .fs-sugg { position: absolute; left: 0; right: 0; z-index: 20; padding: 3px 0; background: var(--panel); border: 2px solid var(--fg);
        box-shadow: 4px 4px 0 color-mix(in srgb, var(--fg) 75%, transparent); }
      .fs-sugg.up { bottom: calc(100% + 6px); }
      .fs-sugg.down { top: calc(100% + 6px); }
      .fs-sg { display: flex; align-items: center; justify-content: space-between; height: 30px; padding: 0 12px; cursor: pointer;
        font: 14px "DejaVu Sans Mono", "Liberation Mono", monospace; white-space: nowrap; }
      .fs-sg u { text-decoration-thickness: 2px; text-decoration-color: var(--accent); }
      .fs-sg .k { font-size: 11px; opacity: .55; }
      .fs-sg:hover, .fs-sg.active { background: var(--accent); color: #fff; }
      .fs-sgmsg { height: 30px; padding: 0 12px; display: flex; align-items: center; font: italic 13px "DejaVu Sans Mono", monospace; color: var(--muted); }

      .fs-tbl { display: flex; flex-direction: column; border: 2px solid var(--fg); background: var(--panel); }
      .fs-rail { position: relative; flex: none; width: 12px; border-right: 2px solid var(--fg); cursor: pointer; touch-action: none;
        background: repeating-linear-gradient(0deg, color-mix(in srgb, var(--fg) 10%, var(--panel)) 0 2px, var(--panel) 2px 6px); }
      .fs-knob { position: absolute; left: 2px; right: 2px; border-radius: 2px; background: var(--accent); cursor: grab; touch-action: none; }
      .fs-knob.dragging { background: var(--fg); }
      .fs-tmain { display: flex; }
      .fs-thead, .fs-tr { display: grid; grid-template-columns: 30px minmax(0, 1fr) 54px; align-items: center; column-gap: 8px; padding: 0 10px; }
      .fs-thead { height: 26px; padding-left: 24px; border-bottom: 2px solid var(--fg); font-size: 10.5px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--muted); }
      .fs-tbody { flex: 1; min-width: 0; overflow-y: auto; overscroll-behavior: contain; scrollbar-width: none; }
      .fs-tbody::-webkit-scrollbar { display: none; }
      .fs-tr { font-size: 13.5px; cursor: pointer; white-space: nowrap; }
      .fs-tr:nth-child(even) { background: color-mix(in srgb, var(--fg) 5%, var(--panel)); }
      .fs-tr .n, .fs-tr .c, .fs-thead .c { font: 11.5px "DejaVu Sans Mono", monospace; color: var(--muted); }
      .fs-tr .c, .fs-thead .c { text-align: right; }
      .fs-tr .nm { overflow: hidden; text-overflow: ellipsis; }
      .fs-tr:hover { background: color-mix(in srgb, var(--accent) 9%, var(--panel)); }
      .fs-tr.sel { background: color-mix(in srgb, var(--accent) 22%, var(--panel)); font-weight: 700; box-shadow: inset 4px 0 0 var(--accent); }
      .fs-tr.sel .n { color: var(--accent); }
      `,
    WIDGET_CSS: `
  .fp-wrap { position: absolute; inset: 0; }
  .fp-card {
    position: absolute; display: flex; flex-direction: column;
    background: var(--panel); border: 1px solid var(--line); border-radius: var(--fp-r);
    box-shadow: 0 1px 3px rgba(0,0,0,.07), 0 10px 28px rgba(0,0,0,.06);
    padding: 20px 26px 22px;
  }
  .fp-title { font-size: 19px; font-weight: 650; }
  .fp-note { margin-top: 3px; font-size: 13.5px; color: var(--muted); }
  .fp-field { position: relative; margin-top: 18px; }
  .fp-field + .fp-field { margin-top: 14px; }
  .fp-label { display: block; margin-bottom: 8px; font-size: 14px; font-weight: 600; }
  .fp-label.caps { font-size: 12px; letter-spacing: .07em; text-transform: uppercase; color: var(--muted); }
  .fp-status { margin-top: 10px; height: 20px; font-size: 13.5px; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .fp-status b { color: var(--fg); font-weight: 600; }
  .fp-ctl {
    display: flex; align-items: center; gap: 10px; height: 42px; padding: 0 12px;
    border: 1px solid color-mix(in srgb, var(--fg) 22%, var(--line)); border-radius: var(--fp-rc);
    background: var(--panel); color: var(--fg);
  }
  .fp-ctl:focus, .fp-ctl:focus-within { outline: none; border-color: var(--accent); box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 22%, transparent); }
  .fp-trigger { cursor: pointer; }
  .fp-trigger.disabled { pointer-events: none; opacity: .5; background: color-mix(in srgb, var(--fg) 4%, var(--panel)); }
  .fp-trigger .fp-val { flex: 1; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
  .fp-trigger .fp-val.empty { color: var(--muted); }
  .fp-chev { flex: none; width: 14px; height: 14px; color: var(--muted); }
  .fp-trigger.open .fp-chev { transform: rotate(180deg); }
  .fp-pop {
    position: absolute; left: 0; right: 0; z-index: 20; padding: 4px;
    background: var(--panel); border: 1px solid var(--line); border-radius: var(--fp-rc);
    box-shadow: 0 10px 28px rgba(0,0,0,.16), 0 2px 6px rgba(0,0,0,.08);
  }
  .fp-pop[hidden] { display: none; }
  .fp-pop.cols { display: grid; grid-auto-flow: column; column-gap: 4px; }
  .fp-opt {
    display: flex; align-items: center; gap: 8px; padding: 0 10px; border-radius: 5px; cursor: pointer;
    white-space: nowrap; overflow: hidden; min-width: 0;
  }
  .fp-opt > span { overflow: hidden; text-overflow: ellipsis; }
  .fp-opt:hover, .fp-opt.active { background: color-mix(in srgb, var(--accent) 12%, var(--panel)); }
  .fp-opt.sel { color: var(--accent); font-weight: 600; }
  .fp-opt.off { cursor: not-allowed; color: var(--muted); opacity: .6; }
  .fp-opt.off:hover { background: transparent; }
  .fp-badge { margin-left: auto; flex: none; padding: 1px 7px; border-radius: 9px; font-size: 11px; font-weight: 600;
    background: color-mix(in srgb, var(--fg) 8%, var(--panel)); color: var(--muted); }
  .fp-ghead { display: flex; align-items: flex-end; padding: 0 10px 4px; font-size: 11.5px; font-weight: 700;
    letter-spacing: .06em; text-transform: uppercase; color: var(--muted); white-space: nowrap; overflow: hidden; }
  .fp-msg { display: flex; align-items: center; gap: 8px; height: 34px; padding: 0 10px; color: var(--muted); font-size: 14px; }
  .fp-spin { width: 14px; height: 14px; border-radius: 50%; border: 2px solid var(--line); border-top-color: var(--accent); }
  .fp-tick { flex: none; width: 14px; height: 14px; visibility: hidden; }
  .fp-opt.sel .fp-tick { visibility: visible; }
  .fp-opt .fp-m { font-weight: 700; }
  .fp-input { flex: 1; min-width: 0; height: 100%; border: 0; outline: none; background: transparent; color: var(--fg);
    font: inherit; user-select: text; -webkit-user-select: text; }
  .fp-input::placeholder { color: var(--muted); }
  .fp-icon { flex: none; width: 16px; height: 16px; color: var(--muted); }
  .fp-ok { flex: none; width: 16px; height: 16px; color: #2f9e44; visibility: hidden; }
  .fp-ac.committed .fp-ok { visibility: visible; }
  .fp-group { display: grid; gap: 10px 18px; }
  .fp-choice { display: flex; align-items: center; gap: 10px; min-height: 26px; cursor: pointer; }
  .fp-choice input { flex: none; width: 18px; height: 18px; margin: 0; accent-color: var(--accent); cursor: pointer; }
  .fp-choice .fp-det { display: block; font-size: 12.5px; color: var(--muted); }
  .fp-group.tiles .fp-choice {
    padding: 9px 12px; border: 1px solid var(--line); border-radius: var(--fp-rc);
    background: color-mix(in srgb, var(--fg) 2%, var(--panel));
  }
  .fp-group.tiles .fp-choice.on { border-color: var(--accent); background: color-mix(in srgb, var(--accent) 8%, var(--panel)); }
  .fp-lb { display: flex; border: 1px solid color-mix(in srgb, var(--fg) 22%, var(--line)); border-radius: var(--fp-rc); overflow: hidden; background: var(--panel); }
  .fp-list { flex: 1; overflow-y: auto; overscroll-behavior: contain; scrollbar-width: none; }
  .fp-list::-webkit-scrollbar { display: none; }
  .fp-row { display: flex; align-items: center; gap: 10px; padding: 0 12px; cursor: pointer; white-space: nowrap;
    border-bottom: 1px solid color-mix(in srgb, var(--line) 55%, transparent); }
  .fp-row:hover { background: color-mix(in srgb, var(--accent) 8%, var(--panel)); }
  .fp-row.sel { background: color-mix(in srgb, var(--accent) 16%, var(--panel)); font-weight: 600; }
  .fp-row.single.sel { background: var(--accent); color: #fff; }
  .fp-box { flex: none; width: 15px; height: 15px; border-radius: 4px; border: 1.5px solid color-mix(in srgb, var(--fg) 40%, var(--line));
    display: flex; align-items: center; justify-content: center; }
  .fp-row.sel .fp-box { background: var(--accent); border-color: var(--accent); }
  .fp-box svg { width: 11px; height: 11px; visibility: hidden; }
  .fp-row.sel .fp-box svg { visibility: visible; }
  .fp-track { position: relative; flex: none; width: 14px; border-left: 1px solid var(--line);
    background: color-mix(in srgb, var(--fg) 4%, var(--panel)); cursor: pointer; touch-action: none; }
  .fp-thumb { position: absolute; left: 2px; right: 2px; border-radius: 5px; cursor: grab; touch-action: none;
    background: color-mix(in srgb, var(--fg) 32%, var(--panel)); }
  .fp-thumb:hover, .fp-thumb.dragging { background: color-mix(in srgb, var(--fg) 50%, var(--panel)); }
  .fp-gpop { display: flex; padding: 0; overflow: hidden; }
  .fp-glist { flex: 1; min-width: 0; overflow: hidden; }
  .fp-search { margin: 4px 4px 6px; height: 36px; }
  .fp-clist { overflow: hidden; }
  .fp-chipbox { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; min-height: 44px; padding: 5px 8px; cursor: text;
    border: 1px solid color-mix(in srgb, var(--fg) 22%, var(--line)); border-radius: var(--fp-rc); background: var(--panel); }
  .fp-chipbox.open { border-color: var(--accent); box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 22%, transparent); }
  .fp-chip { display: inline-flex; align-items: center; gap: 4px; height: 28px; padding: 0 4px 0 10px; border-radius: 14px; font-size: 13.5px;
    background: color-mix(in srgb, var(--accent) 14%, var(--panel)); color: var(--fg); white-space: nowrap; }
  .fp-chip.sq { border-radius: 5px; }
  .fp-x { display: grid; place-items: center; width: 20px; height: 20px; border-radius: 50%; cursor: pointer; font-size: 15px; line-height: 1; color: var(--muted); }
  .fp-x:hover { background: color-mix(in srgb, var(--fg) 14%, transparent); color: var(--fg); }
  .fp-chipin { flex: 1; min-width: 90px; height: 30px; border: 0; outline: none; background: transparent; color: var(--fg); font: inherit; }
  .fp-chippop { display: grid; grid-auto-flow: column; column-gap: 4px; }
  .fp-trows { display: grid; column-gap: 28px; }
  .fp-trow { display: flex; align-items: center; gap: 14px; padding: 9px 0; border-bottom: 1px solid color-mix(in srgb, var(--line) 70%, transparent); }
  .fp-ttext { flex: 1; min-width: 0; }
  .fp-tl { font-size: 14.5px; font-weight: 600; }
  .fp-td { font-size: 12.5px; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .fp-switch { flex: none; position: relative; width: 42px; height: 24px; margin: 0; border-radius: 12px; cursor: pointer;
    appearance: none; -webkit-appearance: none; border: 0; padding: 0;
    background: color-mix(in srgb, var(--fg) 25%, var(--line)); transition: none; }
  .fp-switch::after { content: ''; position: absolute; top: 3px; left: 3px; width: 18px; height: 18px; border-radius: 50%; background: #fff;
    box-shadow: 0 1px 2px rgba(0,0,0,.3); }
  .fp-switch:checked, .fp-switch[aria-checked="true"] { background: var(--accent); }
  .fp-switch:checked::after, .fp-switch[aria-checked="true"]::after { left: 21px; }
  .fp-switch.sq { border-radius: 5px; }
  .fp-switch.sq::after { border-radius: 3px; }
  .fp-onoff { flex: none; width: 34px; font-size: 12px; font-weight: 700; color: var(--muted); text-align: right; }
  .fp-tgroups { display: grid; column-gap: 26px; align-items: start; }
  .fp-tg { min-width: 0; }
  .fp-thead { display: flex; align-items: center; gap: 10px; padding: 8px 0 6px; border-bottom: 1px solid var(--line); font-weight: 650; }
  .fp-thead input, .fp-tkid input { flex: none; width: 17px; height: 17px; margin: 0; accent-color: var(--accent); cursor: pointer; }
  .fp-tcount { margin-left: auto; font-size: 12px; font-weight: 500; color: var(--muted); white-space: nowrap; }
  .fp-links { margin-left: auto; display: flex; gap: 10px; font-size: 13px; font-weight: 500; }
  .fp-link { color: var(--accent); cursor: pointer; text-decoration: underline; text-underline-offset: 2px; }
  .fp-tkid { display: flex; align-items: center; gap: 10px; height: var(--fp-kid); padding-left: 26px; font-size: 14px; cursor: pointer; white-space: nowrap; }
  .fp-tkid span { overflow: hidden; text-overflow: ellipsis; }
  .fp-card.compact { padding-top: 14px; padding-bottom: 14px; }
  .fp-card.compact .fp-note { display: none; }
  .fp-card.compact .fp-field { margin-top: 10px; }
  .fp-card.compact .fp-trow { padding: 5px 0; }
  .fp-card.compact .fp-td { display: none; }
  .fp-card.compact .fp-group.tiles .fp-choice { padding: 6px 10px; }
  `
  }));
})();
