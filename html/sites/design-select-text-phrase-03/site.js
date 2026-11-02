(function () {
  'use strict';
  const C = { theme: 'fluent', accent: '#0078d4', ob: '' };
  const palette = { bg: '#f7f7f6', panel: '#ffffff', fg: '#111820', muted: '#657080', line: '#c9cfd5' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original has a dedicated instruction shelf at every viewport.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util, body = document.body;
      body.className = 'design fluent layout-fluent';
      document.documentElement.style.setProperty('--font', 'Segoe UI, Lato, Noto Sans, Arial, sans-serif');
        const S = (p, a, d) => {
          const s = u.svg(
            'svg',
            Object.assign(
              {
                width: 20,
                height: 20,
                viewBox: '0 0 24 24',
                fill: 'none',
                stroke: 'currentColor',
                'stroke-width': 1.6,
                'stroke-linecap': 'round',
                'stroke-linejoin': 'round',
              },
              a || {},
            ),
            p,
          );
          for (const x of [].concat(d)) u.svg('path', { d: x }, s);
          return s;
        };
        const fs = u.el('div', 'fl-shell', body),
          top = u.el('header', 'fl-top', fs);
        const tb = u.el('div', 'fl-titlebar', top);
        const ic = S(tb, { class: 'fl-appicon', stroke: '#fff', fill: '#0786d8', 'stroke-width': 1 }, [
          'M5 2H14L20 8V22H5Z',
          'M14 2V8H20',
          'M8 12H16M8 15H16M8 18H13',
        ]);
        u.svg('rect', { x: 1, y: 6, width: 10, height: 8, rx: 1, fill: '#9fd5f8', stroke: '#3088bc' }, ic);
        u.svg('path', { d: 'M4 8H8M4 10H7', stroke: '#fff' }, ic);
        u.el('span', 'fl-app', tb, 'DocMark');
        u.el('span', 'fl-sep', tb, '×');
        u.el('span', 'fl-doc', tb, 'Document Review');
        const wc = u.el('div', 'fl-wc', tb);
        for (const [l, d] of [
          ['min', 'M4 12H20'],
          ['max', 'M7 5H19V17M5 7H17V19H5Z'],
          ['close', 'M5 5L19 19M19 5L5 19'],
        ]) {
          const b = u.el('button', '', wc);
          b.type = 'button';
          S(b, { width: 20, height: 20, 'stroke-width': 1.2 }, d);
          b.onclick = () => env.log('window-control', { label: l });
        }
        const tabs = u.el('nav', 'fl-tabs', top);
        for (const [i, t] of ['Home', 'View', 'Help'].entries()) {
          const b = u.el('button', 'fl-tab' + (i === 0 ? ' on' : ''), tabs, t);
          b.type = 'button';
          b.onclick = () => {
            tabs.querySelectorAll('.fl-tab').forEach((x) => x.classList.remove('on'));
            b.classList.add('on');
          };
        }
        const rb = u.el('div', 'fl-ribbon', top);
        const item = (cls, label, paths, chev) => {
          const b = u.el('button', 'fl-btn ' + cls, rb);
          b.type = 'button';
          if (paths) S(b, {}, paths);
          if (label) u.el('span', '', b, label);
          if (chev) S(b, { width: 14, height: 14, class: 'chev' }, 'M6 9L12 15L18 9');
          return b;
        };
        const sp = () => u.el('i', 'fl-div', rb);
        item('fl-open', 'Open', ['M3 8V6Q3 3 6 3H10L13 6H19Q21 6 21 8V19Q21 21 19 21H5Q3 21 3 19Z', 'M3 9H21']);
        sp();
        item('ico fl-undo', '', ['M9 4L4 9L9 14', 'M4 9H15C23 9 23 20 14 20H10']);
        item('ico fl-redo', '', ['M15 4L20 9L15 14', 'M20 9H9C1 9 1 20 10 20H14']);
        sp();
        const z = u.el('button', 'fl-btn fl-zoom', rb, '100%');
        z.type = 'button';
        S(z, { width: 14, height: 14, class: 'chev' }, 'M6 9L12 15L18 9');
        sp();
        u.el('button', 'fl-btn ico fl-b', rb, 'B');
        u.el('button', 'fl-btn ico fl-i', rb, 'I');
        u.el('button', 'fl-btn ico fl-u', rb, 'U');
        sp();
        const fa = item('ico fl-a', 'A', null, true);
        sp();
        item('ico fl-align', '', ['M3 5H21M3 10H14M3 15H21M3 20H13'], true);
        item('ico fl-list', '', ['M9 5H21M9 12H21M9 19H21', 'M3 5H4M3 12H4M3 19H4'], true);
        const numbered = item('ico fl-number', '', [
          'M9 5H21M9 12H21M9 19H21',
          'M3 3H4V7M3 7H5',
          'M3 10Q6 9 5 11L3 14H6',
          'M3 17H5L4 19Q6 21 3 21',
        ]);
        sp();
        item(
          'fl-highlight',
          'Highlight',
          ['M4 19L7 20L19 8Q22 5 19 3Q17 1 15 4L4 16Z', 'M5 15L9 19', 'M2 21H13'],
          true,
        );
        sp();
        rb.querySelectorAll('button').forEach((b) => {
          if (!b.onclick) b.onclick = () => {};
        });
      const side = u.el('aside', 'fl-side');
      const taskHeading = u.el('h3', 'fl-h', side, 'Task');
      taskHeading.hidden = _c.display === 'hidden';
      const noteHost = u.el('div', 'fl-note-host', side);
      noteHost.hidden = _c.display === 'hidden';
      Object.assign(_c, { shell: fs, ribbon: rb, side, header: noteHost, drawIcon: S });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('fl-note', 'instruction');
        note.dataset.display = _c.display;
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.ribbon;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const work = _c.util.el('div', 'fl-work', _c.shell);
      work.appendChild(_c.side);
      _c.body = work;
    },
    'frame.panel': (base) => (_c) => {
      base({ ..._c, body: _c.header });
      const note = _c.header.querySelector('.ref-panel');
      if (note) {
        note.classList.add('fl-note');
        note.querySelector('.ref-panel-text').classList.add('instruction');
        note.querySelector('.ref-panel-text').dataset.display = _c.display;
      }
      const u = _c.util, side = _c.side, S = _c.drawIcon;
        u.el('h3', 'fl-h', side, 'Tools');
        const tl = u.el('div', 'fl-tools', side);
        const hb = u.el('button', 'fl-tool', tl);
        hb.type = 'button';
        S(hb, {}, ['M4 19L7 20L19 8Q22 5 19 3Q17 1 15 4L4 16Z', 'M5 15L9 19', 'M2 21H20']);
        u.el('span', '', hb, 'Highlight');
        S(hb, { width: 14, height: 14, class: 'chev' }, 'M6 9L12 15L18 9');
        const cb = u.el('button', 'fl-tool', tl);
        cb.type = 'button';
        S(cb, {}, ['M3 15L13 4Q15 2 17 4L21 8Q23 10 21 12L12 21H8L3 17Z', 'M9 9L17 17', 'M8 21H22']);
        u.el('span', '', cb, 'Clear Highlight');
        cb.onclick = () => env.widgetDef.clear?.();
        const act = u.el('div', 'fl-actions', side);
        const rs = u.el('button', 'fl-reset', act, 'Reset');
        rs.type = 'button';
        rs.onclick = () => env.widgetDef.clear?.();
        const pv = u.el('section', 'fl-preview', side);
        const ph = u.el('div', 'fl-pvh', pv);
        u.el('span', '', ph, 'Preview');
        const pw = u.el('span', 'fl-pvw', ph);
        for (const d of ['M4 12H20', 'M5 5H19V19H5Z', 'M5 5L19 19M19 5L5 19'])
          S(pw, { width: 18, height: 18, 'stroke-width': 1.2 }, d);
        const pb = u.el('div', 'fl-pvb', pv);
        pb.setAttribute('aria-hidden', 'true');
        u.el('div', 'fl-pvt', pb, 'A New Chapter');
        u.el('div', 'fl-preview-text', pb);
      Object.assign(_c, { actions: act, preview: pv });
    },
    'frame.stage': () => (_c) => {
      const stage = _c.util.el('main', 'stage fl-doc-pane');
      stage.dataset.role = 'stage';
      _c.body.insertBefore(stage, _c.side);
      _c.stage = stage;
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('fl-note');
        note.querySelector('.ref-note-text').classList.add('instruction');
        note.querySelector('.ref-note-text').dataset.display = _c.display;
        _c.header.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        foot.classList.add('fl-preview-footer');
        _c.preview.appendChild(foot);
      }
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.actions.insertBefore(dock, _c.actions.firstChild);
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
    name: 'design-select-text-phrase-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-select-text-phrase-03': palette },
      LOW_THEME: palette,
      ACCENTS: ['#0078d4'],
      LOW_ACCENTS: ['#0078d4'],
      parts,
    },
  });
})();
