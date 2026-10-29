(function () {
  'use strict';
  const C = {
    'site': 'design-read-figure-ascending-01',
    'task': 'read-figure',
    'scenario': 'ascending',
    'style': 'bauhaus',
    'title': 'Mind Grid',
    'menu': 'Task 1 of 1',
    'note': 'Focus Builds Progress',
    'layout': 'perimeter',
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
      if (['mint', 'qt', 'dark', 'electron', 'motif', 'human', 'beos', 'gtk', 'eink'].includes(C.style)) {
        const icon = u.svg('svg', { width: 26, height: 26, viewBox: '0 0 26 26', class: 'title-icon' }, top);
        u.svg(
          'rect',
          {
            x: 3,
            y: 2,
            width: 20,
            height: 22,
            rx: C.style === 'mint' ? 0 : 3,
            fill:
              C.style === 'mint'
                ? 'none'
                : C.style === 'dark'
                  ? '#8266ce'
                  : C.style === 'electron'
                    ? '#ee8520'
                    : '#d7e2e8',
            stroke: 'currentColor',
            'stroke-width': 1.5,
          },
          icon,
        );
        u.svg(
          'path',
          { d: 'M7 7h12M7 11h12M7 15h12M7 19h9', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5 },
          icon,
        );
      }
      u.el('span', '', top, C.title);
      if (['qt', 'dark', 'electron', 'motif', 'human', 'gtk', 'eink'].includes(C.style)) {
        const wc = u.el('div', 'native-window-controls', top);
        for (const kind of ['min', 'max', 'close']) {
          const svg = u.svg('svg', { width: 20, height: 20, viewBox: '0 0 20 20' }, wc);
          u.svg(
            'path',
            {
              d: kind === 'min' ? 'M3 12h14' : kind === 'max' ? 'M4 4h12v12H4z' : 'M4 4l12 12M16 4L4 16',
              fill: 'none',
              stroke: 'currentColor',
              'stroke-width': 1.5,
            },
            svg,
          );
        }
      }
      if (C.subtitle) u.el('small', '', top, C.subtitle);
      if (C.menu) u.el('nav', 'menu', top, C.menu);
      const center = u.el('div', 'center', app),
        brief = u.el('div', 'brief', center, ctx.display === 'hidden' ? '' : ctx.instruction);
      const stage = u.el('section', 'stage', center);
      const aside = u.el('aside', 'aside', document.body);
      u.el('b', '', aside, C.note);
      u.el('p', 'aside-copy', aside, C.aside);
      const footer = u.el('footer', 'bottom', app),
        content = ctx.content || {},
        labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x)),
        labels = (
          content.END_LABELS || ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', '✓']
        ).map(labelOf),
        endRng = ctx.rng.fork('chrome/end'),
        collideRng = ctx.rng.fork('chrome/collide');
      let submit = null;
      if (!ctx.finish) {
        const placement = endRng.pick(['footer', 'footer', 'footer', 'rail', 'header', 'link']);
        let label = placement === 'footer' ? 'Submit' : labelOf(endRng.pick(labels));
        if (placement === 'link') {
          submit = u.el('a', 'submit end-link', footer, label);
          submit.href = '#';
        } else {
          submit = u.el(
            'button',
            'submit end-' + placement,
            placement === 'header' ? top : placement === 'rail' ? aside : footer,
            label,
          );
          submit.type = 'button';
        }
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      const decoy = (parent, label, collides) => {
        const b = u.el('button', 'end-xtra', parent, label);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', collides ? { label, collide: true } : { label }));
      };
      const filler = content.DECOY_LABELS || [];
      if (filler.length && endRng.bool(0.25)) decoy(top, labelOf(endRng.pick(filler)), false);
      if (!ctx.finish && collideRng.bool(0.3)) {
        const actual = submit.getAttribute('aria-label').trim().toLowerCase(),
          pool = [...new Set(labels.filter((x) => x.trim().toLowerCase() !== actual))];
        if (pool.length) decoy(aside, labelOf(collideRng.pick(pool)), true);
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
