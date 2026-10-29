(function () {
  'use strict';
  const C = { site: 'design-find-fact-count-04' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const title = u.el('header', 'ds-titlebar', document.body);
      u.el('span', 'ds-appicon', title, '▣');
      u.el('span', 'ds-brand', title, 'Riverton Chronicle – Document Viewer');
      u.el('span', 'ds-window-controls', title, '−　□　×');
      const menu = u.el('nav', 'ds-menu', document.body);
      ['File', 'Edit', 'View', 'Document', 'Tools', 'Help'].forEach((t) => u.el('span', '', menu, t));
      const toolbar = u.el('div', 'ds-toolbar', document.body);
      const icons = [
        '<svg viewBox="0 0 24 24"><path d="M3 7h7l2 2h9v10H3z"/><path d="M3 7V5h7l2 2"/></svg>',
        '<svg viewBox="0 0 24 24"><path d="M6 3h12v6H6zM5 10h14v10H5z"/><path d="M8 14h8M8 17h8"/></svg>',
        '<svg viewBox="0 0 24 24"><circle cx="10" cy="10" r="6"/><path d="m15 15 6 6M10 7v6M7 10h6"/></svg>',
        '<svg viewBox="0 0 24 24"><circle cx="10" cy="10" r="6"/><path d="m15 15 6 6M7 10h6"/></svg>',
      ];
      [
        ['', 'Open'],
        ['', 'Print'],
        ['', 'Zoom In'],
        ['', 'Zoom Out'],
        ['100%', '▾'],
      ].forEach((x, i) => {
        const b = u.el('button', i === 4 ? 'ds-zoom' : 'ds-tool', toolbar);
        b.type = 'button';
        const icon = u.el('b', '', b);
        icon.innerHTML = i < 4 ? icons[i] : x[0];
        u.el('span', '', b, x[1]);
      });
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
          'Complete',
        ]
      ).map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name));
      const baseline = !ctx.finish && er.bool(0.5);
      const placement = ctx.finish ? null : baseline ? 'footer' : er.pick(['header', 'link']);
      const label = ctx.finish
        ? ''
        : baseline
          ? 'Save'
          : er.pick(labels.filter((x) => String(x).toLowerCase() !== 'submit'));
      const cr = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && cr.bool(0.3)) {
        const pool = labels.filter((x) => String(x).toLowerCase() !== String(label).toLowerCase());
        if (pool.length) collide = cr.pick(pool);
      }
      const decoy = (p, text) => {
        const b = u.el('button', 'ds-xtra', p, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
      };
      const end = (p, cls, text) => {
        const b = u.el(cls === 'ds-endlink' ? 'a' : 'button', cls, p, text);
        if (b.tagName === 'BUTTON') b.type = 'button';
        else b.href = '#';
        b.dataset.role = 'submit';
        b.title = label;
        b.setAttribute('aria-label', label);
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      if (collide) decoy(toolbar, collide);
      if (placement === 'header') submit = end(toolbar, 'ds-submit ds-header-submit', label);
      const main = u.el('div', 'ds-main', document.body);
      const content = u.el('main', 'ds-content', main);
      const natural =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'panel'
            ? 'panel'
            : ctx.display === 'toast'
              ? 'toast'
              : 'header';
      let mode = natural;
      if (mode === 'panel' && window.innerWidth < 1260) mode = 'header';
      if (mode === 'header') {
        const n = u.el('div', 'ds-header-note', content);
        u.el('span', 'ds-instruction', n, ctx.instruction);
      }
      const stage = u.el('section', 'ds-stage', content);
      const inspector = u.el('aside', 'ds-inspector', main);
      u.el('h2', '', inspector, 'Document Properties');
      const meta = u.el('div', 'ds-meta', inspector);
      [
        ['Title', 'Riverton Meadows Park Welcomes Visitors'],
        ['Source', 'Riverton Chronicle'],
        ['Date', 'April 18, 2011'],
        ['Author', 'Staff Writer'],
        ['Type', 'Newspaper Article'],
        ['Pages', '3'],
        ['Size', '742 KB'],
        ['Dimensions', '8.5 × 11 in'],
        ['Language', 'English'],
      ].forEach((x) => {
        const row = u.el('div', 'ds-meta-row', meta);
        u.el('span', '', row, x[0] + ':');
        u.el('span', '', row, x[1]);
      });
      u.el('h2', 'ds-pages-title', inspector, 'Pages');
      const pages = u.el('div', 'ds-pages', inspector);
      [
        ['Page 1', 'Riverton Meadows Park Welcomes Visitors'],
        ['Page 2', 'Community Events at Riverton Meadows'],
        ['Page 3', 'Park Information and Visitor Guide'],
      ].forEach((x, i) => {
        const row = u.el('div', 'ds-page ' + (!i ? 'selected' : ''), pages);
        u.el('div', 'ds-thumb', row);
        const text = u.el('div', 'ds-page-text', row);
        u.el('b', '', text, x[0]);
        u.el('span', '', text, x[1]);
        u.el('i', '', row, String(i + 1));
      });
      if (mode === 'panel') {
        const n = u.el('div', 'ds-instruction ds-panel-note', inspector);
        n.textContent = ctx.instruction;
      }
      if (mode === 'toast') {
        const n = u.el('div', 'ds-instruction ds-toast', document.body);
        n.textContent = ctx.instruction;
      }
      const foot = u.el('footer', 'ds-footer', document.body);
      u.el('span', 'ds-ready', foot, 'Ready');
      if (placement === 'footer') submit = end(foot, 'ds-submit', label);
      if (placement === 'link') submit = end(foot, 'ds-endlink', label + ' ›');
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
