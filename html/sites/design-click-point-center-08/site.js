(function () {
  'use strict';
  const C = {
    'theme': 'quiet',
    'accent': '#4a4f31',
    'bg': '#faf9f5',
    'surface': '#faf9f5',
    'font': "Georgia, 'Times New Roman', serif",
  };
  env.site({
    name: 'design-click-point-center-08',
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        body = document.body;
      body.className = 'design quiet' + (ctx.display === 'toast' ? ' has-instruction-toast' : '');
      const root = document.documentElement;
      for (const [k, v] of Object.entries({
        bg: C.bg,
        panel: C.surface,
        fg: '#2c2f1c',
        muted: '#6d6a58',
        line: '#e1d9c4',
        accent: C.accent,
      }))
        root.style.setProperty('--' + k, v);
      root.style.setProperty('--font', C.font);
      const shell = u.el('div', 'shell', body);
      const content = u.el('div', 'content', shell),
        note = u.el('section', 'task-note', content);
      u.el('div', 'instruction', note, ctx.instruction);
      if (ctx.display === 'hidden') note.hidden = true;
      else if (ctx.display === 'toast') {
        note.classList.add('instruction-toast');
        const x = u.el('button', 'note-close', note, '×');
        x.onclick = () => (note.style.visibility = 'hidden');
      } else if (ctx.display === 'panel') note.classList.add('instruction-panel');
      if (ctx.display !== 'toast' && ctx.display !== 'hidden') u.el('div', 'gold-rule', content);
      const stage = u.el('main', 'stage', content);
      stage.dataset.role = 'stage';
      const dock = u.el('footer', 'footer', shell);
      const tools = u.el('div', 'dock-group tools', dock);
      u.el('div', 'dock-label', tools, 'Tools');
      const row = u.el('div', 'dock-row', tools);
      const icons = {
        Pointer: 'M7 2V25L12 20L16 28L20 26L16 18H24Z',
        Pan: 'M9 16V5C9 2 12 2 12 5V14V3C12 0 15 0 15 3V14V4C15 1 18 2 18 5V15V7C18 4 21 5 21 8V18C21 25 18 28 13 28C9 28 7 26 5 22L2 15C1 12 4 11 6 14L9 18',
        Clear: 'M6 8C10 3 18 3 23 8C30 17 22 28 12 25C7 24 4 21 4 16M6 3V8H12',
      };
      const btns = [];
      for (const name of ['Pointer', 'Pan', 'Clear']) {
        const bt = u.el('button', 'tool' + (name === 'Pointer' ? ' selected' : ''), row);
        bt.type = 'button';
        const s = u.svg(
          'svg',
          {
            width: 34,
            height: 34,
            viewBox: '0 0 28 28',
            fill: 'none',
            stroke: 'currentColor',
            'stroke-width': 1.6,
            'stroke-linejoin': 'round',
          },
          bt,
        );
        u.svg('path', { d: icons[name] }, s);
        u.el('span', '', bt, name);
        btns.push(bt);
        bt.onclick = () => {
          if (name === 'Clear') {
            env.widgetDef.clear?.();
            return;
          }
          btns.forEach((x) => x.classList.remove('selected'));
          bt.classList.add('selected');
        };
      }
      u.el('div', 'dock-sep', dock);
      const zoom = u.el('div', 'dock-group zoom', dock);
      u.el('div', 'dock-label', zoom, 'Zoom');
      const zr = u.el('div', 'zoom-row', zoom);
      const mk = (t) => {
        const b = u.el('button', 'zbtn', zr, t);
        b.type = 'button';
        return b;
      };
      mk('−');
      u.el('span', 'zval', zr, '100%');
      mk('+');
      u.el('div', 'dock-sep', dock);
      u.el('div', 'dock-spacer', dock);
      let submit = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end');
        const labels =
          ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
            ? ctx.content.END_LABELS
            : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
        const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
        const original = er.bool(0.5),
          place = original ? 'dock' : er.pick(['top', 'top', 'link']);
        const label = original ? 'Submit' : labelOf(er.pick(labels));
        const cr = ctx.rng.fork('chrome/collide');
        let collide = null;
        if (cr.bool(0.3)) {
          const pool = labels.map(labelOf).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
          if (pool.length) collide = cr.pick(pool);
        }
        if (collide) {
          const d = u.el('button', 'end-xtra', dock, collide);
          d.type = 'button';
          d.dataset.role = 'xtra';
          d.onclick = () => env.log('decoy', { label: collide, collide: true });
        }
        if (place === 'top') {
          content.classList.add('has-top-action');
          const b = u.el('button', 'top-submit', content, label);
          b.type = 'button';
          b.dataset.role = 'submit';
          b.setAttribute('aria-label', label);
          b.title = label;
          b.onclick = () => ctx.submit();
          submit = b;
        } else {
          if (place === 'link') {
            const a = u.el('a', 'submit submit-link', dock, label + ' ›');
            a.href = '#';
            a.dataset.role = 'submit';
            a.setAttribute('aria-label', label);
            a.title = label;
            a.onclick = (e) => {
              e.preventDefault();
              ctx.submit();
            };
            submit = a;
          } else {
            const b = u.el('button', 'submit', dock, label);
            b.type = 'button';
            b.dataset.role = 'submit';
            b.setAttribute('aria-label', label);
            b.title = label;
            b.onclick = () => ctx.submit();
            submit = b;
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
