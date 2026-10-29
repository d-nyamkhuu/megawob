(function () {
  'use strict';
  const C = {
    'site': 'design-read-figure-ascending-03',
    'task': 'read-figure',
    'scenario': 'ascending',
    'style': 'op-notebook',
    'title': 'WorkFlow',
    'menu': 'Tasks',
    'note': '',
    'layout': 'operational',
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
      u.el('span', 'brand', top, C.title);
      u.el('span', 'section-label', top, 'Tasks');
      const meta = u.el('div', 'top-meta', top);
      u.el('span', '', meta, 'User: jcarter');
      u.el('span', '', meta, 'Project: Q2 Plan');
      u.el('span', '', meta, 'Help');
      const tabs = u.el('nav', 'menu', app);
      [
        ['1', 'Tasks'],
        ['2', 'Notes'],
        ['3', 'Files'],
        ['4', 'Activity'],
        ['5', 'Settings'],
      ].forEach((x, i) => {
        const tab = u.el('span', 'tab' + (i === 0 ? ' active' : ''), tabs);
        u.el('b', '', tab, x[0]);
        u.el('span', '', tab, x[1]);
      });
      const center = u.el('div', 'center', app),
        brief = u.el('div', 'brief', center, ctx.display === 'hidden' ? '' : ctx.instruction);
      if (ctx.instruction.length > 100) document.body.classList.add('instruction-long');
      const stage = u.el('section', 'stage', center);
      u.el('aside', 'aside', document.body);
      const footer = u.el('footer', 'bottom', app),
        status = u.el('div', 'status', footer);
      u.el('span', '', status, 'Task: Number Sequence');
      u.el('span', '', status, 'Targets: 10');
      u.el('span', '', status, 'Status: Not started'); // Independent streams preserve every existing seeded choice.
      const er = ctx.rng.fork('chrome/end'),
        cr = ctx.rng.fork('chrome/collide');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const labels = ctx.content.END_LABELS.map(labelOf);
      const referenceEnd = er.bool(0.5),
        placement = referenceEnd ? 'footer' : er.pick(['footer', 'toolbar', 'link']);
      const label = referenceEnd ? 'Submit' : er.pick(labels);
      const tools = u.el('div', 'chrome-tools', tabs);
      let submit = null;
      if (!ctx.finish) {
        submit = u.el(
          placement === 'link' ? 'a' : 'button',
          'submit' + (placement === 'link' ? ' end-link' : ''),
          placement === 'toolbar' ? tools : footer,
          label,
        );
        if (placement === 'link') submit.href = '#';
        else submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      if (cr.bool(0.3)) {
        const pool = [...new Set(labels)].filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (pool.length) {
          const text = cr.pick(pool),
            decoy = u.el('button', 'chrome-xtra', tools, text);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
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
