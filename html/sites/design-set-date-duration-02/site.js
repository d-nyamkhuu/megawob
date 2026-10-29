(() => {
  'use strict';
  const name = 'design-set-date-duration-02';
  env.site({
    name,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      const title = u.el('header', 'ds-top', content);
      u.el('span', 'ds-brand', title, 'Workout Log');
      const win = u.el('div', 'ds-window', title);
      u.el('span', '', win, '−');
      u.el('span', '', win, '□');
      u.el('span', 'ds-close', win, '×');
      const menu = u.el('nav', 'ds-menu', content);
      ['File', 'Edit', 'View', 'Workout', 'Tools', 'Help'].forEach((x) => u.el('span', '', menu, x));
      const toolbar = u.el('div', 'ds-toolbar', content);
      [
        ['▤', 'New'],
        ['✎', 'Edit'],
        ['✕', 'Delete'],
        ['▥', 'View⌄'],
        ['▤', 'Print'],
      ].forEach(([icon, label]) => {
        const b = u.el('button', 'ds-tool', toolbar);
        u.el('b', '', b, icon);
        u.el('span', '', b, label);
      });
      const main = u.el('div', 'ds-main', content);
      const side = u.el('aside', 'ds-library', main);
      const summary = u.el('div', 'ds-summary', side);
      u.el('h2', '', summary, 'Workouts');
      [
        ['All Workouts', '24'],
        ['Running', '8'],
        ['Cycling', '6'],
        ['Strength Training', '5'],
        ['Yoga', '3'],
        ['Other', '2'],
      ].forEach(([a, b], i) => {
        const row = u.el('div', 'ds-category' + (!i ? ' selected' : ''), summary);
        u.el('span', '', row, a);
        u.el('span', '', row, b);
      });
      u.el('div', 'ds-rule', side);
      [
        ['This Month', '6'],
        ['Last Month', '8'],
        ['This Year', '24'],
      ].forEach(([a, b]) => {
        const row = u.el('div', 'ds-category ds-filter', side);
        u.el('span', '', row, a);
        u.el('span', '', row, b);
      });
      u.el('div', 'ds-rule', side);
      const goals = u.el('div', 'ds-category ds-filter', side);
      u.el('span', '', goals, 'Goals');
      u.el('span', '', goals, '2');
      const list = u.el('section', 'ds-list', main),
        head = u.el('div', 'ds-listhead', list);
      ['Date', 'Type', 'Duration'].forEach((x) => u.el('span', '', head, x));
      const records = [
        ['Apr 21, 2008', 'Running', '30 min'],
        ['Apr 19, 2008', 'Strength', '45 min'],
        ['Apr 16, 2008', 'Cycling', '60 min'],
        ['Apr 14, 2008', 'Running', '35 min'],
        ['Apr 12, 2008', 'Yoga', '60 min'],
        ['Apr 9, 2008', 'Strength', '40 min'],
        ['Apr 7, 2008', 'Running', '50 min'],
        ['Apr 5, 2008', 'Cycling', '90 min'],
        ['Apr 2, 2008', 'Running', '30 min'],
        ['Mar 30, 2008', 'Strength', '45 min'],
        ['Mar 28, 2008', 'Yoga', '60 min'],
        ['Mar 25, 2008', 'Running', '40 min'],
        ['Mar 22, 2008', 'Cycling', '75 min'],
        ['Mar 20, 2008', 'Strength', '40 min'],
        ['Mar 18, 2008', 'Running', '35 min'],
        ['Mar 15, 2008', 'Yoga', '60 min'],
        ['Mar 12, 2008', 'Cycling', '60 min'],
        ['Mar 10, 2008', 'Running', '45 min'],
      ];
      records.forEach((r, i) => {
        const row = u.el('div', 'ds-record' + (i === 6 ? ' active' : ''), list);
        r.forEach((x) => u.el('span', '', row, x));
      });
      const note = (parent, cls) => {
        const n = u.el('aside', cls, parent);
        u.el('div', 'ds-instruction', n, ctx.instruction);
        return n;
      };
      if (ctx.display !== 'hidden' && ctx.display !== 'panel')
        note(content, ctx.display === 'toast' ? 'ds-toast' : 'ds-header-note');
      if (ctx.display === 'panel') note(side, 'ds-brief');
      const footer = u.el('footer', 'ds-footer', content),
        rng = ctx.rng.fork('chrome/end');
      const bank = (ctx.content && ctx.content.END_LABELS) || [
        'Submit',
        'Done',
        'Finish',
        'Continue',
        'Save',
        'OK',
        'Confirm',
        'Apply',
      ];
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      let label = 'Apply',
        place = 'header';
      if (!ctx.finish && !rng.bool(0.5)) {
        place = rng.pick(['header', 'footer', 'link']);
        const opts = bank.map(labelOf).filter((x) => x !== 'Submit');
        if (opts.length) label = rng.pick(opts);
      }
      let submit = null;
      const add = (parent, cls, text, link) => {
        const b = u.el(link ? 'a' : 'button', cls, parent, text);
        if (link) b.href = '#';
        else b.type = 'button';
        b.dataset.role = 'submit';
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      if (!ctx.finish) {
        if (place === 'header') submit = add(toolbar, 'ds-end-header', label);
        if (place === 'footer') submit = add(footer, 'ds-submit', label);
        if (place === 'link') submit = add(footer, 'ds-end-link', label + ' ›', true);
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (!ctx.finish && cr.bool(0.3)) {
        const b = u.el('button', 'ds-xtra', toolbar, 'Next');
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: 'Next', collide: true }));
      }
      return { stage: main.querySelector('.ds-stage') || u.el('main', 'ds-stage', main), submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      u.el(
        'div',
        '',
        el,
        {
          cookie: 'We use cookies to remember your preferences.',
          toast: 'Changes synced.',
          chat: 'Hello. How can we help?',
          promo: 'Try our new workspace.',
          banner: 'Scheduled maintenance tonight.',
        }[ctx.kind],
      );
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
