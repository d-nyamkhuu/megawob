(function () {
  'use strict';
  const C = {
    'site': 'design-read-figure-identify-04',
    'task': 'read-figure',
    'scenario': 'identify',
    'style': 'organizer',
    'title': 'SkillLab | Visual Skills Practice',
    'menu': '',
    'note': 'Shape Identification',
    'layout': 'org',
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
        mode = ctx.display || 'header',
        brief = u.el('div', 'brief', center, mode === 'hidden' ? '' : ctx.instruction);
      if (mode === 'panel' || mode === 'toast') {
        const note = u.el('section', 'episode-note episode-' + mode, center);
        u.el('b', 'episode-note-title', note, mode === 'panel' ? 'Instructions' : 'Task note');
        u.el('span', 'episode-note-copy', note, ctx.instruction);
      }
      const stage = u.el('section', 'stage', center),
        aside = u.el('aside', 'aside', document.body),
        footer = u.el('footer', 'bottom', app);
      let submit = null;
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
      ).map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)));
      const endR = ctx.rng.fork('chrome/end'),
        collideR = ctx.rng.fork('chrome/collide');
      const placement = ctx.finish ? null : endR.bool(0.5) ? 'footer' : endR.pick(['header', 'link']);
      let label = 'Submit';
      if (placement && placement !== 'footer') {
        const options = labels.filter((x) => x.trim().toLowerCase() !== 'submit');
        if (options.length) label = endR.pick(options);
      }
      const endBtn = (parent, cls, text, isLink) => {
        const b = u.el(isLink ? 'a' : 'button', cls, parent, text);
        if (isLink) b.href = '#';
        else b.type = 'button';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      if (!ctx.finish) {
        if (placement === 'header') {
          document.body.classList.add('end-header');
          submit = endBtn(top, 'submit organizer-header-end', label, false);
        } else if (placement === 'link') submit = endBtn(footer, 'organizer-end-link', label + ' ›', true);
        else submit = endBtn(footer, 'submit', label, false);
        if (collideR.bool(0.3)) {
          const pool = labels.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
          if (pool.length) {
            const d = u.el('button', 'organizer-pq', footer, collideR.pick(pool));
            d.type = 'button';
            d.addEventListener('click', () => env.log('decoy', { label: d.textContent, collide: true }));
          }
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
