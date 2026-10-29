(function () {
  'use strict';
  const C = { 'site': 'design-read-figure-shades-07', 'title': 'Tile Challenge' };
  env.site({
    name: C.site,
    styles: ['site.css', 'metro.css'],
    frame(ctx) {
      document.body.className = 'metro instruction-' + ctx.display;
      const u = ctx.util,
        app = u.el('main', 'app', document.body),
        tb = u.el('header', 'titlebar', app);
      const hb = u.el('div', 'hamb', tb);
      const ic = u.svg('svg', { width: 20, height: 16, viewBox: '0 0 20 16' }, hb);
      u.svg('path', { d: 'M1 2h18M1 8h18M1 14h18', fill: 'none', stroke: '#fff', 'stroke-width': 2 }, ic);
      u.el('span', 'ttl', tb, C.title);
      const wc = u.el('div', 'wc', tb);
      const g = u.svg('svg', { width: 16, height: 16, viewBox: '0 0 16 16' }, u.el('span', '', wc));
      u.svg('path', { d: 'M2 8h12', stroke: '#fff', 'stroke-width': 1.5 }, g);
      const g2 = u.svg('svg', { width: 16, height: 16, viewBox: '0 0 16 16' }, u.el('span', '', wc));
      u.svg('path', { d: 'M3 3h10v10H3z', fill: 'none', stroke: '#fff', 'stroke-width': 1.5 }, g2);
      const g3 = u.svg('svg', { width: 16, height: 16, viewBox: '0 0 16 16' }, u.el('span', '', wc));
      u.svg('path', { d: 'M3 3l10 10M13 3L3 13', stroke: '#fff', 'stroke-width': 1.5 }, g3);
      const idx = u.el('nav', 'index', app);
      for (let i = 1; i <= 10; i++) u.el('span', i === 1 ? 'on' : '', idx, String(i));
      const center = u.el('div', 'center', app);
      const brief = u.el('div', 'brief', center, ctx.display === 'hidden' ? '' : ctx.instruction);
      const stage = u.el('section', 'stage', center);
      if (ctx.display !== 'hidden' && !(ctx.display === 'panel' && app.clientWidth > 1100)) {
        const note = brief.getBoundingClientRect(),
          box = center.getBoundingClientRect();
        stage.style.top =
          Math.max(parseFloat(getComputedStyle(stage).top), note.bottom - box.top + (18 * app.clientHeight) / 941) +
          'px';
      }
      const footer = u.el('footer', 'bottom', app);
      let submit = null;
      const er = ctx.rng.fork('chrome/end'),
        labels = (ctx.content && ctx.content.END_LABELS) || [
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
      let place = 'footer',
        label = 'Submit';
      if (!ctx.finish && !er.bool(0.5)) {
        place = er.pick(['toolbar', 'link']);
        const choices = labels
          .map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name))
          .filter((x) => x && String(x).toLowerCase() !== 'submit');
        label = String(er.pick(choices.length ? choices : labels));
      }
      const cr = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && cr.bool(0.3)) {
        const choices = labels
          .map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name))
          .filter((x) => x && String(x).trim().toLowerCase() !== label.trim().toLowerCase());
        if (choices.length) collide = String(cr.pick(choices));
      }
      const end = (parent, cls, text) => {
        const b = u.el(cls === 'end-link' ? 'a' : 'button', cls, parent, text);
        b.type = 'button';
        if (b.tagName === 'A') b.href = '#';
        b.title = text;
        b.setAttribute('aria-label', text);
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      const clr = u.el('button', 'clear', footer, 'Clear');
      clr.type = 'button';
      if (!ctx.finish) {
        if (place === 'footer') submit = end(footer, 'submit', label);
        if (place === 'toolbar') submit = end(tb, 'metro-end', label);
        if (place === 'link') submit = end(footer, 'end-link', label + ' ›');
        if (collide) {
          const d = u.el('button', 'metro-xtra', footer, collide);
          d.type = 'button';
          footer.insertBefore(d, clr);
          d.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body);
      const messages = {
        cookie: 'This application stores preferences on your device.',
        toast: 'Your workspace has been synced.',
        chat: 'Need help with this exercise?',
        promo: 'Try the new practice collection.',
        banner: 'An updated practice collection is available.',
      };
      u.el('span', '', el, messages[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Dismiss');
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
