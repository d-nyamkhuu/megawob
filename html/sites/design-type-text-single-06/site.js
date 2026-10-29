(function () {
  'use strict';
  const C = { site: 'design-type-text-single-06' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const endRng = ctx.rng.fork('chrome/end');
      const collideRng = ctx.rng.fork('chrome/collide');
      const endLabels = (ctx.content && ctx.content.END_LABELS) || [
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
      ];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const defaultEnd = endRng.bool(0.5);
      const placement = defaultEnd ? 'form' : endRng.pick(['title', 'link']);
      const label = defaultEnd ? 'Submit' : labelOf(endRng.pick(endLabels));
      const collision = collideRng.bool(0.3)
        ? (() => {
            const choices = endLabels.map(labelOf).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
            return choices.length ? labelOf(collideRng.pick(choices)) : null;
          })()
        : null;
      const bar = u.el('header', 'ds-bar', document.body);
      u.el('span', '', bar, 'Amiga Workbench');
      u.el('span', '', bar, 'Workbench');
      const clk = u.el('span', 'clk', bar);
      u.el('i', 'ds-flop', clk);
      u.el('span', '', clk, '14:27');

      const icons = u.el('div', 'ds-icons', document.body);
      [
        ['Workbench', 'fl'],
        ['RAM Disk', ''],
        ['Work', ''],
      ].forEach(([t, c]) => {
        const d = u.el('div', 'ds-icon ' + c, icons);
        u.el('i', '', d);
        u.el('div', '', d, t);
      });

      const win = u.el('section', 'ds-win ds-main', document.body);
      const tb = u.el('div', 'ds-title', win);
      u.el('i', 'g', tb);
      u.el('span', '', tb, 'Task Entry - Notes');
      const gs = u.el('span', 'gs', tb);
      u.el('i', '', gs);
      u.el('i', '', gs);
      u.el('i', '', gs);
      const menu = u.el('div', 'ds-menu', win);
      ['File', 'Edit', 'Note', 'Help'].forEach((t) => u.el('span', '', menu, t));
      const inner = u.el('div', 'ds-inner', win);

      const led = u.el('div', 'ds-ledger', inner);
      const tw = u.el('div', 'ds-tablewrap', led);
      const th = u.el('div', 'ds-thead', tw);
      ['#', 'Title', 'Date', 'Status'].forEach((t) => u.el('span', '', th, t));
      [
        ['1', 'Buy supplies', '2024-05-10'],
        ['2', 'Call the workshop', '2024-05-10'],
        ['3', 'Plan weekend', '2024-05-11'],
        ['4', 'Repair lamp', '2024-05-11'],
        ['5', 'Read manual', '2024-05-12'],
      ].forEach((r, i) => {
        const tr = u.el('div', 'ds-tr' + (i === 0 ? ' sel' : ''), tw);
        r.forEach((t) => u.el('span', '', tr, t));
        u.el('span', '', tr, 'Open');
      });
      const sc = u.el('div', 'ds-scroll', led);
      u.el('b', '', sc, '▲');
      u.el('div', 'th', sc);
      u.el('b', '', sc, '▼');

      const det = u.el('div', 'ds-details', inner);
      u.el('span', 'lg', det, 'Task Details');
      if (ctx.display === 'header') {
        const b = u.el('aside', 'ds-brief', det);
        u.el('div', 'ds-instruction', b, ctx.instruction);
      }
      const row = (l, v, cls) => {
        const r = u.el('div', 'ds-row', det);
        u.el('span', 'l', r, l);
        const x = u.el('div', 'ds-box ' + (cls || ''), r, v);
        return r;
      };
      row('Title:', 'Buy supplies');
      const stage = u.el('main', 'ds-stage', det);
      const due = u.el('div', 'ds-row', det);
      u.el('span', 'l', due, 'Due Date:');
      const dd = u.el('div', 'ds-drop', due);
      u.el('div', 'ds-box', dd, '2024-05-10');
      u.el('i', 'ds-cal', dd);
      [
        ['Priority:', 'Normal'],
        ['Status:', 'Open'],
      ].forEach(([l, v]) => {
        const r = u.el('div', 'ds-row', det);
        u.el('span', 'l', r, l);
        const d = u.el('div', 'ds-drop', r);
        u.el('div', 'ds-box', d, v);
        u.el('b', '', d, '▼');
      });
      const btns = u.el('div', 'ds-btns', det);
      ['New', 'Save', 'Delete'].forEach((t) => {
        const b = u.el('button', 'ds-btn', btns, t);
        b.type = 'button';
      });
      let submit = null;
      if (collision) {
        const d = u.el('button', 'ds-menu-xtra', menu, collision);
        d.type = 'button';
        d.dataset.role = 'xtra';
        d.addEventListener('click', () => env.log('decoy', { label: collision, collide: true }));
      }
      if (!ctx.finish) {
        const makeSubmit = (parent, cls, text) => {
          const b = u.el('button', cls, parent, text);
          b.type = 'button';
          b.dataset.role = 'submit';
          b.setAttribute('aria-label', label);
          b.title = label;
          b.addEventListener('click', () => ctx.submit());
          return b;
        };
        if (placement === 'form') submit = makeSubmit(btns, 'ds-btn sub', label);
        else if (placement === 'title') submit = makeSubmit(tb, 'ds-title-end', label);
        else submit = makeSubmit(btns, 'ds-linkend', label + ' ›');
      }

      if (ctx.display === 'panel' || ctx.display === 'toast') {
        const note = u.el('aside', 'ds-mode-note ds-mode-' + ctx.display, document.body);
        if (ctx.display === 'panel') u.el('div', 'ds-mode-heading', note, 'Task Note');
        u.el('div', 'ds-instruction', note, ctx.instruction);
      }

      const pv = u.el('section', 'ds-win ds-preview', document.body);
      const pt = u.el('div', 'ds-title', pv);
      u.el('i', 'g', pt);
      u.el('span', '', pt, 'Preview');
      const pg = u.el('span', 'gs', pt);
      u.el('i', '', pg);
      u.el('i', '', pg);
      const pb = u.el('div', 'body', pv);
      ['Buy supplies', 'Text:', 'Due: 2024-05-10', 'Priority: Normal', 'Status: Open'].forEach((t, i) =>
        u.el('div', i === 1 ? 'ds-preview-text' : '', pb, t),
      );
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
