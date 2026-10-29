(function () {
  'use strict';
  const C = {
    site: 'design-choose-option-listbox-12',
    title: 'Document Preferences',
    menus: ['File', 'Edit', 'Format', 'Arrange', 'View', 'Window', 'Help'],
    clock: 'Mon Apr 15, 1985  10:24 AM',
    side: [
      ['General', 'sheet'],
      ['Appearance', 'pal'],
      ['Spelling', 'aa'],
      ['Auto-Save', 'disk'],
      ['Shortcuts', 'kbd'],
      ['Advanced', 'gear'],
    ],
    active: 1,
  };
  const S = 'fill="none" stroke="#111" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"';
  const ICON = {
    doc: `<svg viewBox="0 0 40 48" ${S}><path d="M3 2h27l9 9v35H3z"/><path d="M30 2v10h9M9 9h15M9 15h23M9 19h23M9 23h23M9 27h23M9 31h23M9 35h23M9 39h23" stroke-width="1.4"/></svg>`,
    sheet: `<svg viewBox="0 0 40 40" ${S}><path d="M8 3h18l7 7v27H8zM26 3v8h7"/><path d="M13 9h7M13 16h14M13 21h14M13 26h14M13 31h14" stroke-width="1.5"/></svg>`,
    pal: `<svg viewBox="0 0 40 40"><path d="M22 3C10 2 2 13 3 25s11 16 20 12c6-3 8-10 5-13l-4-4 11-13-3-3-11 12c-4 0-4-4 1-5z" fill="#f4f1e3" stroke="#222" stroke-width="1.2"/><path d="M22 23L36 5" stroke="#222" stroke-width="3"/><circle cx="12" cy="13" r="2.5" fill="#333"/><circle cx="8" cy="22" r="2.5" fill="#333"/><circle cx="13" cy="30" r="2.5" fill="#333"/><circle cx="21" cy="8" r="2.5" fill="#333"/></svg>`,
    aa: `<svg viewBox="0 0 40 40"><text x="1" y="30" font-family="Times New Roman,serif" font-size="30" fill="#111">Aa</text></svg>`,
    disk: `<svg viewBox="0 0 40 40" ${S}><path d="M5 3h26l4 4v30H5z"/><path d="M11 3v14h18V3M11 37V26h18v11M15 5v10M18 5v10M21 5v10M24 5v10" stroke-width="1.2"/></svg>`,
    kbd: `<svg viewBox="0 0 44 32" ${S}><rect x="2" y="3" width="40" height="25" rx="2"/><path d="M8 9h1M15 9h1M22 9h1M29 9h1M36 9h1M8 15h1M15 15h1M22 15h1M29 15h1M36 15h1M8 21h1M15 21h15M36 21h1" stroke-width="3"/></svg>`,
    gear: `<svg viewBox="0 0 40 40" ${S}><circle cx="20" cy="20" r="6"/><path d="M17 3h6l1 5 4 2 5-3 4 4-3 5 2 4 5 1v6l-5 1-2 4 3 5-4 4-5-3-4 2-1 5h-6l-1-5-4-2-5 3-4-4 3-5-2-4-5-1v-6l5-1 2-4-3-5 4-4 5 3 4-2z" transform="scale(.88) translate(2.5 2.5)"/></svg>`,
    folder: `<svg viewBox="0 0 60 48" ${S}><path d="M3 10h20l5 6h29v28H3z"/><path d="M3 16h54"/></svg>`,
    archive: `<svg viewBox="0 0 52 52" ${S}><rect x="3" y="3" width="46" height="46"/><rect x="9" y="10" width="34" height="14"/><rect x="20" y="30" width="12" height="6"/><path d="M3 26h46"/></svg>`,
    work: `<svg viewBox="0 0 60 56" ${S}><path d="M4 3h46l6 6v44H4zM49 5v48"/><rect x="14" y="3" width="29" height="22"/><path d="M17 6h22M17 9h22M17 12h22M17 15h22M17 18h22M17 21h22" stroke-width=".7"/><rect x="18" y="38" width="22" height="15"/></svg>`,
    trash: `<svg viewBox="0 0 44 56" ${S}><path d="M3 13l3 39q16 4 32 0l3-39M16 9V4q6-3 12 0v5M12 20v25M22 20v25M32 20v25"/><ellipse cx="22" cy="13" rx="20" ry="4"/><path d="M12 9h7M28 9h5"/></svg>`,
    warn: `<svg viewBox="0 0 60 56" fill="none" stroke="#111" stroke-width="4" stroke-linejoin="round"><path d="M27 5q3-5 6 0l25 43q3 5-3 5H5q-6 0-3-5z"/><path d="M30 19v15" stroke-width="6" stroke-linecap="round"/><circle cx="30" cy="44" r="3" fill="#111"/></svg>`,
    apple: `<svg viewBox="0 0 24 28" fill="#111"><path d="M17 1c0 3-2 5-5 5 0-3 2-5 5-5zM12 8c-2 0-3-1-5-1-3 0-6 3-6 8 0 6 4 12 7 12 2 0 2-1 4-1s2 1 4 1c3 0 5-5 6-8-3-1-4-5-1-7-2-3-6-3-9-4z"/></svg>`,
  };
  function ico(parent, u, key, cls) {
    const d = u.el('span', cls || 'ds-ico', parent);
    d.innerHTML = ICON[key];
    return d;
  }
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const bar = u.el('header', 'ds-bar', document.body);
      ico(bar, u, 'apple', 'ds-apple');
      C.menus.forEach((t) => u.el('span', 'ds-m', bar, t));
      u.el('span', 'ds-clock', bar, C.clock);
      const desk = (cls, key, label) => {
        const d = u.el('div', 'ds-desk ' + cls, document.body);
        ico(d, u, key);
        u.el('span', '', d, label);
      };
      desk('d1', 'doc', 'Documents');
      desk('d2', 'folder', 'Projects');
      desk('d3', 'archive', 'Archive');
      desk('dw', 'work', 'Work\nDisk');
      desk('dt', 'trash', 'Trash');
      const win = u.el('div', 'ds-win', document.body);
      const tb = u.el('div', 'ds-title', win);
      u.el('i', 'ds-tbox', tb);
      u.el('span', '', tb, C.title);
      u.el('i', 'ds-tbox r', tb);
      const inner = u.el('div', 'ds-inner', win);
      const side = u.el('nav', 'ds-side', inner);
      C.side.forEach((s, i) => {
        const r = u.el('div', 'ds-sitem' + (i === C.active ? ' on' : ''), side);
        ico(r, u, s[1], 'ds-sico');
        u.el('span', '', r, s[0]);
      });
      const pane = u.el('div', 'ds-pane', inner);
      u.el('h2', 'ds-h2', pane, 'Appearance');
      const stage = u.el('main', 'ds-stage', pane);
      const cb = u.el('div', 'ds-fakecb', pane);
      u.el('i', '', cb);
      u.el('span', '', cb, 'Use accent color in window titles');
      const foot = u.el('footer', 'ds-footer', win);
      const rd = u.el('button', 'ds-btn ds-restore', foot, 'Restore Defaults');
      rd.type = 'button';
      u.el('span', 'ds-sp', foot);
      const cancel = u.el('button', 'ds-btn', foot, 'Cancel');
      cancel.type = 'button';
      let submit = null;
      const endR = ctx.rng.fork('chrome/end');
      const bank = (key, fallback) =>
        ctx.content && Array.isArray(ctx.content[key]) && ctx.content[key].length ? ctx.content[key] : fallback;
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const endLabels = bank('END_LABELS', [
        'Submit',
        'Done',
        'Finish',
        'Continue',
        'Save',
        'OK',
        'Confirm',
        'Apply',
        'Complete',
        "I'm done",
      ]).map(labelOf);
      const defaultEnd = endR.bool(0.5);
      const label = defaultEnd ? 'Submit' : endR.pick(endLabels.filter((x) => x.trim().toLowerCase() !== 'submit'));
      const placement = defaultEnd ? 'footer' : endR.pick(['footer', 'title', 'link', 'icon']);
      const decoyR = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (decoyR.bool(0.3)) {
        const options = [...new Set(endLabels)].filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (options.length) collide = { label: decoyR.pick(options), where: decoyR.pick(['title', 'footer']) };
      }
      const endBtn = (parent, cls, text, link) => {
        const b = u.el(link ? 'a' : 'button', cls, parent, text);
        if (link) b.href = '#';
        else b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      const decoyBtn = (parent, text) => {
        const b = u.el('button', 'ds-btn ds-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        return b;
      };
      if (!ctx.finish) {
        if (placement === 'footer') submit = endBtn(foot, 'ds-btn ds-submit', label, false);
        else if (placement === 'link') submit = endBtn(foot, 'ds-endlink', label + ' ›', true);
        else if (placement === 'title') submit = endBtn(tb, 'ds-btn ds-title-end', label, false);
        else submit = endBtn(tb, 'ds-btn ds-title-end ds-title-icon', '✓', false);
      }
      if (collide) {
        const parent = collide.where === 'title' ? tb : foot;
        decoyBtn(parent, collide.label);
      }
      const display = ['header', 'panel', 'toast'].includes(ctx.display) ? ctx.display : 'hidden';
      document.body.dataset.instruction = display;
      if (display !== 'hidden') {
        const t = u.el('aside', 'ds-task ds-note-' + display, document.body);
        u.el('h2', '', t, 'Task');
        u.el('div', 'ds-instruction', t, ctx.instruction);
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      ico(el, u, 'warn', 'ds-warn');
      const tx = u.el('div', 'ds-otext', el);
      u.el('b', '', tx, 'Layout could not be restored.');
      u.el(
        'p',
        '',
        tx,
        'The previous workspace layout could not be loaded. This may be due to a changed configuration.',
      );
      const dismiss = u.el('button', 'ds-btn ds-odis', tx, 'Use default layout');
      dismiss.type = 'button';
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
