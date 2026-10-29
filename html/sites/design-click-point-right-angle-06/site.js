(function () {
  'use strict';
  const TOOLS = [
    [
      'Select',
      'M-5 -11Q-7 -11 -7 -9Q-7 -7 -4 -7H-3V3H-6Q-9 3 -9 5Q-9 7 -6 7H-1V13L0 15L1 13V7H6Q9 7 9 5Q9 3 6 3H3V-7H4Q7 -7 7 -9Q7 -11 5 -11Z',
    ],
    ['Point', 'M-4 0A4 4 0 1 1 4 0A4 4 0 1 1 -4 0Z'],
    ['Segment', 'M-9 10L9 -10'],
    ['Circle', 'M-11 0A11 11 0 1 1 11 0A11 11 0 1 1 -11 0Z'],
    ['Measure', 'M-9 -10L-9 10L11 10Z'],
    ['Clear', 'M-8 -12H3L8 -7V12H-8ZM3 -12V-5H8M-4 -1H4M-4 4H4M-4 8H4'],
  ];
  const TOOL_NOTE = {
    Select: 'Click to add a point.',
    Point: 'Click to add a point.',
    Segment: 'Click two points to draw a segment.',
    Circle: 'Click to set a center.',
    Measure: 'Click to measure an angle.',
    Clear: 'Clears the drawing.',
  };
  const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
  env.site({
    name: 'design-click-point-right-angle-06',
    styles: ['open.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        body = document.body;
      body.className = 'ol' + (ctx.display === 'toast' ? ' has-instruction-toast' : '');
      const shell = u.el('div', 'shell', body);
      const rail = u.el('nav', 'rail', shell);
      const grip = u.el('div', 'rail-grip', rail);
      grip.innerHTML =
        '<svg width="18" height="12" viewBox="0 0 18 12"><path d="M1 2H17M1 6H17M1 10H17" stroke="#555" stroke-width="1.4"/></svg>';
      let toolNote;
      const btns = [];
      for (const [name, path] of TOOLS) {
        const bt = u.el('button', 'rtool' + (name === 'Select' ? ' sel' : ''), rail);
        bt.type = 'button';
        const s = u.svg(
          'svg',
          {
            width: 44,
            height: 34,
            viewBox: '-16 -16 32 32',
            fill: name === 'Point' ? '#111' : name === 'Select' ? '#111' : 'none',
            stroke: '#111',
            'stroke-width': 2.2,
            'stroke-linejoin': 'round',
          },
          bt,
        );
        u.svg('path', { d: path }, s);
        u.el('span', '', bt, name);
        btns.push(bt);
        bt.onclick = () => {
          if (name === 'Clear') {
            env.widgetDef.clear?.();
            return;
          }
          btns.forEach((x) => x.classList.remove('sel'));
          bt.classList.add('sel');
          if (toolNote) {
            toolNote.t.textContent = 'Tool: ' + name;
            toolNote.h.textContent = TOOL_NOTE[name];
          }
        };
      }
      u.el('div', 'rail-fill', rail);
      const win = u.el('div', 'win', shell);
      const head = u.el('header', 'head', win);
      u.el('div', 'title', head, 'Geometry Workshop');
      const wc = u.el('div', 'wctl', head);
      for (const k of ['p', 'm']) {
        const b = u.el('button', '', wc);
        b.type = 'button';
        b.innerHTML =
          k === 'p'
            ? '<svg width="14" height="14" viewBox="0 0 14 14"><path d="M3 2H11M7 2V12M3 12H11" stroke="#111" stroke-width="2" fill="none"/></svg>'
            : '<svg width="14" height="14" viewBox="0 0 14 14"><rect x="2" y="2" width="10" height="10" fill="none" stroke="#111" stroke-width="2.2"/></svg>';
        b.onclick = () => env.log('window-control', { k });
      }
      const menu = u.el('nav', 'menu', win);
      for (const m of ['File', 'Edit', 'View', 'Tools', 'Help']) {
        const s = u.el('span', '', menu, m);
      }
      const content = u.el('div', 'content', win);
      const note = u.el('section', 'task-note', content);
      if (ctx.display === 'panel') u.el('div', 'panel-heading', note, 'Task instructions');
      u.el('div', 'instruction', note, ctx.instruction);
      if (ctx.display === 'hidden') note.hidden = true;
      else if (ctx.display === 'toast') {
        note.classList.add('instruction-toast');
        const x = u.el('button', 'note-close', note, '×');
        x.type = 'button';
        x.setAttribute('aria-label', 'Close');
        x.onclick = () => (note.style.visibility = 'hidden');
      } else if (ctx.display === 'panel') note.classList.add('instruction-panel');
      const stage = u.el('main', 'stage', content);
      stage.dataset.role = 'stage';
      const footer = u.el('footer', 'footer', win);
      const st = u.el('div', 'f-status', footer);
      toolNote = { t: u.el('div', '', st, 'Tool: Select'), h: u.el('div', '', st, 'Click to add a point.') };
      const co = u.el('div', 'f-coords', footer);
      u.el('span', '', co, 'x:  —');
      u.el('span', '', co, 'y:  —');
      const act = u.el('div', 'f-act', footer);
      const undo = u.el('button', 'obtn', act, 'Undo');
      undo.type = 'button';
      undo.onclick = () => {
        env.widgetDef.clear?.();
      };
      const redo = u.el('button', 'obtn', act, 'Redo');
      redo.type = 'button';
      redo.disabled = true;
      let submit = null;
      if (!ctx.finish) {
        const fallback = [
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
        ];
        const labels =
          ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
            ? ctx.content.END_LABELS
            : fallback;
        const endRng = ctx.rng.fork('chrome/end');
        const common = endRng.bool(0.5);
        const label = common ? 'Submit' : labelOf(endRng.pick(labels));
        const placement = common ? 'footer' : endRng.pick(['menu', 'link', 'footer']);
        const end = (parent, cls, text) => {
          const b = u.el(cls === 'end-link' ? 'a' : 'button', cls, parent, text);
          if (cls === 'end-link') b.href = '#';
          else b.type = 'button';
          b.dataset.role = 'submit';
          b.setAttribute('aria-label', label);
          b.title = label;
          b.onclick = (e) => {
            e.preventDefault();
            ctx.submit();
          };
          return b;
        };
        const decoy = (parent, text, collide) => {
          const b = u.el('button', 'chrome-xtra', parent, text);
          b.type = 'button';
          b.dataset.role = 'xtra';
          b.onclick = () => env.log('decoy', collide ? { label: text, collide: true } : { label: text });
          return b;
        };
        const collideRng = ctx.rng.fork('chrome/collide');
        let collide = null;
        if (collideRng.bool(0.3)) {
          const same = (s) => String(s).trim().toLowerCase() === label.trim().toLowerCase();
          const options = [...new Set(labels.map(labelOf))].filter((x) => !same(x));
          if (options.length)
            collide = { label: String(collideRng.pick(options)), where: collideRng.pick(['menu', 'footer']) };
        }
        if (placement === 'menu' || collide?.where === 'menu') {
          menu.classList.add('menu-actions');
          const tools = u.el('div', 'menu-actions-inner', menu);
          if (collide && collide.where === 'menu') decoy(tools, collide.label, true);
          if (placement === 'menu') submit = end(tools, 'menu-submit', label);
        }
        if (placement === 'footer') submit = end(act, 'submit', label);
        else if (placement === 'link') submit = end(act, 'end-link', label + ' ›');
        if (collide && collide.where === 'footer') decoy(act, collide.label, true);
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
