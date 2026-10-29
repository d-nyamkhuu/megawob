(function () {
  'use strict';
  const C = {
    'title': 'Task List',
    'win': 'WorkPad  -  Untitled',
    'date': 'Mon Apr 13, 1992   10:24 AM',
    'tabs': ['Tasks', 'Notes', 'Files', 'Contacts', 'Settings'],
    'accent': '#9db9e3',
    'bg': '#8f9db3',
    'surface': '#f8f7f3',
    'font': "'Segoe UI','Lucida Sans Unicode','Lucida Grande',Verdana,sans-serif",
  };
  env.site({
    name: 'design-reorder-items-list-08',
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        body = document.body;
      body.className =
        'design memphis layout-left openlook' + (ctx.display === 'toast' ? ' has-instruction-toast' : '');
      const root = document.documentElement;
      for (const [k, v] of Object.entries({
        bg: C.bg,
        panel: C.surface,
        fg: '#111820',
        muted: '#555d68',
        line: '#9aa3ad',
        accent: C.accent,
      }))
        root.style.setProperty('--' + k, v);
      root.style.setProperty('--font', C.font);
      const shell = u.el('div', 'shell', body);
      const logo = u.el('div', 'sun-logo', shell);
      const mark = u.svg('svg', { class: 'sun-mark', viewBox: '0 0 40 40', fill: 'none', 'aria-hidden': 'true' }, logo);
      const diamond = u.svg(
        'g',
        { transform: 'translate(20 20) rotate(45)', stroke: 'currentColor', 'stroke-width': 1.6 },
        mark,
      );
      for (let i = 0; i < 4; i++) {
        const g = u.svg('g', { transform: 'rotate(' + i * 90 + ')' }, diamond);
        u.svg('path', { d: 'M-14 -14H-2V-2H-10V-10H-6V-6M-14 -10V-2H-14V-6' }, g);
      }
      const word = u.el('div', 'sun-word', logo);
      u.el('span', '', word, 'Sun');
      u.el('small', '', word, 'MICROSYSTEMS');
      const page = u.el('div', 'page', shell);
      const rings = u.el('div', 'rings', shell);
      for (let i = 0; i < 15; i++) {
        const r = u.svg('svg', { class: 'ring', viewBox: '0 0 44 27', fill: 'none' }, rings);
        r.style.top = 7.85 + i * 6.09 + '%';
        u.svg('rect', { x: 27, y: 1, width: 16, height: 25, rx: 3, fill: '#131b21' }, r);
        u.svg(
          'path',
          {
            d: 'M33 6H8Q1 6 1 11Q1 15 8 15H33M33 14H8Q1 14 1 19Q1 23 8 23H33',
            stroke: '#222b30',
            'stroke-width': 5,
            'stroke-linecap': 'round',
          },
          r,
        );
        u.svg(
          'path',
          {
            d: 'M33 5H8Q1 5 1 10Q1 14 8 14H33M33 13H8Q1 13 1 18Q1 22 8 22H33',
            stroke: '#a9b1b5',
            'stroke-width': 2.7,
            'stroke-linecap': 'round',
          },
          r,
        );
        u.svg(
          'path',
          {
            d: 'M32 4H8Q3 4 2 8M32 12H8Q3 12 2 16M8 21H32',
            stroke: '#e5e9e7',
            'stroke-width': 1,
            'stroke-linecap': 'round',
          },
          r,
        );
      }
      const aside = u.el('aside', 'tabs', shell);
      C.tabs.forEach((text, i) => {
        const bt = u.el('button', 'tab' + (i === 0 ? ' active' : ''), aside);
        u.el('span', 'tab-text', bt, text);
        bt.type = 'button';
        bt.style.top = 12.97 + i * 10.52 + '%';
        bt.onclick = () => {
          aside.querySelectorAll('.tab').forEach((x) => x.classList.remove('active'));
          bt.classList.add('active');
        };
      });
      const head = u.el('header', 'titlebar', shell);
      const mi = u.el('span', 'menu-gadget', head);
      const pin = u.svg('svg', { width: 20, height: 24, viewBox: '0 0 20 24', fill: 'none' }, mi);
      u.svg('path', { d: 'M3 6H17V20H3ZM5 3H15V6H5Z', fill: '#f3f2e9', stroke: '#17212a', 'stroke-width': 1.8 }, pin);
      u.svg('path', { d: 'M5 10H15M5 13H15M5 17H15', stroke: '#17212a', 'stroke-width': 2 }, pin);
      u.el('div', 'win-title', head, C.win);
      const wc = u.el('div', 'window-controls', head);
      for (const label of ['–', '□', '×']) {
        const bt = u.el('button', '', wc, label);
        bt.type = 'button';
        bt.onclick = () => env.log('window-control', { label });
      }
      const band = u.el('div', 'band', shell);
      const ic = u.svg('svg', { class: 'band-icon', width: 52, height: 64, viewBox: '0 0 52 64', fill: 'none' }, band);
      u.svg('path', { d: 'M9 6H37L49 18V62H9Z', fill: '#999', stroke: '#333', 'stroke-width': 2 }, ic);
      u.svg('path', { d: 'M3 2H34L46 14V58H3Z', fill: '#fffef8', stroke: '#222', 'stroke-width': 2 }, ic);
      u.svg('path', { d: 'M34 2V14H46M11 13H28', stroke: '#333', 'stroke-width': 1.7 }, ic);
      for (let i = 0; i < 8; i++)
        u.svg('path', { d: 'M11 ' + (19 + i * 4.3) + 'H39', stroke: '#333', 'stroke-width': 1.6 }, ic);
      u.el('div', 'band-title', band, C.title);
      u.el('div', 'band-date', band, C.date);
      const content = u.el('div', 'content', shell),
        note = u.el('section', 'task-note', content);
      u.el('div', 'instruction', note, ctx.instruction);
      let display = ctx.display || 'header';
      if ((display === 'panel' || display === 'toast') && ctx.size && ctx.size.width < 1260) display = 'header';
      if (display === 'hidden') note.hidden = true;
      else if (display === 'toast') {
        note.classList.add('instruction-toast');
        const x = u.el('button', 'note-close', note, '×');
        x.type = 'button';
        x.setAttribute('aria-label', 'Close');
        x.onclick = () => (note.style.visibility = 'hidden');
      } else if (display === 'panel') note.classList.add('instruction-panel');
      const stage = u.el('main', 'stage', content);
      stage.dataset.role = 'stage';
      u.el('div', 'rule', shell);
      const footer = u.el('footer', 'footer', shell);
      u.el('div', 'footer-copy', footer, '');
      const clear = u.el('button', 'gbtn clear', footer, 'Clear All');
      clear.type = 'button';
      clear.onclick = () => {
        env.widgetDef.clear?.();
      };
      const reset = u.el('button', 'gbtn reset', footer, 'Reset Order');
      reset.type = 'button';
      reset.onclick = () => {
        env.widgetDef.clear?.();
      };
      let submit = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end'),
          labels = (
            (ctx.content && ctx.content.END_LABELS) || [
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
            ]
          ).map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)));
        const label = er.bool(0.5) ? 'Submit' : er.pick(labels.filter((x) => x.trim().toLowerCase() !== 'submit'));
        const placement = er.pick(['footer', 'footer', 'footer', 'band', 'link']);
        const addSubmit = (parent, cls, text) => {
          const b = u.el(cls === 'end-link' ? 'a' : 'button', cls, parent, text);
          b.type = 'button';
          b.dataset.role = 'submit';
          b.setAttribute('aria-label', label);
          b.title = label;
          b.onclick = (e) => {
            e.preventDefault();
            ctx.submit();
          };
          return b;
        };
        if (placement === 'footer') submit = addSubmit(footer, 'submit', label);
        else if (placement === 'link') submit = addSubmit(footer, 'end-link', label + ' ›');
        else {
          shell.classList.add('end-in-band');
          submit = addSubmit(band, 'band-submit', label);
        }
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const pool = labels.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
          if (pool.length) {
            const decoy = u.el(
              'button',
              'end-xtra ' + (placement === 'band' ? 'xtra-band' : 'xtra-footer'),
              placement === 'band' ? band : footer,
              cr.pick(pool),
            );
            decoy.type = 'button';
            decoy.dataset.role = 'xtra';
            decoy.onclick = () => env.log('decoy', { label: decoy.textContent, collide: true });
          }
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        kind = ctx.kind;
      const el = u.el('section', 'obstruction obstruction-' + kind, document.body);
      el.dataset.role = 'overlay';
      const box = u.el('div', 'obstruction-box', el);
      const title = {
        cookie: 'Your privacy',
        toast: 'Changes saved',
        chat: 'Support',
        promo: 'Workspace update',
        banner: 'Service notice',
      }[kind];
      const text = {
        cookie: 'This application stores optional cookies.',
        toast: 'Your changes have been saved.',
        chat: 'Need a hand with this workspace?',
        promo: 'Explore the latest workspace features.',
        banner: 'You are viewing a shared workspace.',
      }[kind];
      const label = kind === 'cookie' ? 'Reject optional' : 'Close';
      u.el('h3', '', box, title);
      u.el('p', '', box, text);
      const dismiss = u.el('button', 'dismiss', box, label);
      dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('close');
      if (kind === 'cookie') {
        const accept = u.el('button', 'dismiss', box, 'Accept optional');
        accept.onclick = () => ctx.dismiss('accept');
      }
      return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };
    },
  });
})();
