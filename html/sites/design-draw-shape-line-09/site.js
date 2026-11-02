(function () {
  'use strict';
  const C = {
    'layout': 'split-level',
    'theme': 'vista',
    'title': 'Path Tracer',
    'menu': 'File    Edit    View    Tools    Help',
    'foot': '',
    'accent': '#2685dd',
    'bg': '#d8e8f6',
    'surface': '#fff',
    'font': 'Arial, sans-serif',
    'ob': 'tips',
  };
  function drawChrome(ctx) {
    const u = ctx.util,
      body = document.body;
    body.className = 'mac';
    const pos = (el, l, t, w, h) => {
      el.style.left = l + '%';
      el.style.top = t + '%';
      if (w != null) el.style.width = w + '%';
      if (h != null) el.style.height = h + '%';
      return el;
    };
    const bg = u.el('div', 'mac-desk', body);
    for (const area of [
      'left',
      'top',
      'right-top',
      'right-bottom',
      'edge',
      'bottom',
      'foot-left',
      'foot-right',
      'under-dock',
    ])
      u.el('div', 'wall-' + area, bg);
    const mb = u.el('div', 'mac-menubar', body);
    const ap = u.svg('svg', { class: 'mac-apple', width: 16, height: 18, viewBox: '0 0 16 18' }, mb);
    u.svg(
      'path',
      {
        d: 'M8 5C6 3.5 2 4.5 2 9C2 13 5 17 7 16.5C7.8 16.2 8.2 16.2 9 16.5C11 17 14 13 14 10C12 9.500 11.500 6 13.500 5C11.500 3.500 9.500 4 8 5ZM8.500 4C8.500 2 9.500 1 11 0.500C11 2 10 3.500 8.500 4Z',
        fill: '#222',
      },
      ap,
    );
    u.el('b', '', mb, 'Finder');
    for (const t of ['File', 'Edit', 'View', 'Go', 'Window', 'Help']) u.el('span', '', mb, t);
    const tr = u.el('div', 'mac-status', mb);
    {
      const ic = (w, kids) => {
        const s = u.svg('svg', { width: w, height: 14, viewBox: '0 0 ' + w + ' 14' }, tr);
        for (const [t, a] of kids) u.svg(t, a, s);
      };
      ic(18, [
        ['path', { d: 'M1 3Q9 -3 17 3M3 6Q9 1 15 6M5 9Q9 5 13 9', fill: 'none', stroke: '#222', 'stroke-width': 1.4 }],
        ['circle', { cx: 9, cy: 12, r: 1.3, fill: '#222' }],
      ]);
      ic(18, [
        ['path', { d: 'M1 5H4L9 1V13L4 9H1Z', fill: '#222' }],
        ['path', { d: 'M11 4Q14 7 11 10M13 2Q18 7 13 12', fill: 'none', stroke: '#222', 'stroke-width': 1.3 }],
      ]);
      ic(28, [
        ['rect', { x: 1, y: 3, width: 22, height: 9, rx: 2, fill: 'none', stroke: '#222', 'stroke-width': 1.2 }],
        ['rect', { x: 3, y: 5, width: 18, height: 5, fill: '#222' }],
        ['rect', { x: 24, y: 6, width: 2, height: 3, fill: '#222' }],
      ]);
    }
    u.el('span', '', tr, 'Mon 10:24 AM');
    {
      const s = u.svg('svg', { width: 16, height: 14, viewBox: '0 0 16 14' }, tr);
      u.svg('circle', { cx: 6, cy: 6, r: 4.5, fill: 'none', stroke: '#222', 'stroke-width': 1.6 }, s);
      u.svg('path', { d: 'M9.500 9.500L14 13', stroke: '#222', 'stroke-width': 1.8 }, s);
      const l = u.svg('svg', { width: 18, height: 14, viewBox: '0 0 18 14' }, tr);
      u.svg('path', { d: 'M1 2H3M5 2H17M1 7H3M5 7H17M1 12H3M5 12H17', stroke: '#222', 'stroke-width': 2 }, l);
    }
    const win = pos(u.el('div', 'mac-win', body), 3.23, 7.76, 68.8, 77.6);
    const tb = u.el('div', 'mac-title', win);
    const lights = u.el('div', 'mac-lights', tb);
    for (const c of ['#fc5f57', '#fdbc2e', '#28c840']) u.el('i', '', lights).style.background = c;
    u.el('span', '', tb, 'Drawing Task');
    const note = u.el('section', 'task-note mac-note', win);
    note.hidden = true;
    const stage = u.el('main', 'mac-stage', win);
    stage.dataset.role = 'stage';
    const side = u.el('aside', 'mac-side', win);
    u.el('div', 'mac-lab', side, 'Tool');
    const pb = u.el('button', 'mac-pencil', side);
    pb.type = 'button';
    const pi = u.svg('svg', { width: 34, height: 34, viewBox: '0 0 34 34' }, pb);
    u.svg('path', { d: 'M3 32L6 22L24 4L30 10L12 28Z', fill: '#594438' }, pi);
    u.svg('path', { d: 'M6 22L9 25L27 7L24 4Z', fill: '#947362' }, pi);
    u.svg('path', { d: 'M3 32L6 22L12 28Z', fill: '#dcb195' }, pi);
    u.svg('path', { d: 'M3 32L4.5 27L8 30Z', fill: '#1c1c1c' }, pi);
    u.svg('path', { d: 'M24 4L27 1L33 7L30 10Z', fill: '#25282b' }, pi);
    u.svg('path', { d: 'M24 4L30 10', stroke: '#c4c4c4', 'stroke-width': 1 }, pi);
    u.el('span', '', pb, 'Freehand Pencil');
    u.el('div', 'mac-lab mac-lab2', side, 'Line Color');
    u.el('div', 'mac-swatch', side);
    const clr = u.el('button', 'mac-clear', side, 'Clear');
    clr.type = 'button';
    clr.onclick = () => {
      env.widgetDef.clear?.();
    };
    const sep = u.el("div", "mac-sep", win);
    const tips = pos(u.el('div', 'mac-win mac-tips', body), 72.6, 38.8, 24.7, 28.9);
    const tt = u.el('div', 'mac-title', tips);
    const l2 = u.el('div', 'mac-lights', tt);
    for (const c of ['#fc5f57', '#fdbc2e', '#28c840']) u.el('i', '', l2).style.background = c;
    u.el('span', '', tt, 'Tips');
    const tc = u.el('div', 'mac-tipbody', tips);
    u.el('h4', '', tc, 'How to draw');
    const ol = u.el('ol', '', tc);
    for (const t of [
      'Press and hold the mouse button.',
      'Move the pointer while holding the button.',
      'Release the mouse button when finished.',
    ])
      u.el('li', '', ol, t);
    const dock = u.el('div', 'mac-dock', body),
      iconBoxes = [
        [279, 862, 61, 66],
        [351, 858, 69, 70],
        [430, 858, 66, 70],
        [507, 858, 60, 71],
        [583, 857, 66, 72],
        [660, 857, 61, 72],
        [735, 857, 61, 72],
        [810, 858, 68, 71],
        [885, 858, 69, 71],
        [962, 858, 66, 71],
        [1040, 858, 70, 71],
        [1117, 858, 69, 71],
        [1192, 858, 71, 71],
        [1328, 857, 62, 72],
      ];
    for (let i = 0; i < 14; i++) {
      if (i === 13) u.el('em', '', dock);
      const icon = u.el('img', 'mac-dock-icon mac-icon-' + i, dock);
      icon.src = 'sites/design-draw-shape-line-09/assets/dock-' + i + '.webp';
      icon.alt = '';
      const [x, y, w, h] = iconBoxes[i];
      icon.style.cssText = `left:${((x - 266) / 1140) * 100}%;top:${((y - 848) / 93) * 100}%;width:${(w / 1140) * 100}%;height:${(h / 93) * 100}%;`;
    }
    u.el('span', 'mac-dock-active', dock);
    return { stage, win, tb, note, sep };
  }
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const chrome = drawChrome(_c.ctx);
      Object.assign(_c, chrome, { header: chrome.note });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      _c.note.hidden = _c.display !== 'header';
      const text = _c.note.querySelector('.ref-instruction');
      if (text) text.classList.add('instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.tb;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.win;
    },
    'frame.panel': (base) => (_c) => {
      base({ ..._c, body: _c.note });
      if (_c.display === 'panel') {
        _c.note.hidden = false;
        _c.note.classList.add('instruction-panel');
        const panel = _c.note.querySelector('.ref-panel');
        panel.querySelector('.ref-panel-title').classList.add('mac-instruction-title');
        panel.querySelector('.ref-panel-text').classList.add('instruction');
      }
    },
    'frame.stage': () => (_c) => {
      // drawChrome creates the original absolutely positioned stage.
      _c.stage.dataset.role = 'stage';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('task-note', 'mac-note', 'instruction-toast');
        note.querySelector('.ref-note-text').classList.add('instruction');
        _c.win.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.win.appendChild(foot);
      _c.sep.hidden = _c.ctx.finish && !document.body.querySelector('.ref-xtra');
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.win.appendChild(dock);
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
        title = 'How to draw';
        text = 'Press and hold the mouse button. Draw one continuous stroke, then release when finished.';
        label = 'Close';
      } else if (o === 'newsletter') {
        title = 'Product Updates Newsletter';
        text = 'Get occasional updates about new features and tips.';
        label = 'Close';
      } else if (o === 'notifications') {
        title = 'Notifications (5)';
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
              ['New message', 'You have a new message from Alex.'],
              ['Weekly digest', 'Your summary is ready to view.'],
              ['Product update', 'Check out what’s new this week.'],
              ['Event reminder', 'Design sync starts in 1 hour.'],
            ]) {
          const card = u.el('div', 'notification-card', notifications);
          u.el('strong', '', card, name);
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
      if (o === 'newsletter') {
        u.el('div', 'nl-input', box, 'Your email address (optional)');
        const cb = u.el('div', 'nl-check', box);
        u.el('span', 'nl-box', cb);
        u.el('span', '', cb, 'Send me product updates');
        const x = u.el('button', 'nl-x', box, '✕');
        x.type = 'button';
        x.onclick = () => dismiss.click();
        if (env.timeText) env.timeText.textContent = 'Time: Paused (starts after you close the newsletter)';
      }
      dismiss.type = 'button';
      dismiss.onclick = () => {
        if (env.timeText) env.timeText.textContent = 'Time: Ready';
        ctx.dismiss('close');
      };
      if (o === 'privacy' || (kind === 'cookie' && !o)) {
        const accept = u.el('button', 'dismiss', box, 'Accept optional');
        accept.onclick = () => ctx.dismiss('accept');
      }
      return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };
    },
  };
  const palette = { bg: '#f0f0f0', panel: '#ffffff', fg: '#000000', muted: '#666666', line: '#d0d0d0' };
  env.site({
    name: 'design-draw-shape-line-09',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-draw-shape-line-09': palette },
      LOW_THEME: palette,
      ACCENTS: ['#2f7bf2'],
      LOW_ACCENTS: ['#2f7bf2'],
      parts,
    },
  });
})();
