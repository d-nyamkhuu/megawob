(function () {
  'use strict';
  const C = {
    'site': 'design-read-figure-identify-03',
    'task': 'read-figure',
    'scenario': 'identify',
    'style': 'dark',
    'title': '',
    'menu': 'File   Edit   View   Help',
    'note': 'Shape Quiz',
    'layout': 'brief-left',
    'subtitle': '',
    'aside': '',
  };
  env.site({
    name: C.site,
    styles: ['site.css', 'beos.css'],
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
      const info = u.el('div', 'qinfo', app);
      u.el('span', '', info, 'Question 1 of 10');
      u.el('span', 'score', info, 'Score: 0');
      const center = u.el('div', 'center', app),
        brief = u.el('div', 'brief', center, ctx.display === 'hidden' ? '' : ctx.instruction);
      if (ctx.display === 'panel') {
        center.classList.add('has-instruction-panel');
        brief.classList.add('instruction-panel-header');
        const panel = u.el('aside', 'instruction-panel', center);
        u.el('b', '', panel, 'Instructions');
        u.el('p', '', panel, ctx.instruction);
      } else if (ctx.display === 'toast') {
        brief.classList.add('instruction-toast');
      } else if (ctx.display === 'hidden') {
        brief.classList.add('instruction-empty');
      }
      const stage = u.el('section', 'stage', center);
      const aside = u.el('aside', 'aside', document.body);
      u.el('b', '', aside, C.note);
      const tabMark = u.svg('svg', { viewBox: '0 0 24 24', class: 'tab-mark', 'aria-hidden': 'true' }, aside);
      u.svg(
        'path',
        {
          d: 'M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4M5 5l4 4m10-4-4 4m4 10-4-4M5 19l4-4',
          fill: 'none',
          stroke: '#b28d23',
          'stroke-width': 1.5,
        },
        tabMark,
      );
      u.el('p', 'aside-copy', aside, C.aside);
      const footer = u.el('footer', 'bottom', app);
      const hint = u.el(
        'span',
        'status',
        footer,
        'Select the matching shape.',
      );
      ['BeOS', 'Home', 'Trash'].forEach((n, i) => {
        const item = u.el('div', 'dicon desktop-' + i, document.body);
        const svg = u.svg('svg', { viewBox: '0 0 60 60', width: 60, height: 60, 'aria-hidden': 'true' }, item);
        const path = (d, fill, stroke = '#252525') =>
          u.svg('path', { d, fill, stroke, 'stroke-width': 1.6, 'stroke-linejoin': 'round' }, svg);
        if (i === 0) {
          path('M6 40L34 35L55 42L54 54L30 59L5 52Z', '#b5b8b6');
          path('M6 40L30 46L55 42L30 36Z', '#edf0eb');
          path('M30 46L54 42L54 53L30 58Z', '#727773');
          path('M11 5L35 2L50 6L50 37L34 44L11 36Z', '#d9dcd6');
          path('M15 9L35 7L43 10L43 31L34 35L15 30Z', '#8cabbc');
          path('M15 9L34 12L34 35L15 30Z', '#c1d5dc');
          path('M34 12L43 10L43 31L34 35Z', '#7393a3');
          path('M10 44L26 48L26 52L10 48Z', '#4b4e4b');
          path('M36 49L41 48L41 52L36 53Z', '#e6b93f');
        } else if (i === 1) {
          path('M5 15L7 8L20 9L27 15L51 17L53 49L8 46Z', '#e8be78');
          path('M4 18L50 23L50 53L7 48Z', '#ffe0a0');
          path('M50 23L54 19L54 52L50 53Z', '#ba8846');
          path('M7 20L48 25', 'none', '#fff1c4');
          path('M9 46L48 51', 'none', '#e2b96b');
        } else {
          path('M12 15L48 15L43 52Q30 61 18 52Z', '#b4b8b5');
          path('M15 18L20 49M23 21L25 54M31 22L31 55M39 21L37 53M45 18L41 49', 'none', '#626966');
          u.svg(
            'ellipse',
            { cx: 30, cy: 15, rx: 22, ry: 7, fill: '#dce0db', stroke: '#252525', 'stroke-width': 1.6 },
            svg,
          );
          u.svg('ellipse', { cx: 30, cy: 15, rx: 16, ry: 4, fill: '#757b78', stroke: '#fff' }, svg);
          path('M25 9L25 6L36 6L36 10', 'none');
        }
        u.el('span', '', item, n);
      });
      let submit = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end'),
          cr = ctx.rng.fork('chrome/collide');
        const labels =
          ctx.content && ctx.content.END_LABELS && ctx.content.END_LABELS.length
            ? ctx.content.END_LABELS
            : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
        const base = !er.bool(0.5),
          labelValue = base
            ? labels.find(
                (x) => (typeof x === 'string' ? x : x.label || x.text || String(x)).trim().toLowerCase() === 'submit',
              ) || 'Submit'
            : er.pick(labels),
          label =
            typeof labelValue === 'string' ? labelValue : labelValue.label || labelValue.text || String(labelValue);
        const placement = base ? 'footer' : er.pick(['footer', 'toolbar', 'link']);
        hint.textContent = 'Select the correct shape, then click ' + label + '.';
        const makeEnd = (parent, cls, asLink) => {
          const b = u.el(asLink ? 'a' : 'button', cls, parent, label);
          if (asLink) {
            b.href = '#';
          } else b.type = 'button';
          b.title = label;
          b.setAttribute('aria-label', label);
          b.addEventListener('click', (e) => {
            e.preventDefault();
            ctx.submit();
          });
          return b;
        };
        if (placement === 'toolbar') submit = makeEnd(top, 'beos-end-toolbar', false);
        else if (placement === 'link') {
          const link = makeEnd(footer, 'beos-end-link', true);
          link.textContent = label + ' ›';
          submit = link;
        } else submit = makeEnd(footer, 'submit', false);
        if (cr.bool(0.3)) {
          const pool = labels
            .map((x) => (typeof x === 'string' ? x : x.label || x.text || String(x)))
            .filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
          if (pool.length) {
            const collision = cr.pick(pool),
              decoy = u.el('button', 'beos-pq', top, collision);
            decoy.type = 'button';
            decoy.addEventListener('click', () => env.log('decoy', { label: collision, collide: true }));
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
