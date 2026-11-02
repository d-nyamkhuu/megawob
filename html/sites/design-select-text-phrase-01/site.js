(function () {
  'use strict';
  const C = { theme: 'human-text', ob: 'notifications', accent: '#ed8333' };
  const palette = { bg: '#c3d4ea', panel: '#fbf7ef', fg: '#111820', muted: '#657080', line: '#c9cfd5' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // Retain the original side-card breakpoint.
      _c.display = _c.ctx.display === 'panel' && _c.W < 1150 ? 'header' : (_c.ctx.display || 'header');
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util, body = document.body;
      body.className = 'design wordapp';
      document.documentElement.style.setProperty('--font', 'Lato, Ubuntu, Segoe UI, sans-serif');
        const E = (t, c, p, x) => u.el(t, c, p, x);
        const icon = (parent, name, cls = '') => {
          const s = u.svg(
            'svg',
            {
              class: 'w-icon ' + cls,
              viewBox: '0 0 32 32',
              fill: 'none',
              stroke: '#486886',
              'stroke-width': 1.3,
              'stroke-linejoin': 'round',
            },
            parent,
          );
          const P = (d, attrs = {}) => u.svg('path', { d, ...attrs }, s);
          const R = (x, y, width, height, attrs = {}) => u.svg('rect', { x, y, width, height, ...attrs }, s);
          const defs = u.svg('defs', {}, s);
          const grad = u.svg(
            'linearGradient',
            { id: 'w-' + name + '-' + cls.replace(/\W/g, ''), x1: 0, y1: 0, x2: 0, y2: 1 },
            defs,
          );
          u.svg('stop', { offset: 0, 'stop-color': '#91c6f2' }, grad);
          u.svg('stop', { offset: 1, 'stop-color': '#1164b9' }, grad);
          const blue = 'url(#w-' + name + '-' + cls.replace(/\W/g, '') + ')';
          if (name === 'office') {
            R(6, 4, 21, 25, { rx: 1, fill: blue, stroke: '#fff' });
            P('M10 8H16V15H10ZM19 11H23V15H19ZM10 18H16V25H10ZM19 18H23V25H19Z', { fill: '#fff', stroke: 'none' });
          } else if (name === 'save') {
            R(5, 3, 23, 26, { rx: 1, fill: '#7470ba', stroke: '#4c5284' });
            R(10, 4, 12, 9, { fill: '#e5f6ff' });
            R(10, 18, 14, 10, { fill: '#fff' });
            R(19, 5, 3, 6, { fill: '#444b85' });
            P('M13 21H22M13 24H22', { stroke: '#adb8c7' });
          } else if (name === 'undo' || name === 'redo') {
            P('M8 11Q21 4 24 16Q26 24 18 28L15 24Q22 20 19 15Q16 10 10 15L13 18L3 17L4 6Z', {
              fill: blue,
              stroke: '#3978b2',
            });
            if (name === 'redo') s.style.transform = 'scaleX(-1)';
          } else if (name === 'paste') {
            R(5, 4, 19, 24, { rx: 1, fill: '#f3c45a', stroke: '#bc9450' });
            R(9, 2, 10, 5, { rx: 2, fill: '#eef2f6', stroke: '#6f7b83' });
            P('M17 13H27L30 16V31H17Z', { fill: '#fff', stroke: '#78848d' });
            P('M27 13V17H30M20 20H27M20 23H27M20 26H27', { stroke: '#a1a7ad' });
          } else if (name === 'cut') {
            P('M10 4L21 23M21 3L11 23', { stroke: '#85939f', 'stroke-width': 2 });
            u.svg('circle', { cx: 8, cy: 25, r: 4 }, s);
            u.svg('circle', { cx: 23, cy: 25, r: 4 }, s);
          } else if (name === 'copy') {
            R(4, 4, 15, 20, { fill: '#f8fcff', stroke: '#9eacb7' });
            R(11, 10, 15, 20, { fill: '#fff', stroke: '#9eacb7' });
            P('M14 14H23M14 18H23M14 22H23M14 26H23', { stroke: '#adb9c4' });
          } else if (name === 'paint') {
            P('M10 22L25 5L29 9L14 26Z', { fill: '#ffd15b', stroke: '#ab8737' });
            P('M8 18L18 25L13 30Q5 29 3 25Z', { fill: '#5087c2', stroke: '#4a688a' });
          } else if (name === 'find') {
            P('M4 12H12V29H2V21ZM20 12H28L30 21V29H20ZM10 6H13V16H9ZM19 6H22V16H18Z', {
              fill: blue,
              stroke: '#234f81',
            });
            P('M12 19H20M12 24H20', { stroke: '#244e7d', 'stroke-width': 3 });
            P('M5 16V25M23 16V25', { stroke: '#cce7fa', 'stroke-width': 2 });
          } else if (name === 'replace') {
            u.svg(
              'text',
              { x: 2, y: 12, fill: '#172d50', stroke: 'none', 'font-size': 13, 'font-family': 'Arial' },
              s,
            ).textContent = 'ab';
            u.svg(
              'text',
              { x: 2, y: 29, fill: '#172d50', stroke: 'none', 'font-size': 13, 'font-family': 'Arial' },
              s,
            ).textContent = 'ac';
            P('M23 8V24M19 20L23 24L27 20', { stroke: '#704acc', 'stroke-width': 2 });
          } else if (name === 'select') {
            P('M8 2V27L14 21L20 30L24 27L18 18H28Z', { fill: '#fff', stroke: '#52667c' });
          } else if (name === 'highlight') {
            P('M8 21L19 7L26 12L15 25Z', { fill: '#fff', stroke: '#4b678a' });
            P('M8 21L6 27L15 25Z', { fill: '#426292' });
            P('M3 30H27', { stroke: '#fff000', 'stroke-width': 4 });
          } else if (name === 'border') {
            R(5, 5, 22, 22, { fill: '#e8eff9', stroke: '#90a2b6' });
            P('M16 5V27M5 16H27', { stroke: '#8196ac' });
            P('M9 9H12M20 9H23M9 23H12M20 23H23', { stroke: '#8196ac' });
          } else if (name === 'shade') {
            P('M7 18L18 6L27 16L16 27Z', { fill: '#fff', stroke: '#56769a' });
            P('M4 29H28', { stroke: '#b2bdc9', 'stroke-width': 3 });
            P('M24 21Q31 28 24 28Q20 27 24 21Z', { fill: blue });
          } else if (name === 'view1') {
            R(6, 4, 20, 25, { fill: '#fff', stroke: '#285a8e' });
            R(9, 7, 14, 3, { fill: '#78858b', stroke: 'none' });
            P('M9 14H23M9 18H23M9 22H23M9 26H23', { stroke: '#4f5f6a' });
          } else if (name === 'view2') {
            R(5, 6, 22, 22, { fill: '#e8f3ff', stroke: '#295a92' });
            P('M9 11H13M19 11H23M9 16H13M19 16H23M9 22H13M19 22H23', { stroke: '#295a92', 'stroke-width': 3 });
          } else if (name === 'view3') {
            R(5, 6, 22, 22, { fill: '#e8f3ff', stroke: '#295a92' });
            P('M10 10H24M10 16H24M10 22H24', { stroke: '#295a92', 'stroke-width': 2 });
            P('M3 10H6M3 16H6M3 22H6', { stroke: '#295a92', 'stroke-width': 3 });
          }
          return s;
        };
        const sh = E('div', 'w-shell', body),
          tb = E('header', 'w-title', sh);
        const orb = E('div', 'w-orb', tb);
        icon(orb, 'office');
        const qa = E('div', 'w-qa', tb);
        icon(qa, 'save');
        icon(qa, 'undo');
        E('span', 'w-arrow', qa, '▾');
        icon(qa, 'redo');
        E('div', 'w-name', tb, 'Morning Reflections.docx - Word Processor');
        const wc = E('div', 'w-wc', tb);
        for (const [c, l] of [
          ['', ' –'],
          ['', '▢'],
          ['x', '✕'],
        ]) {
          const b = E('button', 'w-wbtn ' + c, wc, l);
          b.type = 'button';
          b.onclick = () => env.log('window-control', { label: l });
        }
        const tabs = E('nav', 'w-tabs', sh);
        const tabEls = [];
        for (const [i, t] of ['Home', 'Insert', 'Page Layout', 'References', 'Mailings', 'Review', 'View'].entries()) {
          const b = E('button', 'w-tab' + (i === 0 ? ' on' : ''), tabs, t);
          b.type = 'button';
          tabEls.push(b);
          b.onclick = () => {
            tabEls.forEach((x) => x.classList.remove('on'));
            b.classList.add('on');
          };
        }
        E('div', 'w-help', tabs, '?');
        const rb = E('div', 'w-ribbon', sh);
        const grp = (name, cls) => {
          const g = E('div', 'w-group ' + cls, rb);
          const body2 = E('div', 'w-gbody', g);
          E('div', 'w-glabel', g, name);
          if (['Clipboard', 'Font', 'Paragraph'].includes(name)) E('span', 'w-launcher', g, '↘');
          return body2;
        };
        let g = grp('Clipboard', 'g-clip');
        const paste = E('div', 'w-paste', g);
        icon(E('div', 'w-pico', paste), 'paste');
        E('div', '', paste, 'Paste');
        E('span', 'w-pdrop', paste, '▾');
        const sm = E('div', 'w-small', g);
        for (const [ic, t, dis] of [
          ['cut', 'Cut', 1],
          ['copy', 'Copy', 1],
          ['paint', 'Format Painter', 0],
        ]) {
          const r = E('div', 'w-srow' + (dis ? ' dis' : ''), sm);
          icon(E('span', 'w-sic', r), ic);
          E('span', '', r, t);
        }
        g = grp('Font', 'g-font');
        const r1 = E('div', 'w-row', g);
        for (const [c, t] of [
          ['wide', 'Segoe UI'],
          ['sz', '11'],
        ]) {
          const b = E('div', 'w-combo ' + c, r1);
          E('span', '', b, t);
          E('span', 'w-arrow', b, '▾');
        }
        const grow = E('span', 'w-grow', r1);
        E('span', '', grow, 'A');
        E('sup', '', grow, '▴');
        const shrink = E('span', 'w-grow shrink', r1);
        E('span', '', shrink, 'A');
        E('sup', '', shrink, '▾');
        const r2 = E('div', 'w-row', g);
        for (const [t, s] of [
          ['B', 'font-weight:700'],
          ['I', 'font-style:italic'],
          ['U', 'text-decoration:underline'],
          ['abc', 'text-decoration:line-through;font-size:.7em'],
          ['x²', 'font-weight:700'],
        ]) {
          const b = E('span', 'w-fb', r2, t);
          b.style.cssText = s;
        }
        icon(E('span', 'w-fb highlighter', r2), 'highlight');
        E('span', 'w-arrow', r2, '▾');
        const color = E('span', 'w-fb color', r2, 'A');
        E('span', 'w-arrow', r2, '▾');
        g = grp('Paragraph', 'g-par');
        const p1 = E('div', 'w-row', g);
        const lineIcon = (parent, kind) => {
          const holder = E('span', 'w-paricon ' + kind, parent);
          const s = u.svg(
            'svg',
            { viewBox: '0 0 30 30', fill: 'none', stroke: '#172e40', 'stroke-width': 1.8 },
            holder,
          );
          for (let j = 0; j < 4; j++) {
            const y = 5 + j * 6;
            let x = kind === 'right' ? 10 : kind === 'center' ? 6 : 3;
            let end = kind === 'left' && j % 2 ? 20 : 27;
            if (kind === 'bullets' || kind === 'numbers' || kind === 'levels') x = 12;
            u.svg('path', { d: `M${x} ${y}H${end}` }, s);
            if (kind === 'bullets') u.svg('circle', { cx: 4, cy: y, r: 1.4, fill: '#164986', stroke: 'none' }, s);
            if (kind === 'numbers') {
              const n = u.svg('text', { x: 1, y: y + 2, fill: '#164986', stroke: 'none', 'font-size': 8 }, s);
              n.textContent = String(j + 1);
            }
            if (kind === 'levels') {
              const n = u.svg('text', { x: 1 + j, y: y + 2, fill: '#164986', stroke: 'none', 'font-size': 8 }, s);
              n.textContent = j % 2 ? 'a' : '1';
            }
          }
          return holder;
        };
        for (const name of ['bullets', 'numbers', 'levels']) {
          lineIcon(p1, name);
          E('span', 'w-arrow', p1, '▾');
        }
        for (const t of ['⇤', '⇥', '¶']) E('span', 'w-fb parletter', p1, t);
        const p2 = E('div', 'w-row', g);
        for (const name of ['left', 'center', 'right', 'justify']) {
          const b = lineIcon(p2, name);
          if (name === 'left') b.classList.add('sel');
        }
        E('span', 'w-fb parletter', p2, '↕');
        E('span', 'w-arrow', p2, '▾');
        icon(E('span', 'w-fb', p2), 'shade');
        E('span', 'w-arrow', p2, '▾');
        icon(E('span', 'w-fb', p2), 'border');
        g = grp('Styles', 'g-sty');
        const sr = E('div', 'w-row sty', g);
        for (const [t, c] of [
          ['Normal', 'n'],
          ['Heading 1', 'h1'],
          ['Heading 2', 'h2'],
          ['Title', 'tt'],
        ]) {
          const s = E('div', 'w-style ' + c + (c === 'n' ? ' on' : ''), sr);
          E('div', 'w-aa', s, 'AaBbCc');
          E('div', 'w-sn', s, t);
        }
        E('span', 'w-style-scroll', sr, '▴\n▾\n▾');
        g = grp('Editing', 'g-edit');
        for (const [ic, t] of [
          ['find', 'Find'],
          ['replace', 'Replace'],
          ['select', 'Select ▾'],
        ]) {
          const r = E('div', 'w-erow', g);
          icon(E('span', 'w-eic', r), ic);
          E('span', '', r, t);
        }

      const content = E('div', 'w-content', sh);
      if (_c.display === 'panel') content.classList.add('with-panel');
      Object.assign(_c, { shell: sh, tabs, content, header: content, icon });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('w-note');
        const text = _c.util.el('div', 'instruction', note, note.textContent);
        for (const child of [...note.childNodes]) if (child !== text) child.remove();
        note.prepend(_c.util.el('span', 'w-info', note, 'i'));
      }
      _c.header.querySelector('.ref-spacer')?.remove();
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.tabs;
      base(_c);
      _c.header = header;
      _c.headerTools.classList.add('w-tabtools');
    },
    'frame.body': () => (_c) => { _c.body = _c.content; },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const note = _c.body.querySelector('.ref-panel');
      if (note) {
        note.classList.add('w-note', 'instruction-panel');
        note.querySelector('.ref-panel-text').classList.add('instruction');
        note.prepend(_c.util.el('span', 'w-info', note, 'i'));
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage w-stage', _c.content);
      _c.stage.dataset.role = 'stage';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('w-note', 'instruction-toast');
        note.querySelector('.ref-note-text').classList.add('instruction');
        note.querySelector('.ref-note-x').classList.add('note-close');
        note.prepend(_c.util.el('span', 'w-info', note, 'i'));
        _c.content.insertBefore(note, _c.stage);
      }
    },
    'frame.footer': (base) => (_c) => {
      const E = (t, c, p, x) => _c.util.el(t, c, p, x);
      const sh = _c.shell, icon = _c.icon;
        const foot = E('footer', 'w-status', sh);
        for (const t of ['Page 1 of 1', '131 words', 'English (United States)']) E('span', 'w-st', foot, t);
        E('span', 'w-sp', foot);
        const views = E('div', 'w-views', foot);
        for (const n of ['view1', 'view2', 'view3']) icon(E('span', n === 'view1' ? 'selected' : '', views), n);
        const zoom = E('div', 'w-zoom', foot);
        E('span', 'zoom-minus', zoom, '−');
        E('span', 'zoom-circle', zoom);
        const track = E('span', 'zoom-track', zoom);
        E('span', 'zoom-thumb', track);
        E('span', 'zoom-plus', zoom, '+');
        E('span', 'zoom-value', zoom, '100%');

      base(_c);
      const controls = document.body.querySelector('.ref-foot');
      controls.querySelector('.ref-foot-text').remove();
      foot.appendChild(controls);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.insertBefore(dock, _c.foot.querySelector('.w-views'));
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        kind = ctx.kind;
      const el = u.el('section', 'obstruction obstruction-' + kind, document.body);
      el.dataset.role = 'overlay';
      const box = u.el('div', 'obstruction-box', el);
      let title, text, label;
      const o = C.ob;
      if (o === 'update') {
        title = 'A new version is available';
        text = 'Get the latest features and security fixes.';
        label = 'Remind me later';
      } else if (o === 'privacy') {
        title = 'We’d like your consent';
        text =
          'We use optional analytics to improve this application. You can change this setting at any time in the Options menu.';
        label = 'Reject optional';
      } else if (o === 'tips') {
        title = 'Tip of the day';
        text = 'The midpoint is the point that is the same distance from both marked points.';
        label = 'Close';
      } else if (o === 'newsletter') {
        title = 'Stay in the loop';
        text = 'Get occasional tips, practice problems, and feature updates.';
        label = 'Close';
      } else if (o === 'notifications') {
        title = 'Notifications (4)';
        text = 'Software Update Available\nDisk Almost Full\nTip of the Day\nWelcome to Shape Sorter\nReminder';
        label = 'Dismiss all';
      } else if (o === 'survey') {
        title = 'Quick Survey';
        text = 'Please take a moment to give us some feedback.\nHow easy is this training task?';
        label = 'Close survey';
      } else {
        title = {
          cookie: 'Your privacy',
          toast: 'Changes saved',
          chat: 'Support',
          promo: 'Workspace update',
          banner: 'Service notice',
        }[kind];
        text = {
          cookie: 'This application stores optional cookies.',
          toast: 'Your changes have been saved.',
          chat: 'Need a hand with this workspace?',
          promo: 'Explore the latest workspace features.',
          banner: 'You are viewing a shared workspace.',
        }[kind];
        label = kind === 'cookie' ? 'Reject optional' : 'Close';
      }
      u.el('h3', '', box, title);
      if (o === 'notifications') {
        const notifications = u.el('div', 'notifications', box);
        for (const [name, body] of C.theme === 'bitmap'
          ? [
              ['Software Update Available', 'A new version is ready.'],
              ['Disk Almost Full', 'You have 12 MB remaining.'],
              ['Tip of the Day', 'Organize your files faster.'],
              ['Welcome to Shape Sorter', 'Learn how to play.'],
              ['Reminder', 'Back up your disk.'],
            ]
          : [
              ['New messages', 'You have 3 unread messages.'],
              ['Software update', 'A new version is available.'],
              ['Calendar reminder', 'Team sync at 11:00.'],
              ['Storage almost full', 'You have 1.2 GB remaining.'],
            ]) {
          const card = u.el('div', 'notification-card', notifications);
          u.el('strong', '', card, name);
          if (C.theme === 'human-text') {
            const index = notifications.children.length - 1;
            u.el('div', 'notification-time', card, ['10:14', '09:52', '09:20', '08:47'][index]);
            const svg = u.svg(
              'svg',
              {
                class: 'notification-icon',
                width: 44,
                height: 48,
                viewBox: '0 0 48 48',
                fill: 'none',
                stroke: '#423024',
                'stroke-width': 3,
                'stroke-linecap': 'round',
                'stroke-linejoin': 'round',
              },
              card,
            );
            if (index === 0) {
              u.svg('rect', { x: 4, y: 10, width: 40, height: 32, rx: 3 }, svg);
              u.svg('path', { d: 'M5 12L24 28L43 12' }, svg);
            } else if (index === 1) {
              u.svg('path', { d: 'M6 20A18 18 0 0 1 40 15M40 5V16H29M42 28A18 18 0 0 1 8 33M8 43V32H19' }, svg);
            } else if (index === 2) {
              u.svg('rect', { x: 5, y: 8, width: 38, height: 37, rx: 3, fill: '#faf8f3' }, svg);
              u.svg('path', { d: 'M6 16H42', stroke: '#b33020', 'stroke-width': 7 }, svg);
              u.svg('path', { d: 'M14 5V12M34 5V12' }, svg);
              for (const x of [13, 23, 33])
                for (const y of [25, 35])
                  u.svg('rect', { x: x - 2, y: y - 2, width: 4, height: 4, fill: '#b33020', stroke: 'none' }, svg);
            } else {
              u.svg(
                'path',
                {
                  d: 'M20 6Q24 0 28 6M19 41Q24 49 29 41M5 40Q11 36 11 27V20Q11 8 24 8Q37 8 37 20V27Q37 36 43 40Z',
                  fill: '#d9ad74',
                },
                svg,
              );
            }
          }
          u.el('p', '', card, body);
          const x = u.el('button', 'notification-x', card, '×');
          x.onclick = () => card.remove();
        }
      } else u.el('p', '', box, text);
      if (o === 'tips') {
        const label = u.el('label', 'tip-option', box);
        const input = u.el('input', '', label);
        input.type = 'checkbox';
        u.el('span', '', label, 'Do not show again');
      }
      const dismiss = u.el('button', 'dismiss', box, label);
      if (o === 'privacy' || o === 'newsletter') {
        const icon = u.svg(
          'svg',
          {
            class: 'ob-icon',
            width: 64,
            height: 64,
            viewBox: '0 0 64 64',
            fill: 'none',
            stroke: C.accent,
            'stroke-width': 3,
          },
          box,
        );
        u.svg(
          'path',
          {
            d:
              o === 'newsletter'
                ? 'M8 14H56V50H8ZM8 14L32 34L56 14'
                : 'M32 4L54 14V30Q54 49 32 59Q10 49 10 30V14ZM22 30L29 37L44 21',
          },
          icon,
        );
      }
      dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('close');
      if (o === 'privacy' || (kind === 'cookie' && !o)) {
        const accept = u.el('button', 'dismiss', box, 'Accept optional');
        accept.onclick = () => ctx.dismiss('accept');
      }
      return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };
    },
  };
  env.site({
    name: 'design-select-text-phrase-01',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css', 'word.css'],
    design: { THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#ed8333'], LOW_ACCENTS: ['#ed8333'], parts },
  });
})();
