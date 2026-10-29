(function () {
  'use strict';
  const C = {
    'site': 'design-read-figure-color-02',
    'task': 'read-figure',
    'scenario': 'color',
    'style': 'carbon',
    'title': 'Color Match',
    'menu': 'File    Edit    View    Tools    Help',
    'note': 'Color Match',
    'layout': 'brief-left',
    'subtitle': '',
    'aside': '',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      document.body.className = C.style + ' ' + C.layout + ' instruction-' + ctx.display;
      const u = ctx.util,
        app = u.el('main', 'app', document.body),
        top = u.el('header', 'top', app);
      const icon = u.svg('svg', { width: 22, height: 22, viewBox: '0 0 22 22' }, top);
      u.svg('rect', { x: 1, y: 1, width: 20, height: 20, rx: 3, fill: '#6e9dc7' }, icon);
      u.svg('path', { d: 'M5 5h12v12H5zM5 9h12M9 5v12', fill: 'none', stroke: '#e8f4ff', 'stroke-width': 1 }, icon);
      u.el('span', '', top, C.title);
      u.el('span', 'window-controls', top, '−   □   ×');
      if (C.subtitle) u.el('small', '', top, C.subtitle);
      if (C.menu) u.el('nav', 'menu', top, C.menu);
      const endRng = ctx.rng.fork('chrome/end'),
        labels = ctx.content && ctx.content.END_LABELS;
      let placement = 'footer',
        label = 'Submit';
      if (!ctx.finish && endRng.bool(0.5)) {
        label = endRng.pick(
          labels && labels.length ? labels : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'],
        );
        label = typeof label === 'string' ? label : label.label || label.text || label.name || String(label);
        placement = endRng.pick(['header', 'link']);
      }
      const collideRng = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (collideRng.bool(0.3)) {
        const pool = (
          labels && labels.length ? labels : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
        )
          .map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)))
          .filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (pool.length) collide = collideRng.pick(pool);
      }
      const center = u.el('div', 'center', app),
        brief = u.el(
          'div',
          'brief',
          center,
          ctx.display === 'header' || ctx.display === 'panel' ? ctx.instruction : '',
        );
      const stage = u.el('section', 'stage', center);
      if (ctx.display === 'toast') {
        const note = u.el('div', 'carbon-instruction-toast', document.body, ctx.instruction);
        note.setAttribute('role', 'status');
      }
      const aside = u.el('aside', 'aside', document.body);
      u.el('b', '', aside, C.note);
      u.el('p', 'aside-copy', aside, C.aside);
      const footer = u.el('footer', 'bottom', app);
      const help = u.el('span', 'footer-help', footer, 'Help');
      const hs = u.svg(
        'svg',
        { width: 32, height: 32, viewBox: '0 0 32 32', style: 'vertical-align:middle;margin-right:12px' },
        help,
      );
      u.svg('circle', { cx: 16, cy: 16, r: 14, fill: '#aeb7c0', stroke: '#111', 'stroke-width': 2 }, hs);
      const ht = u.svg(
        'text',
        { x: 16, y: 23, 'text-anchor': 'middle', fill: '#17222c', 'font-size': 24, 'font-weight': 700 },
        hs,
      );
      ht.textContent = '?';
      help.prepend(hs);
      if (collide) {
        const d = u.el('button', 'carbon-xtra', footer, collide);
        d.type = 'button';
        d.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
      }
      const clear = u.el('button', 'control clear', footer, 'Clear');
      clear.dataset.clear = 'true';
      let submit = null;
      if (!ctx.finish) {
        if (placement === 'footer') {
          submit = u.el('button', 'submit', footer, label);
          submit.type = 'button';
          submit.addEventListener('click', ctx.submit);
        } else if (placement === 'header') {
          submit = u.el('button', 'carbon-header-end', top, label);
          submit.type = 'button';
          submit.addEventListener('click', ctx.submit);
        } else {
          submit = u.el('a', 'carbon-footer-end', footer, label + ' ›');
          submit.href = '#';
          submit.addEventListener('click', (e) => {
            e.preventDefault();
            ctx.submit();
          });
        }
        if (submit) {
          submit.dataset.role = 'submit';
          submit.setAttribute('aria-label', label);
          submit.title = label;
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
