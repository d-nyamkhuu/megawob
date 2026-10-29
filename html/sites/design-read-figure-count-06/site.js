(function () {
  'use strict';
  const C = {
    'site': 'design-read-figure-count-06',
    'task': 'read-figure',
    'scenario': 'count',
    'style': 'plain',
    'title': 'Items to look at:',
    'menu': '',
    'note': '',
    'layout': 'split',
    'subtitle': '',
    'aside': '',
  };
  env.site({
    name: C.site,
    styles: ['site.css', 'm.css'],
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
      const tb = u.el('div', 'm-title', top);
      u.el('i', 'm-sys', tb);
      u.el('span', '', tb, 'Shape Counter');
      const mc = u.el('div', 'm-ctl', tb);
      ['min', 'max', 'close'].forEach((t) => u.el('b', t, mc));
      const mb = u.el('div', 'm-menu', top);
      ['File', 'Edit', 'View', 'Tools', 'Help'].forEach((t) => u.el('span', '', mb, t));
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
      const display = ctx.display || 'header',
        briefText = display === 'hidden' ? '' : ctx.instruction;
      const center = u.el('div', 'center', app),
        lb1 = u.el('div', 'm-lab m-l1', center, 'Items'),
        lb2 = u.el('div', 'm-lab m-l2', center, 'Task'),
        brief = u.el('div', 'brief ' + display, center, briefText);
      const stage = u.el('section', 'stage', center);
      const aside = u.el('aside', 'aside', document.body);
      u.el('b', '', aside, C.note);
      u.el('p', 'aside-copy', aside, C.aside);
      const footer = u.el('footer', 'bottom', app);
      u.el('span', '', footer, 'Ready');
      u.el('span', 'm-clock', footer, 'Mon Apr 15 1991   10:24 AM');
      const er = ctx.rng.fork('chrome/end'),
        cr = ctx.rng.fork('chrome/collide');
      const placement = ctx.finish ? null : er.pick(['header', 'link', 'footer', 'footer', 'footer']);
      const labels = ctx.content && ctx.content.END_LABELS,
        ends =
          labels && labels.length ? labels : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const labelRaw = er.pick(ends),
        label = !er.fork('reference-label').bool(0.5)
          ? 'Submit'
          : typeof labelRaw === 'string'
            ? labelRaw
            : labelRaw.label || labelRaw.text || String(labelRaw);
      const collidePool = ends
        .map((x) => (typeof x === 'string' ? x : x.label || x.text || String(x)))
        .filter((x) => String(x).trim().toLowerCase() !== String(label).trim().toLowerCase());
      const collide = cr.bool(0.3) && collidePool.length ? cr.pick(collidePool) : null;
      const decoy = (parent, text, collision) => {
        const b = u.el('button', 'm-xtra', parent, text);
        b.type = 'button';
        b.addEventListener('click', () =>
          env.log('decoy', collision ? { label: text, collide: true } : { label: text }),
        );
      };
      const end = (parent, cls, text) => {
        const b = u.el(cls === 'm-endlink' ? 'a' : 'button', cls, parent, text);
        if (b.tagName === 'BUTTON') b.type = 'button';
        else b.href = '#';
        b.title = label;
        b.setAttribute('aria-label', label);
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      let submit = null;
      if (!ctx.finish) {
        if (placement === 'header') submit = end(tb, 'm-submit-top', label);
        else if (placement === 'link') submit = end(footer, 'm-endlink', label);
        else submit = end(footer, 'submit', label);
        if (collide) decoy(mb, collide, true);
        const dr = cr.fork('filler');
        if (dr.bool(0.25)) {
          const d = ctx.content && ctx.content.DECOY_LABELS;
          const item = d && d.length ? dr.pick(d) : 'Help';
          decoy(mb, typeof item === 'string' ? item : item.label || item.text || String(item), false);
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
