(function () {
  'use strict';
  const C = { site: 'design-find-fact-tooltip-03' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const s = window.getSelection();
      if (s) s.removeAllRanges();
      const u = ctx.util;
      const win = u.el('div', 'ds-window', document.body);
      const top = u.el('header', 'ds-top', win);
      u.el('span', 'ds-appicon', top, '▣');
      u.el('span', 'ds-brand', top, 'Inventory Manager');
      const wc = u.el('span', 'ds-window-controls', top);
      ['−', '□', '×'].forEach((x) => u.el('b', '', wc, x));
      const menu = u.el('nav', 'ds-menu', win);
      ['File', 'Edit', 'View', 'Tools', 'Reports', 'Help'].forEach((x) => u.el('span', '', menu, x));
      const bar = u.el('div', 'ds-toolbar', win);
      [
        ['▤', 'New'],
        ['▰', 'Open'],
        ['✎', 'Edit'],
        ['✖', 'Delete'],
        ['◉◉', 'Find'],
        ['▣', 'Refresh'],
      ].forEach((p, i) => {
        if (i === 4) {
          const sep = u.el('i', 'ds-separator', bar);
        }
        const b = u.el('button', '', bar);
        u.el('strong', '', b, p[0]);
        u.el('span', '', b, p[1]);
      });
      const area = u.el('div', 'ds-area', win);
      const content = u.el('div', 'ds-content', area);
      const mode = ctx.display;
      let display = mode;
      if (display === 'panel' && window.innerWidth < 1260) display = 'header';
      if (display === 'toast' && window.innerHeight < 700) display = 'header';
      function note(parent, cls) {
        const n = u.el('aside', cls, parent);
        u.el('b', '', n, 'Task');
        u.el('span', '', n, ctx.instruction);
        return n;
      }
      if (display === 'header') note(content, 'ds-header-note');
      const stage = u.el('main', 'ds-stage', content);
      const stats = u.el('aside', 'ds-stats', area);
      const sections = [
        ['Inventory Summary', ['Total products:|12', 'In stock:|10', 'Low stock:|2', 'Out of stock:|0']],
        ['Categories', ['Fitness|5', 'Strength|3', 'Recovery|2', 'Hydration|1', 'Gear|1']],
        [
          'Recent Updates',
          [
            '2004-06-14|Updated DB-5500',
            '2004-06-13|Added ET-6003',
            '2004-06-12|Revised YM-2200',
            '2004-06-11|Updated stock levels',
          ],
        ],
      ];
      sections.forEach(([title, rows]) => {
        const sec = u.el('section', 'ds-stat-section', stats);
        u.el('h2', '', sec, title);
        const body = u.el('div', 'ds-stat-rows', sec);
        rows.forEach((row) => {
          const parts = row.split('|');
          const line = u.el('div', '', body);
          u.el('span', '', line, parts[0]);
          u.el('span', '', line, parts[1]);
        });
      });
      if (display === 'panel') note(area, 'ds-panel-note');
      if (display === 'toast') note(content, 'ds-toast');
      const status = u.el('footer', 'ds-status', win, 'Ready');
      let submit = null;
      const er = ctx.rng.fork('chrome/end');
      const labels = (
        (ctx.content && ctx.content.END_LABELS) || [
          'Submit',
          'Done',
          'Finish',
          'Continue',
          'Save',
          'OK',
          'Confirm',
          'Apply',
        ]
      ).map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name));
      const placement = ctx.finish ? null : er.bool(0.5) ? 'footer' : er.pick(['header', 'link']);
      const label = ctx.finish ? '' : placement === 'footer' ? 'Finish' : er.pick(labels);
      const cr = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && cr.bool(0.3)) {
        const p = labels.filter((x) => String(x).toLowerCase() !== String(label).toLowerCase());
        if (p.length) collide = cr.pick(p);
      }
      const btn = (parent, cls, text, submitter) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.dataset.role = submitter ? 'submit' : 'decoy';
        b.title = label;
        b.setAttribute('aria-label', label);
        b.addEventListener('click', () =>
          submitter ? ctx.submit() : env.log('decoy', { label: text, collide: true }),
        );
        return b;
      };
      if (placement === 'footer') submit = btn(status, 'ds-submit', label, true);
      else if (placement === 'header') submit = btn(bar, 'ds-submit ds-header-submit', label, true);
      else if (placement === 'link') {
        const a = u.el('a', 'ds-endlink', status, label + ' ›');
        a.href = '#';
        a.dataset.role = 'submit';
        a.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        submit = a;
      }
      if (collide) btn(placement === 'footer' ? status : bar, 'ds-xtra', collide, false);
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
      const d = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      d.addEventListener('click', () => ctx.dismiss(ctx.kind === 'cookie' ? 'accept' : 'close'));
      return { el, dismiss: d, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
