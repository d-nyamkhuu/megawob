(function () {
  'use strict';
  const C = { site: 'design-solve-puzzle-compute-01', title: 'Task Manager', menu: 'File    Edit    View    Tools    Help' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      document.body.className = 'human brief-left instruction-' + ctx.display;
      const endR = ctx.rng.fork('chrome/end');
      const endLabels = (
        ctx.content && Array.isArray(ctx.content.END_LABELS)
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
      ).map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)));
      const endPlacement = endR.bool(0.5) ? 'form' : endR.pick(['toolbar', 'link']);
      const endLabel = endPlacement === 'form' ? 'Submit' : endR.pick(endLabels);
      document.body.classList.add('ep-end-' + endPlacement);
      const u = ctx.util,
        app = u.el('main', 'app', document.body),
        top = u.el('header', 'top', app);
      const icon = u.svg('svg', { width: 26, height: 26, viewBox: '0 0 26 26', class: 'title-icon' }, top);
      u.svg(
        'rect',
        { x: 3, y: 2, width: 20, height: 22, rx: 3, fill: '#ee8520', stroke: '#ee8520', 'stroke-width': 1.5 },
        icon,
      );
      u.svg(
        'path',
        {
          d: 'M7 13l4 4 8-9',
          fill: 'none',
          stroke: '#fff',
          'stroke-width': 2.4,
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
        },
        icon,
      );
      u.el('span', '', top, C.title);
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
      u.el('nav', 'menu', top, C.menu);
      const center = u.el('div', 'center', app),
        brief = u.el('div', 'brief', center, ctx.display === 'hidden' ? '' : ctx.instruction),
        stage = u.el('section', 'stage', center);
      const aside = u.el('aside', 'aside', document.body);
      u.el('b', '', aside, 'Tasks');
      u.el('div', 'searchbox', aside, '⌕   Search tasks...');
      const list = u.el('div', 'task-list', aside);
      [
        'Vendor Payments',
        'Project Budget',
        'Staff Scheduling',
        'Facility Requests',
        'Inventory Check',
        'Client Follow-ups',
        'Travel Arrangements',
        'Meeting Notes',
        'Website Updates',
        'Equipment Orders',
      ].forEach((name, i) => {
        const row = u.el('div', 'task-row' + (!i ? ' active' : ''), list);
        u.el('span', '', row, name);
        u.el(
          'small',
          '',
          row,
          ['Apr 23', 'Apr 21', 'Apr 20', 'Apr 19', 'Apr 18', 'Apr 17', 'Apr 16', 'Apr 13', 'Apr 12', 'Apr 11'][i] +
            ', 2018',
        );
      });
      const footer = u.el('footer', 'bottom', app);
      let submit = null;
      if (!ctx.finish) {
        submit = u.el('button', 'submit', footer, endLabel);
        submit.type = 'button';
        submit.setAttribute('aria-label', endLabel);
        submit.title = endLabel;
        submit.addEventListener('click', ctx.submit);
      }
      const collideR = ctx.rng.fork('chrome/collide');
      if (!ctx.finish && collideR.bool(0.3)) {
        const pool = [...new Set(endLabels.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase()))];
        if (pool.length) {
          const where = collideR.pick(['toolbar', 'link']),
            box = u.el('div', 'ep-xtras ' + (where === 'link' ? 'link-xtras' : 'toolbar-xtras'), document.body),
            text = collideR.pick(pool),
            decoy = u.el('button', 'ep-xtra', box, text);
          decoy.type = 'button';
          decoy.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        }
      }
      if (ctx.display === 'hidden') brief.style.display = 'none';
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body),
        messages = {
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
