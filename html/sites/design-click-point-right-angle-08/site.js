(function () {
  'use strict';
  const C = { title: 'Geometry Practice - Right Angles', font: 'Tahoma, Verdana, "Segoe UI", sans-serif' };
  env.site({
    name: 'design-click-point-right-angle-08',
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        body = document.body;
      body.className = 'design xp' + (ctx.display === 'toast' ? ' has-instruction-toast' : '');
      const root = document.documentElement;
      for (const [k, v] of Object.entries({
        bg: '#ece9d8',
        panel: '#ffffff',
        fg: '#111111',
        muted: '#555555',
        line: '#aca899',
        accent: '#1b3fa0',
      }))
        root.style.setProperty('--' + k, v);
      root.style.setProperty('--font', C.font);
      const win = u.el('div', 'xp-win', body);
      const tb = u.el('header', 'xp-title', win);
      const ico = u.svg('svg', { width: 28, height: 30, viewBox: '0 0 20 20', class: 'xp-ico' }, tb);
      u.svg('rect', { x: 1, y: 1, width: 18, height: 18, rx: 1, fill: '#7aaf76', stroke: '#c0d3b5' }, ico);
      u.svg(
        'path',
        {
          d: 'M3 3L16 16L7 17L15 4L3 12L5 3L17 9L11 18M3 17L8 4L17 15M2 7H18M6 2V18M13 2V18',
          fill: 'none',
          stroke: '#d8d78c',
          'stroke-width': 0.7,
        },
        ico,
      );
      u.el('span', 'xp-title-text', tb, C.title);
      const wc = u.el('div', 'xp-wc', tb);
      for (const [cls, lab] of [
        ['min', 'min'],
        ['max', 'max'],
        ['close', 'close'],
      ]) {
        const b = u.el('button', 'xp-wbtn ' + cls, wc);
        b.type = 'button';
        b.setAttribute('aria-label', lab);
        b.onclick = () => env.log('window-control', { label: lab });
        const s = u.svg('svg', { width: 16, height: 16, viewBox: '0 0 16 16' }, b);
        if (cls === 'min') u.svg('rect', { x: 3, y: 10, width: 7, height: 3, fill: '#fff' }, s);
        else if (cls === 'max')
          u.svg('rect', { x: 3, y: 3, width: 10, height: 10, fill: 'none', stroke: '#fff', 'stroke-width': 2 }, s);
        else u.svg('path', { d: 'M3 3L13 13M13 3L3 13', stroke: '#fff', 'stroke-width': 2.4 }, s);
      }
      const menu = u.el('nav', 'xp-menu', win);
      for (const m of ['File', 'Edit', 'View', 'Tools', 'Help']) u.el('span', '', menu, m);
      const menuActions = u.el('div', 'xp-menu-actions', menu);
      const er = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const referenceEnd = er.bool(0.5);
      const placement = referenceEnd ? 'footer' : er.pick(['toolbar', 'link', 'footer']);
      const endLabel = referenceEnd ? 'Submit' : er.pick(endLabels.filter((label) => label !== 'Submit'));
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const choices = endLabels.filter((label) => label.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (choices.length) {
          const label = cr.pick(choices),
            decoy = u.el('button', 'xp-xtra', menuActions, label);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.onclick = () => env.log('decoy', { label, collide: true });
        }
      }
      const main = u.el('div', 'xp-main', win);
      const note = u.el('section', 'task-note', main);
      u.el('div', 'note-label', note, 'Task');
      u.el('div', 'instruction', note, ctx.instruction);
      const desc = u.el('div', 'xp-desc', note);
      u.el(
        'p',
        '',
        desc,
        'A line segment AB is shown with a filled dot at point B. Choose a point C so that angle ABC is 90° and the point C is outside the dotted circle.',
      );
      u.el('p', '', desc, 'Click on the diagram to place the point.');
      if (ctx.display === 'hidden') {
        note.querySelector('.instruction').hidden = true;
        desc.hidden = true;
      } else if (ctx.display === 'toast') {
        note.classList.add('instruction-toast');
        const x = u.el('button', 'note-close', note, '×');
        x.onclick = () => (note.style.visibility = 'hidden');
      } else if (ctx.display === 'panel') note.classList.add('instruction-panel');
      const work = u.el('div', 'xp-work', main);
      const bar = u.el('div', 'xp-tools', work);
      const P = {
        Pointer: 'M5 2V26L11 20L15 29L19 27L15 19H23Z',
        Undo: 'M12 6L3 14L12 22V17C20 16 24 19 26 26C27 15 21 10 12 11Z',
        Clear: 'M4 18L16 5L27 13L15 26H9ZM10 12L21 21',
        ZoomIn: 'M20 20L29 29M13 3A10 10 0 1 1 13 23A10 10 0 1 1 13 3M8 13H18M13 8V18',
        ZoomOut: 'M20 20L29 29M13 3A10 10 0 1 1 13 23A10 10 0 1 1 13 3M8 13H18',
        Fit: 'M3 3H11V6H6V11H3ZM29 3H21V6H26V11H29ZM3 29H11V26H6V21H3ZM29 29H21V26H26V21H29ZM12 12H20V20H12Z',
      };
      const cols = {
        Pointer: '#444',
        Undo: '#2b66c8',
        Clear: '#d9607f',
        'Zoom In': '#2b66c8',
        'Zoom Out': '#2b66c8',
        Fit: '#2b66c8',
      };
      const items = [
        ['Pointer', 'Pointer'],
        ['Undo', 'Undo'],
        ['Clear', 'Clear'],
        '|',
        ['Zoom In', 'ZoomIn'],
        ['Zoom Out', 'ZoomOut'],
        '|',
        ['Fit', 'Fit'],
      ];
      for (const it of items) {
        if (it === '|') {
          u.el('i', 'xp-sep', bar);
          continue;
        }
        const bt = u.el('button', 'xp-tool' + (it[0] === 'Pointer' ? ' selected' : ''), bar);
        bt.type = 'button';
        const s = u.svg('svg', { width: 34, height: 34, viewBox: '0 0 32 32' }, bt);
        const defs = u.svg('defs', {}, s),
          g = u.svg('linearGradient', { id: 'icon-' + it[1], x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
        u.svg('stop', { offset: '0%', 'stop-color': '#a8dcff' }, g);
        u.svg('stop', { offset: '100%', 'stop-color': '#338fdc' }, g);
        if (it[0].startsWith('Zoom')) {
          u.svg('path', { d: 'M20 20L29 29', stroke: '#385a7a', 'stroke-width': 5, 'stroke-linecap': 'round' }, s);
          u.svg('path', { d: 'M21 20L29 28', stroke: '#c1b092', 'stroke-width': 2 }, s);
          u.svg(
            'circle',
            { cx: 12, cy: 12, r: 10, fill: 'url(#icon-' + it[1] + ')', stroke: '#385a7a', 'stroke-width': 1.7 },
            s,
          );
          u.svg('circle', { cx: 12, cy: 12, r: 7.4, fill: '#f3faff', stroke: '#c0d7e9' }, s);
          u.svg(
            'path',
            { d: 'M7 12H17' + (it[0] === 'Zoom In' ? 'M12 7V17' : ''), stroke: '#2767ae', 'stroke-width': 2.5 },
            s,
          );
        } else if (it[0] === 'Clear') {
          u.svg('path', { d: 'M3 19L18 4H30V13L15 27H3Z', fill: '#dc94c5', stroke: '#5b628e', 'stroke-width': 1.5 }, s);
          u.svg(
            'path',
            { d: 'M3 19H15L30 4H18ZM3 19V27H15V19', fill: '#f5b8d2', stroke: '#5b628e', 'stroke-width': 1.5 },
            s,
          );
        } else if (it[0] === 'Fit') {
          u.svg(
            'rect',
            { x: 3, y: 3, width: 25, height: 25, rx: 1, fill: '#e8f6fe', stroke: '#395a78', 'stroke-width': 1.4 },
            s,
          );
          u.svg(
            'path',
            {
              d: 'M4 4H12L9 7L14 12L11 15L6 10L4 12ZM27 4H19L22 7L17 12L20 15L25 10L27 12ZM4 27V19L7 22L12 17L15 20L10 25L12 27ZM27 27H19L22 24L17 19L20 16L25 21L27 19Z',
              fill: 'url(#icon-Fit)',
              stroke: '#28679a',
              'stroke-width': 0.7,
            },
            s,
          );
        } else
          u.svg(
            'path',
            {
              d: P[it[1]],
              fill: it[0] === 'Pointer' ? '#fff' : 'url(#icon-Undo)',
              stroke: it[0] === 'Pointer' ? '#354451' : '#245581',
              'stroke-width': 1.6,
              'stroke-linejoin': 'round',
            },
            s,
          );
        u.el('span', '', bt, it[0]);
        bt.onclick = () => {
          if (it[0] === 'Clear' || it[0] === 'Undo') {
            env.widgetDef.clear?.();
            return;
          }
          if (it[0] === 'Pointer') {
            return;
          }
        };
      }
      const stage = u.el('main', 'stage', work);
      stage.dataset.role = 'stage';
      const acts = u.el('div', 'xp-actions', work);
      const del = u.el('button', 'xp-del', acts);
      del.type = 'button';
      del.disabled = true;
      del.onclick = () => env.widgetDef.clear?.();
      const dx = u.svg('svg', { width: 30, height: 30, viewBox: '0 0 30 30' }, del);
      u.svg('path', { d: 'M5 5L25 25M25 5L5 25', stroke: '#aaa', 'stroke-width': 5, 'stroke-linecap': 'round' }, dx);
      u.svg('path', { d: 'M5 4L25 24M25 4L5 24', stroke: '#c1c1bc', 'stroke-width': 3, 'stroke-linecap': 'round' }, dx);
      u.el('span', '', del, 'Delete Point');
      let submit = null;
      if (!ctx.finish) {
        const isLink = placement === 'link';
        submit = u.el(
          isLink ? 'a' : 'button',
          isLink ? 'xp-endlink' : 'submit' + (placement === 'toolbar' ? ' xp-end-toolbar' : ''),
          placement === 'toolbar' ? menuActions : acts,
          endLabel,
        );
        if (isLink) {
          submit.href = '#';
          acts.prepend(submit);
        } else submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.onclick = (e) => {
          e.preventDefault();
          ctx.submit();
        };
      }
      const st = u.el('footer', 'xp-status', win);
      u.el('span', 'xp-st-left', st, 'Click to place a point.');
      const xy = u.el('span', 'xp-st-xy', st, 'x: 472   y: 296');
      stage.addEventListener('pointermove', (e) => {
        const r = stage.getBoundingClientRect();
        xy.textContent = 'x: ' + Math.round(e.clientX - r.left) + '   y: ' + Math.round(e.clientY - r.top);
      });
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
      const label = kind === 'cookie' ? 'Reject optional' : 'Close';
      u.el('h3', '', box, title);
      u.el('p', '', box, text);
      const dismiss = u.el('button', 'dismiss', box, label);
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
