(function () {
  'use strict';
  const C = {
    'site': 'design-read-figure-identify-12',
    'task': 'read-figure',
    'scenario': 'identify',
    'style': 'mac',
    'title': 'SkillLab | Visual Skills Practice',
    'menu': '',
    'note': 'Shape Quiz',
    'layout': 'brief-left',
    'subtitle': '',
    'aside': '',
  };
  env.site({
    name: C.site,
    styles: ['site.css', 'mac.css'],
    initialOverlay: { kind: 'banner' },
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
      const apple = u.svg('svg', { class: 'apple', viewBox: '0 0 32 36', 'aria-hidden': 'true' }, top);
      u.svg(
        'path',
        {
          d: 'M23 1c0 5-3 8-7 8 0-4 3-7 7-8zM17 11c5-4 10-1 12 2-7 4-5 11 1 13-2 5-5 10-9 9-3-2-5-2-8 0-5 2-10-8-11-14-1-7 4-12 9-11 3 0 4 2 6 1z',
          fill: 'currentColor',
        },
        apple,
      );
      for (const m of ['File', 'Edit', 'View', 'Special', 'Help']) u.el('span', 'mi', top, m);
      u.el('span', 'clock', top, '10:24 AM');
      u.el('span', 'help-icon', top, '?');
      const computer = u.svg('svg', { class: 'computer-icon', viewBox: '0 0 36 36' }, top);
      u.svg(
        'path',
        { d: 'M9 3h20v24H9zM12 6h14v15H12zM6 28h26l2 5H3z', fill: 'none', stroke: 'currentColor', 'stroke-width': 2 },
        computer,
      );
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
      const titleBar = u.el('div', 'tbar', app);
      u.el('span', 'window-title', titleBar, C.note);
      const center = u.el('div', 'center', app),
        brief = u.el('div', 'brief', center, ctx.display === 'hidden' ? '' : ctx.instruction);
      const stage = u.el('section', 'stage', center);
      const aside = u.el('aside', 'aside', document.body);
      const asideTitle = u.el('div', 'tbar', aside);
      u.el('span', 'window-title', asideTitle, 'Task Details');
      const kv = u.el('div', 'kv', aside);
      for (const r of [
        ['Task', 'Identify the shape'],
        ['Items', '1'],
        ['Time Limit', 'Not timed'],
        ['Status', 'Ready'],
      ]) {
        const p = u.el('p', '', kv);
        u.el('b', '', p, r[0] + ': ');
        p.append(r[1]);
      }
      u.el('div', 'note', aside, 'The workspace layout is ready.');
      if (ctx.display === 'panel') {
        aside.append(brief);
        brief.classList.add('panel-note');
      } else if (ctx.display === 'toast') {
        brief.classList.add('toast-note');
      } else if (ctx.display === 'hidden') {
        brief.hidden = true;
      }
      let ol = null;
      if (ctx.display !== 'hidden') {
        u.el('h3', '', aside, 'Instructions');
        ol = u.el('ol', '', aside);
        for (const t of ['Look at the figure in the frame.', 'Click the matching button.']) u.el('li', '', ol, t);
      }
      const footer = u.el('footer', 'bottom', app);
      const er = ctx.rng.fork('chrome/end'),
        cr = ctx.rng.fork('chrome/collide/macintosh');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endLabels = (ctx.content.END_LABELS || ['Submit', 'Done', 'Finish', 'OK']).map(labelOf);
      const canonical = !er.bool(0.5),
        placement = canonical ? 'footer' : er.pick(['header', 'link']);
      const label = canonical ? 'Submit' : er.pick(endLabels);
      if (ol && !ctx.finish) u.el('li', '', ol, 'Then click ' + label + '.');
      let submit = null;
      if (!ctx.finish) {
        submit = u.el('button', 'submit end-' + placement, placement === 'header' ? titleBar : footer, label);
        submit.type = 'button';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.addEventListener('click', ctx.submit);
        if (placement === 'link') footer.classList.add('has-end-link');
      }
      if (cr.bool(0.3)) {
        const labels = [...new Set(endLabels)].filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (labels.length) {
          const text = cr.pick(labels),
            decoy = u.el('button', 'chrome-xtra', footer, text);
          decoy.type = 'button';
          decoy.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const rows = document.querySelectorAll('.kv p');
      if (rows[2]) rows[2].lastChild.textContent = '01:00 (paused)';
      if (rows[3]) rows[3].lastChild.textContent = 'Waiting for layout';
      const note = document.querySelector('.aside .note');
      if (note) note.textContent = 'The timer will start after the layout is restored.';
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body);
      const messages = {
        cookie: 'This application stores preferences on your device.',
        toast: 'Your workspace has been synced.',
        chat: 'Need help with this exercise?',
        promo: 'Try the new practice collection.',
        banner: 'An updated practice collection is available.',
      };
      const dlg = u.el('div', 'dlg', el);
      u.el('b', '', dlg, 'Layout could not be restored.');
      u.el('p', '', dlg, 'The previous window layout could not be restored.\nSome panels may be out of place.');
      const warning = u.svg('svg', { class: 'warning-icon', viewBox: '0 0 90 90', 'aria-hidden': 'true' }, dlg);
      u.svg(
        'path',
        {
          d: 'M44 6Q46 4 48 8L85 76Q88 81 81 81H9Q3 81 6 75Z',
          fill: 'white',
          stroke: 'black',
          'stroke-width': 5,
          'stroke-linejoin': 'round',
        },
        warning,
      );
      u.svg('path', { d: 'M45 26v29', stroke: 'black', 'stroke-width': 8, 'stroke-linecap': 'round' }, warning);
      u.svg('circle', { cx: 45, cy: 68, r: 4, fill: 'black' }, warning);
      el.title = messages[ctx.kind];
      const dismiss = u.el('button', 'dbtn', dlg, 'Use default layout');
      dismiss.addEventListener('click', () => {
        ctx.dismiss();
        const rows = document.querySelectorAll('.kv p');
        if (rows[2]) rows[2].lastChild.textContent = 'Not timed';
        if (rows[3]) rows[3].lastChild.textContent = 'Ready';
        const note = document.querySelector('.aside .note');
        if (note) note.textContent = 'The workspace layout has been restored.';
      });
      return { el, dismiss };
    },
  });
})();
