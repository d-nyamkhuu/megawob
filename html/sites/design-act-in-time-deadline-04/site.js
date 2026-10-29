(function () {
  'use strict';
  const C = { site: 'design-act-in-time-deadline-04' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        body = document.body;
      const desk = u.el('div', 'ds-desktop', body);
      const menu = u.el('div', 'ds-menu', desk);
      [
        ['●', ''],
        ['File', ''],
        ['Edit', ''],
        ['View', ''],
        ['Trips', ''],
        ['Reservations', ''],
        ['Window', ''],
        ['Help', ''],
      ].forEach(([t]) => u.el('span', '', menu, t));
      const clock = u.el('span', 'ds-clock', menu, '9:14 AM');
      const win = u.el('section', 'ds-window', desk);
      const title = u.el('header', 'ds-titlebar', win);
      u.el('span', 'ds-closebox', title, '');
      u.el('strong', 'ds-window-title', title, 'Travel Planner');
      const winbox = u.el('span', 'ds-zoom', title, '▣');
      const app = u.el('div', 'ds-app', win);
      const rail = u.el('nav', 'ds-rail', app);
      const iconArt = [
        '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M15 14V9h18v5M9 15h30v27H9z" fill="none" stroke="currentColor" stroke-width="3"/><path d="M20 15v27M28 15v27" fill="none" stroke="currentColor" stroke-width="2.5"/></svg>',
        '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M23 4h3l2 15 14 9v4l-15-5-1 11 6 4v3l-8-2-8 2v-3l6-4-1-11-15 5v-4l14-9z" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/></svg>',
        '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M5 40V13h11v13h7V19h18v21M5 34h38M10 9h12v4H10zM31 23v5M36 23v5" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/><path d="M25 40V27h16v13" fill="none" stroke="currentColor" stroke-width="3"/></svg>',
        '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M8 27l3-10q1-4 5-4h16q4 0 5 4l3 10 3 3v9h-4v-4H9v4H5v-9z" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/><path d="M13 25h22l-3-8H16zM12 30h5M31 30h5" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="13" cy="34" r="2"/><circle cx="35" cy="34" r="2"/></svg>',
        '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M8 16l29-8 6 23-29 9z" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/><path d="M15 19l2 2m4-4 2 2m4-4 2 2m-14 9 2 2m4-4 2 2" stroke="currentColor" stroke-width="2.5"/><circle cx="34" cy="27" r="1.6"/></svg>',
        '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M12 5h25v38H12z" fill="none" stroke="currentColor" stroke-width="3"/><path d="M18 14h13M18 21h13M18 28h13M18 35h9" stroke="currentColor" stroke-width="2.5"/></svg>',
      ];
      [['Trips'], ['Flights'], ['Hotels'], ['Cars'], ['Deals'], ['My Trips']].forEach(([label], i) => {
        const item = u.el('div', 'ds-navitem' + (i === 0 ? ' selected' : ''), rail);
        const icon = u.el('span', 'ds-navicon', item);
        icon.innerHTML = iconArt[i];
        u.el('span', 'ds-navlabel', item, label);
      });
      const main = u.el('main', 'ds-main', app);
      const task = u.el('div', 'ds-task', main);
      const taskline = u.el('div', 'ds-taskline', task);
      let submit = null,
        placement = null,
        label = 'Continue';
      const makeSubmit = (parent, cls) => {
        const b = u.el('button', cls, parent, label);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', () => ctx.submit());
        return b;
      };
      if (!ctx.finish) {
        const fallback = ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete'];
        const labels =
          ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
            ? ctx.content.END_LABELS
            : fallback;
        const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
        const er = ctx.rng.fork('chrome/end');
        const standard = er.bool(0.5);
        label = standard ? 'Continue' : labelOf(er.pick(labels));
        placement = standard ? 'footer' : er.pick(['header', 'footer', 'link', 'icon']);
        const c = ctx.rng.fork('chrome/collide');
        if (c.bool(0.3)) {
          const pool = labels.map(labelOf).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
          if (pool.length) {
            const d = u.el('button', 'ds-xtra', taskline, String(c.pick(pool)));
            d.type = 'button';
            d.dataset.role = 'xtra';
            d.addEventListener('click', () => env.log('decoy', { label: d.textContent, collide: true }));
          }
        }
        if (placement === 'header') submit = makeSubmit(taskline, 'ds-submit ds-head-submit');
        if (placement === 'icon') {
          submit = makeSubmit(taskline, 'ds-submit ds-icon-submit');
          submit.textContent = '✓';
          submit.title = label;
          submit.setAttribute('aria-label', label);
        }
      }
      const mode = ctx.display || 'header';
      if (mode === 'header') u.el('div', 'ds-instruction ds-header-note', taskline, ctx.instruction);
      if (mode === 'panel' || mode === 'toast')
        u.el('div', 'ds-instruction ds-header-note ds-small-fallback', taskline, ctx.instruction);
      const work = u.el('div', 'ds-work', task);
      const stage = u.el('div', 'ds-stage', work);
      const intro = u.el('div', 'ds-trip-intro', work);
      u.el('div', 'ds-mountain', intro);
      const introcopy = u.el('div', 'ds-introcopy', intro);
      u.el('h1', '', introcopy, 'Mountain View Express');
      u.el('div', 'ds-subtitle', introcopy, 'Scenic train from Riverdale to Pinecrest');
      u.el(
        'p',
        '',
        introcopy,
        'Limited seats are released for this popular route. They’ll be available soon. Please wait for the window to open.',
      );
      if (mode === 'toast') u.el('div', 'ds-instruction ds-toast', work, ctx.instruction);
      const side = u.el('aside', 'ds-summary', app);
      const section = (heading) => {
        const s = u.el('section', 'ds-summary-section', side);
        u.el('h2', '', s, heading);
        return s;
      };
      if (mode === 'panel') u.el('div', 'ds-instruction ds-panel-note', side, ctx.instruction);
      const details = section('Trip Details');
      u.el('div', 'ds-train-art', details);
      [
        ['Route:', 'Riverdale → Pinecrest'],
        ['Date:', 'Sat, Jun 18, 1988'],
        ['Depart:', '8:00 AM'],
        ['Arrive:', '11:20 AM'],
        ['Duration:', '3 h 20 m'],
        ['Service:', 'Mountain View Express'],
      ].forEach(([k, v]) => {
        const r = u.el('div', 'ds-detail-row', details);
        u.el('b', '', r, k);
        u.el('span', '', r, v);
      });
      const availability = section('Availability');
      [
        ['First Class:', '12 seats'],
        ['Coach:', '48 seats'],
        ['Total:', '60 seats'],
      ].forEach(([k, v]) => {
        const r = u.el('div', 'ds-detail-row', availability);
        u.el('b', '', r, k);
        u.el('span', '', r, v);
      });
      const about = section('About This Trip');
      u.el(
        'p',
        'ds-about',
        about,
        'A relaxing ride through pine forests, rivers and mountain valleys. Large windows and a cafe car on board.',
      );
      const foot = u.el('footer', 'ds-footer', task);
      u.el('span', 'ds-footer-text', foot, '');
      if (!ctx.finish && placement === 'footer') submit = makeSubmit(foot, 'ds-submit');
      if (!ctx.finish && placement === 'link') {
        submit = makeSubmit(foot, 'ds-endlink');
        submit.textContent = label + ' ›';
      }
      if (mode === 'hidden') {
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'This site uses cookies to keep your travel preferences.',
        toast: 'Reservation details updated.',
        chat: 'Travel desk. How may we help?',
        promo: 'Discover more scenic routes.',
        banner: 'Mountain View Express reservations open shortly.',
      };
      u.el('div', 'ds-overlay-text', el, texts[ctx.kind] || texts.toast);
      const dismiss = u.el('button', 'ds-overlay-dismiss', el, ctx.kind === 'banner' ? 'Dismiss' : 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', () => ctx.dismiss(ctx.kind === 'cookie' ? 'accept' : 'close'));
      if (ctx.kind === 'cookie') {
        const accept = u.el('button', 'ds-overlay-dismiss', el, 'Accept all');
        accept.type = 'button';
        accept.addEventListener('click', () => ctx.dismiss('accept'));
      }
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
