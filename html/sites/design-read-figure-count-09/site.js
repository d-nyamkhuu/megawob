(function () {
  'use strict';
  const C = {
    'site': 'design-read-figure-count-09',
    'task': 'read-figure',
    'scenario': 'count',
    'style': 'bsadmin',
    'title': 'Items to look at:',
    'menu': '',
    'note': '',
    'layout': 'tworow',
    'subtitle': '',
    'aside': '',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      document.body.className = C.style + ' ' + C.layout + ' instruction-' + ctx.display;
      const u = ctx.util,
        content = ctx.content || {},
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
      top.style.display = 'none';
      const center = u.el('div', 'center', app),
        bp = u.el('section', 'bpanel', center),
        btitle = u.el('h2', 'phead', bp, 'Counting Task');
      const brief = u.el('div', 'brief', bp, ctx.display === 'hidden' ? '' : ctx.instruction);
      brief.classList.add('brief-' + ctx.display);
      const det = u.el('div', 'details', bp);
      u.el('p', '', det, 'Details:');
      const ul = u.el('ul', '', det);
      for (const t of [
        'Count only the items matching the task.',
        'Ignore items in other categories.',
        'Check each figure carefully.',
        'Each item is a non-overlapping figure.',
      ])
        u.el('li', '', ul, t);
      const wp = u.el('section', 'wpanel', center);
      u.el('h2', 'phead', wp, 'Workspace');
      const stage = u.el('div', 'stage', wp);
      const aside = u.el('aside', 'aside', document.body);
      u.el('b', '', aside, C.note);
      u.el('p', 'aside-copy', aside, C.aside);
      const footer = u.el('footer', 'bottom', app);
      u.el('h2', 'phead', footer, 'Your Answer');
      const fb = u.el('div', 'fbar', footer);
      let submit = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end'),
          labels =
            Array.isArray(content.END_LABELS) && content.END_LABELS.length
              ? content.END_LABELS
              : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
        const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
        const submitLabel = labels.find((x) => labelOf(x).trim().toLowerCase() === 'submit'),
          otherLabels = labels.filter((x) => labelOf(x).trim().toLowerCase() !== 'submit');
        const label =
          er.bool(0.75) && submitLabel
            ? labelOf(submitLabel)
            : labelOf(er.pick(otherLabels.length ? otherLabels : labels));
        const placement = er.pick(['footer', 'footer', 'footer', 'footer', 'header', 'link']);
        const makeEnd = (parent, where) => {
          const el = u.el(
            where === 'link' ? 'a' : 'button',
            where === 'link' ? 'end-link' : where === 'header' ? 'end-header' : 'submit',
            parent,
            label,
          );
          el.type = where === 'link' ? '' : 'button';
          if (where === 'link') el.href = '#';
          el.dataset.role = 'submit';
          el.setAttribute('aria-label', label);
          el.title = label;
          el.addEventListener('click', (e) => {
            e.preventDefault();
            ctx.submit();
          });
          return el;
        };
        if (placement === 'header') {
          submit = makeEnd(btitle, 'header');
        } else submit = makeEnd(fb, placement);
        for (const t of ['Clear', 'Reset']) {
          const b = u.el('button', 'aux', fb, t);
          b.type = 'button';
          b.addEventListener('click', () => env.log('decoy', { label: t }));
        }
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const pool = labels.map(labelOf).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
          if (pool.length) {
            const text = labelOf(cr.pick(pool)),
              b = u.el('button', 'aux end-xtra', btitle, text);
            b.type = 'button';
            b.dataset.role = 'xtra';
            b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
          }
        }
      } else {
        for (const t of ['Clear', 'Reset']) {
          const b = u.el('button', 'aux', fb, t);
          b.type = 'button';
          b.addEventListener('click', () => env.log('decoy', { label: t }));
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
