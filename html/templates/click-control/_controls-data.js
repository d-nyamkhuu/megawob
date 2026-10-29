/* click-control/_controls-data: controls CSS, defaults and small DOM helpers; built once per page. */
(function () {
  'use strict';

  const CSS = `
  .uc-page { position: absolute; top: 14px; bottom: 14px; display: flex; flex-direction: column; overflow: hidden;
    background: var(--panel); border: 1px solid var(--line); border-radius: 10px;
    box-shadow: 0 1px 3px rgba(0,0,0,.06), 0 10px 30px rgba(0,0,0,.05); }
  .uc-nav { flex: none; display: flex; align-items: center; gap: 22px; height: 48px; padding: 0 18px;
    border-bottom: 1px solid var(--line); background: color-mix(in srgb, var(--fg) 3%, var(--panel)); }
  .uc-brand { display: flex; align-items: center; gap: 9px; font-weight: 700; font-size: 15px; letter-spacing: .01em; white-space: nowrap; }
  .uc-logo { width: 22px; height: 22px; border-radius: 6px; background: var(--accent); }
  .uc-navlinks { display: flex; gap: 18px; font-size: 14px; color: var(--muted); white-space: nowrap; overflow: hidden; }
  .uc-navlinks span.on { color: var(--fg); font-weight: 600; }
  .uc-navright { margin-left: auto; display: flex; align-items: center; gap: 14px; }
  .uc-search { display: flex; align-items: center; gap: 8px; width: 180px; height: 30px; padding: 0 10px; border-radius: 15px;
    border: 1px solid var(--line); color: var(--muted); font-size: 13px; background: var(--panel); }
  .uc-avatar { width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 700; color: #fff; background: color-mix(in srgb, var(--accent) 70%, #333); }
  .uc-body { flex: 1; display: flex; min-height: 0; }
  .uc-side { flex: none; width: 170px; padding: 16px 10px; border-right: 1px solid var(--line);
    background: color-mix(in srgb, var(--fg) 2%, var(--panel)); }
  .uc-side div { display: flex; align-items: center; gap: 10px; height: 32px; padding: 0 10px; border-radius: 6px; font-size: 14px; color: var(--muted); }
  .uc-side div i { width: 8px; height: 8px; border-radius: 2px; background: color-mix(in srgb, var(--muted) 55%, transparent); }
  .uc-side div.on { color: var(--fg); font-weight: 600; background: color-mix(in srgb, var(--accent) 10%, transparent); }
  .uc-side div.on i { background: var(--accent); }
  .uc-main { flex: 1; min-width: 0; display: flex; flex-direction: column; padding: 14px 24px 16px; position: relative; }
  .uc-crumb { font-size: 12.5px; color: var(--muted); white-space: nowrap; overflow: hidden; }
  .uc-h1 { margin: 2px 0 10px; font-size: 21px; font-weight: 700; white-space: nowrap; overflow: hidden; }
  .uc-content { flex: 1; min-height: 0; position: relative; display: flex; flex-direction: column; }
  .uc-box { position: relative; max-width: 100%; }

  .uc-card { border: 1px solid var(--line); border-radius: 8px; padding: 14px 16px; background: var(--panel); }
  .uc-flow { display: flex; flex-wrap: wrap; align-items: center; gap: 10px 10px; max-width: 600px; }
  .uc-flow .uc-text { flex-basis: 100%; color: var(--muted); font-size: 14px; line-height: 1.45; }
  .uc-flow .uc-inrow { flex-basis: 100%; display: flex; align-items: center; gap: 8px; font-size: 14px; }
  .uc-flow .uc-br { flex-basis: 100%; height: 0; }
  .uc-input { height: 32px; padding: 0 9px; border: 1px solid color-mix(in srgb, var(--fg) 22%, var(--line)); border-radius: 5px;
    background: var(--panel); color: var(--fg); font: inherit; font-size: 14px; }
  .uc-input:focus { outline: 2px solid color-mix(in srgb, var(--accent) 45%, transparent); outline-offset: 0; border-color: var(--accent); }
  .uc-btn { height: 34px; padding: 0 16px; border-radius: 6px; font: inherit; font-size: 14px; font-weight: 600; cursor: pointer; white-space: nowrap;
    border: 1px solid color-mix(in srgb, var(--fg) 20%, var(--line)); color: var(--fg); background: color-mix(in srgb, var(--fg) 4%, var(--panel)); }
  .uc-btn:hover { background: color-mix(in srgb, var(--fg) 9%, var(--panel)); }
  .uc-btn.primary { background: var(--accent); border-color: var(--accent); color: #fff; }
  .uc-btn.ghost { background: transparent; border-color: transparent; color: var(--accent); }
  .uc-btn.ghost:hover { background: color-mix(in srgb, var(--accent) 10%, transparent); }
  .uc-btn.aslink { height: auto; padding: 2px 2px; border: 0; background: transparent; color: var(--accent); font-weight: 500;
    text-decoration: underline; text-underline-offset: 2px; }
  .uc-btn.icon { display: inline-flex; align-items: center; gap: 7px; padding: 0 12px 0 10px; }
  .uc-btn.icon svg { width: 15px; height: 15px; }
  .uc-btn[disabled], .uc-btn.dis { opacity: .45; cursor: not-allowed; }
  .uc-btn[data-clicked] { box-shadow: inset 0 2px 4px rgba(0,0,0,.25); background: color-mix(in srgb, var(--accent) 18%, var(--panel)); }
  .uc-btn.aslink[data-clicked] { box-shadow: none; background: transparent; color: color-mix(in srgb, var(--accent) 60%, #000); }
  .uc-surface { position: relative; border: 1px dashed color-mix(in srgb, var(--fg) 25%, var(--line)); border-radius: 10px;
    background-image: radial-gradient(color-mix(in srgb, var(--fg) 14%, transparent) 1px, transparent 1px); background-size: 16px 16px; }
  .uc-surface .uc-btn { position: absolute; padding: 0; }

  .uc-bar { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; padding: 8px; border: 1px solid var(--line);
    border-radius: 8px; background: color-mix(in srgb, var(--fg) 3%, var(--panel)); max-width: 640px; }
  .uc-bar .sep { width: 1px; height: 22px; background: var(--line); }
  .uc-doc { margin-top: 12px; max-width: 600px; color: var(--muted); font-size: 14px; line-height: 1.6; }
  .uc-doc b { color: var(--fg); }
  .uc-foot { display: flex; flex-wrap: wrap; justify-content: flex-end; align-items: center; gap: 10px; margin-top: 14px; padding-top: 12px;
    border-top: 1px solid var(--line); }

  .uc-article { max-width: 640px; font-size: 15px; line-height: 1.7; }
  .uc-article h3 { margin: 0 0 6px; font-size: 17px; }
  .uc-article p { margin: 0 0 10px; }
  .uc-link { color: var(--accent); text-decoration: underline; text-underline-offset: 2px; cursor: pointer; }
  .uc-link:hover { text-decoration-thickness: 2px; }
  .uc-links { display: flex; flex-wrap: wrap; gap: 10px 14px; align-items: center; max-width: 620px; }
  .uc-links.col { flex-direction: column; align-items: flex-start; gap: 8px; }
  .uc-link.btnlook { display: inline-flex; align-items: center; height: 32px; padding: 0 14px; border-radius: 6px; text-decoration: none;
    font-weight: 600; font-size: 14px; color: #fff; background: var(--accent); }
  .uc-link.chip { display: inline-flex; align-items: center; height: 28px; padding: 0 12px; border-radius: 14px; text-decoration: none;
    font-size: 13.5px; color: var(--fg); border: 1px solid color-mix(in srgb, var(--fg) 22%, var(--line)); }

  .uc-tabs { max-width: 660px; }
  .uc-strip { display: flex; flex-wrap: wrap; gap: 2px; border-bottom: 1px solid var(--line); }
  .uc-tab { height: 36px; padding: 0 14px; border: 1px solid transparent; border-bottom: 0; border-radius: 7px 7px 0 0; margin-bottom: -1px;
    font: inherit; font-size: 14px; color: var(--muted); background: transparent; cursor: pointer; white-space: nowrap; }
  .uc-tab:hover { color: var(--fg); background: color-mix(in srgb, var(--fg) 4%, transparent); }
  .uc-tab[data-active] { color: var(--fg); font-weight: 600; background: var(--panel); border-color: var(--line); }
  .uc-tabpanel { padding: 12px 16px; border: 1px solid var(--line); border-top: 0; border-radius: 0 0 8px 8px; line-height: 1.65; min-height: 90px; font-size: 14.5px; }
  .uc-tabpanel[hidden] { display: none; }

  .uc-menuwrap { position: relative; display: inline-block; align-self: flex-start; }
  .uc-mpanel { position: absolute; z-index: 5; min-width: 150px; padding: 4px; border: 1px solid var(--line); border-radius: 7px;
    background: var(--panel); box-shadow: 0 8px 24px rgba(0,0,0,.14), 0 2px 5px rgba(0,0,0,.06); }
  .uc-mpanel.root-static { position: relative; display: inline-block; box-shadow: 0 1px 3px rgba(0,0,0,.08); }
  .uc-mpanel[hidden] { display: none !important; }
  .uc-mrow { position: relative; }
  .uc-mrow > .uc-mpanel { left: calc(100% + 2px); top: -5px; }
  .uc-mi { display: flex; align-items: center; gap: 9px; height: 29px; padding: 0 10px; border-radius: 5px; font-size: 14px; white-space: nowrap; cursor: pointer; }
  .uc-mi svg { flex: none; width: 16px; height: 16px; color: var(--muted); }
  .uc-mi .car { margin-left: auto; padding-left: 14px; color: var(--muted); font-size: 11px; }
  .uc-mi .sc { margin-left: auto; padding-left: 18px; color: var(--muted); font-size: 12px; }
  .uc-mi[data-active], .uc-mi[data-open] { background: color-mix(in srgb, var(--accent) 13%, var(--panel)); }
  .uc-mi.dis { color: var(--muted); opacity: .55; cursor: default; }
  .uc-mi.dis[data-active] { background: transparent; }
  .uc-menubtn { display: inline-flex; align-items: center; gap: 8px; }
  .uc-menubtn + .uc-mpanel { top: calc(100% + 6px); left: 0; }

  .uc-acc { width: 600px; max-width: 100%; border: 1px solid var(--line); border-radius: 8px; overflow: hidden; }
  .uc-sec + .uc-sec { border-top: 1px solid var(--line); }
  .uc-sec-h { display: flex; align-items: center; gap: 10px; height: 38px; padding: 0 14px; font-weight: 600; cursor: pointer; font-size: 14.5px;
    background: color-mix(in srgb, var(--fg) 3%, var(--panel)); white-space: nowrap; overflow: hidden; }
  .uc-sec-h:hover { background: color-mix(in srgb, var(--fg) 6%, var(--panel)); }
  .uc-sec-h svg { flex: none; width: 14px; height: 14px; color: var(--muted); transition: none; }
  .uc-sec-h[aria-expanded="true"] svg { transform: rotate(90deg); }
  .uc-sec-h[aria-expanded="true"] { color: var(--accent); }
  .uc-sec-b { padding: 8px 16px 10px 38px; line-height: 1.6; font-size: 14px; }
  .uc-sec-b[hidden] { display: none; }

  .uc-backdrop { position: absolute; inset: -8px; z-index: 10; background: rgba(15, 18, 25, .32); border-radius: 8px; }
  .uc-backdrop[hidden], .uc-dialog[hidden] { display: none; }
  .uc-dialog { position: absolute; z-index: 11; width: 340px; border-radius: 9px; overflow: hidden; background: var(--panel);
    border: 1px solid var(--line); box-shadow: 0 18px 50px rgba(0,0,0,.28); }
  .uc-dlg-t { display: flex; align-items: center; height: 40px; padding: 0 8px 0 16px; font-weight: 700;
    background: color-mix(in srgb, var(--fg) 4%, var(--panel)); border-bottom: 1px solid var(--line); }
  .uc-dlg-t span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .uc-dlg-x { margin-left: auto; flex: none; width: 28px; height: 28px; border: 0; border-radius: 5px; background: transparent; color: var(--muted);
    font: inherit; font-size: 20px; line-height: 1; cursor: pointer; }
  .uc-dlg-x:hover { background: color-mix(in srgb, var(--fg) 10%, transparent); color: var(--fg); }
  .uc-dlg-b { padding: 14px 16px; line-height: 1.5; font-size: 14px; }
  .uc-dlg-f { display: flex; justify-content: flex-end; gap: 8px; padding: 0 16px 14px; }
  .uc-dlg-f .uc-btn { padding: 0 12px; }

  .uc-pie { position: relative; touch-action: none; }
  .uc-pie svg { display: block; }
  .uc-slice { fill: color-mix(in srgb, var(--accent) 78%, #000); stroke: var(--panel); stroke-width: 2; cursor: pointer; }
  .uc-slice:hover, .uc-slice[data-active] { fill: color-mix(in srgb, var(--accent) 60%, #fff); }
  .uc-slabel { fill: #fff; font-size: 17px; font-weight: 700; pointer-events: none; text-anchor: middle; dominant-baseline: central; }
  .uc-spread { fill: var(--fg); cursor: pointer; }
  .uc-spread-i { stroke: var(--panel); stroke-width: 3; stroke-linecap: round; pointer-events: none; }
  .uc-pie[data-open] .uc-spread-i { transform: rotate(45deg); }
  .uc-hint { margin-top: 8px; font-size: 13px; color: var(--muted); }

  .uc-wlist { display: grid; gap: 12px 28px; }
  .uc-widget { display: flex; align-items: center; gap: 8px; width: max-content; font-size: 14.5px; cursor: pointer; }
  .uc-widget input[type=radio], .uc-widget input[type=checkbox] { width: 17px; height: 17px; margin: 0; accent-color: var(--accent); }
  .uc-widget textarea { width: 180px; height: 36px; padding: 6px 9px; resize: none; border: 1px solid color-mix(in srgb, var(--fg) 22%, var(--line));
    border-radius: 5px; background: var(--panel); color: var(--fg); font: inherit; font-size: 14px; }

  .uc-form { width: 400px; max-width: 100%; box-sizing: border-box; }
  .uc-field { display: flex; flex-direction: column; gap: 4px; }
  .uc-field label { font-size: 13px; font-weight: 600; color: var(--muted); }
  .uc-field .uc-input { width: 250px; }

  .uc-board { display: block; border: 1px solid var(--line); border-radius: 8px; background: color-mix(in srgb, var(--fg) 2%, var(--panel)); }
  .uc-sq { fill: color-mix(in srgb, var(--fg) 22%, var(--panel)); }
  .uc-meter { display: flex; align-items: center; gap: 12px; margin-top: 8px; font-size: 13.5px; color: var(--muted); }
  .uc-meter .bar { width: 200px; height: 8px; border-radius: 4px; background: color-mix(in srgb, var(--fg) 10%, var(--panel)); overflow: hidden; }
  .uc-meter .bar i { display: block; height: 100%; background: var(--accent); }

  .uc-toast { position: absolute; z-index: 40; bottom: 16px; display: flex; align-items: center; gap: 16px; max-width: 70%;
    padding: 10px 12px 10px 16px; border-radius: 8px; color: #fff; background: rgba(28, 31, 38, .95); font-size: 14px;
    box-shadow: 0 10px 26px rgba(0,0,0,.25); }
  .uc-toast[hidden] { display: none; }
  .uc-toast span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .uc-toast button { flex: none; height: 28px; padding: 0 10px; border: 0; border-radius: 5px; font: inherit; font-weight: 700; cursor: pointer;
    color: color-mix(in srgb, var(--accent) 55%, #fff); background: transparent; }
  .uc-toast button:hover { background: rgba(255,255,255,.1); }
  .uc-navview { position: absolute; inset: 0; z-index: 20; padding: 14px 18px; background: var(--panel); border: 1px solid var(--line);
    border-radius: 8px; overflow: hidden; }
  .uc-navview[hidden] { display: none; }
  .uc-navview h2 { margin: 10px 0 8px; font-size: 20px; }
  .uc-navview p { margin: 0; color: var(--muted); line-height: 1.6; max-width: 560px; }
  .uc-back { color: var(--accent); cursor: pointer; text-decoration: underline; text-underline-offset: 2px; font-size: 14px; }
  `;

  function make() {
    const assets = env.templateLib('click-control/_assets');


    const ICONS = assets.icons();
    const DLG_ICON =
      '<svg viewBox="0 0 60 54" aria-hidden="true"><defs><linearGradient id="displaycal-drive" x2="0" y2="1"><stop stop-color="#e4e2dc"/><stop offset=".52" stop-color="#cac9c2"/><stop offset="1" stop-color="#a5a59e"/></linearGradient></defs><g stroke="#686963" stroke-width="1.4" fill="url(#displaycal-drive)"><rect x="3" y="33" width="54" height="18" rx="5"/><rect x="3" y="18" width="54" height="18" rx="5"/><rect x="3" y="3" width="54" height="18" rx="5"/></g><g fill="none" stroke="#eeeae3" stroke-width="1"><path d="M7 18h45M7 33h45M7 48h45M6 8v6M6 23v6M6 38v6"/></g><g fill="#b9bab2" stroke="#81847b" stroke-width=".65"><rect x="11" y="11" width="4" height="3"/><rect x="11" y="26" width="4" height="3"/><rect x="11" y="41" width="4" height="3"/><rect x="46" y="11" width="4" height="2"/><rect x="43" y="26" width="7" height="2"/><rect x="43" y="41" width="7" height="2"/></g></svg>';
    const HOVER_FILL = assets.hoverFill();
    const TRIANGLE = '<svg viewBox="0 0 16 21" aria-hidden="true"><path d="M2 1L15 10.5L2 20Z"/></svg>';
    const HAMBURGER = '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M2.5 4h11M2.5 8h11M2.5 12h11"/></svg>';
    const FILE_COLORS = assets.fileColors();
    const PERSON = '<svg viewBox="0 0 20 24" fill="#8996a6" stroke="#576273"><circle cx="10" cy="6" r="4"/><path d="M3 22v-6c0-8 14-8 14 0v6Z"/></svg>';
    const CONTACTS = ['Arturo', 'Bianca', 'Chen', 'Diego', 'Elena', 'Freda', 'George', 'Hiro', 'Isabel', 'Jamal', 'Keiko', 'Leon',
      'Marta', 'Nico', 'Olga', 'Pavel', 'Quinn'];
    const SPOTS = [[.18, .12], [.72, .12], [.05, .58], [.43, .42], [.83, .58], [.45, .8]];
    const SEQ_DECOYS = ['Settings', 'Help', 'Cancel', 'Reset', 'Options', 'Preview'];
    const CALIBRATION_LOG = ['[10:14:03] Detecting display...', '[10:14:03] DELL 2001FP at 1600x900, 60 Hz',
      '[10:14:04] Loading measurement data...', '[10:14:05] Ready.'];

    const linkPoint = (el) => {
      const rs = el.getClientRects();
      const r = rs.length ? rs[0] : el.getBoundingClientRect();
      return [r.left + r.width / 2, r.top + r.height / 2];
    };
    const fail = (t) => { throw new Error(`click-control/controls cannot locate ${JSON.stringify(t)}`); };
    const must = (p, t) => p || fail(t);
    const fam = () => env.taskDef;

    // Tokens and their defaults.
    const TOKENS = {
      icons: {},
      hoverFill: HOVER_FILL,
      obstacle: false,
      articleFit: null,
      outerInset: 6,
      gapOuter: 0,
      gapInner: 0,
      pieMin: 220,
      pieMax: 320,
      pieHMul: 1,
      pieHSub: 34,
      pieWMul: 1,
      pieWSub: 0,
      innerFrac: null,
      knobR: 26,
      seqW: 280,
      seqWFrac: .24,
      seqH: 120,
      seqHFrac: .24,
      seqSpots: SPOTS,
      seqDecoys: 6,
      seqLabels: SEQ_DECOYS,
      helper: true,
      menuLabel: 'Menu',
      decoysBefore: ['New Contact...', 'Open Group...'],
      decoysAfter: ['Import...', 'Export...'],
      modTitle: 'Module Contents',
      chevron: TRIANGLE,
      headings: { text: 'Your name:', textarea: 'Message:', radio: 'Choose a fruit:', checkbox: 'I agree:', button: 'Action:', other: 'Learn more:' },
      intro: 'Please complete the form below. Fields marked with * are required.',
      extras: ['First Name *', 'Last Name *', 'Email Address', 'Phone Number'],
      rx: 1,
      dlgIcon: DLG_ICON,
      dlgName: ['Archive name:', 'my_display_2004-06-12.zip'],
      dlgLocation: '/home/user/profiles',
      dlgReport: 'Include calibration report (PDF)',
    };
    // What most sites of one scenario share, applied to widgets that declare exactly that scenario.
    const SCENARIOS = {
      link: {
        articleFit: {},
        parts: {
          linkDecor: (base, S) => (ctx, art, links) => {
            const { util } = ctx;
            S.P.linkResources(ctx, art, links, {
              intro: 'Here are some useful resources for the next phase:',
              labels: ['Read the project overview: ', 'Product requirements: ', 'Design references: ', 'Meeting notes: ', 'Release checklist: '],
            });
            util.el('p', 'notebook-closing', art, 'If you have questions, reach out to the team.');
            util.el('p', 'notebook-thanks', art, 'Thanks!');
          },
        },
      },
      tab: {
        parts: {
          tabButton: () => (ctx, tb, t, i) => {
            const { util } = ctx;
            const art=util.el('span','tab-art',tb);
            const shapes=['<path d="M6 2h10l6 6v22H6zM16 2v7h6M10 15h8M10 20h8M10 25h5"/>','<circle cx="13" cy="8" r="5"/><path d="M3 29v-5c0-9 19-9 19 0v5zM23 4c8 0 8 11 1 11M25 19c6 1 7 4 7 10h-6"/>','<path d="M2 9V5h10l4 4h15v20H2zM2 12h29"/>','<path d="M28 16c0 8-6 12-14 12l-6 4v-6C-4 22 0 4 13 4c9 0 15 4 15 12z"/><circle cx="8" cy="16" r="1"/><circle cx="15" cy="16" r="1"/><circle cx="22" cy="16" r="1"/>'];
            art.innerHTML='<svg viewBox="0 0 34 34" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+shapes[i%4]+'</svg>';
          },
          tabPanel: () => (ctx, p, t, i, links) => {
            const { util } = ctx;
            util.el('h2','pb-title',p,t.label);
            util.el('h4','pb-sub',p,'Overview');
            util.el('p','pb-overview',p,t.words.filter(word=>!word.link).map(word=>word.text).join(' '));
            util.el('h4','pb-sub pb-key',p,'Key Points');
            const list=util.el('ul','pb-list',p);
            ['Improve navigation and content structure','Ensure accessibility across devices','Maintain a consistent visual language','Gather feedback from early users'].forEach(text=>util.el('li','',list,text));
            const linkArea=util.el('div','pb-links',p);
            t.words.forEach((word,j)=>{if(word.link){const row=util.el('div','pb-linkrow',linkArea);const a=util.el('span','uc-link',row,word.text);a.dataset.key=i+'.'+j;a.dataset.role='link';links.push(a);}});
          },
        },
      },
      menu: { menuLabel: 'People' },
      widget: { obstacle: true },
    };

    return { CSS, ICONS, DLG_ICON, HOVER_FILL, TRIANGLE, HAMBURGER, FILE_COLORS, PERSON, CONTACTS, SPOTS, SEQ_DECOYS, CALIBRATION_LOG, linkPoint, fail, must, fam, TOKENS, SCENARIOS };
  }

  env.template('click-control/_controls-data', make, { uses: ['click-control/_assets'] });
})();
