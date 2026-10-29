(function () {
  'use strict';
  const C = {
    'site': 'design-read-figure-count-03',
    'task': 'read-figure',
    'scenario': 'count',
    'style': 'forum',
    'title': 'Visual Task',
    'menu': '',
    'note': '',
    'layout': 'wb',
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
        brief = u.el('div', 'brief', center, ctx.display === 'header' ? ctx.instruction : '');
      if (ctx.display !== 'header') center.style.gridTemplateRows = 'minmax(0,1fr)';
      const stage = u.el('section', 'stage', center);
      const aside = u.el('aside', 'aside', document.body);
      const pan = (t, cls) => {
        const p = u.el('section', 'pan ' + cls, aside);
        u.el('h3', '', p, t);
        return u.el('div', 'pb', p);
      };
      const det = pan('Task Details', 'pd');
      [
        ['Task ID:', 'C-1047'],
        ['Task type:', 'Visual Count'],
        ['Target:', 'Matching items'],
        ['Input:', 'Answer below'],
        ['Deadline:', 'Not timed'],
      ].forEach((r) => {
        const d = u.el('div', 'drow', det);
        u.el('span', '', d, r[0]);
        u.el('span', '', d, r[1]);
      });
      const ins = pan('Instructions', 'pi');
      if (ctx.display === 'panel') u.el('div', 'instruction-panel-text', ins, ctx.instruction);
      else if (ctx.display !== 'hidden' && ctx.display !== 'toast') {
        const ol = u.el('ol', '', ins);
        [
          'Look at the shapes on the left.',
          'Count only the <b>matching items</b>.',
          'Enter or select your answer below.',
          'Finish when your answer is ready.',
        ].forEach((t) => {
          const li = u.el('li', '', ol);
          li.innerHTML = t;
        });
      }
      const nt = pan('Notes', 'pn');
      [
        ['Admin', '10:14 AM', 'Remember to count only matching items.', 0],
        ['User', '10:16 AM', 'Got it.', 1],
        ['Admin', '10:17 AM', 'Let me know if you have any questions.', 2],
      ].forEach((n) => {
        const w = u.el('div', 'note d' + n[3], nt);
        if (n[3]) u.el('i', '', w);
        const bx = u.el('div', 'nbox', w);
        const h = u.el('div', 'nh', bx);
        u.el('b', '', h, n[0]);
        u.el('span', '', h, n[1]);
        u.el('div', 'nt', bx, n[2]);
      });
      if (ctx.display === 'toast') {
        const toast = u.el('div', 'forum-task-toast', document.body);
        u.el('b', '', toast, 'Task notice');
        u.el('span', '', toast, ctx.instruction);
      }
      const footer = u.el('footer', 'bottom', app);
      let submit = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end'),
          baseline = er.bool(0.5),
          placement = baseline ? 'footer' : er.pick(['header', 'link']);
        const bank = ctx.content && ctx.content.END_LABELS,
          labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x)),
          labels =
            Array.isArray(bank) && bank.length
              ? bank.map(labelOf)
              : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"],
          label = baseline ? 'Submit' : labelOf(er.pick(labels));
        let tag = placement === 'link' ? 'a' : 'button';
        submit = u.el(tag, 'submit forum-submit-' + placement, footer, label);
        if (tag === 'button') submit.type = 'button';
        if (tag === 'a') submit.href = '#';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const options = [...new Set(labels)].filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
          if (options.length) {
            const decoy = u.el(
              'button',
              'forum-pq',
              placement === 'header' ? top : footer,
              labelOf(cr.pick(options)),
            );
            decoy.type = 'button';
            decoy.addEventListener('click', () => env.log('decoy', { label: decoy.textContent, collide: true }));
          }
        }
      }
      if (ctx.display === 'hidden' || ctx.display === 'toast') aside.classList.add('forum-no-instructions');
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
