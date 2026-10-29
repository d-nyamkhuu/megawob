(function () {
  'use strict';
  const C = {
    'site': 'design-read-figure-identify-05',
    'task': 'read-figure',
    'scenario': 'identify',
    'style': 'wood',
    'title': 'Figure Identification',
    'menu': 'File        Edit        Tools        Help',
    'note': 'Shape Identification',
    'layout': 'wood',
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
      const globe = u.svg('svg', { width: 26, height: 26, viewBox: '0 0 26 26', class: 'globe' }, top);
      u.svg('circle', { cx: 13, cy: 13, r: 11, fill: '#388aaf', stroke: '#bfa67a', 'stroke-width': 1.5 }, globe);
      u.svg(
        'path',
        {
          d: 'M4 9l5-4 4 2-1 5 4 3-2 6-4-3-1-5-4-1M17 4l4 5-3 3-3-3',
          fill: '#bfa675',
          stroke: '#e2c397',
          'stroke-width': 0.4,
        },
        globe,
      );
      u.svg('path', { d: 'M5 6Q10 1 16 4', stroke: '#d9e6d9', 'stroke-width': 2, fill: 'none' }, globe);
      u.el('span', '', top, C.title);
      if (['qt', 'dark', 'electron', 'motif', 'human', 'gtk', 'eink', 'wood'].includes(C.style)) {
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
      for (const corner of ['tl', 'tr', 'bl', 'br']) u.el('i', 'frame-screw ' + corner, center);
      const stage = u.el('section', 'stage', center);
      const aside = u.el('aside', 'aside', document.body);
      u.el('b', '', aside, C.note);
      u.el('p', 'aside-copy', aside, C.aside);
      const footer = u.el('footer', 'bottom', app);
      let submit = null;
      const er = ctx.rng.fork('chrome/end'),
        legacy = er.bool(0.5),
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
        ],
        entry = legacy ? 'Submit' : er.pick(labels),
        label = String((entry && entry.label) || entry),
        placement = legacy ? 'footer' : er.pick(['header', 'link']);
      const end = (parent, kind, text) => {
        const b = u.el(kind === 'link' ? 'a' : 'button', kind === 'link' ? 'submit-link' : 'submit', parent, text);
        if (kind === 'link') b.href = '#';
        else b.type = 'button';
        b.setAttribute('aria-label', text);
        b.title = text;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      if (!ctx.finish) {
        if (placement === 'footer') submit = end(footer, 'button', label);
        else if (placement === 'header') submit = end(top, 'button', label);
        else submit = end(footer, 'link', label + ' ›');
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const own = label.trim().toLowerCase(),
          pool = labels.map((x) => String((x && x.label) || x)).filter((x) => x.trim().toLowerCase() !== own),
          other = pool.length ? cr.pick(pool) : 'Done',
          where = cr.pick(['header', 'footer']),
          parent = where === 'header' ? top : footer,
          decoy = u.el('button', 'end-xtra', parent, other);
        decoy.type = 'button';
        decoy.addEventListener('click', () => env.log('decoy', { label: other, collide: true }));
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
