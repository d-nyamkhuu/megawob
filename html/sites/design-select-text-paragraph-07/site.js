(function () {
  'use strict';
  const C = {
    'title': 'TextLens',
    'accent': '#0a2fc4',
    'font': 'Arial, Helvetica, sans-serif',
    'doc': 'world_notes.txt',
  };
  env.site({
    name: 'design-select-text-paragraph-07',
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        body = document.body;
      body.className = 'design beos' + (ctx.display === 'toast' ? ' has-instruction-toast' : '');
      const erng = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const original = erng.bool(0.5);
      const placement = original ? 'actions' : erng.pick(['toolbar', 'footer']);
      const endLabel = original ? 'Submit' : erng.pick(endLabels);
      const crng = ctx.rng.fork('chrome/collide');
      const collideLabels = endLabels.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
      const collide = crng.bool(0.3) && collideLabels.length ? crng.pick(collideLabels) : null;
      const root = document.documentElement;
      for (const [k, v] of Object.entries({
        bg: '#c8d0de',
        panel: '#fff',
        fg: '#111820',
        muted: '#5a6578',
        line: '#9aa4b8',
        accent: C.accent,
      }))
        root.style.setProperty('--' + k, v);
      root.style.setProperty('--font', C.font);
      const shell = u.el('div', 'shell', body);
      const head = u.el('header', 'head', shell);
      const tab = u.el('div', 'tab-title', head);
      const app = u.svg('svg', { width: 22, height: 22, viewBox: '0 0 22 22' }, tab);
      app.innerHTML =
        '<rect x="1" y="1" width="20" height="20" fill="#1c8fdb" stroke="#111" stroke-width="1.5"/><path d="M3 3L19 19H3Z" fill="#acd8ef"/><path d="M3 19L19 3" stroke="#091426" stroke-width="4"/><path d="M3 19L19 3" stroke="#ed5424" stroke-width="2"/><path d="M3 3L19 19" stroke="#123c81"/>';
      u.el('span', '', tab, C.title);
      const controls = u.el('div', 'window-controls', head);
      for (const label of ['−', '□', '×']) {
        const bt = u.el('button', '', controls, label);
        bt.type = 'button';
        bt.onclick = () => env.log('window-control', { label });
      }
      const menu = u.el('nav', 'menu', shell);
      for (const m of ['File', 'Edit', 'View', 'Help']) u.el('span', '', menu, m);
      const menuTools = u.el('div', 'chrome-tools', menu);
      if (collide) {
        const decoy = u.el('button', 'chrome-xtra', menuTools, collide);
        decoy.type = 'button';
        decoy.dataset.role = 'xtra';
        decoy.onclick = () => env.log('decoy', { label: collide, collide: true });
      }
      u.el('span', 'menu-right', menu, 'BeOS');
      const content = u.el('div', 'content', shell);
      const docbox = u.el('section', 'docbox', content);
      const dh = u.el('div', 'doc-head', docbox);
      u.el('span', '', dh, 'Source Document:');
      u.el('b', '', dh, C.doc);
      const dmain = u.el('div', 'doc-main', docbox);
      const stage = u.el('main', 'stage', dmain);
      stage.dataset.role = 'stage';
      const vs = u.el('div', 'vscroll', dmain);
      vs.setAttribute('aria-hidden', 'true');
      u.el('span', 'vs-btn up', vs, '▲');
      const vt = u.el('span', 'vs-thumb', vs);
      u.el('span', 'vs-btn down', vs, '▼');
      const note = u.el('section', 'task-note', content);
      u.el('div', 'note-label', note, 'Task');
      u.el('div', 'instruction', note, ctx.instruction);
      u.el(
        'div',
        'hint',
        note,
        'Use your mouse to click and drag in the document above to select the whole paragraph.',
      );
      if (ctx.display === 'hidden') note.classList.add('instruction-hidden');
      else if (ctx.display === 'toast') {
        note.classList.add('instruction-notification');
      } else if (ctx.display === 'panel') note.classList.add('instruction-panel');
      const row = u.el('div', 'groups', note);
      const g1 = u.el('div', 'group g-tools', row);
      u.el('div', 'g-title', g1, 'Selection Tools');
      const g1b = u.el('div', 'g-body tools', g1);
      const sb = u.el('button', 'tool-sel', g1b);
      sb.type = 'button';
      const cur = u.svg('svg', { width: 30, height: 34, viewBox: '0 0 30 34' }, sb);
      cur.innerHTML =
        '<path d="M5 3V26L11 20L16 31L20 29L15 19H23Z" fill="#fff" stroke="#111" stroke-width="2" stroke-linejoin="round"/>';
      u.el('span', 'sel-label', g1b, 'Select (drag)');
      u.el('span', 'vsep', g1b);
      const clr = u.el('button', 'clear-sel', g1b);
      clr.type = 'button';
      const er = u.svg('svg', { width: 38, height: 34, viewBox: '0 0 38 34' }, clr);
      er.innerHTML =
        '<path d="M4 20L17 6L30 17L18 30H10Z" fill="#fff" stroke="#555" stroke-width="2" stroke-linejoin="round"/><path d="M11 14L24 25" stroke="#555" stroke-width="2"/>';
      u.el('span', '', clr, 'Clear Selection');
      clr.onclick = () => {
        env.widgetDef.clear?.();
      };
      const g2 = u.el('div', 'group g-tip', row);
      u.el('div', 'g-title', g2, 'Tip');
      const tb = u.el('div', 'g-body tip', g2);
      u.el('div', '', tb, 'Make sure to include the entire paragraph,');
      u.el('div', '', tb, 'from the first word to the last word.');
      const g3 = u.el('div', 'group g-act', row);
      u.el('div', 'g-title', g3, 'Actions');
      const ab = u.el('div', 'g-body acts', g3);
      let submit = null;
      const endButton = (parent, cls) => {
        const b = u.el('button', cls, parent, endLabel);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.title = endLabel;
        b.setAttribute('aria-label', endLabel);
        b.onclick = () => ctx.submit();
        return b;
      };
      if (!ctx.finish && placement === 'actions') submit = endButton(ab, 'submit');
      if (!ctx.finish && placement === 'toolbar') submit = endButton(menuTools, 'submit chrome-end');
      const rs = u.el('button', 'clear', ab, 'Reset');
      rs.type = 'button';
      rs.onclick = () => {
        env.widgetDef.clear?.();
      };
      const footer = u.el('footer', 'footer', shell);
      const fi = u.el('span', 'foot-icon', footer);
      const fs = u.svg('svg', { width: 26, height: 24, viewBox: '0 0 22 22' }, fi);
      fs.innerHTML = app.innerHTML;
      u.el('span', 'foot-caret', fi, '▾');
      u.el('span', 'foot-copy', footer, 'Ready');
      if (!ctx.finish && placement === 'footer') submit = endButton(footer, 'submit footer-end');
      u.el('span', 'foot-clock', footer, '10:24 AM');
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
