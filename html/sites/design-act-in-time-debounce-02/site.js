(function () {
  'use strict';
  const C = { site: 'design-act-in-time-debounce-02' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util,
        body = document.body;
      body.classList.add('wayfarer');
      const app = u.el('div', 'wf-app', body);
      const rail = u.el('aside', 'wf-rail', app);
      u.el('div', 'wf-logo', rail, '▲');
      u.el('strong', 'wf-wordmark', rail, 'Wayfarer');
      [
        ['◆', 'Home'],
        ['▢', 'Trips'],
        ['◉', 'Explore'],
        ['▣', 'Stays'],
        ['▱', 'Cars'],
        ['☆', 'Rewards'],
      ].forEach((x, i) => {
        const a = u.el('div', 'wf-navitem' + (!i ? ' selected' : ''), rail);
        u.el('b', '', a, x[0]);
        u.el('span', '', a, x[1]);
      });
      const canvas = u.el('main', 'wf-canvas', app);
      const hero = u.el('div', 'wf-hero', canvas);
      const top = u.el('div', 'wf-top-actions', canvas);
      ['⌕', '♧', 'J'].forEach((x, i) => u.el('span', 'wf-action a' + i, top, x));
      const greeting = u.el('div', 'wf-greeting', canvas);
      u.el('h1', '', greeting, 'Good morning');
      u.el('p', '', greeting, 'Where will you go next?');
      const records = u.el('section', 'wf-records', canvas);
      const rh = u.el('header', '', records);
      u.el('h2', '', rh, 'Recent trips');
      u.el('a', '', rh, 'View all');
      [
        ['Seattle', 'Mar 3 – Mar 7, 2022', '▥'],
        ['Honolulu', 'Feb 10 – Feb 16, 2022', '◩'],
        ['Tokyo', 'Jan 12 – Jan 20, 2022', '▤'],
        ['Barcelona', 'Nov 3 – Nov 12, 2021', '▧'],
        ['London', 'Sep 18 – Sep 26, 2021', '▥'],
      ].forEach((x, i) => {
        const row = u.el('div', 'wf-triprow', records);
        u.el('div', 'wf-thumb t' + i, row, x[2]);
        const txt = u.el('div', 'wf-triptext', row);
        u.el('b', '', txt, x[0]);
        u.el('span', '', txt, x[1]);
        u.el('i', '', row, '›');
      });
      const panelWindow = u.el('section', 'wf-window', canvas);
      const toolbar = u.el('header', 'wf-toolbar', panelWindow);
      const tabs = u.el('nav', 'wf-tabs', toolbar);
      [
        ['✈', 'Flights'],
        ['▰', 'Stays'],
        ['▱', 'Cars'],
        ['▣', 'Packages'],
      ].forEach((x, i) => {
        const t = u.el('div', 'wf-tab' + (!i ? ' active' : ''), tabs);
        u.el('b', '', t, x[0]);
        u.el('span', '', t, x[1]);
      });
      let submit = null,
        label = 'Submit',
        placement = 'header';
      const make = (parent, cls) => {
        const b = u.el('button', cls, parent, label);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.title = label;
        b.setAttribute('aria-label', label);
        b.addEventListener('click', () => ctx.submit());
        return b;
      };
      if (!ctx.finish) {
        const fallback = [
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
        const labels =
          ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
            ? ctx.content.END_LABELS
            : fallback;
        const text = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
        const er = ctx.rng.fork('chrome/end');
        const common = er.bool(0.5);
        label = common ? 'Confirm' : text(er.pick(labels));
        placement = common ? 'header' : er.pick(['header', 'footer', 'link']);
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const pool = labels.map(text).filter((x) => String(x).toLowerCase() !== label.toLowerCase());
          if (pool.length) {
            const d = u.el('button', 'wf-xtra', toolbar, String(cr.pick(pool)));
            d.type = 'button';
            d.dataset.role = 'xtra';
            d.addEventListener('click', () => env.log('decoy', { label: d.textContent, collide: true }));
          }
        }
        if (placement === 'header') submit = make(toolbar, 'wf-submit');
      }
      const note = ctx.instruction;
      const mode = ctx.display || 'header';
      let noteBox = null;
      if (mode === 'header' && note) {
        noteBox = u.el('div', 'wf-note', canvas, note);
      }
      if (mode === 'panel' && note) {
        const panel = u.el('aside', 'wf-instruction-panel', canvas, note);
      }
      if (mode === 'toast' && note) {
        const toast = u.el('aside', 'wf-instruction-toast', canvas, note);
      }
      const stage = u.el(
        'main',
        'ds-stage wf-stage' + (!ctx.finish && placement === 'footer' ? ' wf-stage-footer' : ''),
        panelWindow,
      );
      if (!ctx.finish && placement === 'footer') {
        const footer = u.el('footer', 'wf-footer', panelWindow);
        submit = make(footer, 'wf-submit');
      }
      if (!ctx.finish && placement === 'link') submit = make(toolbar, 'wf-link');
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
