(function () {
  'use strict';
  const C = { foot: 'Order: left to right, top to bottom', accent: '#ff8a1f' };
  const ICONS = {
    New: '<path d="M8 3h13l5 5v21H8z" fill="#fff" stroke="#000" stroke-width="2"/><path d="M21 3v5h5" fill="none" stroke="#000" stroke-width="2"/>',
    Open: '<path d="M3 8h9l3 3h14v17H3z" fill="#ffe600" stroke="#000" stroke-width="2"/>',
    Save: '<path d="M4 4h22l3 3v22H4z" fill="#1235c8" stroke="#000" stroke-width="2"/><rect x="9" y="4" width="13" height="9" fill="#fff" stroke="#000"/><path d="M13 5v6M19 5v6" stroke="#000" stroke-width="2"/><rect x="9" y="19" width="14" height="10" fill="#ddd" stroke="#000" stroke-width="1.5"/>',
    Close:
      '<path d="M5 5L27 27M27 5L5 27" stroke="#e01010" stroke-width="7"/><path d="M5 5L27 27M27 5L5 27" stroke="#600" stroke-width="1" opacity=".5"/>',
    Undo: '<path d="M12 6L4 14l8 8V17c8-1 12 2 15 9 0-10-5-16-15-16z" fill="#3f78e0" stroke="#123" stroke-width="1.5"/>',
    Redo: '<path d="M20 6l8 8-8 8V17C12 16 8 19 5 26c0-10 5-16 15-16z" fill="#3f78e0" stroke="#123" stroke-width="1.5"/>',
    Shuffle:
      '<rect x="4" y="4" width="24" height="24" fill="#fff" stroke="#000" stroke-width="2"/><g fill="#000"><circle cx="10" cy="10" r="2.5"/><circle cx="22" cy="10" r="2.5"/><circle cx="16" cy="16" r="2.5"/><circle cx="10" cy="22" r="2.5"/><circle cx="22" cy="22" r="2.5"/></g>',
    Reset:
      '<rect x="4" y="4" width="24" height="24" fill="#fff" stroke="#000" stroke-width="2"/><path d="M12 4v24M20 4v24M4 12h24M4 20h24" stroke="#000" stroke-width="2"/>',
    'Auto Sort': '<path d="M19 2L8 18h7l-3 12 13-18h-7z" fill="#222" stroke="#000" stroke-width="1"/>',
    Grid: '<g fill="#c0c0c0" stroke="#000" stroke-width="2"><rect x="5" y="6" width="4" height="4"/><rect x="13" y="6" width="4" height="4"/><rect x="21" y="6" width="4" height="4"/><rect x="5" y="14" width="4" height="4"/><rect x="13" y="14" width="4" height="4"/><rect x="21" y="14" width="4" height="4"/><rect x="5" y="22" width="4" height="4"/><rect x="13" y="22" width="4" height="4"/><rect x="21" y="22" width="4" height="4"/></g>',
    List: '<rect x="4" y="4" width="24" height="24" fill="#fff" stroke="#1235c8" stroke-width="2"/><path d="M7 9h18M7 13h18M7 17h18M7 21h18M7 25h18" stroke="#1235c8" stroke-width="2"/>',
  };
  const GROUPS = [
    ['File', ['New', 'Open', 'Save', '|', 'Close']],
    ['Edit', ['Undo', 'Redo']],
    ['Arrange', ['Shuffle', '|', 'Reset']],
    ['Quick action', ['Auto Sort']],
    ['View', ['Grid', '|', 'List']],
  ];
  env.site({
    name: 'design-reorder-items-grid-12',
    styles: ['amiga.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        body = document.body;
      let display = ctx.display;
      if ((display === 'panel' && window.innerWidth < 1120) || (display === 'toast' && window.innerHeight < 700))
        display = 'header';
      body.className = 'design amiga' + (display === 'toast' ? ' has-instruction-toast' : '');
      const labels = (ctx.content && ctx.content.END_LABELS) || [
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
      const labelOf = (x) => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);
      const er = ctx.rng.fork('chrome/end'),
        cr = ctx.rng.fork('chrome/collide');
      const original = er.bool(0.55),
        placement = original ? 'footer' : er.pick(['toolbar', 'status']);
      const endLabel = original ? 'Submit' : labelOf(er.pick(labels));
      const collide = cr.bool(0.3)
        ? (() => {
            const options = [...new Set(labels.map(labelOf))].filter(
              (x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase(),
            );
            return options.length ? cr.pick(options) : null;
          })()
        : null;
      const root = document.documentElement;
      for (const [k, v] of Object.entries({
        bg: '#8a95a8',
        panel: '#c0c0c0',
        fg: '#000',
        muted: '#444',
        line: '#000',
        accent: C.accent,
      }))
        root.style.setProperty('--' + k, v);
      const shell = u.el('div', 'shell', body),
        head = u.el('header', 'head', shell);
      const tb = u.el('div', 'titlebar', head);
      u.el('span', 'gadget close', tb, 'I');
      u.el('span', 'ttl', tb, 'Amiga Workbench - Tile Sorter');
      const wc = u.el('div', 'window-controls', tb);
      for (const g of ['_', '□', '×']) {
        const b = u.el('button', '', wc, g);
        b.type = 'button';
        b.onclick = () => env.log('window-control', { label: g });
      }
      const rib = u.el('div', 'ribbon', head);
      for (const [name, tools] of GROUPS) {
        const gr = u.el('div', 'tool-group g-' + name.replace(/\s/g, '').toLowerCase(), rib);
        u.el('div', 'gname', gr, name);
        const row = u.el('div', 'trow', gr);
        for (const t of tools) {
          if (t === '|') {
            u.el('span', 'sep', row);
            continue;
          }
          const bt = u.el('button', 'tool' + (t === 'Grid' ? ' selected' : ''), row);
          bt.type = 'button';
          const dis = t === 'Undo' || t === 'Redo' || t === 'Auto Sort';
          if (dis) {
            bt.classList.add('off');
            bt.disabled = true;
            bt.setAttribute('aria-disabled', 'true');
          }
          const svg = u.svg('svg', { width: 32, height: 32, viewBox: '0 0 32 32' }, bt);
          svg.innerHTML = ICONS[t];
          u.el('span', '', bt, t);
          if (!dis)
            bt.onclick = () => {
              if (t === 'Reset') env.widgetDef.clear?.();
              if (t === 'Grid' || t === 'List') {
                row.querySelectorAll('.tool').forEach((x) => x.classList.remove('selected'));
                bt.classList.add('selected');
              }
              env.log('tool', { label: t });
            };
        }
      }
      let toolbarEnd = null;
      if (!ctx.finish && placement === 'toolbar') {
        toolbarEnd = u.el('button', 'toolbar-end', tb);
        toolbarEnd.type = 'button';
        toolbarEnd.dataset.role = 'submit';
        toolbarEnd.title = endLabel;
        toolbarEnd.setAttribute('aria-label', endLabel);
        u.el('span', 'toolbar-end-label', toolbarEnd, endLabel);
        toolbarEnd.onclick = () => ctx.submit();
      }
      const content = u.el('div', 'content', shell),
        note = u.el('section', 'task-note', content);
      u.el('div', 'instruction', note, ctx.instruction);
      if (display === 'hidden') note.hidden = true;
      else if (display === 'toast') {
        note.classList.add('instruction-toast');
        const x = u.el('button', 'note-close', note, '×');
        x.type = 'button';
        x.setAttribute('aria-label', 'Close');
        x.onclick = () => (note.style.visibility = 'hidden');
      } else if (display === 'panel') {
        note.classList.add('instruction-panel');
        content.classList.add('panel-mode');
      }
      const stage = u.el('main', 'stage', content);
      stage.dataset.role = 'stage';
      const cursor = u.svg('svg', { class: 'scenic-cursor', viewBox: '0 0 24 36', 'aria-hidden': 'true' }, content);
      cursor.innerHTML =
        '<path d="M2 1v27l6-7 5 13 5-2-5-12h9z" fill="#fff" stroke="#000" stroke-width="2" stroke-linejoin="miter"/>';
      const footer = u.el('footer', 'footer', shell);
      u.el('div', 'footer-ready', footer, 'Ready.');
      u.el('div', 'footer-cell', footer, 'Tiles: ' + ((ctx.spec && ctx.spec.items && ctx.spec.items.length) || ''));
      u.el('div', 'footer-cell wide', footer, C.foot);
      if (collide) {
        const decoy = u.el('button', 'pq-xtra', footer, collide);
        decoy.type = 'button';
        decoy.dataset.role = 'xtra';
        decoy.onclick = () => env.log('decoy', { label: collide, collide: true });
      }
      let submit = toolbarEnd;
      if (!ctx.finish && placement === 'footer') {
        submit = u.el('button', 'submit', footer);
        u.el('span', 'submit-label', submit, endLabel);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.onclick = () => ctx.submit();
      } else if (!ctx.finish && placement === 'status') {
        submit = u.el('button', 'status-end', footer, endLabel + ' ›');
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.onclick = () => ctx.submit();
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
