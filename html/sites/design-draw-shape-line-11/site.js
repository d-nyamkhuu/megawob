(function () {
  'use strict';
  const C = {
    'theme': 'nextstep',
    'title': 'Line Practice',
    'menu': ['Workspace', 'File', 'Edit', 'Tools', 'Help'],
    'accent': '#333',
    'font': 'Helvetica, Arial, sans-serif',
  };
  const TOOLS = [
    ['Select', 'M4 2V22L9 17L13 26L17 24L13 15H21Z'],
    ['Freehand', 'M5 24L6 18L19 5L23 9L10 22ZM16 8L20 12M6 18L10 22M19 5L21 3L25 7L23 9'],
    ['Rectangle', 'M3 5H25V23H3Z'],
    ['Ellipse', 'M24 14A10 10 0 1 1 4 14A10 10 0 1 1 24 14Z'],
    ['Eraser', 'M4 17L15 5L24 12L14 24H9ZM10 11L19 18'],
  ];
  env.site({
    name: 'design-draw-shape-line-11',
    styles: ['site.css', 'nextstep.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        body = document.body;
      body.className = 'design nextstep layout-ns' + (ctx.display === 'toast' ? ' has-instruction-toast' : '');
      const root = document.documentElement;
      for (const [k, v] of Object.entries({
        bg: '#bbb',
        panel: '#fff',
        fg: '#111820',
        muted: '#657080',
        line: '#c9cfd5',
        accent: C.accent,
      }))
        root.style.setProperty('--' + k, v);
      root.style.setProperty('--font', C.font);
      const shell = u.el('div', 'shell', body);
      const mb = u.el('div', 'ns-menubar', shell);
      const logo = u.el('span', 'ns-logo', mb);
      logo.textContent = '✕';
      for (const m of C.menu) u.el('span', 'ns-menu', mb, m);
      u.el('span', 'ns-clock', mb, 'Mon Oct 18   9:24 AM');
      const title = u.el('div', 'title', shell, C.title);
      const content = u.el('div', 'content', shell);
      const left = u.el('section', 'ns-pane ns-task', content);
      const lh = u.el('div', 'ns-phead', left);
      u.el('i', 'ns-sq', lh);
      u.el('span', '', lh, 'Task');
      const note = u.el('div', 'task-note ns-pbody', left);
      u.el('div', 'instruction', note, ctx.instruction);
      u.el('p', 'ns-help', note, 'Press and drag from A to B.');
      u.el('p', 'ns-help', note, 'Do not draw anything else.');
      u.el('hr', 'ns-rule', note);
      const st = u.el('div', 'ns-stats', note);
      u.el('div', 'ns-points', st, '');
      u.el('div', '', st, 'Tool:  Freehand pencil');
      u.el('div', 'ns-goal', st, '');
      if (ctx.display === 'hidden') note.hidden = true;
      else if (ctx.display === 'toast') {
        note.classList.add('instruction-toast');
        const x = u.el('button', 'note-close', note, '×');
        x.onclick = () => (note.style.visibility = 'hidden');
      } else if (ctx.display === 'panel') note.classList.add('instruction-panel');
      const right = u.el('section', 'ns-pane ns-draw', content);
      const rh = u.el('div', 'ns-phead', right);
      u.el('i', 'ns-sq', rh);
      u.el('span', '', rh, 'Drawing Area');
      const well = u.el('div', 'ns-well', right);
      const stage = u.el('main', 'stage', well);
      stage.dataset.role = 'stage';
      const foot = u.el('footer', 'footer ns-foot', shell);
      const fh = u.el('div', 'ns-phead', foot);
      u.el('i', 'ns-sq', fh);
      u.el('span', '', fh, 'Tools & Actions');
      const bar = u.el('div', 'ns-bar', foot);
      const btns = [];
      for (const [name, d] of TOOLS) {
        const g = u.el('div', 'ns-tool', bar);
        const b = u.el('button', 'ns-tbtn' + (name === 'Freehand' ? ' sel' : ''), g);
        b.type = 'button';
        const s = u.svg(
          'svg',
          {
            width: 42,
            height: 42,
            viewBox: '0 0 28 28',
            fill: name === 'Select' ? '#111' : name === 'Eraser' ? '#999' : 'none',
            stroke: '#111',
            'stroke-width': 2,
            'stroke-linejoin': 'round',
          },
          b,
        );
        u.svg('path', { d }, s);
        u.el('span', name === 'Freehand' ? 'b' : '', g, name);
        btns.push(b);
        b.onclick = () => {
          if (name === 'Eraser') env.widgetDef.clear?.();
        };
      }
      u.el('div', 'ns-vsep', bar);
      u.el('span', 'ns-lbl', bar, 'Line Width:');
      const w = u.el('div', 'ns-width', bar);
      u.el('span', '', w, '1');
      const sp = u.el('div', 'ns-spin', w);
      for (const d of ['M7 15V3M2 9L7 3L12 9', 'M7 2V14M2 8L7 14L12 8']) {
        const i = u.el('i', '', sp);
        const s = u.svg(
          'svg',
          { width: 14, height: 17, viewBox: '0 0 14 17', fill: 'none', stroke: '#111', 'stroke-width': 1.5 },
          i,
        );
        u.svg('path', { d }, s);
      }
      u.el('span', 'ns-lbl ns-b', bar, 'Color:');
      const sw = u.el('div', 'ns-color', bar);
      u.el('i', '', sw);
      u.el('div', 'ns-vsep', bar);
      const un = u.el('button', 'ns-btn dis', bar, 'Undo');
      un.type = 'button';
      const cl = u.el('button', 'ns-btn', bar, 'Clear');
      cl.type = 'button';
      cl.onclick = () => env.widgetDef.clear?.();
      u.el('div', 'ns-vsep', bar);
      let submit = null;
      if (!ctx.finish) {
        const endRng = ctx.rng.fork('chrome/end');
        const labels =
          ctx.content && Array.isArray(ctx.content.END_LABELS)
            ? ctx.content.END_LABELS
            : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
        const labelOf = (x) => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);
        const alternatives = labels.map(labelOf).filter((x) => x.trim().toLowerCase() !== 'submit');
        const label = endRng.bool(0.5) || !alternatives.length ? 'Submit' : endRng.pick(alternatives);
        const placement = endRng.pick(['toolbar', 'toolbar', 'title', 'link']);
        const endParent = placement === 'title' ? title : bar;
        const endClass = placement === 'link' ? 'ns-endlink' : 'submit';
        submit = u.el(
          placement === 'link' ? 'a' : 'button',
          endClass,
          endParent,
          placement === 'link' ? label + ' ›' : label,
        );
        if (placement !== 'link') submit.type = 'button';
        if (placement === 'title') {
          title.style.position = 'relative';
          Object.assign(submit.style, {
            position: 'absolute',
            right: '1.2vw',
            top: '3px',
            transform: 'none',
            minWidth: '80px',
            height: '20px',
            padding: '0 7px',
            font: '600 12px Helvetica,Arial,sans-serif',
            background: '#c6c6c6',
            color: '#111',
            border: '2px outset #eee',
            boxShadow: 'none',
          });
        } else if (placement === 'link') {
          submit.href = '#';
          Object.assign(submit.style, {
            marginLeft: 'auto',
            whiteSpace: 'nowrap',
            color: '#111',
            font: '600 clamp(14px,1.2vw,19px) Helvetica,Arial,sans-serif',
            padding: '10px 12px',
            textDecoration: 'underline',
          });
        }
        submit.dataset.role = 'submit';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.onclick = (e) => {
          e.preventDefault();
          ctx.submit();
        };
        const collideRng = ctx.rng.fork('chrome/collide');
        if (collideRng.bool(0.3)) {
          const pool = labels.map(labelOf).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
          if (pool.length) {
            const text = collideRng.pick(pool);
            const decoy = u.el('button', 'ns-xtra', bar, text);
            decoy.type = 'button';
            decoy.dataset.role = 'xtra';
            Object.assign(decoy.style, {
              flex: '0 0 auto',
              minWidth: '68px',
              height: '34px',
              padding: '0 5px',
              background: '#d4d4d4',
              border: '2px outset #eee',
              font: 'clamp(11px,1vw,15px) Helvetica,Arial,sans-serif',
              color: '#111',
            });
            decoy.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
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
      const h = u.el('h3', '', box);
      const xb = u.el('button', 'ns-x', h);
      xb.type = 'button';
      xb.setAttribute('aria-label', 'Close consent dialog');
      xb.onclick = () => ctx.dismiss('close');
      const xicon = u.svg(
        'svg',
        { width: 23, height: 23, viewBox: '0 0 24 24', fill: 'none', stroke: '#111', 'stroke-width': 1.6 },
        xb,
      );
      u.svg('path', { d: 'M5 5L19 19M19 5L5 19' }, xicon);
      u.el('span', '', h, 'Data Use Consent');
      const body = u.el('div', 'ns-ob', box);
      const ic = u.svg(
        'svg',
        {
          class: 'ob-icon',
          width: 100,
          height: 108,
          viewBox: '0 0 100 108',
          fill: '#ccc',
          stroke: '#111',
          'stroke-width': 2,
        },
        body,
      );
      u.svg('path', { d: 'M2 2H82L98 18V106H2Z' }, ic);
      u.svg('path', { d: 'M82 2V18H98', fill: 'none' }, ic);
      for (let i = 0; i < 7; i++)
        u.svg('path', { d: 'M18 ' + (18 + i * 12) + 'H' + (i === 6 ? 50 : i === 0 ? 66 : 82), fill: 'none' }, ic);
      const t = u.el('div', 'ns-obtext', body);
      u.el(
        'p',
        '',
        t,
        'We’d like to collect anonymous information about how you use this drawing tool to help improve it.',
      );
      const ul = u.el('ul', '', t);
      for (const s of [
        'What you draw (e.g., strokes and shapes)',
        'Basic device information',
        'Approximate time spent on tasks',
      ])
        u.el('li', '', ul, s);
      u.el('p', '', t, 'This data is not used to identify you.');
      const row = u.el('div', 'ns-obrow', body);
      const dismiss = u.el('button', 'dismiss', row, 'Reject (optional)');
      dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('close');
      const accept = u.el('button', 'dismiss agree', row, 'I Agree');
      accept.type = 'button';
      accept.onclick = () => ctx.dismiss('accept');
      return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };
    },
  });
})();
