(function () {
  'use strict';
  const C = { site: 'design-find-fact-locate-11', tabs: ['Documents', 'Search', 'Reports', 'Settings'] };
  env.site({
    name: C.site,
    styles: ['site.css', 'atlas.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        header = u.el('header', 'ds-top', document.body),
        brand = u.el('div', 'ds-brand', header);
      u.el('span', 'ds-logo', brand, '▤');
      u.el('span', '', brand, 'Atlas');
      const nav = u.el('nav', 'ds-menu', header);
      C.tabs.forEach((x, i) => u.el('span', i === 0 ? 'active' : '', nav, x));
      const user = u.el('div', 'ds-user', header);
      u.el('span', 'ds-avatar', user, '●');
      u.el('span', '', user, 'AC');
      u.el('span', 'ds-caret', user, '⌄');
      const content = u.el('div', 'ds-content', document.body);
      const natural = ctx.display;
      let mode =
        natural === 'hidden' ? 'hidden' : natural === 'toast' ? 'toast' : natural === 'panel' ? 'panel' : 'header';
      if (mode === 'panel' && window.innerWidth < 1260) mode = 'header';
      if (mode === 'header') {
        const note = u.el('div', 'ds-header-note', content);
        u.el('span', 'ds-info', note, 'i');
        u.el('span', '', note, ctx.instruction);
      }
      const main = u.el('div', 'ds-main', content);
      const stage = u.el('main', 'ds-stage', main);
      const side = u.el('aside', 'ds-side', main);
      u.el('h2', '', side, 'Document Overview');
      const meta = u.el('div', 'ds-meta', side);
      [
        ['Title', 'Product Catalog'],
        ['Version', '3.2'],
        ['Last updated', 'Mar 3, 2022'],
        ['Total sections', '7'],
        ['Total terms', '7'],
      ].forEach(([a, b]) => {
        u.el('span', '', meta, a);
        u.el('span', '', meta, b);
      });
      const index = u.el('div', 'ds-index', side);
      u.el('h3', '', index, 'Sections');
      ['Aurora', 'Beacon', 'Cipher', 'Drift', 'Eclipse', 'Summit', 'Zenith'].forEach((x, i) => {
        const row = u.el('div', 'ds-index-row', index);
        u.el('span', '', row, `${i + 1}.`);
        u.el('span', '', row, x);
        u.el('span', 'ds-term', row, '1 term');
      });
      if (mode === 'panel') {
        const note = u.el('aside', 'ds-note-panel', side);
        u.el('span', 'ds-info', note, 'i');
        u.el('span', '', note, ctx.instruction);
        side.prepend(note);
      }
      if (mode === 'toast') {
        const note = u.el('aside', 'ds-toast', content);
        u.el('span', 'ds-info', note, 'i');
        u.el('span', '', note, ctx.instruction);
      }
      const foot = u.el('footer', 'ds-footer', content);
      u.el('span', 'ds-status', foot, '●  All systems operational');
      let submit = null;
      const er = ctx.rng.fork('chrome/end'),
        labels = (
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
      const placement = ctx.finish ? null : er.bool(0.5) ? 'footer' : er.pick(['header', 'link']);
      const label = ctx.finish
        ? ''
        : placement === 'footer'
          ? 'OK'
          : er.pick(labels.filter((x) => String(x).toLowerCase() !== 'submit'));
      const cr = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && cr.bool(0.3)) {
        const pool = labels.filter((x) => String(x).toLowerCase() !== String(label).toLowerCase());
        if (pool.length) collide = cr.pick(pool);
      }
      const decoy = (p, t) => {
        const b = u.el('button', 'ds-xtra', p, t);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: t, collide: true }));
      };
      const end = (p, cls, t) => {
        const b = u.el('button', cls, p, t);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.title = t;
        b.setAttribute('aria-label', t);
        b.addEventListener('click', () => ctx.submit());
        return b;
      };
      if (collide) decoy(foot, collide);
      if (placement === 'footer') submit = end(foot, 'ds-submit', label);
      if (placement === 'header') submit = end(header, 'ds-submit ds-header-submit', label);
      if (placement === 'link') {
        const a = u.el('a', 'ds-endlink', foot, label + ' ›');
        a.href = '#';
        a.dataset.role = 'submit';
        a.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        submit = a;
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const b = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      b.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss: b, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
