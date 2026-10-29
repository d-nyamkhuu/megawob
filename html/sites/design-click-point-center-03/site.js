(function () {
  'use strict';
  const C = {
    'title': 'Geometry Practice',
    'accent': '#0064ed',
    'bg': '#f6f7f9',
    'surface': '#ffffff',
    'font': "'Segoe UI Variable','Segoe UI',Arial,sans-serif",
    'theme': 'fluent',
  };
  env.site({
    name: 'design-click-point-center-03',
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        body = document.body;
      body.className = 'design fluent' + (ctx.display === 'toast' ? ' has-instruction-toast' : '');
      const root = document.documentElement;
      for (const [k, v] of Object.entries({
        bg: C.bg,
        panel: C.surface,
        fg: '#1b1f27',
        muted: '#6a707b',
        line: '#e1e4ea',
        accent: C.accent,
      }))
        root.style.setProperty('--' + k, v);
      root.style.setProperty('--font', C.font);
      const shell = u.el('div', 'shell', body),
        head = u.el('header', 'head', shell);
      const logo = u.svg('svg', { class: 'logo', width: 28, height: 28, viewBox: '0 0 28 28' }, head);
      u.svg('circle', { cx: 14, cy: 14, r: 13, fill: '#0875f5' }, logo);
      u.svg(
        'path',
        {
          d: 'M8.5 22L14 8L19.5 22M10.5 16.5Q14 18 17.5 16.5M14 5V8',
          fill: 'none',
          stroke: '#fff',
          'stroke-width': 1.5,
          'stroke-linejoin': 'round',
        },
        logo,
      );
      u.svg('circle', { cx: 14, cy: 8, r: 1.7, fill: '#fff' }, logo);
      u.el('div', 'title', head, C.title);
      const controls = u.el('div', 'window-controls', head);
      const wc = [
        ['min', 'M3 10H17'],
        ['max', 'M4 4H16V16H4Z'],
        ['close', 'M3 3L17 17M17 3L3 17'],
      ];
      for (const [name, d] of wc) {
        const bt = u.el('button', '', controls);
        bt.type = 'button';
        bt.onclick = () => env.log('window-control', { label: name });
        const s = u.svg(
          'svg',
          { width: 20, height: 20, viewBox: '0 0 20 20', fill: 'none', stroke: '#1b1f27', 'stroke-width': 1.4 },
          bt,
        );
        u.svg('path', { d }, s);
      }
      const content = u.el('div', 'content', shell),
        note = u.el('section', 'task-note', content);
      u.el('div', 'note-label', note, 'Task 1 of 1');
      const instruction = u.el('div', 'instruction', note, ctx.instruction);
      let display = ctx.display || 'panel';
      if (display === 'toast' && ctx.size && ctx.size.height < 700) display = 'header';
      if (display === 'header') {
        note.hidden = true;
        u.el('div', 'header-instruction', head, ctx.instruction);
      } else if (display === 'hidden') note.hidden = true;
      else if (display === 'toast') {
        note.hidden = true;
        const toast = u.el('section', 'instruction-toast', body);
        u.el('div', 'instruction', toast, ctx.instruction);
        const x = u.el('button', 'note-close', toast, '×');
        x.type = 'button';
        x.setAttribute('aria-label', 'Close');
        x.onclick = () => (toast.style.visibility = 'hidden');
      } else {
        note.classList.add('instruction-panel');
        u.el(
          'p',
          'brief-copy',
          note,
          'Click the point where the center of the circle is located. The figure shows only a portion of the circle.',
        );
      }
      const stage = u.el('main', 'stage', content);
      stage.dataset.role = 'stage';
      const footer = u.el('footer', 'footer', shell);
      const tools = u.el('div', 'tools', footer);
      const mk = (label, d, sel) => {
        const bt = u.el('button', 'tool' + (sel ? ' selected' : ''), tools);
        bt.type = 'button';
        const s = u.svg(
          'svg',
          {
            width: 30,
            height: 30,
            viewBox: '0 0 32 32',
            fill: 'none',
            stroke: '#1b1f27',
            'stroke-width': 1.7,
            'stroke-linejoin': 'round',
          },
          bt,
        );
        u.svg('path', { d }, s);
        u.el('span', '', bt, label);
        return bt;
      };
      const ptr = mk('Pointer', 'M7 2L7 27L13 21L17 30L21 28L17 19L26 19Z', true);
      const pan = mk(
        'Pan',
        'M11 17V7Q11 3 14 5V15V4Q14 1 17 3V15V5Q17 2 20 5V16V8Q20 5 23 8V19L24 13Q27 10 27 14V22Q26 30 18 30Q12 30 9 25L4 18Q2 14 5 14Q7 14 11 19',
      );
      const clr = mk('Clear', 'M4 19L17 5Q18 4 19 5L29 14Q30 15 29 16L17 29Q16 30 15 29L4 21Z M10 13L23 25');
      for (const bt of [ptr, pan])
        bt.onclick = () => {
          ptr.classList.toggle('selected', bt === ptr);
          pan.classList.toggle('selected', bt === pan);
        };
      clr.onclick = () => {
        env.widgetDef.clear?.();
      };
      u.el('span', 'divider', footer);
      u.el('span', 'spacer', footer);
      const hints = u.el('label', 'hints', footer);
      const cb = u.el('input', '', hints);
      cb.type = 'checkbox';
      u.el('span', '', hints, 'Show hints');
      let submit = null;
      if (!ctx.finish) {
        const labels =
          ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
            ? ctx.content.END_LABELS
            : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
        const er = ctx.rng.fork('chrome/end');
        const primary = er.bool(0.5);
        const placement = primary ? 'footer' : er.pick(['header', 'link']);
        const label = primary ? 'Submit' : String(er.pick(labels));
        const end = (parent, cls, text, accessible) => {
          const b = u.el(cls === 'end-link' ? 'a' : 'button', cls, parent, text);
          if (b.tagName === 'BUTTON') b.type = 'button';
          else b.href = '#';
          b.dataset.role = 'submit';
          b.setAttribute('aria-label', accessible || text);
          b.title = accessible || text;
          b.onclick = (e) => {
            e.preventDefault();
            ctx.submit();
          };
          return b;
        };
        if (placement === 'footer') submit = end(footer, 'submit', label);
        else if (placement === 'header') submit = end(head, 'header-submit', label);
        else submit = end(footer, 'end-link', label + ' ›', label);

        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const same = (x) => String(x).trim().toLowerCase() === label.trim().toLowerCase();
          const pool = [
            ...new Set(
              labels
                .map((x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x)))
                .filter((x) => !same(x)),
            ),
          ];
          if (pool.length) {
            const decoy = u.el('button', 'end-xtra', footer, String(cr.pick(pool)));
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
