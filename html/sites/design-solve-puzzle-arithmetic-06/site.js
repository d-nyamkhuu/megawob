(function () {
  'use strict';
  const C = {
    'site': 'design-solve-puzzle-arithmetic-06',
    'task': 'solve-puzzle',
    'scenario': 'arithmetic',
    'style': 'homepage',
    'title': 'Maple Creek',
    'menu': 'Notes  *  Friends  *  Photos  *  Little Things  *  A Brighter Day',
    'note': 'My Personal Homepage',
    'layout': 'notebook',
    'subtitle': 'My Personal Homepage',
    'aside': 'Home\nJournal\nFriends\nPhotos\nFun\nLinks',
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
      const footer = u.el('footer', 'bottom', app);
      // New episode choices have independent streams, preserving the original seed draws.
      const er = ctx.rng.fork('chrome/end'),
        cr = ctx.rng.fork('chrome/collide');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const labels = ctx.content.END_LABELS.map(labelOf);
      const classic = er.bool(0.5),
        placement = classic ? 'footer' : er.pick(['toolbar', 'link']);
      const endLabel = classic ? 'Submit' : er.pick(labels);
      let submit = null;
      if (!ctx.finish) {
        const parent = placement === 'toolbar' ? u.el('div', 'end-tools', center) : footer;
        submit = u.el(placement === 'link' ? 'a' : 'button', 'submit episode-end end-' + placement, parent, endLabel);
        if (placement === 'link') submit.href = '#';
        else submit.type = 'button';
        submit.dataset.chromePlacement = placement;
        submit.dataset.role = 'submit';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.addEventListener('click', (event) => {
          event.preventDefault();
          ctx.submit();
        });
        if (cr.bool(0.3)) {
          const alternatives = labels.filter((label) => label.trim().toLowerCase() !== endLabel.trim().toLowerCase());
          if (alternatives.length) {
            const label = cr.pick(alternatives),
              decoy = u.el('button', 'end-xtra', footer, label);
            decoy.type = 'button';
            decoy.dataset.role = 'xtra';
            decoy.addEventListener('click', () => env.log('decoy', { label, collide: true }));
          }
        }
      }
      brief.classList.toggle('long-note', ctx.instruction.length > 120);
      if (ctx.display === 'hidden') brief.remove();
      // Measure once, before task anchors exist; long instructions reserve their own space.
      if (ctx.display === 'header' || ctx.display === 'toast' || (ctx.display === 'panel' && center.clientWidth < 1100))
        center.style.setProperty('--episode-note-height', brief.getBoundingClientRect().height + 'px');
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
