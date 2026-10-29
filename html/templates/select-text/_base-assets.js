// select-text/base: byte-identical style strings and content defaults; reference.js keeps their part hooks.
(function () {
  'use strict';
  env.template('select-text/_base-assets', () => ({
    CSS: `
      .hl-card {
        position: relative; display: flex; flex-direction: column;
        background: var(--panel); border: 1px solid var(--line); border-radius: 10px;
        box-shadow: 0 1px 3px rgba(0,0,0,.07), 0 8px 24px rgba(0,0,0,.05);
      }
      .hl-head {
        display: flex; align-items: baseline; gap: 12px; padding: 16px 30px 12px;
        border-bottom: 1px solid var(--line);
      }
      .hl-kicker { white-space: nowrap; font-size: 12px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--accent); }
      .hl-title { font-size: 17px; font-weight: 600; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .hl-meta { margin-left: auto; font-size: 12px; color: var(--muted); white-space: nowrap; }
      .hl-text {
        padding: 18px 30px 22px;
        user-select: text; -webkit-user-select: text; -webkit-user-drag: none;
        cursor: text; counter-reset: hl-par;
      }
      .hl-text p { margin: 0; counter-increment: hl-par; position: relative; }
      .hl-text p + p { margin-top: var(--hl-gap); }
      .hl-text.serif { font-family: Georgia, "Liberation Serif", "DejaVu Serif", serif; }
      .hl-text.indent p + p { text-indent: 1.6em; }
      .hl-text.numbered p::before {
        content: counter(hl-par); position: absolute; left: -26px; top: 0; width: 16px; text-align: right;
        font-family: system-ui, sans-serif; font-size: 12px; font-weight: 600; line-height: var(--hl-lh); color: var(--muted);
      }
      .hl-text.pilcrow p::before {
        content: "\\00B6" counter(hl-par); position: absolute; left: -30px; top: 0;
        font-family: system-ui, sans-serif; font-size: 11px; line-height: var(--hl-lh); color: var(--muted); opacity: .8;
      }
      .hl-text ::selection { background: var(--hl-sel); color: inherit; }
      .hl-foot { padding: 0 30px 14px; font-size: 12px; color: var(--muted); }
      .hl-link { color: var(--accent); text-decoration: underline; text-underline-offset: 2px; -webkit-user-drag: none; }
      .hl-text strong { font-weight: 700; }
      .hl-tip { text-decoration: underline dotted; text-underline-offset: 4px; text-decoration-thickness: 1.5px; cursor: help; }
      .hl-tipbox { position: absolute; z-index: 6; display: none; max-width: 260px; padding: 5px 10px; border-radius: 6px; background: #23262e;
        color: #f4f5f8; font: 600 12.5px/1.3 system-ui, sans-serif; white-space: nowrap; box-shadow: 0 6px 18px rgba(0,0,0,.25); pointer-events: none; }
      .hl-panerow { display: flex; gap: 6px; padding-right: 8px; border-bottom: 1px solid var(--line); }
      .hl-pane { flex: 1; overflow: hidden; position: relative; }
      .hl-bar { flex: none; position: relative; width: 12px; margin: 8px 0; border-radius: 6px; background: color-mix(in srgb, var(--line) 70%, transparent); }
      .hl-thumb { position: absolute; left: 1px; width: 10px; border-radius: 5px; background: color-mix(in srgb, var(--muted) 65%, var(--panel)); cursor: grab; }
      .hl-thumb:hover, .hl-thumb.on { background: var(--accent); }
      `,
    KICKERS: ['Reading passage', 'Field notes', 'Archive entry', 'Travel journal', 'Excerpt', 'Story draft'],
    TITLES: ['Places along the coast', 'A walk through town', 'Notes from the valley',
        'Things we saw that year', 'Letters from the north', 'An ordinary week'],
    CODE_CSS: `
      .cd-win {
        display: flex; flex-direction: column; overflow: hidden;
        background: var(--cd-bg); color: var(--cd-fg);
        border: 1px solid var(--cd-edge); border-radius: var(--cd-radius);
        box-shadow: 0 10px 30px rgba(0,0,0,.18), 0 2px 6px rgba(0,0,0,.08);
      }
      .cd-title {
        display: flex; align-items: center; gap: 8px; height: 30px; padding: 0 12px;
        background: var(--cd-chrome); color: var(--cd-dim);
        font: 12px system-ui, sans-serif; border-bottom: 1px solid var(--cd-edge);
      }
      .cd-dot { width: 11px; height: 11px; border-radius: 50%; }
      .cd-title-text { flex: 1; text-align: center; margin-right: 52px; }
      .cd-tabs { display: flex; background: var(--cd-chrome); border-bottom: 1px solid var(--cd-edge); }
      .cd-tab {
        display: flex; align-items: center; gap: 8px; padding: 7px 16px;
        font: 12.5px system-ui, sans-serif; color: var(--cd-dim); border-right: 1px solid var(--cd-edge);
      }
      .cd-tab.on { background: var(--cd-bg); color: var(--cd-fg); box-shadow: inset 0 2px 0 var(--cd-accent); margin-bottom: -1px; }
      .cd-tab .x { opacity: .55; font-size: 11px; }
      .cd-body {
        position: relative; padding: 10px 0 14px;
        font-family: var(--cd-font); font-size: var(--cd-fs); line-height: var(--cd-lh);
        background-image: linear-gradient(var(--cd-ruler), var(--cd-ruler));
        background-repeat: no-repeat; background-size: 1px 100%;
        background-position: calc(12px + var(--cd-gutter) + 14px + var(--cd-cols) * 1ch + 4px) 0;
      }
      .cd-text {
        font-variant-ligatures: none; tab-size: 4;
        user-select: text; -webkit-user-select: text; -webkit-user-drag: none; cursor: text;
      }
      .cd-line { display: grid; grid-template-columns: var(--cd-gutter) calc(var(--cd-cols) * 1ch); column-gap: 14px; padding: 0 18px 0 12px; }
      .cd-line.cur { background: var(--cd-curline); }
      .cd-ln { text-align: right; color: var(--cd-dim); opacity: .8; padding-right: 2px; cursor: default; }
      .cd-line.cur .cd-ln { color: var(--cd-fg); opacity: 1; }
      .cd-src { white-space: pre-wrap; overflow-wrap: anywhere; min-height: calc(var(--cd-fs) * var(--cd-lh)); }
      .cd-win.hang .cd-src { padding-left: 2ch; text-indent: -2ch; }
      .cd-text ::selection { background: var(--cd-sel); color: inherit; }
      .cd-status {
        display: flex; gap: 18px; align-items: center; height: 24px; padding: 0 12px; white-space: nowrap; overflow: hidden;
        background: var(--cd-statusbg); color: var(--cd-statusfg); font: 11.5px system-ui, sans-serif;
      }
      .cd-status .grow { flex: 1; }
      .cd-status .sel { min-width: 90px; }
      `,
    THEMES: {
        light: { bg: '#ffffff', fg: '#24292f', dim: '#6e7781', chrome: '#f3f4f6', edge: '#d0d7de', curline: '#f6f8fa',
          sel: '#b6d6fd', ruler: '#eaeef2', accent: '#0969da', statusbg: '#0969da', statusfg: '#ffffff', dots: ['#d0d7de', '#d0d7de', '#d0d7de'] },
        dark: { bg: '#1e1e1e', fg: '#d4d4d4', dim: '#858585', chrome: '#252526', edge: '#3c3c3c', curline: '#2a2d2e',
          sel: '#264f78', ruler: '#333333', accent: '#3794ff', statusbg: '#007acc', statusfg: '#ffffff', dots: ['#ff5f57', '#febc2e', '#28c840'] },
        sepia: { bg: '#fdf6e3', fg: '#586e75', dim: '#93a1a1', chrome: '#eee8d5', edge: '#d9cfb2', curline: '#f5eedb',
          sel: '#e0d4a8', ruler: '#ece3c8', accent: '#b58900', statusbg: '#eee8d5', statusfg: '#657b83', dots: ['#dc322f', '#b58900', '#859900'] },
        night: { bg: '#0f172a', fg: '#cbd5e1', dim: '#64748b', chrome: '#111c33', edge: '#1e293b', curline: '#16213a',
          sel: '#334d80', ruler: '#1c2840', accent: '#38bdf8', statusbg: '#1e293b', statusfg: '#94a3b8', dots: ['#475569', '#475569', '#475569'] },
      },
    FONTS: ['"DejaVu Sans Mono", "Liberation Mono", monospace', '"Liberation Mono", "Courier New", monospace',
        '"Nimbus Mono PS", "Courier New", "Liberation Mono", monospace'],
    FILES: ['notes.txt', 'draft.md', 'journal.txt', 'chapter-2.txt', 'field-notes.md', 'README.txt', 'letters.txt'],
    CSS3: `
      .hl-split { display: flex; align-items: stretch; }
      .hl-main { flex: 1; min-width: 0; display: flex; flex-direction: column; }
      .hl-main .hl-panerow { border-bottom: 0; }
      .hl-card.legal { border-radius: 4px; }
      .hl-card.legal .hl-head { padding: 14px 28px 10px; }
      .tm-toc { flex: none; width: 190px; padding: 16px 14px 16px 22px; border-right: 1px solid var(--line); font-size: 12.5px; color: var(--muted); }
      .tm-toc b { display: block; margin-bottom: 8px; font-size: 11px; letter-spacing: .08em; text-transform: uppercase; }
      .tm-toc div { padding: 3px 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .tm-clause { margin: 0; }
      .tm-clause + .tm-clause { margin-top: var(--hl-gap); }
      .tm-h { margin: 0 0 .25em; font: 700 .92em system-ui, sans-serif; letter-spacing: .01em; color: var(--fg); }
      .tm-clause p { margin: 0; }
      .tm-banner { padding: 8px 28px; font-size: 12.5px; color: var(--muted); background: color-mix(in srgb, var(--line) 35%, transparent); border-bottom: 1px solid var(--line); }
      .tm-foot { display: flex; gap: 10px; justify-content: flex-end; padding: 10px 28px 14px; border-top: 1px solid var(--line); }
      .tm-foot span { padding: 5px 14px; font-size: 12.5px; border: 1px solid var(--line); border-radius: 4px; color: var(--muted); }

      .ch-card { border-radius: 14px; overflow: hidden; }
      .ch-top { display: flex; align-items: center; gap: 10px; padding: 12px 18px; border-bottom: 1px solid var(--line); background: color-mix(in srgb, var(--panel) 90%, var(--bg)); }
      .ch-top .av { flex: none; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; color: #fff; background: var(--accent); }
      .ch-top b { display: block; font-size: 14px; }
      .ch-top small { display: block; font-size: 11.5px; color: var(--muted); }
      .ch-text { padding: 8px 18px 12px; user-select: text; -webkit-user-select: text; cursor: text; }
      .ch-day { margin: 0 0 6px; text-align: center; font-size: 11.5px; color: var(--muted); }
      .ch-row { display: flex; align-items: flex-end; gap: 8px; margin-top: var(--ch-gap); }
      .ch-row.me { flex-direction: row-reverse; }
      .ch-row .av { flex: none; width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; color: #fff; background: color-mix(in srgb, var(--muted) 80%, #000); }
      .ch-col { max-width: 72%; min-width: 0; }
      .ch-row.me .ch-col { text-align: right; }
      .ch-meta { margin: 0 4px 2px; font-size: 11px; color: var(--muted); }
      .ch-bub { display: inline-block; text-align: left; padding: 7px 12px; border-radius: 14px; background: color-mix(in srgb, var(--line) 55%, var(--panel)); overflow-wrap: anywhere; }
      .ch-row.me .ch-bub { color: #fff; background: var(--accent); }
      .ch-text ::selection { background: var(--hl-sel); color: inherit; }
      .ch-row.me .ch-bub::selection { background: rgba(255,255,255,.4); }
      .ch-compose { display: flex; gap: 8px; padding: 10px 14px; border-top: 1px solid var(--line); }
      .ch-compose div { flex: 1; padding: 7px 12px; border-radius: 16px; font-size: 13px; color: var(--muted); background: color-mix(in srgb, var(--line) 40%, var(--panel)); }
      .ch-compose span { padding: 7px 14px; border-radius: 16px; font-size: 13px; font-weight: 600; color: #fff; background: var(--accent); opacity: .7; }

      .tb-card { border-radius: 8px; }
      .tb-bar { display: flex; flex-wrap: wrap; gap: 10px 14px; align-items: center; padding: 10px 20px; border-bottom: 1px solid var(--line); }
      .tb-bar input { flex: 1 1 160px; min-width: 120px; padding: 6px 10px; font: inherit; font-size: 13px; color: var(--muted); background: var(--panel); border: 1px solid var(--line); border-radius: 5px; }
      .tb-bar span { font-size: 13px; color: var(--muted); }
      .tb-toolbar { display: flex; gap: 14px; padding: 8px 20px; border-bottom: 1px solid var(--line); font-size: 13px; color: var(--muted); }
      .tb-ta {
        display: block; box-sizing: border-box; width: 100%; resize: none; overflow: hidden; margin: 0;
        padding: 14px 20px; border: 0; outline: none; background: transparent; color: var(--fg); font: inherit;
      }
      .tb-ta::selection, .tb-in::selection { background: var(--hl-sel); color: inherit; }
      .tb-ta.paper { background-image: repeating-linear-gradient(transparent 0, transparent calc(var(--hl-lh) - 1px), color-mix(in srgb, var(--line) 80%, transparent) calc(var(--hl-lh) - 1px), color-mix(in srgb, var(--line) 80%, transparent) var(--hl-lh)); background-position: 0 14px; background-origin: border-box; }
      .tb-foot { display: flex; align-items: center; justify-content: space-between; padding: 8px 20px 12px; border-top: 1px solid var(--line); font-size: 12.5px; color: var(--muted); }
      .tb-foot span.btn { padding: 5px 16px; border-radius: 5px; color: #fff; background: var(--accent); opacity: .65; font-weight: 600; }
      .tb-row { display: flex; align-items: center; gap: 12px; padding: 18px 22px; }
      .tb-row label { flex: none; font-size: 13px; font-weight: 600; color: var(--muted); }
      .tb-in { box-sizing: border-box; min-width: 0; padding: 8px 12px; font: inherit; color: var(--fg); background: var(--panel); border: 1px solid var(--line); border-radius: 6px; outline: none; }
      .tb-in:focus, .tb-ta:focus { box-shadow: none; }
      .tb-row .btn { flex: none; padding: 7px 16px; font-size: 13px; border-radius: 6px; color: var(--muted); border: 1px solid var(--line); }

      .tbl-card { border-radius: 6px; overflow: hidden; }
      .tbl-bar { display: flex; align-items: center; gap: 12px; padding: 10px 16px; border-bottom: 1px solid var(--line); font-size: 13px; }
      .tbl-bar b { font-size: 14.5px; }
      .tbl-bar .grow { flex: 1; }
      .tbl-bar span.chip { padding: 4px 12px; color: var(--muted); border: 1px solid var(--line); border-radius: 5px; }
      .tbl { width: 100%; border-collapse: collapse; user-select: text; -webkit-user-select: text; cursor: text; table-layout: auto; }
      .tbl th { text-align: left; padding: 8px 14px; font: 600 .78em system-ui, sans-serif; letter-spacing: .04em; text-transform: uppercase; color: var(--muted); border-bottom: 2px solid var(--line); background: color-mix(in srgb, var(--panel) 92%, var(--bg)); }
      .tbl td { padding: var(--tb-pad) 14px; vertical-align: top; border-bottom: 1px solid var(--line); overflow-wrap: anywhere; }
      .tbl.zebra tbody tr:nth-child(even) td { background: color-mix(in srgb, var(--line) 22%, transparent); }
      .tbl.cols td + td { border-left: 1px solid var(--line); }
      .tbl ::selection { background: var(--hl-sel); color: inherit; }
      .tbl-foot { padding: 8px 16px; font-size: 12px; color: var(--muted); }

      .pf-win { display: flex; flex-direction: column; overflow: hidden; background: #525659; border-radius: 6px; box-shadow: 0 6px 24px rgba(0,0,0,.28); }
      .pf-bar { display: flex; align-items: center; gap: 14px; padding: 7px 14px; font: 12.5px system-ui, sans-serif; color: #f1f3f4; background: #323639; }
      .pf-bar .name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .pf-bar .pg { padding: 1px 8px; border-radius: 3px; background: #202124; }
      .pf-bar .zm { display: flex; gap: 8px; align-items: center; }
      .pf-body { flex: 1; min-height: 0; display: flex; }
      .pf-pane { flex: 1; min-width: 0; overflow: hidden; position: relative; }
      .pf-pages { padding: 16px 0; display: flex; flex-direction: column; align-items: center; gap: 14px; }
      .pf-page { position: relative; flex: none; box-sizing: border-box; background: #fff; color: #202124; box-shadow: 0 2px 8px rgba(0,0,0,.45); user-select: text; -webkit-user-select: text; cursor: text; }
      .pf-page p { margin: 0; }
      .pf-page p + p { margin-top: var(--hl-gap); }
      .pf-page.just p { text-align: justify; hyphens: none; }
      .pf-page ::selection { background: rgba(51, 144, 255, .38); color: inherit; }
      .pf-num { position: absolute; left: 0; right: 0; bottom: 16px; text-align: center; font: 11px system-ui, sans-serif; color: #80868b; user-select: none; }
      .pf-run { position: absolute; left: 0; right: 0; top: 14px; text-align: center; font: 10.5px system-ui, sans-serif; letter-spacing: .08em; text-transform: uppercase; color: #9aa0a6; user-select: none; }
      .pf-scroll { flex: none; position: relative; width: 12px; margin: 6px 5px 6px 2px; border-radius: 6px; background: rgba(255,255,255,.12); }
      .pf-thumb { position: absolute; left: 1px; width: 10px; border-radius: 5px; background: #9aa0a6; cursor: grab; }
      .pf-thumb:hover, .pf-thumb.on { background: #dadce0; }
      `,
    TERMS_TITLES: ['Terms of Service', 'Terms and Conditions', 'User Agreement', 'Terms of Use', 'Customer Agreement'],
    SITE_NAMES: ['Brightpath', 'Northwind', 'Kestrel', 'Lumen', 'Harbor & Co.', 'Fernwood'],
    CHAT_TITLES: ['Support chat', 'Team thread', 'Direct messages', 'Order help', 'Project room'],
    TABLE_TITLES: ['Customers', 'Recent orders', 'Contacts', 'Support queue', 'Shipments'],
    SP_CSS: `
      .sp-app { position: relative; display: flex; flex-direction: column; overflow: hidden; margin: 6px auto 0;
        background: color-mix(in srgb, var(--fg) 9%, var(--bg)); border: 1px solid var(--line); border-radius: 8px; }
      .sp-bar { flex: none; display: flex; align-items: center; gap: 12px; height: 40px; padding: 0 12px;
        background: var(--panel); border-bottom: 1px solid var(--line); font-size: 13px; white-space: nowrap; }
      .sp-file { font-weight: 600; overflow: hidden; text-overflow: ellipsis; min-width: 0; }
      .sp-chip { padding: 3px 8px; border: 1px solid var(--line); border-radius: 5px; color: var(--muted); }
      .sp-grow { flex: 1; }
      .sp-btn { width: 26px; height: 26px; display: grid; place-items: center; border-radius: 5px; color: var(--muted); }
      .sp-note { color: var(--muted); font-size: 12px; overflow: hidden; text-overflow: ellipsis; }
      .sp-area { flex: 1; display: flex; align-items: flex-start; justify-content: center; overflow: hidden; padding-top: 6px; }
      .sp-canvas { display: block; cursor: text; }
      `,
    SP_FONTS: ['"Liberation Serif", "Times New Roman", serif', 'Georgia, "DejaVu Serif", serif', '"DejaVu Sans", Arial, sans-serif', '"Liberation Mono", "Courier New", monospace'],
    SP_STAMPS: ['RECEIVED', 'COPY', 'FILED', 'SCANNED', 'ARCHIVE'],
  }));
})();
