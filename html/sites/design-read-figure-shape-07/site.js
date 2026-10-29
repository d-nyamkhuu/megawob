(function () {
  'use strict';
  const C = {
    'site': 'design-read-figure-shape-07',
    'task': 'read-figure',
    'scenario': 'shape',
    'style': 'swiss',
    'title': 'Task 01',
    'menu': 'Play    Instructions    Settings    Help',
    'note': 'Your action',
    'layout': 'wide',
    'subtitle': '',
    'aside': 'Click a shape in the image, then submit your answer.',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      document.body.className = 'pdc ' + C.style + ' ' + C.layout + ' instruction-' + ctx.display;
      const u = ctx.util,
        r = ctx.rng.fork('chrome/end'),
        cr = ctx.rng.fork('chrome/collide'),
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
      if (ctx.display === 'panel') u.el('div', 'episode-note panel-note', aside, ctx.instruction);
      if (ctx.display === 'toast') u.el('div', 'episode-note toast-note', aside, ctx.instruction);
      const footer = u.el('footer', 'bottom', app);
      let submit = null;
      if (!ctx.finish) {
        const labels = (ctx.content && ctx.content.END_LABELS) || [
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
        const legacy = r.bool(0.5);
        const alternatives = labels.filter(
          (x) =>
            String(x.label || x.text || x.name || x)
              .trim()
              .toLowerCase() !== 'submit',
        );
        const picked = legacy ? null : r.pick(alternatives.length ? alternatives : labels);
        const label = legacy ? 'Submit' : String(picked.label || picked.text || picked.name || picked);
        const placement = legacy ? 'aside' : r.pick(['top', 'link']);
        document.body.classList.add('end-placement-' + placement);
        if (placement !== 'aside') footer.remove();
        const place = placement === 'aside' ? footer : aside;
        const cls = placement === 'top' ? 'end-top' : placement === 'link' ? 'end-link' : 'submit';
        submit = u.el(placement === 'link' ? 'a' : 'button', cls, place, label);
        submit.type = 'button';
        if (placement === 'link') submit.href = '#';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        if (cr.bool(0.3)) {
          const candidates = labels
            .map((x) => String(x.label || x.text || x.name || x))
            .filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
          if (candidates.length) {
            const dlabel = cr.pick(candidates),
              decoy = u.el('button', 'pq-xtra', aside, dlabel);
            decoy.type = 'button';
            decoy.addEventListener('click', () => env.log('decoy', { label: dlabel, collide: true }));
          }
        }
      } else footer.remove();
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
