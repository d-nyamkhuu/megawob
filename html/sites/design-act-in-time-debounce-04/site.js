(function () {
  'use strict';
  const C = {
    'site': 'design-act-in-time-debounce-04',
    'brand': 'AirTravel Pro',
    'instruction': 'right',
    'rail':
      'Travel Help|Finding flights|City names and airports|Changing or canceling|Baggage information|Tips|Type a city name to see a list of matching cities and airports.|You can enter the city name or the airport name.|For best results, use the full name rather than an abbreviation.|Popular destinations|New York (JFK) · United States|London (LHR) · United Kingdom|Tokyo (NRT) · Japan|Sydney (SYD) · Australia',
    'menu': '✈   Flights|▣   Hotels|▰   Cars|▣   My Trips|⚙   Preferences',
    'briefTitle': 'Your task',
  };
  env.site({
    name: C.site,
    styles: ['site.css', 'qt.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-brand', top, C.brand);
      const meta = u.el('div', 'ds-window-meta', top);
      let submit = null,
        placement = null,
        label = 'Continue';
      const makeSubmit = (parent, cls) => {
        const b = u.el('button', cls, parent);
        b.textContent = label;
        b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
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
        const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
        const er = ctx.rng.fork('chrome/end');
        const original = er.bool(0.5);
        label = original ? 'Continue' : labelOf(er.pick(labels));
        placement = original ? 'title' : er.pick(['shelf', 'title', 'status']);
        const collideRng = ctx.rng.fork('chrome/collide');
        if (collideRng.bool(0.3)) {
          const pool = labels.map(labelOf).filter((x) => String(x).trim().toLowerCase() !== label.trim().toLowerCase());
          if (pool.length) {
            const d = u.el('button', 'ds-pq', meta, String(collideRng.pick(pool)));
            d.type = 'button';
            d.dataset.role = 'xtra';
            d.addEventListener('click', () => env.log('decoy', { label: d.textContent, collide: true }));
          }
        }
        ['−', '□', '×'].forEach((t) => {
          const b = u.el('button', 'ds-window-control', meta, t);
          b.type = 'button';
        });
        if (placement === 'title') submit = makeSubmit(meta, 'ds-submit ds-submit-title');
      } else
        ['−', '□', '×'].forEach((t) => {
          const b = u.el('button', 'ds-window-control', meta, t);
          b.type = 'button';
        });
      const nav = u.el('nav', 'ds-menu', document.body);
      C.menu.split('|').forEach((t, i) => u.el('span', i === 0 ? 'active' : '', nav, t));
      const mode = ctx.display || 'header';
      const body = u.el('div', 'ds-body', document.body);
      const rail = u.el('aside', 'ds-rail', body);
      C.rail.split('|').forEach((t, i) => {
        u.el(
          'div',
          [
            'ds-side-title',
            'ds-side-link',
            'ds-side-link',
            'ds-side-link',
            'ds-side-link',
            'ds-side-section',
            'ds-side-copy',
            'ds-side-copy',
            'ds-side-copy',
            'ds-side-section',
            'ds-destination',
            'ds-destination',
            'ds-destination',
            'ds-destination',
          ][i],
          rail,
          t,
        );
        if (i === 0 && mode === 'panel') {
          const note = u.el('aside', 'ds-panel-note', rail);
          u.el('strong', '', note, 'Your task');
          u.el('div', '', note, ctx.instruction);
        }
      });
      if (mode === 'header') {
        const n = u.el('div', 'ds-header-note', document.body);
        u.el('span', '', n, ctx.instruction);
      }
      const content = u.el('div', 'ds-content', body);
      const stage = u.el('main', 'ds-stage', content);
      const foot = u.el('footer', 'ds-footer', document.body);
      u.el('span', '', foot, 'Ready  ·  AirTravel Pro');
      if (!ctx.finish && placement === 'shelf') submit = makeSubmit(foot, 'ds-submit');
      if (!ctx.finish && placement === 'status') submit = makeSubmit(foot, 'ds-submit ds-submit-status');
      if (mode === 'toast') {
        const note = u.el('div', 'ds-toast', document.body);
        u.el('div', 'ds-instruction ds-instruction-toast', note, ctx.instruction);
        const x = u.el('button', 'ds-toast-close', note, '×');
        x.type = 'button';
        x.addEventListener('click', () => note.remove());
      }
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
