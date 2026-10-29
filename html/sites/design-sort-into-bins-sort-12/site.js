// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-sort-into-bins-sort-12',
    styles: ['site.css', 'gtk.css'],
    scripts: [],
    initialOverlay: { kind: 'banner' },
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'bottom',
        'theme': 'gtk',
        'title': 'Shape Sorter',
        'menu': 'File       Edit       View       Help',
        'accent': '#758da8',
        'bg': '#e9e7e1',
        'surface': '#f3f0e8',
        'font': 'Arial, sans-serif',
        ob: 'stale',
      },
      parts: {
        'frame.3': () => () => {},
        'frame.11': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, shell, u } = _c;
            for (const corner of ['tl', 'tr', 'bl', 'br']) {
              const ornament = u.el('div', 'corner corner-' + corner, shell);
              ornament.innerHTML =
                '<svg viewBox="0 0 30 30"><path d="M2 2H26L20 8L23 17L15 14L8 25L7 13L2 14Z" fill="#bd8d3d" stroke="#453016" stroke-width="2"/><path d="M4 4L18 5L11 9L9 18L8 8Z" fill="#ffe3a0"/><path d="M13 12L20 9L18 15L24 19L15 17L10 24Z" fill="#e0b25c" stroke="#674019"/></svg>';
            }
            if (C.menu) {
              const nav = u.el('nav', 'menu', head);
              C.menu.split(/\s{2,}/).forEach((t, i) => {
                const b = u.el('button', 'mtab' + (i === 0 ? ' on' : ''), nav, t);
                b.type = 'button';
                b.onclick = () => {
                  nav.querySelectorAll('.mtab').forEach((x) => x.classList.remove('on'));
                  b.classList.add('on');
                };
              });
              u.el('div', 'tagline', head, 'Learn ✦ Explore ✦ Grow');
            }
          },
        'frame.13': (base, S) =>
          function (_c) {
            const { C } = S;
            const { ctx, shell, u } = _c;
            const rail = u.el('nav', 'command-rail', shell);
            rail.setAttribute('aria-label', 'Commands');
            const railIcons = {
              Home: '<path d="M7 17V33H17V23H23V33H32V17L20 6Z" fill="url(#ivory)" stroke="#777b7c" stroke-width="1.6"/><path d="M3 18L20 2L37 18L34 21L20 8L6 21Z" fill="url(#roof)" stroke="#996745" stroke-width="1.5"/><path d="M27 4H31V12L27 8Z" fill="#e3d9c4" stroke="#777"/><path d="M18 24H23V33H18Z" fill="#b87839"/><path d="M9 18V31H15" fill="none" stroke="#fff" stroke-width="1.5"/>',
              Tasks:
                '<path d="M9 2H28Q34 2 34 8V33Q34 37 30 37H9Q5 37 5 33V6Q5 2 9 2Z" fill="url(#silver)" stroke="#707577" stroke-width="1.8"/><path d="M9 5H28Q31 5 31 8V33H8V6" fill="none" stroke="#fff" stroke-width="1.4"/><path d="M10 12H25M10 17H29M10 22H26M10 27H21" stroke="#757f87" stroke-width="2"/>',
              Settings:
                '<path d="M17 2H23L24 7L28 9L32 6L36 11L33 15L34 19L39 21L37 27H32L29 31L30 36L24 39L21 34H17L13 38L8 34L10 29L7 25L2 24V18L7 17L9 12L6 8L11 4L15 7Z" transform="translate(1 0) scale(.94)" fill="url(#silver)" stroke="#737779" stroke-width="1.8" stroke-linejoin="round"/><circle cx="20" cy="20" r="7" fill="#e5e5e1" stroke="#737779" stroke-width="1.8"/><path d="M16 5H21M5 19V23M12 32L15 34" fill="none" stroke="#fff" stroke-width="1.3"/>',
              Help: '<circle cx="20" cy="20" r="17" fill="url(#silver)" stroke="#6e7476" stroke-width="1.8"/><circle cx="20" cy="20" r="14.5" fill="none" stroke="#fff" stroke-width="1.2"/><path d="M14 14Q14 8 21 9Q28 9 26 16Q25 19 21 21V25" fill="none" stroke="#636d75" stroke-width="3.5" stroke-linecap="round"/><circle cx="21" cy="30" r="1.8" fill="#636d75"/>',
            };
            for (const [label, paths] of Object.entries(railIcons)) {
              const b = u.el('button', 'command' + (label === 'Home' ? ' selected' : ''), rail);
              b.type = 'button';
              b.innerHTML =
                '<svg viewBox="0 0 40 40" aria-hidden="true"><defs><linearGradient id="silver" x2="0" y2="1"><stop stop-color="#fafafa"/><stop offset="1" stop-color="#b4b7b9"/></linearGradient><linearGradient id="ivory" x2="0" y2="1"><stop stop-color="#fffdf1"/><stop offset="1" stop-color="#dbd7ca"/></linearGradient><linearGradient id="roof" x2="0" y2="1"><stop stop-color="#efbc83"/><stop offset="1" stop-color="#d88e4f"/></linearGradient></defs>' +
                paths +
                '</svg>';
              u.el('span', '', b, label);
              b.onclick = () => env.log('decoy', { label });
            }
            const content = u.el('div', 'content', shell),
              note = u.el('section', 'task-note', content);
            content.dataset.instruction = ctx.display;
            u.el('div', 'note-label', note, C.layout === 'left' ? 'Task' : '');
            Object.assign(_c, { content, note, rail, railIcons });
          },
        'frame.14': () => () => {},
        'frame.22': () => () => {},
        'frame.25': (base, S) =>
          function (_c) {
            const { footer, u } = _c;
            const tools = u.el('div', 'tools', footer);
            u.el('span', 'tools-label', tools, 'Tools');
            for (const [nm, path] of [
              ['Select', 'M6 3V27L12 21L17 31L21 29L16 19H25Z'],
              ['Clear', 'M3 20L19 3L27 10L29 16L14 31L3 24Z'],
              ['Reset', 'M10 9A10 10 0 1 1 6 20'],
            ]) {
              const w = u.el('button', 'tool2' + (nm === 'Select' ? ' sel' : ''), tools);
              w.type = 'button';
              const s = u.svg(
                'svg',
                {
                  width: 34,
                  height: 34,
                  viewBox: '0 0 32 32',
                  fill: nm === 'Clear' ? '#9290b9' : nm === 'Select' ? '#fff' : 'none',
                  stroke: nm === 'Clear' ? '#30254c' : nm === 'Select' ? '#000' : '#a8a4c5',
                  'stroke-width': nm === 'Clear' ? 1 : nm === 'Select' ? 1.6 : 3.6,
                  'stroke-linejoin': 'round',
                },
                w,
              );
              u.svg('path', { d: path }, s);
              if (nm === 'Clear') {
                u.svg(
                  'path',
                  { d: 'M3 20L14 27L29 12L27 10L12 24Z', fill: '#b0afd0', stroke: '#50456d', 'stroke-width': 0.8 },
                  s,
                );
                u.svg(
                  'path',
                  { d: 'M14 27V31M3 20L14 27M12 24L27 10', fill: 'none', stroke: '#42375f', 'stroke-width': 1 },
                  s,
                );
              }
              if (nm === 'Reset')
                u.svg('path', { d: 'M11 2L3 9L12 16Z', fill: '#a8a4c5', stroke: '#a8a4c5', 'stroke-width': 0.5 }, s);
              u.el('small', '', w, nm);
              if (nm === 'Select')
                w.onclick = () => {
                  tools.querySelectorAll('.tool2').forEach((x) => x.classList.remove('sel'));
                  w.classList.add('sel');
                };
              else w.onclick = () => env.log('tool', { label: nm });
            }
            u.el('div', 'tool-sep', footer);
            Object.assign(_c, { tools });
          },
        'frame.28': (base, S) =>
          function (_c) {
            const { C } = S;
            const { ctx, footer, head, u } = _c;
            const er = ctx.rng.fork('chrome/end'),
              cr = ctx.rng.fork('chrome/collide');
            const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
            const endLabels = ctx.content.END_LABELS.map(labelOf);
            const referenceEnd = er.bool(0.5),
              placement = referenceEnd ? 'footer' : er.pick(['toolbar', 'status']);
            const endLabel = referenceEnd ? 'Submit' : er.pick(endLabels);
            const episodeTools = u.el('div', 'episode-tools', head.querySelector('.menu'));
            if (_c.submit) {
              _c.submit.textContent = endLabel;
              _c.submit.title = endLabel;
              _c.submit.setAttribute('aria-label', endLabel);
              _c.submit.classList.add('end-' + placement);
              if (placement === 'toolbar') episodeTools.append(_c.submit);
            }
            if (cr.bool(0.3)) {
              const options = endLabels.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
              const label = cr.pick(options);
              const decoy = u.el('button', 'episode-xtra', episodeTools, label);
              decoy.type = 'button';
              decoy.dataset.role = 'xtra';
              decoy.onclick = () => env.log('decoy', { label, collide: true });
            }
            if (C.theme === 'eink') {
              const points = u.el('span', 'points', footer, 'Points: 0/1');
              footer.insertBefore(points, _c.submit);
              const clear = u.el('button', 'clear', footer, 'Clear');
              clear.onclick = () => {
                env.widgetDef.clear?.();
              };
            }
            Object.assign(_c, { cr, endLabel, endLabels, episodeTools, er, labelOf, placement, referenceEnd });
          },
        'overlay.7': (base, S) =>
          function (_c) {
            const { kind, o } = _c;
            if (o === 'stale') {
              _c.title = 'Unsaved layout changes';
              _c.text =
                'You have unsaved changes to the activity layout. If you continue, your changes will be kept and you can still complete the task.';
              _c.label = 'Continue without saving';
            } else if (o === 'update') {
              _c.title = 'A new version is available';
              _c.text = 'Get the latest features and security fixes.';
              _c.label = 'Remind me later';
            } else if (o === 'privacy') {
              _c.title = 'We’d like your consent';
              _c.text =
                'We use optional analytics to improve this application. You can change this setting at any time in the Options menu.';
              _c.label = 'Reject optional';
            } else if (o === 'tips') {
              _c.title = 'Tip of the day';
              _c.text = 'The midpoint is the point that is the same distance from both marked points.';
              _c.label = 'Close';
            } else if (o === 'newsletter') {
              _c.title = 'Stay in the loop';
              _c.text = 'Get occasional tips, practice problems, and feature updates.';
              _c.label = 'Close';
            } else if (o === 'notifications') {
              _c.title = 'Notifications (5)';
              _c.text =
                'Software Update Available\nDisk Almost Full\nTip of the Day\nWelcome to Shape Sorter\nReminder';
              _c.label = 'Dismiss all';
            } else if (o === 'survey') {
              _c.title = 'Quick Survey';
              _c.text = 'Please take a moment to give us some feedback.\nHow easy is this training task?';
              _c.label = 'Close survey';
            } else {
              _c.title = {
                cookie: 'Your privacy',
                toast: 'Changes saved',
                chat: 'Support',
                promo: 'Workspace update',
                banner: 'Service notice',
              }[kind];
              _c.text = {
                cookie: 'This application stores optional cookies.',
                toast: 'Your changes have been saved.',
                chat: 'Need a hand with this workspace?',
                promo: 'Explore the latest workspace features.',
                banner: 'You are viewing a shared workspace.',
              }[kind];
              _c.label = kind === 'cookie' ? 'Reject optional' : 'Close';
            }
          },
      },
    },
  });
})();
