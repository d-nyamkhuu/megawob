(function () {
  'use strict';
  const C = { theme: 'library', accent: '#8a1c2b', ob: '' };
  const palette = { bg: '#f6f0e2', panel: '#fbf7ee', fg: '#111820', muted: '#657080', line: '#c9cfd5' };
  function styleControls(parent) {
    parent.querySelectorAll('.ref-submit').forEach((el) => el.classList.add('episode-end'));
    parent.querySelectorAll('.ref-xtra').forEach((el) => el.classList.add('episode-xtra'));
    parent.querySelectorAll('.ref-endlink').forEach((el) => el.classList.add('episode-end-link'));
  }
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The catalog reserves a note location even at the smallest viewport.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      // Alternate controls live in the existing Task Actions area.
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('design', 'library', 'layout-three');
      document.documentElement.style.setProperty('--font', "Georgia, 'Times New Roman', serif");
      const shell = u.el('div', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const book = u.svg(
        'svg',
        { class: 'lib-logo', viewBox: '0 0 90 70', fill: 'none', stroke: '#dece9e', 'stroke-width': 3 },
        head,
      );
      u.svg(
        'path',
        { d: 'M18 3Q35 2 42 8V57Q33 51 18 54ZM72 3Q55 2 48 8V57Q57 51 72 54Z', fill: '#d4c293', stroke: 'none' },
        book,
      );
      u.svg(
        'path',
        {
          d: 'M7 11H2V66H40Q45 70 50 66H88V11H82M12 7V60H38Q45 60 45 65Q45 60 52 60H78V7M18 3Q35 2 42 8V57Q33 51 18 54ZM72 3Q55 2 48 8V57Q57 51 72 54ZM9 64H38M52 64H81',
        },
        book,
      );
      const lh = u.el('div', 'lib-brand', head);
      u.el('div', 'lib-name', lh, 'Riverton University Library');
      u.el('div', 'lib-sub', lh, 'CATALOG  ·  ARCHIVES  ·  SPECIAL COLLECTIONS');
      const nav = u.el('nav', 'lib-nav', head);
      for (const t of ['Search', 'Browse', 'Services', 'About']) u.el('span', t === 'Search' ? 'on' : '', nav, t);
      const ov = u.el('div', 'lib-overview', shell);
      const cover = u.el('div', 'lib-cover', ov);
      const ct = u.el('div', 'cover-title', cover);
      u.el('div', '', ct, 'The');
      u.el('div', '', ct, 'Quiet Village');
      const tree = u.svg(
        'svg',
        { class: 'cover-tree', viewBox: '0 0 110 110', fill: 'none', stroke: '#b49955', 'stroke-width': 1.1 },
        cover,
      );
      u.svg('path', { d: 'M55 42V91M55 70Q48 96 22 97M55 77Q61 97 85 98M26 101H85M55 91L52 101M55 91L61 101' }, tree);
      for (let i = 0; i < 45; i++) {
        const a = i * 2.39996,
          r = 7 + Math.sqrt(i / 45) * 34,
          x = 55 + Math.cos(a) * r,
          y = 44 + Math.sin(a) * r * 0.85;
        u.svg(
          'path',
          { d: `M55 83Q${55 + (x - 55) * 0.28} 60 ${x} ${y}m-4 0l4 -4 4 4m-7 -5l3 -4 3 4m-6 4l-3 -4m10 4l3 -4` },
          tree,
        );
      }
      u.el('small', '', cover, 'H. L. Cartwright');
      const rec = u.el('div', 'lib-rec', ov);
      u.el('h2', '', rec, 'The Quiet Village');
      u.el('div', 'lib-author', rec, 'Cartwright, Helen L.');
      for (const [k, v] of [
        ['Publication:', 'Riverton: Maple Press, 1996'],
        ['Description:', '261 p. ; 20 cm'],
        ['Subjects:', 'Villages — Fiction\nRural life — Fiction'],
        ['Call Number:', 'PR6023.A784 Q58 1996'],
      ]) {
        u.el('span', 'k', rec, k);
        u.el('span', 'v', rec, v);
      }
      const sm = u.el('div', 'lib-sum', ov);
      u.el('h3', '', sm, 'Summary');
      const summary = u.el('p', '', sm);
      summary.append(
        document.createTextNode(
          'A gentle novel about community, change, and the enduring rhythms of rural life. Set in a small village, ',
        ),
      );
      u.el('em', '', summary, 'The Quiet Village');
      summary.append(document.createTextNode(' explores the ties between people and place across the seasons.'));
      const content = u.el('div', 'content', shell);
      const note = u.el('section', 'task-note', content);
      note.hidden = _c.display !== 'header';
      if (_c.display === 'header') u.el('div', 'note-label', note, 'Text Selection Task');
      content.classList.toggle('episode-no-header', _c.display === 'hidden' || _c.display === 'panel');
      const aside = u.el('aside', 'aside', content);
      aside.classList.toggle('episode-panel-mode', _c.display === 'panel');
      Object.assign(_c, { shell, content, note, aside, toolbar: nav, header: note });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const text = _c.note.querySelector('.ref-instruction');
      if (text) text.classList.add('instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
      styleControls(_c.headerTools);
    },
    'frame.body': () => (_c) => { _c.body = _c.content; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.aside;
      base(_c);
      _c.body = body;
      const panel = _c.aside.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('episode-panel');
        panel.querySelector('.ref-panel-title').textContent = 'Task Instructions';
      }
      const u = _c.util, aside = _c.aside;
      u.el('h3', '', aside, 'Text Controls');
      u.el('p', '', aside, 'Select text with your mouse.');
      for (const t of ['Select All', 'Clear Selection', 'View Full Text']) {
        const b = u.el('button', 'lib-btn', aside, t);
        b.type = 'button';
        b.onclick = () => {
          const tx = document.querySelector('.hl-text');
          if (t === 'Clear Selection' || t === 'Select All') {
            if (tx) tx.dispatchEvent(new CustomEvent('catalog-selection', { detail: t }));
          } else env.log('view-full-text', {});
        };
      }
      const actions = u.el('h3', 'lib-actions', aside, 'Task Actions');
      actions.hidden = _c.ctx.finish || _c.placement === 'header' || _c.placement === 'icon';
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.content);
      _c.stage.dataset.role = 'stage';
      _c.content.insertBefore(_c.stage, _c.aside);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('task-note', 'instruction-toast');
        note.querySelector('.ref-note-text').classList.add('instruction');
        note.querySelector('.ref-note-x').classList.add('note-close');
        _c.note.replaceWith(note);
        _c.note = note;
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        _c.aside.appendChild(foot);
        foot.querySelector('.ref-foot-text').hidden = true;
        styleControls(foot);
      }
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) {
        _c.aside.appendChild(dock);
        styleControls(dock);
      }
      if (_c.aside.scrollHeight > _c.aside.clientHeight) _c.aside.classList.add('episode-compact');
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
    name: 'design-select-text-phrase-10',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css', 'ref.css'],
    design: {
      THEMES: { 'design-select-text-phrase-10': palette },
      LOW_THEME: palette,
      ACCENTS: ['#8a1c2b'],
      LOW_ACCENTS: ['#8a1c2b'],
      parts,
    },
  });
})();
