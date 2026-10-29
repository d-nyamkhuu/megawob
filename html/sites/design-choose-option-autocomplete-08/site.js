(function () {
  'use strict';
  const C = { 'site': 'design-choose-option-autocomplete-08', 'instruction': 'top', 'briefTitle': 'Instructions' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      function icon(parent, globe) {
        const e = u.el('span', 'ds-sysicon', parent);
        e.innerHTML = globe
          ? '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 2 23 5 29 12 29 21 23 28 13 30 5 25 2 17 5 8Z" fill="#eee" stroke="#222"/><circle cx="16" cy="16" r="11" fill="#1429a1" stroke="#222"/><path d="m7 8 5-2 2 4-3 4-5-1 1-5Zm14 1 5 4-2 5-4-1-1 4-4 1-2-5 3-4 4 1Zm-9 13 3 4-3 1-3-4Z" fill="#dedec9" stroke="#555" stroke-width=".6"/><path d="M5 16h22M16 5c-7 6-7 16 0 22M16 5c7 6 7 16 0 22" fill="none" stroke="#aaa" stroke-width=".7"/><path d="m8 6 5-2" stroke="white" stroke-width="2"/></svg>'
          : '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="m16 2 8 5 5 9-4 9-10 5-9-5-3-9 4-9Z" fill="#eee" stroke="#222"/><path d="m12 5 9-1 3 7 4 5-5 4 1 7-11-3-6 1 1-7-4-4 7-2Z" fill="#ddd" stroke="#333"/><path d="m12 9 7-2 3 9-6 3-5-2 1-8Zm-4 13 7 2 9-3M6 16l5 2M17 20l1 7" fill="none" stroke="#555"/><path d="m10 12 6 1 3-3 2 6-7 1-4-2Z" fill="white" stroke="#111"/><path d="M8 25h15M20 6v5" stroke="white"/></svg>';
        return e;
      }
      const top = u.el('header', 'ds-top', document.body);
      icon(top, false);
      u.el('span', 'ds-brand', top, 'OS/2 Workplace Shell  -  Employee Record');
      const wb = u.el('span', 'ds-wbtn', top);
      ['_', '▫', '×'].forEach((t) => u.el('i', '', wb, t));
      const nav = u.el('nav', 'ds-menu', document.body);
      ['File', 'Edit', 'View', 'Insert', 'Format', 'Tools', 'Help'].forEach((t) => u.el('span', '', nav, t));
      const endRng = ctx.rng.fork('chrome/end');
      const endLabels = (ctx.content && ctx.content.END_LABELS) || [
        'Submit',
        'Done',
        'Finish',
        'Continue',
        'Save',
        'OK',
        'Confirm',
        'Apply',
        '✓',
      ];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const commonEnd = endRng.bool(0.5);
      const endPlacement = commonEnd ? 'footer' : endRng.pick(['header', 'status']);
      const endLabel = commonEnd ? 'Submit' : labelOf(endRng.pick(endLabels));
      const collideRng = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (collideRng.bool(0.3)) {
        const opts = [
          ...new Set(endLabels.map(labelOf).filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase())),
        ];
        if (opts.length) collide = labelOf(collideRng.pick(opts));
      }
      const body = u.el('div', 'ds-body', document.body);
      const rail = u.el('aside', 'ds-rail', body);
      for (let i = 1; i <= 20; i++) u.el('div', '', rail, String(i));
      const content = u.el('div', 'ds-content', body);
      const tabs = u.el('div', 'ds-tabs', content);
      ['General', 'Employment', 'Contact', 'Notes'].forEach((t, i) => u.el('span', i ? '' : 'on', tabs, t));
      const sheet = u.el('div', 'ds-sheet', content);
      const mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'left'
              : C.instruction;
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls === 'ds-brief') u.el('h2', '', b, C.briefTitle);
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      if (mode === 'top') briefing(sheet, 'ds-header-note');
      if (mode === 'toast') briefing(sheet, 'ds-toast');
      const main = u.el('div', 'ds-main', sheet);
      if (mode === 'left' || mode === 'right') {
        const b = briefing(main, 'ds-brief');
        if (mode === 'right') b.style.order = '2';
      }
      const left = u.el('div', 'ds-left', main);
      [
        ['First name', 'Elena'],
        ['Last name', 'Morales'],
        ['Employee ID', 'EMP-1043'],
      ].forEach((r) => {
        const row = u.el('div', 'ds-row', left);
        u.el('span', '', row, r[0] + ':');
        u.el('div', 'ds-fake', row, r[1]);
      });
      const jr = u.el('div', 'ds-row', left);
      u.el('span', '', jr, 'Job title:');
      const jf = u.el('div', 'ds-fake ds-dd', jr, 'Project Coordinator');
      u.el('b', '', jf, '▾');
      const right = u.el('div', 'ds-right', main);
      const stage = u.el('main', 'ds-stage', right);
      [
        ['Department', ''],
        ['Start date', '2023-06-12'],
        ['Employment type', 'Full-time'],
      ].forEach((r, i) => {
        const row = u.el('div', 'ds-row ds-rrow', right);
        u.el('span', '', row, r[0] + ':');
        const f = u.el('div', 'ds-fake ds-dd', row, r[1]);
        if (i === 1) {
          const cal = u.el('b', 'ds-calendar', f);
          cal.innerHTML =
            '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 4h20v18H2Z" fill="white" stroke="black"/><path d="M2 4h20v5H2Z" fill="#003999" stroke="black"/><path d="M6 2v5M18 2v5M3 13h18M3 17h18M7 9v12M12 9v12M17 9v12" fill="none" stroke="#222"/></svg>';
        }
        if (i === 2) u.el('b', '', f, '▾');
      });
      const addl = u.el('div', 'ds-addl', sheet);
      u.el('div', '', addl, 'Additional information:');
      const area = u.el('div', 'ds-area', addl);
      const sb = u.el('div', 'ds-vsb', area);
      u.el('b', '', sb, '▲');
      u.el('i', '', sb);
      u.el('b', '', sb, '▼');
      const foot = u.el('footer', 'ds-footer', sheet);
      ['New', 'Clear', 'Preview'].forEach((t) => {
        const b = u.el('button', 'ds-act', foot, t);
        b.type = 'button';
      });
      foot
        .querySelectorAll('.ds-act')
        .forEach((b) => b.addEventListener('click', () => env.log('decoy', { label: b.textContent })));
      u.el('span', 'ds-sp', foot);
      let submit = null;
      const endBtn = (parent, cls, text) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', text);
        b.title = text;
        b.addEventListener('click', () => ctx.submit());
        return b;
      };
      if (!ctx.finish && endPlacement === 'footer') submit = endBtn(foot, 'ds-submit', endLabel);
      if (!ctx.finish && endPlacement === 'header') submit = endBtn(nav, 'ds-end-header', endLabel);
      if (collide) {
        const d = u.el('button', 'ds-pq', foot, collide);
        d.type = 'button';
        d.dataset.role = 'xtra';
        d.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
      }
      const cancel = u.el('button', 'ds-travel-cancel', foot, 'Cancel');
      cancel.type = 'button';
      const st = u.el('footer', 'ds-status', document.body);
      icon(st, true);
      u.el('span', 'ds-ready', st, 'Ready');
      if (!ctx.finish && endPlacement === 'status') submit = endBtn(st, 'ds-end-status', endLabel);
      u.el('span', 'ds-sp', st);
      u.el('span', 'ds-clock', st, 'Apr 24, 1994   10:27 AM');
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
