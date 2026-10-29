// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.theme': (base, S) => function (_c) {
      const { ctx } = _c;
      const { ACCENTS, LOW_ACCENTS, LOW_THEME, THEMES } = S;
      const { rng, util, content } = ctx;
      let name = rng.pick(Object.keys(THEMES));
      const root = document.documentElement;
      let accent = rng.pick(ACCENTS);
      const tr = rng.fork('chrome/theme');
      if (tr.bool(0.08)) {
        name = 'low';
        accent = tr.pick(LOW_ACCENTS);
      }
      for (const [k, v] of Object.entries(name === 'low' ? LOW_THEME : THEMES[name])) root.style.setProperty(`--${k}`, v);
      root.style.setProperty('--accent', accent);
      root.style.setProperty('--accent', '#1683e8');
      root.dataset.theme = name;
      Object.assign(_c, { accent, content, name, rng, root, tr, util });
    },
    'frame.layout': (base, S) => function (_c) {
      const { ctx, util } = _c;
      const W = window.innerWidth;
      const H = window.innerHeight;
      // NoteKeeper's Windows 2000 frame.
      const titlebar = util.el('div', 'office-titlebar', document.body);
      util.el('span', 'office-appmark', titlebar, '▧').innerHTML = '<svg viewBox="0 0 32 32" aria-hidden="true"><path fill="#fff" stroke="#111" stroke-width="2" d="M4 2h16l8 8v20H4z"/><path fill="#8ec7ff" d="M20 2v8h8"/><path stroke="#004b9b" stroke-width="2" d="M8 15h15M8 19h15M8 23h12"/><path fill="#ffd43b" stroke="#111" d="M3 5h4v23H3z"/></svg>';
      util.el('span', 'office-apptitle', titlebar, 'NoteKeeper');
      const windowButtons = util.el('div', 'office-window-buttons', titlebar);
      for (const glyph of ['−', '□', '×']) util.el('span', 'office-window-button', windowButtons, glyph);
      const menubar = util.el('nav', 'office-menubar', document.body);
      const toolbar = util.el('div', 'office-toolbar', document.body);
      const nav = [
        ['<svg viewBox="0 0 32 32" aria-hidden="true"><path fill="#fff" stroke="#111" stroke-width="2" d="M6 2h15l6 6v22H6z"/><path fill="#8bc7ff" stroke="#111" d="M21 2v7h6"/><path stroke="#0054a6" stroke-width="2" d="M10 14h13M10 18h13M10 22h13"/></svg>','Notes'],
        ['<svg viewBox="0 0 32 32" aria-hidden="true"><path fill="#e9b72f" stroke="#553b08" stroke-width="2" d="M2 7h12l3 4h13v17H2z"/><path fill="#ffe36e" stroke="#553b08" stroke-width="2" d="M2 11h28L26 27H2z"/></svg>','Folders'],
        ['<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="13" cy="13" r="9" fill="#fff" stroke="#24435d" stroke-width="3"/><path stroke="#d9e7ed" stroke-width="3" d="M7 9a7 7 0 0 1 8-3"/><path stroke="#604820" stroke-width="4" d="m20 20 9 9"/><path stroke="#aaa" stroke-width="2" d="m20 20 8 8"/></svg>','Search'],
        ['<svg viewBox="0 0 32 32" aria-hidden="true"><path fill="#fff" stroke="#173d71" stroke-width="2" d="M3 5h12q4 0 4 4v19q-2-4-5-4H3z"/><path fill="#d9edff" stroke="#173d71" stroke-width="2" d="M29 5H19v23q2-4 5-4h5z"/><path stroke="#1672c5" stroke-width="2" d="M6 11h8M6 15h8M22 11h4M22 15h4"/><path fill="#f5d34f" stroke="#111" d="m17 7 4 4-8 9-5 2 2-5z"/></svg>','Tags'],
        ['<svg viewBox="0 0 32 32" aria-hidden="true"><path fill="#c5d9ed" stroke="#111" stroke-width="2" d="m7 4 5-2 4 2-5 15-4 8-4-2 2-9z"/><path fill="#ef3c36" stroke="#111" stroke-width="2" d="m22 3 4 1 3 17-2 8-4-1-1-8z"/><path fill="#ddd" stroke="#111" d="m7 4 5-2 3 2-1 3-6 1zM22 3l4 1 2 3-6 1z"/><path fill="#397dc3" d="M3 27h6v3H3z"/><path fill="#d71920" d="M23 27h5v3h-5z"/></svg>','Preferences'],
        ['<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="14" fill="#1681df" stroke="#084b92" stroke-width="2"/><path fill="#fff" stroke="#073b73" stroke-width="1" d="M11 11q0-6 6-6 6 0 6 6 0 3-4 6-2 2-2 5h-3q0-5 3-8 3-2 3-4 0-3-3-3t-3 4z"/><circle cx="16" cy="27" r="2" fill="#fff"/></svg>','Help']
      ];
      nav.forEach(([icon, label]) => {
        const item = util.el('div', 'office-tool', toolbar);
        util.el('span', 'office-tool-icon', item).innerHTML = icon;
        util.el('span', '', item, label);
      });
      const roomy = W >= 1260;
      const tall = H >= 800;
      let display = ctx.display || 'header';
      if (display === 'panel' && !roomy) display = 'header';
      if (display === 'toast' && !tall) display = 'header';
      // reset() reuses the body: a previous toast must not shrink later episodes.
      document.body.classList.toggle('ref-has-note', display === 'toast');
      Object.assign(_c, { H, W, display, menubar, roomy, tall, titlebar, toolbar, windowButtons });
    },
    'frame.instruction': (base, S) => function (_c) {
      const { ctx, display, header, util } = _c;
      if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
      else util.el('div', 'ref-spacer', header);
      document.body.classList.toggle('office-no-instruction', display === 'hidden');
    },
    'frame.tools': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, display, endBtn, header, label, placement, toolbar, util, wantFooter } = _c;
      let submit = null;
      const headerTools = util.el('div', 'ref-tools', header);
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      if (display === 'hidden') toolbar.appendChild(headerTools);
      Object.assign(_c, { headerTools, submit });
    },
    'frame.body': (base, S) => function (_c) {
      const { content, name, rng, sidebar, util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      // Keep the sibling's random draws consumed, while this design has its persistent record index.
      if (sidebar) rng.sample(content.NAV_ITEMS, rng.int(4, 7));
      const side = util.el('aside', 'office-documents', body);
      document.addEventListener('wheel', (event) => {
        const pane = document.querySelector('.office-settings .sp-panel');
        if (pane) pane.scrollTop += event.deltaY * 3;
      }, { passive: true, capture: true });
      util.el('div', 'office-documents-heading', side, 'Saved Settings');
      const columns = util.el('div', 'office-columns', side);
      util.el('span', '', columns, 'Name');
      util.el('span', '', columns, 'Last Modified');
      const records = [
        ['▤','General','4/12/2000 9:14 AM'], ['▤','Editing','4/12/2000 9:14 AM'], ['▤','Appearance','4/10/2000 2:08 PM'],
        ['▤','Sync','4/08/2000 11:21 AM'], ['▤','Backups','4/09/2000 5:36 PM'], ['▤','Advanced','4/06/2000 3:17 PM']
      ];
      records.forEach(([icon, name, date], i) => {
      const row = util.el('div', `office-record${i === 0 ? ' selected' : ''}`, side);
        util.el('span', 'office-record-icon', row, icon);
        const copy = util.el('div', 'office-record-copy', row);
        util.el('div', 'office-record-name', copy, name);
        util.el('div', 'office-record-date', copy, date);
      });
      Object.assign(_c, { body, records, side });
    },
    'frame.stage': (base) => function (_c) {
      base(_c);
      _c.stage.style.justifyContent = 'center';
      _c.stage.style.alignItems = 'flex-start';
    },
  };

  env.site({
    name: 'design-change-settings-mixed-05',
    template: 'site/base',
    design: { parts },
  });
})();
