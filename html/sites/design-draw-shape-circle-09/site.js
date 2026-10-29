(function () {
  'use strict';
  const C = {
    title: 'DRAW LAB',
    nav: ['TASKS', 'HELP', 'SETTINGS'],
    side: ['Draw', 'Practice', 'Results'],
    dialog: 'Circle Trace',
    noteLabel: 'Task:',
    yellow: '#ffe65e',
    ink: '#000',
    bg: '#f6f5f3',
    font: '"Courier New",Courier,monospace',
  };
  const PENCIL = 'M3 21L4.5 14.5L17 2Q18 1 19 2L22 5Q23 6 22 7L9.5 19.5ZM16 3L21 8M4.5 14.5L9.5 19.5M3.5 18L6 20.5';
  const ERASER = 'M3 14L13 3Q14 2 15 3L21 9Q22 10 21 11L11 21H8L3 16Q2 15 3 14ZM7 10L16 17';
  env.site({
    name: 'design-draw-shape-circle-09',
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        body = document.body;
      body.className = 'design brut' + (ctx.display === 'toast' ? ' has-instruction-toast' : '');
      body.classList.add('display-' + ctx.display);
      const root = document.documentElement;
      for (const [k, v] of Object.entries({
        bg: C.bg,
        panel: '#fdfdfd',
        fg: '#000',
        muted: '#111',
        line: '#000',
        accent: '#d6246e',
      }))
        root.style.setProperty('--' + k, v);
      root.style.setProperty('--font', C.font);
      root.style.setProperty('--yellow', C.yellow);
      const shell = u.el('div', 'shell', body);
      const head = u.el('header', 'head', shell);
      u.el('div', 'title', head, C.title);
      const nav = u.el('nav', 'menu', head);
      for (const t of C.nav) u.el('span', '', nav, t);
      const side = u.el('aside', 'side', shell);
      C.side.forEach((t, i) => {
        const b = u.el('button', 'side-item' + (i === 0 ? ' on' : ''), side, t);
        b.type = 'button';
      });
      const dlg = u.el('section', 'dialog', shell);
      const tb = u.el('div', 'dlg-title', dlg);
      u.el('span', '', tb, C.dialog);
      const sq = u.el('span', 'sq', tb);
      for (let i = 0; i < 3; i++) u.el('i', '', sq);
      const stage = u.el('main', 'stage', dlg);
      stage.dataset.role = 'stage';
      const foot = u.el('footer', 'footer', dlg);
      const icon = (parent, d) => {
        const s = u.svg(
          'svg',
          {
            width: 36,
            height: 36,
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: '#000',
            'stroke-width': 1.8,
            'stroke-linejoin': 'round',
            'stroke-linecap': 'round',
          },
          parent,
        );
        u.svg('path', { d }, s);
      };
      const pen = u.el('button', 'tool on', foot);
      pen.type = 'button';
      icon(pen, PENCIL);
      u.el('span', '', pen, 'Pencil');
      const clr = u.el('button', 'tool clear', foot);
      clr.type = 'button';
      icon(clr, ERASER);
      u.el('span', '', clr, 'Clear');
      clr.onclick = () => {
        env.widgetDef.clear?.();
      };
      u.el('span', 'grow', foot);
      let submit = null;
      let endPlacement = 'footer',
        endLabel = 'Submit',
        collide = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end');
        const cr = ctx.rng.fork('chrome/collide');
        if (er.bool(0.5)) {
          endPlacement = 'footer';
          endLabel = 'Submit';
        } else {
          endPlacement = er.pick(['header', 'link']);
          const labels = ctx.content && ctx.content.END_LABELS;
          endLabel = er.pick(
            Array.isArray(labels) && labels.length
              ? labels
              : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'],
          );
          if (typeof endLabel !== 'string') endLabel = endLabel.label || endLabel.text || String(endLabel);
        }
        if (cr.bool(0.3)) {
          const labels = ctx.content && ctx.content.END_LABELS,
            pool =
              Array.isArray(labels) && labels.length
                ? labels
                : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
          const options = pool
            .map((x) => (typeof x === 'string' ? x : x.label || x.text || String(x)))
            .filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
          if (options.length) collide = cr.pick(options);
        }
        const makeEnd = (parent, cls, text) => {
          const b = u.el(endPlacement === 'link' ? 'a' : 'button', cls, parent, text);
          if (b.tagName === 'BUTTON') b.type = 'button';
          else b.href = '#';
          b.dataset.role = 'submit';
          b.setAttribute('aria-label', endLabel);
          b.title = endLabel;
          b.onclick = (e) => {
            e.preventDefault();
            ctx.submit();
          };
          return b;
        };
        if (endPlacement === 'footer') submit = makeEnd(foot, 'submit', endLabel);
        else if (endPlacement === 'header') submit = makeEnd(head, 'header-submit', endLabel);
        else submit = makeEnd(foot, 'submit-link', endLabel + ' ›');
        if (collide) {
          const parent = endPlacement === 'footer' ? head : foot;
          const b = u.el('button', 'end-xtra', parent, collide);
          b.type = 'button';
          b.dataset.role = 'xtra';
          b.onclick = () => env.log('decoy', { label: collide, collide: true });
        }
      }
      const note = u.el('section', 'task-note', shell);
      u.el('div', 'note-label', note, C.noteLabel);
      u.el('div', 'instruction', note, ctx.instruction);
      if (ctx.display === 'hidden') note.hidden = true;
      else if (ctx.display === 'toast') {
        note.classList.add('instruction-toast');
        const x = u.el('button', 'note-close', note, '×');
        x.type = 'button';
        x.onclick = () => (note.style.visibility = 'hidden');
      } else if (ctx.display === 'panel') note.classList.add('instruction-panel');
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        kind = ctx.kind;
      const el = u.el('section', 'obstruction obstruction-' + kind, document.body);
      el.dataset.role = 'overlay';
      const box = u.el('div', 'obstruction-box', el);
      const title =
        {
          cookie: 'Your privacy',
          toast: 'Changes saved',
          chat: 'Support',
          promo: 'Workspace update',
          banner: 'Service notice',
        }[kind] || 'Notice';
      const text =
        {
          cookie: 'This application stores optional cookies.',
          toast: 'Your changes have been saved.',
          chat: 'Need a hand with this workspace?',
          promo: 'Explore the latest workspace features.',
          banner: 'You are viewing a shared workspace.',
        }[kind] || '';
      u.el('h3', '', box, title);
      u.el('p', '', box, text);
      const dismiss = u.el('button', 'dismiss', box, kind === 'cookie' ? 'Reject optional' : 'Close');
      dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('close');
      if (kind === 'cookie') {
        const a = u.el('button', 'dismiss', box, 'Accept optional');
        a.type = 'button';
        a.onclick = () => ctx.dismiss('accept');
      }
      return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };
    },
  });
})();
