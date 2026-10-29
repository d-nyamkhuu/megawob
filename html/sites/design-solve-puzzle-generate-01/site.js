(function () {
  'use strict';
  const C = {
    'site': 'design-solve-puzzle-generate-01',
    'task': 'solve-puzzle',
    'scenario': 'generate',
    'style': 'plain',
    'title': 'Odd Number Practice',
    'menu': '',
    'note': 'Notes',
    'layout': 'floating',
    'subtitle': '',
    'aside': 'Remember: Read the condition and check the current number.',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      const W = window.innerWidth,
        H = window.innerHeight;
      let display = ctx.display;
      if (display === 'toast' && (W < 1120 || H < 681)) display = 'header';
      document.body.className =
        C.style + ' ' + C.layout + ' instruction-' + display + (ctx.finish ? ' finish-mode' : '');
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
      if (['qt', 'dark', 'electron', 'motif', 'human', 'beos', 'gtk', 'eink'].includes(C.style)) {
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
      const endR = ctx.rng.fork('chrome/end'),
        collideR = ctx.rng.fork('chrome/collide'),
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
      const chosen = endR.pick(labels),
        label = endR.bool(0.5) ? 'Submit' : String((chosen && (chosen.label || chosen.text || chosen.name)) || chosen);
      const placement = endR.pick(['footer', 'footer', 'footer', 'header', 'link']);
      const center = u.el('div', 'center', app),
        brief = u.el('div', 'brief', center, display === 'header' ? ctx.instruction : '');
      const stage = u.el('section', 'stage', center);
      const aside = u.el('aside', 'aside', document.body);
      u.el('b', '', aside, C.note);
      const asideText = u.el('p', 'aside-copy', aside, display === 'panel' ? ctx.instruction : C.aside);
      if (display === 'toast') {
        const toast = u.el('div', 'plain-instruction-toast', app, ctx.instruction);
        toast.setAttribute('role', 'note');
      }
      const footer = u.el('footer', 'bottom', app);
      const decoyBtn = (parent, text, collides) => {
        const b = u.el('button', collides ? 'plain-pq' : 'plain-xtra', parent, text);
        b.type = 'button';
        b.addEventListener('click', () =>
          env.log('decoy', collides ? { label: text, collide: true } : { label: text }),
        );
      };
      let submit = null;
      if (!ctx.finish) {
        let parent = footer,
          cls = 'submit',
          tag = 'button';
        if (placement === 'header') {
          parent = top;
          cls = 'plain-header-end';
        }
        if (placement === 'link') {
          parent = footer;
          cls = 'plain-end-link';
          tag = 'a';
        }
        submit = u.el(tag, cls, parent, label);
        if (tag === 'a') submit.href = '#';
        else submit.type = 'button';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      if (!ctx.finish && collideR.bool(0.3)) {
        const pool = labels
          .map((x) => String((x && (x.label || x.text || x.name)) || x))
          .filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (pool.length) decoyBtn(top, String(collideR.pick(pool)), true);
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
