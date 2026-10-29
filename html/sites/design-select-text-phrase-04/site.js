(function () {
  'use strict';
  const C = {
    title: 'Text Task',
    menu: ['File', 'Edit', 'View', 'Help'],
    tools: ['Select', 'Copy', 'Cut', 'Paste'],
    clock: 'Mon Apr 22   10:24 AM',
  };
  const ICONS = {
    Select: 'M6 2V24L11 19L15 27L18 26L14 18H21Z',
    Copy: 'M5 2H16L23 9V29H5ZM16 2V9H23M8 5H13M8 8H13M8 12H20M8 15H20M8 18H20M8 21H20M8 24H20',
    Cut: 'M5 2L19 22M22 2L9 22M6 21A4 4 0 1 0 6 29A4 4 0 1 0 6 21M21 21A4 4 0 1 0 21 29A4 4 0 1 0 21 21M13 16H15',
    Paste: 'M4 5H24V29H4ZM7 8H21V26H7M9 4V8H19V4ZM11 4V2H17V4M9 12H19M9 15H19M9 18H19M9 21H19M9 24H19',
  };
  function appIcon(u, parent, cls) {
    const s = u.svg('svg', { class: cls, viewBox: '0 0 20 22', width: 20, height: 22 }, parent);
    u.svg('rect', { x: 1, y: 1, width: 18, height: 20, fill: '#d3d1c9', stroke: '#222' }, s);
    u.svg('path', { d: 'M4 4H10V11H4ZM10 11H16V18H10Z', fill: '#738aaa', stroke: '#222', 'stroke-width': 0.8 }, s);
    u.svg(
      'path',
      { d: 'M11 3L16 6L13 12L8 9ZM4 13L8 12L10 18L5 19Z', fill: '#c1aa72', stroke: '#222', 'stroke-width': 0.8 },
      s,
    );
    u.svg('path', { d: 'M6 3V19M3 9H17M10 4L14 18', fill: 'none', stroke: '#762e2a', 'stroke-width': 1 }, s);
    return s;
  }
  const definition = {
    name: 'design-select-text-phrase-04',
    styles: ['motif.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        body = document.body;
      body.className = 'design motif' + (ctx.display === 'toast' ? ' has-instruction-toast' : '');
      const endR = ctx.rng.fork('chrome/end');
      const endPool =
        ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const endText = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const keepDefault = endR.bool(0.5);
      const endLabel = keepDefault ? 'Submit' : endText(endR.pick(endPool));
      const placement = ctx.finish ? null : keepDefault ? 'footer' : endR.pick(['header', 'link']);
      const collideR = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && collideR.bool(0.3)) {
        const choices = [...new Set(endPool.map(endText))].filter(
          (x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase(),
        );
        if (choices.length) collide = collideR.pick(choices);
      }
      let submit = null;
      const shell = u.el('div', 'shell', body);
      // top panel
      const bar = u.el('div', 'topbar', shell);
      appIcon(u, bar, 'bar-icon');
      for (const t of ['Applications', 'Places', 'System']) u.el('span', 'bar-item', bar, t);
      u.el('span', 'bar-clock', bar, C.clock);
      // tools window
      const tools = u.el('div', 'float tools', shell);
      const th = u.el('div', 'float-head', tools);
      u.el('span', '', th, 'Tools ▫');
      const tx = u.el('button', 'xbtn', th, '✕');
      tx.type = 'button';
      const tl = u.el('div', 'tool-list', tools);
      C.tools.forEach((t, i) => {
        const b = u.el('button', 'tool' + (i === 0 ? ' selected' : ''), tl);
        b.type = 'button';
        const s = u.svg(
          'svg',
          {
            viewBox: '0 0 28 30',
            width: 28,
            height: 30,
            fill: i === 0 ? '#111' : i === 2 ? 'none' : '#eeede7',
            stroke: '#111',
            'stroke-width': i === 2 ? 2.2 : 1.3,
            'stroke-linejoin': 'round',
          },
          b,
        );
        u.svg('path', { d: ICONS[t] }, s);
        u.el('span', '', b, t);
        b.onclick = () => {
          tl.querySelectorAll('.tool').forEach((x) => x.classList.remove('selected'));
          b.classList.add('selected');
        };
      });
      // find window
      const find = u.el('div', 'float find', shell);
      const fh = u.el('div', 'float-head', find);
      u.el('span', '', fh, 'Find ▫');
      u.el('button', 'xbtn', fh, '✕').type = 'button';
      const fb = u.el('div', 'find-body', find);
      u.el('div', '', fb, 'Find:');
      const fi = u.el('input', 'find-input', fb);
      fi.type = 'text';
      fi.readOnly = true;
      for (const t of ['Match case', 'Whole words']) {
        const l = u.el('label', 'find-check', fb);
        const c = u.el('input', '', l);
        c.type = 'checkbox';
        u.el('span', '', l, t);
      }
      u.el('button', 'find-next', fb, 'Find Next').type = 'button';
      // main window
      const win = u.el('div', 'win', shell);
      const head = u.el('div', 'win-title', win);
      appIcon(u, head, 'win-icon');
      u.el('span', 'win-title-text', head, C.title);
      const wc = u.el('div', 'win-controls', head);
      for (const l of ['_', '□', '✕']) {
        const b = u.el('button', '', wc, l);
        b.type = 'button';
        b.onclick = () => env.log('window-control', { label: l });
      }
      const menu = u.el('div', 'win-menu', win);
      for (const m of C.menu) u.el('span', '', menu, m);
      if (placement === 'header') {
        submit = u.el('button', 'submit motif-end motif-header-end', menu, endLabel);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.setAttribute('aria-label', endLabel);
        submit.title = endLabel;
        submit.onclick = () => ctx.submit();
      }
      const content = u.el('div', 'content', win);
      const note = u.el('section', 'task-note', content);
      u.el('div', 'instruction', note, ctx.instruction);
      if (ctx.display === 'hidden') note.hidden = true;
      else if (ctx.display === 'toast') {
        note.classList.add('instruction-toast');
        const x = u.el('button', 'note-close', note, '×');
        x.onclick = () => (note.style.visibility = 'hidden');
      } else if (ctx.display === 'panel') note.classList.add('instruction-panel');
      const stage = u.el('main', 'stage', content);
      stage.dataset.role = 'stage';
      const foot = u.el('footer', 'footer', content);
      const grow = u.el('span', 'foot-grow', foot);
      if (!ctx.finish && placement === 'footer') {
        submit = u.el('button', 'submit', foot, endLabel);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.setAttribute('aria-label', endLabel);
        submit.title = endLabel;
        submit.onclick = () => ctx.submit();
      } else if (!ctx.finish && placement === 'link') {
        submit = u.el('a', 'motif-endlink', foot, endLabel + ' ›');
        submit.href = '#';
        submit.dataset.role = 'submit';
        submit.setAttribute('aria-label', endLabel);
        submit.title = endLabel;
        submit.onclick = (e) => {
          e.preventDefault();
          ctx.submit();
        };
      }
      if (collide) {
        const d = u.el('button', 'motif-xtra', foot, collide);
        d.type = 'button';
        d.dataset.role = 'xtra';
        d.onclick = () => env.log('decoy', { label: collide, collide: true });
      }
      if (!submit) grow.style.flex = '1';
      const clear = u.el('button', 'clear', foot, 'Clear');
      clear.type = 'button';
      clear.onclick = () => {
        env.widgetDef.clear?.();
      };
      // taskbar
      const tb = u.el('div', 'taskbar', shell);
      u.el('span', 'tb-btn', tb, '≡');
      const task = u.el('span', 'tb-task', tb);
      appIcon(u, task, 'bar-icon');
      u.el('span', '', task, C.title);
      u.el('span', 'tb-grow', tb);
      u.el('span', 'tb-btn', tb, '▤');
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
      let dismiss;
      if (kind === 'cookie') {
        const reject = u.el('button', 'dismiss', box, 'Reject optional');
        reject.type = 'button';
        reject.onclick = () => ctx.dismiss('reject');
        dismiss = u.el('button', 'dismiss', box, 'Accept optional');
        dismiss.type = 'button';
        dismiss.onclick = () => ctx.dismiss('accept');
      } else {
        dismiss = u.el('button', 'dismiss', box, 'Close');
        dismiss.type = 'button';
        dismiss.onclick = () => ctx.dismiss('close');
      }
      return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };
    },
  };
  env.site(definition);
})();
