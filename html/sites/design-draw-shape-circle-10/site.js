(function () {
  'use strict';
  env.site({
    name: 'design-draw-shape-circle-10',
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        body = document.body;
      body.className = 'win31' + (ctx.display === 'toast' ? ' has-instruction-toast' : '');
      const desk = u.el('div', 'desk', body);
      // desktop icons
      const icons = u.el('div', 'icons', desk);
      const icon = (label, draw) => {
        const d = u.el('div', 'dicon', icons);
        const sv = u.svg('svg', { width: 56, height: 56, viewBox: '0 0 56 56' }, d);
        draw(sv);
        u.el('span', '', d, label);
      };
      icon('Program Manager', (s) => {
        u.svg('path', { d: 'M12 5L40 4L44 7V27L50 29V44L44 50H5L7 45L9 29L13 27Z', fill: '#111' }, s);
        u.svg('path', { d: 'M13 5H41V28H13Z', fill: '#deded0', stroke: '#fff' }, s);
        u.svg('path', { d: 'M41 6L44 8V27L41 30Z', fill: '#81817c' }, s);
        u.svg('rect', { x: 16, y: 8, width: 22, height: 17, fill: '#00005e', stroke: '#777' }, s);
        u.svg(
          'path',
          { d: 'M21 13H30V19H21M24 11H34V21H24M20 21H33', fill: 'none', stroke: '#6e84be', 'stroke-width': 1 },
          s,
        );
        u.svg('path', { d: 'M27 15H31V18H27', fill: '#75b036' }, s);
        u.svg('path', { d: 'M11 30H48V43H10Z', fill: '#e9e9d9', stroke: '#fff' }, s);
        u.svg('path', { d: 'M48 30V43L44 47H9L10 43H48', fill: '#8e8e86', stroke: '#444' }, s);
        u.svg('rect', { x: 14, y: 33, width: 10, height: 6, fill: '#000060', stroke: '#333' }, s);
        u.svg('rect', { x: 16, y: 34, width: 6, height: 3, fill: '#d5d5ca' }, s);
        u.svg('rect', { x: 32, y: 34, width: 9, height: 5, fill: '#313144' }, s);
        u.svg('rect', { x: 34, y: 35, width: 5, height: 3, fill: '#f0f0dd' }, s);
        u.svg('path', { d: 'M8 46H44L40 49H5Z', fill: '#ddd', stroke: '#fff' }, s);
      });
      icon('My Files', (s) => {
        u.svg('path', { d: 'M6 17L11 10H22L28 16H49V45H6Z', fill: '#ddcc63', stroke: '#564e18', 'stroke-width': 1 }, s);
        u.svg('path', { d: 'M7 17L12 11H22L27 17M7 17H48', fill: 'none', stroke: '#fffbc0', 'stroke-width': 2 }, s);
        u.svg('path', { d: 'M6 19H49V46H6Z', fill: '#f6ed81', stroke: '#333', 'stroke-width': 1.2 }, s);
        u.svg('path', { d: 'M7 45V20H48', fill: 'none', stroke: '#ffffce', 'stroke-width': 1.5 }, s);
        u.svg('path', { d: 'M49 20V46H7', fill: 'none', stroke: '#8b8038', 'stroke-width': 1.5 }, s);
      });
      icon('Recycle Bin', (s) => {
        u.svg(
          'path',
          { d: 'M8 12L26 5L47 13L42 43L32 50L16 45Z', fill: '#c5c5bc', stroke: '#333', 'stroke-width': 1 },
          s,
        );
        u.svg('path', { d: 'M8 12L29 20L47 13L26 5Z', fill: '#85857c', stroke: '#eee', 'stroke-width': 1.5 }, s);
        u.svg('path', { d: 'M29 20L47 13L42 43L32 50Z', fill: '#91918c' }, s);
        u.svg('path', { d: 'M9 15L27 22L31 48L17 44Z', fill: '#deded1' }, s);
        u.svg(
          'path',
          {
            d: 'M18 26L21 22L25 27M21 23L22 31M17 28L14 32L19 37M15 32L21 33M22 38L26 35L25 30M26 35L20 36',
            fill: 'none',
            stroke: '#399245',
            'stroke-width': 2.2,
          },
          s,
        );
        u.svg('path', { d: 'M9 13L29 21L46 14', fill: 'none', stroke: '#fff', 'stroke-width': 1 }, s);
      });
      // briefing window
      const brief = u.el('section', 'win brief', desk);
      u.el('div', 'tbar', brief).append(u.el('span', 'tt', '', 'Task Briefing'));
      const note = u.el('div', 'brief-body task-note', brief);
      u.el('div', 'instruction', note, ctx.instruction);
      u.el('p', '', note, 'Use the pencil to draw one continuous circle by hand.');
      u.el(
        'p',
        '',
        note,
        'Make the circle pass through the hollow dot so it lies on the circle’s edge, with the filled dot inside the circle.',
      );
      u.el('hr', '', brief);
      if (ctx.display === 'hidden') note.hidden = true;
      else if (ctx.display === 'toast') {
        note.classList.add('instruction-toast');
        const x = u.el('button', 'note-close', note, '×');
        x.type = 'button';
        x.onclick = () => (note.style.visibility = 'hidden');
      } else if (ctx.display === 'panel') note.classList.add('instruction-panel');
      else {
        note.hidden = true;
      }
      // main window
      const win = u.el('section', 'win main', desk);
      const tb = u.el('div', 'tbar', win);
      const ti = u.svg('svg', { width: 18, height: 18, viewBox: '0 0 18 18', class: 'ticon' }, tb);
      u.svg('rect', { x: 2, y: 1, width: 13, height: 16, fill: '#fffddd', stroke: '#555' }, ti);
      u.svg(
        'path',
        { d: 'M4 5H12M4 7H12M5 11L8 8L11 13M5 14V9M9 14V6', stroke: '#80ae8b', 'stroke-width': 1.2, fill: 'none' },
        ti,
      );
      u.el('span', 'tt', tb, 'Drawing Task');
      const wc = u.el('div', 'wctl', tb);
      for (const l of ['min', 'max', 'close']) {
        const b = u.el('button', 'wb ' + l, wc);
        b.type = 'button';
        b.tabIndex = -1;
        b.onclick = () => env.log('window-control', { label: l });
      }
      const menu = u.el('nav', 'menubar', win);
      for (const [a, rest] of [
        ['F', 'ile'],
        ['E', 'dit'],
        ['V', 'iew'],
        ['H', 'elp'],
      ]) {
        const s = u.el('span', '', menu);
        u.el('u', '', s, a);
        s.append(rest);
      }
      if (ctx.display === 'header') u.el('div', 'header-instruction', win, ctx.instruction);
      const tools = u.el('div', 'toolbar', win);
      const pencil = u.el('button', 'tbtn sel', tools);
      pencil.type = 'button';
      const pi = u.svg('svg', { width: 40, height: 40, viewBox: '0 0 40 40' }, pencil);
      u.svg(
        'path',
        {
          d: 'M6 35L10 24L28 5L34 11L16 30Z',
          fill: '#eee447',
          stroke: '#151515',
          'stroke-width': 1.5,
          'stroke-linejoin': 'round',
        },
        pi,
      );
      u.svg('path', { d: 'M11 25L29 7L31 9L14 28Z', fill: '#ffff95' }, pi);
      u.svg('path', { d: 'M15 29L33 11L31 9L13 27Z', fill: '#b39c25' }, pi);
      u.svg(
        'path',
        { d: 'M28 5L30 3L33 3L36 6L36 9L34 11Z', fill: '#d53232', stroke: '#111', 'stroke-width': 1.5 },
        pi,
      );
      u.svg('path', { d: 'M28 6L33 11', stroke: '#ddd', 'stroke-width': 2 }, pi);
      u.svg('path', { d: 'M6 35L10 24L16 30Z', fill: '#e5d5a9', stroke: '#111', 'stroke-width': 1.5 }, pi);
      u.svg('path', { d: 'M5 36L7 31L10 34Z', fill: '#111' }, pi);
      u.el('span', '', pencil, 'Pencil');
      const clr = u.el('button', 'tbtn', tools);
      clr.type = 'button';
      const ci = u.svg('svg', { width: 40, height: 40, viewBox: '0 0 40 40' }, clr);
      u.svg(
        'path',
        {
          d: 'M5 24L20 8H33L36 11L21 29H7Z',
          fill: '#efefef',
          stroke: '#222',
          'stroke-width': 1.5,
          'stroke-linejoin': 'round',
        },
        ci,
      );
      u.svg('path', { d: 'M21 29L36 11V18L21 34Z', fill: '#8b8b8b', stroke: '#222', 'stroke-width': 1.5 }, ci);
      u.svg('path', { d: 'M5 24H19L21 29V34H9L5 29Z', fill: '#c5c5c5', stroke: '#222', 'stroke-width': 1.5 }, ci);
      u.svg('path', { d: 'M7 24L21 9H32', fill: 'none', stroke: '#fff', 'stroke-width': 1.5 }, ci);
      u.el('span', '', clr, 'Clear');
      clr.onclick = () => {
        env.widgetDef.clear?.();
      };
      const endR = ctx.rng.fork('chrome/end');
      const endPool = ctx.content && ctx.content.END_LABELS;
      const endOptions =
        Array.isArray(endPool) && endPool.length
          ? endPool
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const originalEnd = endR.bool(0.5);
      const pickedEnd = originalEnd ? 'Submit' : endR.pick(endOptions);
      const endLabel =
        typeof pickedEnd === 'string'
          ? pickedEnd
          : (pickedEnd && (pickedEnd.label || pickedEnd.text || pickedEnd.name)) || String(pickedEnd);
      const endPlacement = originalEnd ? 'status' : endR.pick(['status', 'toolbar', 'menu']);
      const decoy = (parent, label, collide) => {
        const b = u.el('button', collide ? 'win-xtra pq-xtra' : 'win-xtra', parent, label);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', collide ? { label, collide: true } : { label }));
        return b;
      };
      const collideR = ctx.rng.fork('chrome/collide');
      const collidePool = (
        Array.isArray(endPool) && endPool.length
          ? endPool
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
      ).map((x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x)));
      let collideLabel = null;
      if (collideR.bool(0.3)) {
        const alternatives = collidePool.filter(
          (x) => String(x).trim().toLowerCase() !== String(endLabel).trim().toLowerCase(),
        );
        if (alternatives.length) collideLabel = collideR.pick(alternatives);
      }
      if (collideLabel) decoy(endPlacement === 'menu' ? menu : tools, collideLabel, true);
      const stage = u.el('main', 'stage', win);
      stage.dataset.role = 'stage';
      const status = u.el('footer', 'status', win);
      u.el('span', 'st', status, 'Tool: Pencil');
      u.el('span', 'stsep', status);
      u.el('span', 'st', status, 'Draw with mouse (press and hold)');
      let submit = null;
      if (!ctx.finish) {
        submit = u.el('button', 'submit', status, 'Submit');
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.onclick = () => ctx.submit();
      }
      if (!ctx.finish) {
        submit.textContent = endLabel;
        if (endPlacement === 'toolbar') {
          tools.appendChild(submit);
          submit.classList.add('toolbar-submit');
        } else if (endPlacement === 'menu') {
          menu.appendChild(submit);
          submit.classList.add('menu-submit');
        }
      }
      // taskbar
      const task = u.el('div', 'taskbar', body);
      const st = u.el('div', 'startbtn', task);
      const fl = u.svg('svg', { width: 30, height: 26, viewBox: '0 0 30 26' }, st);
      u.svg('path', { d: 'M7 5L16 2L26 5L25 24L16 21L7 24Z', fill: '#000', stroke: '#000', 'stroke-width': 2 }, fl);
      for (const [d, c] of [
        ['M9 7L15 5V12L9 14Z', '#e03a2a'],
        ['M18 5L23 7V14L18 12Z', '#2aac3c'],
        ['M9 16L15 14V20L9 22Z', '#3854d1'],
        ['M18 14L23 16V22L18 20Z', '#f2cc27'],
      ])
        u.svg('path', { d, fill: c }, fl);
      for (const [x, y] of [
        [2, 5],
        [4, 9],
        [1, 13],
        [4, 17],
        [2, 21],
      ])
        u.svg('rect', { x, y, width: 3, height: 2, fill: '#111' }, fl);
      u.el('span', '', st, 'Start');
      const app = u.el('div', 'taskapp', task);
      const ai = u.svg('svg', { width: 30, height: 28, viewBox: '0 0 30 28' }, app);
      u.svg('rect', { x: 3, y: 3, width: 24, height: 17, fill: '#c0c0c0', stroke: '#222' }, ai);
      u.svg('rect', { x: 6, y: 6, width: 18, height: 11, fill: '#1a2a9a' }, ai);
      u.svg('rect', { x: 8, y: 22, width: 14, height: 3, fill: '#888' }, ai);
      u.el('span', '', app, 'Drawing Task');
      u.el('div', 'clock', task, '10:24 AM');
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
      const tbar = u.el('div', 'tbar', box);
      u.el('span', 'tt', tbar, title);
      u.el('p', '', box, text);
      const dismiss = u.el('button', 'dismiss', box, kind === 'cookie' ? 'Reject optional' : 'OK');
      dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('close');
      if (kind === 'cookie') {
        const accept = u.el('button', 'dismiss', box, 'Accept optional');
        accept.type = 'button';
        accept.onclick = () => ctx.dismiss('accept');
      }
      return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };
    },
  });
})();
