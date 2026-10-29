(function () {
  'use strict';
  const C = {
    accent: '#1f5a41',
    bg: '#f4f8f6',
    surface: '#f3f9f7',
    font: 'Arial, "Helvetica Neue", "Segoe UI", sans-serif',
  };
  env.site({
    name: 'design-click-point-midpoint-09',
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        body = document.body;
      body.className = 'design geo' + (ctx.display === 'toast' ? ' has-instruction-toast' : '');
      const root = document.documentElement;
      for (const [k, v] of Object.entries({
        bg: C.bg,
        panel: C.surface,
        fg: '#1c2a24',
        muted: '#5d6d65',
        line: '#c9d8d0',
        accent: C.accent,
      }))
        root.style.setProperty('--' + k, v);
      root.style.setProperty('--font', C.font);
      const shell = u.el('div', 'shell', body);
      const top = u.el('header', 'topbar', shell);
      u.el('div', 'brand', top, 'GeoPractice');
      const nav = u.el('nav', 'topnav', top);
      ['Geometry', 'Plot', 'Activities'].forEach((t, i) => {
        if (i) u.el('i', '', nav, '|');
        u.el('span', '', nav, t);
      });
      u.el('div', 'spacer', top);
      u.el('div', 'lesson', top, 'Lesson 3: Midpoints');
      u.el('i', 'sep', top, '|');
      const user = u.el('div', 'user', top, 'Student ');
      const caret = u.svg('svg', { width: 14, height: 10, viewBox: '0 0 14 10' }, user);
      u.svg('path', { d: 'M0 1H14L7 9Z', fill: '#e8f2ee' }, caret);
      const tabs = u.el('div', 'tabs', shell);
      for (let i = 1; i <= 5; i++) {
        const t = u.el('button', 'tab' + (i === 3 ? ' on' : ''), tabs, String(i));
        t.type = 'button';
        t.onclick = () => {
          tabs.querySelectorAll('.tab').forEach((x) => x.classList.remove('on'));
          t.classList.add('on');
        };
      }
      const content = u.el('div', 'content', shell);
      const doc = u.el('section', 'doc', content);
      u.el('div', 'doc-bar', doc, 'Coordinate Plane');
      const docBar = doc.querySelector('.doc-bar');
      const stage = u.el('main', 'stage', doc);
      stage.dataset.role = 'stage';
      const aside = u.el('aside', 'margin', content);
      const note = u.el('section', 'task-note', aside);
      u.el('div', 'note-label', note, 'Task');
      u.el('div', 'instruction', note, ctx.instruction);
      if (ctx.display === 'hidden') note.hidden = true;
      else if (ctx.display === 'toast') {
        note.classList.add('instruction-toast');
        const x = u.el('button', 'note-close', note, '×');
        x.onclick = () => (note.style.visibility = 'hidden');
      } else if (ctx.display === 'panel') note.classList.add('instruction-panel');
      u.el('hr', '', aside);
      u.el('div', 'actions-label', aside, 'Actions');
      const r1 = u.el('div', 'act', aside);
      const i1 = u.svg(
        'svg',
        {
          width: 30,
          height: 40,
          viewBox: '0 0 30 40',
          fill: 'none',
          stroke: '#29363d',
          'stroke-width': 2,
          'stroke-linejoin': 'miter',
        },
        r1,
      );
      u.svg('path', { d: 'M6 3V32L13 25L18 36L17 23H26Z', fill: '#f8fafb' }, i1);
      u.svg('path', { d: 'M6 3L17 23L13 25L6 32Z', fill: '#29363d' }, i1);
      u.el('span', '', r1, 'Click on the graph to place a point.');
      const r2 = u.el('div', 'act', aside);
      const i2 = u.svg(
        'svg',
        {
          width: 30,
          height: 40,
          viewBox: '0 0 30 40',
          fill: 'none',
          stroke: '#29363d',
          'stroke-width': 2,
          'stroke-linejoin': 'round',
        },
        r2,
      );
      u.svg('path', { d: 'M2 9H28M9 9L10 5H20L21 9M4 9L5 36H25L26 9M11 14V31M19 14V31' }, i2);
      u.el('span', '', r2, 'Use Clear to remove your point and try again.');
      u.el('div', 'grow', aside);
      const btns = u.el('div', 'btns', aside);
      const clear = u.el('button', 'clear', btns, 'Clear');
      clear.type = 'button';
      clear.onclick = () => {
        env.widgetDef.clear?.();
      };
      let submit = null;
      if (!ctx.finish) {
        const labelOf = (x) => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);
        const labels =
          ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
            ? ctx.content.END_LABELS
            : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
        const er = ctx.rng.fork('chrome/end'),
          placement = er.pick(['footer', 'footer', 'footer', 'header', 'header', 'link']);
        const label = labelOf(er.pick(labels));
        const makeEnd = (parent, cls, text) => {
          const b = u.el(cls === 'end-link' ? 'a' : 'button', cls, parent, text);
          b.type = 'button';
          if (b.tagName === 'A') b.href = '#';
          b.dataset.role = 'submit';
          b.setAttribute('aria-label', label);
          b.title = label;
          b.onclick = (e) => {
            e.preventDefault();
            ctx.submit();
          };
          return b;
        };
        if (placement === 'footer') submit = makeEnd(btns, 'submit', label);
        else if (placement === 'header') submit = makeEnd(docBar, 'end-header', label);
        else submit = makeEnd(btns, 'end-link', label + ' ›');
        if (placement === 'footer') btns.classList.add('has-end');
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const own = label.trim().toLowerCase(),
            options = [...new Set(labels.map(labelOf))].filter((x) => x.trim().toLowerCase() !== own);
          if (options.length) {
            const text = labelOf(cr.pick(options)),
              where = cr.pick(['header', 'header', 'footer']);
            const parent = where === 'header' ? docBar : btns;
            const d = u.el('button', 'end-xtra', parent, text);
            d.type = 'button';
            d.dataset.role = 'xtra';
            d.onclick = () => env.log('decoy', { label: text, collide: true });
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
