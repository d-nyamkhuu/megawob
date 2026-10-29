(function () {
  'use strict';
  const C = {
    'site': 'design-solve-puzzle-algebra-11',
    'task': 'solve-puzzle',
    'scenario': 'algebra',
    'style': 'human',
    'title': 'Algebra Practice',
    'menu': '⌂  Home     ▱  Lessons     ✎  Practice     ▥  Progress                         ⚙  Settings     ?  Help',
    'note': 'Solve for x',
    'layout': 'floating',
    'subtitle': '',
    'aside': '',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    initialOverlay: { kind: 'chat' },
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
      if (ctx.display === 'panel') {
        const note = u.el('aside', 'episode-panel', app);
        u.el('b', '', note, 'Practice note');
        u.el('div', '', note, ctx.instruction);
      }
      if (ctx.display === 'toast') {
        const note = u.el('div', 'episode-toast', app, ctx.instruction);
        note.setAttribute('role', 'status');
      }
      const aside = u.el('aside', 'aside', document.body);
      u.el('b', '', aside, C.note);
      u.el('p', 'aside-copy', aside, C.aside);
      const footer = u.el('footer', 'bottom', app);
      let submit = null;
      if (!ctx.finish) {
        const endRng = ctx.rng.fork('chrome/end'),
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
          label = endRng.bool(0.5)
            ? 'Submit'
            : String(endRng.pick(labels.filter((x) => String(x).trim().toLowerCase() !== 'submit'))),
          placement = endRng.pick(['footer', 'footer', 'header', 'link']);
        const parent = document.body;
        const cls =
          'episode-end ' +
          (placement === 'header'
            ? 'episode-end-header'
            : placement === 'link'
              ? 'episode-end-link'
              : 'episode-end-footer');
        submit = u.el(placement === 'link' ? 'a' : 'button', cls, parent, label);
        submit.type = 'button';
        if (placement === 'link') submit.href = '#';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        const collideRng = ctx.rng.fork('chrome/collide');
        if (collideRng.bool(0.3)) {
          const pool = labels.map((x) => String(x)),
            other = pool.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
          if (other.length) {
            const decoy = u.el(
              'button',
              'episode-xtra ' + (placement === 'header' ? 'episode-xtra-header' : 'episode-xtra-footer'),
              document.body,
              collideRng.pick(other),
            );
            decoy.type = 'button';
            decoy.addEventListener('click', () => env.log('decoy', { label: decoy.textContent, collide: true }));
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
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Dismiss all');
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
