(function () {
  'use strict';
  const C = { site: 'design-find-fact-datagrid-01' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const sel = window.getSelection();
      if (sel) sel.removeAllRanges();
      const u = ctx.util;
      const win = u.el('header', 'ds-window', document.body);
      u.el('span', 'ds-plane', win, '✈');
      u.el('span', 'ds-brand', win, 'SkyWays');
      u.el('div', 'ds-window-controls', win, '−　□　×');
      const top = u.el('nav', 'ds-top', document.body);
      u.el('span', 'ds-plane ds-main-plane', top, '✈');
      u.el('strong', 'ds-title', top, 'Flights');
      const nav = u.el('div', 'ds-tabs', top);
      ['Departures', 'Arrivals', 'Airlines', 'Airports'].forEach((x, i) => {
        const a = u.el('span', i === 0 ? 'active' : '', nav, x);
      });
      const search = u.el('div', 'ds-global-search', top);
      search.innerHTML =
        '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="8.5" cy="8.5" r="5.8"/><path d="m13 13 4 4"/></svg>';
      u.el('span', '', search, 'Search flights, airports or cities...');
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
      const body = u.el('div', 'ds-content', document.body);
      if (mode === 'header') {
        const h = u.el('div', 'ds-header-note', body);
        u.el('div', 'ds-instruction', h, ctx.instruction);
      }
      const main = u.el('main', 'ds-main', body);
      if (mode === 'panel') {
        const p = u.el('aside', 'ds-brief', main);
        u.el('h2', '', p, 'Task details');
        u.el('div', 'ds-instruction', p, ctx.instruction);
      }
      const stage = u.el('section', 'ds-stage', main);
      if (mode === 'toast') {
        const note = u.el('aside', 'ds-toast', body);
        u.el('div', 'ds-instruction', note, ctx.instruction);
      }
      const dock = u.el('footer', 'ds-dock', document.body);
      const items = [
        ['✈', 'Flights'],
        ['▦', 'Bookings'],
        ['♧', 'Passengers'],
        ['▢', 'Airports'],
        ['▥', 'Reports'],
        ['⚙', 'Settings'],
      ];
      items.forEach((it, i) => {
        const a = u.el('div', i === 0 ? 'ds-dock-item selected' : 'ds-dock-item', dock);
        u.el('span', 'ds-dock-icon', a, it[0]);
        u.el('span', '', a, it[1]);
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
        ]
      ).map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name));
      const baseline = !ctx.finish && er.bool(0.5);
      const placement = ctx.finish ? null : baseline ? 'footer' : er.pick(['header', 'link']);
      const label = ctx.finish
        ? ''
        : baseline
          ? 'Submit'
          : er.pick(labels.filter((x) => String(x).toLowerCase() !== 'submit'));
      const cr = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && cr.bool(0.3)) {
        const pool = labels.filter((x) => String(x).toLowerCase() !== String(label).toLowerCase());
        if (pool.length) collide = cr.pick(pool);
      }
      const decoy = (parent, text) => {
        const b = u.el('button', 'ds-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
      };
      const end = (parent, cls, text) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.title = label;
        b.setAttribute('aria-label', label);
        b.addEventListener('click', () => ctx.submit());
        return b;
      };
      const tools = u.el('div', 'ds-tools', top);
      if (collide) decoy(tools, collide);
      if (placement === 'header') submit = end(tools, 'ds-submit ds-header-submit', label);
      if (placement === 'footer') submit = end(dock, 'ds-submit', label);
      if (placement === 'link') submit = end(dock, 'ds-endlink', label + ' ›');
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
