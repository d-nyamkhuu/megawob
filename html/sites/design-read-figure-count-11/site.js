(function () {
  'use strict';
  const C = {
    'site': 'design-read-figure-count-11',
    'task': 'read-figure',
    'scenario': 'count',
    'style': 'atari',
    'title': 'Shape Counter',
    'menu': '',
    'note': '',
    'layout': 'board',
    'subtitle': '',
    'aside': '',
  };
  env.site({
    name: C.site,
    styles: ['site.css', 'atari.css'],
    initialOverlay: { kind: 'promo' },
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
      u.el('span', 'window-gadget', top, '−');
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
      const mb = u.el('div', 'menubar', document.body);
      const logo = u.svg('svg', { viewBox: '0 0 32 30', class: 'mb-logo' }, mb);
      u.svg(
        'path',
        { d: 'M12 1h8v10c0 8 4 13 11 17h-6c-5-3-8-7-9-12-1 5-4 9-9 12H1c7-4 11-9 11-17zM14 0h4v29h-4z', fill: '#000' },
        logo,
      );
      ['Desk', 'File', 'Edit', 'Options', 'Help'].forEach((t) => u.el('span', 'mb-item', mb, t));
      u.el('span', 'mb-clock', mb, 'Mon 27 Jan 1986   10:14');
      const dt = u.el('div', 'desk-icons', document.body);
      const disk = u.el('div', 'di-disk', dt),
        ds = u.svg('svg', { viewBox: '0 0 50 48' }, disk);
      u.svg('path', { d: 'M5 2h36l5 5v38H3V6z', fill: '#080808', stroke: '#000', 'stroke-width': 2 }, ds);
      u.svg('path', { d: 'M14 3h22v13H14zM10 25h29v18H10z', fill: '#eee' }, ds);
      u.svg('path', { d: 'M29 4h5v10h-5zM14 28h7v12h-7z', fill: '#222' }, ds);
      u.el('span', '', disk, 'A:' + String.fromCharCode(92));
      const trash = u.el('div', 'di-trash', dt),
        ts = u.svg('svg', { viewBox: '0 0 50 48' }, trash);
      u.svg(
        'path',
        {
          d: 'M10 9l3 33q12 8 25 0l3-33M8 8q17-8 35 0v5q-17 6-35 0zM19 4V1h13v3M17 17l1 23M24 17v25M31 17v25M37 16l-1 24',
          fill: '#ddd',
          stroke: '#111',
          'stroke-width': 2.5,
        },
        ts,
      );
      u.el('span', '', trash, 'TRASH');
      const footer = u.el('footer', 'bottom', app);
      let submit = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end'),
          original = er.bool(0.5),
          labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name),
          labels = ctx.content.END_LABELS.map(labelOf),
          label = original ? 'Submit' : labelOf(er.pick(ctx.content.END_LABELS)),
          placement = original ? 'footer' : er.pick(['header', 'link']);
        document.body.dataset.endPlacement = placement;
        submit = u.el(
          placement === 'link' ? 'a' : 'button',
          'submit end-' + placement,
          placement === 'header' ? top : footer,
          label,
        );
        if (placement === 'link') submit.href = '#';
        else submit.type = 'button';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        document.body.dataset.endLabel = label;
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name),
          labels = ctx.content.END_LABELS.map(labelOf),
          pool = labels.filter((x) => x.toLowerCase() !== (submit ? submit.textContent : 'Submit').toLowerCase());
        if (pool.length) {
          const label = cr.pick(pool),
            decoy = u.el('button', 'chrome-xtra', mb, label);
          decoy.type = 'button';
          decoy.addEventListener('click', () => env.log('decoy', { label, collide: true }));
        }
      }
      let display = ctx.display;
      if (
        (display === 'panel' && document.documentElement.clientWidth < 1366) ||
        (display === 'toast' && document.documentElement.clientHeight < 700)
      )
        display = 'header';
      document.body.classList.add('note-' + display);
      if (display === 'hidden') {
        brief.remove();
        stage.style.top = '0';
      } else if (display === 'panel') {
        stage.style.top = '0';
      } else {
        stage.style.top = brief.offsetHeight + 'px';
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      if (ctx.initial) {
        const aside = u.el('aside', 'aside survey-overlay', document.body);
        const tb = u.el('div', 'aside-title', aside);
        u.el('span', 'gadget', tb, '↵');
        u.el('span', '', tb, 'Quick Survey');
        u.el('span', 'gadget x', tb, '✕');
        const ab = u.el('div', 'aside-body', aside);
        u.el('p', 'aside-help', ab, 'Help us improve\nShape Counter!');
        u.el('p', 'q', ab, '1. How easy was this task?');
        ['Very easy', 'Easy', 'Neither', 'Difficult', 'Very difficult'].forEach((t) => {
          const r = u.el('div', 'opt', ab);
          u.el('i', 'radio', r);
          u.el('span', '', r, t);
        });
        u.el('p', 'q', ab, '2. Any comments? (optional)');
        u.el('div', 'comments', ab);
        const cs = u.el('button', 'close-survey', ab, 'Close survey');
        cs.type = 'button';
        cs.addEventListener('click', ctx.dismiss);
        const close = tb.querySelector('.x');
        close.setAttribute('role', 'button');
        close.setAttribute('aria-label', 'Close survey');
        close.tabIndex = 0;
        close.addEventListener('click', ctx.dismiss);
        close.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            ctx.dismiss();
          }
        });
        return { el: aside, dismiss: cs };
      }
      const el = u.el('div', 'overlay ' + ctx.kind, document.body);
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
