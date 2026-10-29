(function () {
  'use strict';
  env.site({
    name: 'design-select-text-sentence-05',
    styles: ['site.css', 'nx.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        body = document.body;
      const endR = ctx.rng.fork('chrome/end'),
        collideR = ctx.rng.fork('chrome/collide');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const referenceEnd = endR.bool(0.5);
      const endPlacement = referenceEnd ? 'footer' : endR.pick(['toolbar', 'link']);
      const endLabel = referenceEnd ? 'Submit' : endR.pick(endLabels);
      body.className = 'design nx' + (ctx.display === 'toast' ? ' has-instruction-toast' : '');
      for (const [k, v] of Object.entries({
        bg: '#575b60',
        panel: '#f7f7f7',
        fg: '#111',
        muted: '#555',
        line: '#aaa',
        accent: '#777',
        font: 'Helvetica,Arial,sans-serif',
      }))
        document.documentElement.style.setProperty('--' + k, v);
      const ICON = {
        Text: 'M6 28L16 4L26 28M10 20H22',
        Paragraph: 'M3 4H29M3 11H29M3 18H29M3 25H18',
        Select: 'M5 5H27V27H5Z',
        Find: 'M20 20L29 29M13 3A10 10 0 1 1 13 23A10 10 0 1 1 13 3Z',
        Inspector: 'M6 3H20L27 10V29H6Z M20 3V10H27 M10 13H23 M10 17H23 M10 21H23 M10 25H19',
      };
      // menu bar
      const bar = u.el('div', 'nx-bar', body);
      u.el('b', '', bar, 'NeXT');
      for (const t of ['File', 'Edit', 'Find', 'Tools', 'Windows', 'Help']) u.el('span', '', bar, t);
      u.el('i', 'nx-clock-box', bar);
      u.el('span', 'nx-clock', bar, 'Mon Apr 12   10:24 AM');
      // desktop icons
      const dock = u.el('div', 'nx-dock', body);
      for (const [n, k] of [
        ['Workspace', 'cube'],
        ['Documents', 'doc'],
        ['Projects', 'cab'],
        ['Trash', 'trash'],
      ]) {
        const it = u.el('div', 'nx-ic', dock);
        const g = u.el('div', 'nx-glyph ' + k, it);
        const s = u.svg(
          'svg',
          { viewBox: '0 0 60 70', width: 60, height: 70, fill: 'none', stroke: '#171717', 'stroke-width': 1.5 },
          g,
        );
        if (k === 'cube') {
          u.svg('path', { d: 'M4 18L38 2L56 16L24 33Z', fill: '#ddd', stroke: '#eee' }, s);
          u.svg('path', { d: 'M4 18L24 33V67L4 51Z', fill: '#aaa', stroke: '#ddd' }, s);
          u.svg('path', { d: 'M24 33L56 16V51L24 67Z', fill: '#080808', stroke: '#222' }, s);
          const t = u.svg(
            'text',
            {
              x: 28,
              y: 43,
              fill: '#ddd',
              stroke: 'none',
              'font-family': 'Arial',
              'font-size': 17,
              transform: 'rotate(-25 28 43)',
            },
            s,
          );
          t.textContent = 'NeX';
          const t2 = u.svg(
            'text',
            {
              x: 33,
              y: 59,
              fill: '#ddd',
              stroke: 'none',
              'font-family': 'Arial',
              'font-size': 17,
              transform: 'rotate(-25 33 59)',
            },
            s,
          );
          t2.textContent = 'XT';
        } else if (k === 'doc') {
          u.svg('path', { d: 'M9 3H41L53 15V67H9Z', fill: '#ddd' }, s);
          u.svg('path', { d: 'M41 3V15H53', fill: '#aaa' }, s);
          u.svg('path', { d: 'M15 14H35M15 22H46M15 30H46M15 38H46M15 46H46M15 54H46M15 61H46', stroke: '#777' }, s);
        } else if (k === 'cab') {
          u.svg('path', { d: 'M7 8L13 3H54V63L48 68H7Z', fill: '#aaa' }, s);
          u.svg('path', { d: 'M7 8H48V68H7Z', fill: '#ddd' }, s);
          u.svg('path', { d: 'M12 14H43V34H12Z', fill: '#555' }, s);
          u.svg('path', { d: 'M14 16H41V32H14Z', fill: '#888', stroke: '#bbb' }, s);
          u.svg('path', { d: 'M12 39H43V60H12Z', fill: '#aaa' }, s);
          u.svg('path', { d: 'M22 48H33V53H22Z', fill: '#222', stroke: '#eee' }, s);
          u.svg('path', { d: 'M9 10H46M49 7V61M9 64H45', stroke: '#fff' }, s);
        } else {
          u.svg('path', { d: 'M10 17L15 62Q30 70 45 62L50 17Z', fill: '#888' }, s);
          for (let x = 13; x < 49; x += 4)
            u.svg(
              'path',
              { d: `M${x} 19L${17 + (x - 13) * 0.78} 62`, stroke: x % 8 === 5 ? '#eee' : '#222', 'stroke-width': 2 },
              s,
            );
          u.svg('ellipse', { cx: 30, cy: 17, rx: 22, ry: 7, fill: '#bbb', stroke: '#eee' }, s);
          u.svg('ellipse', { cx: 30, cy: 16, rx: 17, ry: 4, fill: '#111' }, s);
        }
        u.el('span', '', it, n);
      }
      // main window
      const shell = u.el('div', 'shell', body),
        frame = u.el('div', 'frame', shell);
      const tb = u.el('div', 'ptitle', frame);
      u.el('i', 'nx-box', tb);
      u.el('b', '', tb, 'Reading Exercise');
      u.el('i', 'nx-box', tb);
      const menu = u.el('nav', 'menu', frame);
      for (const t of ['File', 'Edit', 'Format', 'Help']) {
        const a = u.el('a', '', menu, t);
        a.href = '#';
        a.onclick = (e) => {
          e.preventDefault();
          env.log('decoy', { label: t });
        };
      }
      const menuTools = u.el('div', 'nx-menu-tools', menu);
      const collideOptions = endLabels.filter((t) => t.trim().toLowerCase() !== endLabel.trim().toLowerCase());
      if (collideR.bool(0.3) && collideOptions.length) {
        const label = collideR.pick(collideOptions),
          decoy = u.el('button', 'nx-xtra', menuTools, label);
        decoy.type = 'button';
        decoy.dataset.role = 'xtra';
        decoy.onclick = () => env.log('decoy', { label, collide: true });
      }
      const content = u.el('div', 'content', frame),
        note = u.el('section', 'task-note', content);
      const instruction = u.el('div', 'instruction', note, ctx.instruction);
      if (ctx.display === 'hidden') note.hidden = true;
      else if (ctx.display === 'toast') {
        note.classList.add('instruction-toast');
        const title = u.el('div', 'nx-note-title', note, 'Reading Notice');
        note.insertBefore(title, instruction);
        const x = u.el('button', 'note-close', note, '×');
        x.type = 'button';
        x.title = 'Dismiss reading notice';
        x.onclick = () => (note.style.visibility = 'hidden');
      } else if (ctx.display === 'panel') {
        note.classList.add('instruction-panel');
        const title = u.el('div', 'nx-note-title', note, 'Reading Task');
        note.insertBefore(title, instruction);
      }
      const stage = u.el('main', 'stage', content);
      stage.dataset.role = 'stage';
      const footer = u.el('footer', 'footer', frame);
      const clr = u.el('button', 'clear', footer, 'Clear Selection');
      clr.type = 'button';
      clr.onclick = () => {
        env.widgetDef.clear?.();
      };
      let submit = null;
      if (!ctx.finish) {
        const link = endPlacement === 'link';
        submit = u.el(
          link ? 'a' : 'button',
          link ? 'submit nx-end-link' : 'submit' + (endPlacement === 'toolbar' ? ' nx-end-toolbar' : ''),
          endPlacement === 'toolbar' ? menuTools : footer,
          endLabel,
        );
        if (link) {
          submit.href = '#';
          footer.insertBefore(submit, clr);
        } else submit.type = 'button';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.dataset.role = 'submit';
        submit.onclick = (e) => {
          e.preventDefault();
          ctx.submit();
        };
      }
      // floating palette
      const pal = u.el('aside', 'nx-pal', body),
        pt = u.el('div', 'nx-pt', pal);
      const xb = u.el('i', 'nx-box x', pt);
      const xs = u.svg('svg', { width: 12, height: 12, viewBox: '0 0 12 12', stroke: '#fff', 'stroke-width': 2 }, xb);
      u.svg('path', { d: 'M2 2L10 10M10 2L2 10' }, xs);
      u.el('b', '', pt, 'Text Tools');
      const grid = u.el('div', 'nx-grid', pal);
      for (const n of Object.keys(ICON)) {
        const bt = u.el('button', 'nx-tool', grid);
        bt.type = 'button';
        const s = u.svg(
          'svg',
          {
            width: 34,
            height: 34,
            viewBox: '0 0 32 32',
            fill: 'none',
            stroke: '#111',
            'stroke-width': n === 'Inspector' ? 1.3 : n === 'Select' ? 1.8 : 2.2,
          },
          bt,
        );
        if (n === 'Text') {
          const letter = u.svg(
            'text',
            { x: 3, y: 29, fill: '#080808', stroke: 'none', 'font-family': 'Arial', 'font-size': 36 },
            s,
          );
          letter.textContent = 'A';
        } else u.svg('path', { d: ICON[n], ...(n === 'Select' ? { 'stroke-dasharray': '2.3 1.2' } : {}) }, s);
        u.el('span', '', bt, n);
        bt.onclick = () => {
          env.log('tool', { n });
        };
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
