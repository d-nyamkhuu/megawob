// Design on templates/site/ui-click-hover-menu-01.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-click-control-rows-02',
    styles: ['site.css'],
    template: 'site/click-control-hover-menu-01',
    design: {
      cfg: {
        'title': 'Company Documents',
        'theme': 'qt',
        'layout': 'dock',
        'tools': 'Home    View    Tools',
        'side':
          'Tips|Hover over a file in the list to see available actions, such as archive, share, or delete.|Use the columns to sort and find files quickly.|Common Actions|Archive — Move a file to archive to keep your documents organized.|Share — Send a file to others for collaboration.|Rename — Change the name of a file.|Move — Move a file to a different folder.|Copy — Create a copy of a file.|Delete — Permanently delete a file.',
      },
      parts: {
        'frame.7': (base, S) =>
          function (_c) {
            const { cfg } = S;
            const { head, u } = _c;
            if (cfg.tools) {
              const tools = u.el('div', 'tools', head);
              cfg.tools
                .trim()
                .split(/\s+/)
                .forEach((label) => {
                  const item = u.el('span', 'menu-label', tools);
                  u.el('u', '', item, label[0]);
                  u.el('span', '', item, label.slice(1));
                });
              const ribbon = u.el('div', 'ribbon-actions', tools);
              ribbon.style.cssText =
                'position:absolute;left:0;right:0;top:43px;height:139px;display:grid;grid-template-columns:15% 15% 14% 25% 17%;overflow:hidden;padding:6px 8px 0;background:linear-gradient(#f5faff,#dceafa);';
              const groups = [
                [
                  'New',
                  [
                    ['▯', 'New Document'],
                    ['↑', 'Upload'],
                  ],
                ],
                [
                  'File',
                  [
                    ['▱', 'Open'],
                    ['⬇', 'Download'],
                  ],
                ],
                [
                  'Share',
                  [
                    ['♧', 'Share'],
                    ['✉', 'Email'],
                  ],
                ],
                [
                  'Organize',
                  [
                    ['▣', 'Rename'],
                    ['➜', 'Move'],
                    ['▤', 'Copy'],
                    ['×', 'Delete'],
                  ],
                ],
                [
                  'Manage',
                  [
                    ['ⓘ', 'Properties'],
                    ['◷', 'Version History'],
                  ],
                ],
              ];
              groups.forEach((g, gi) => {
                const group = u.el('div', 'ribbon-group', ribbon);
                group.style.cssText =
                  'position:relative;display:flex;flex-direction:row;flex-wrap:nowrap;align-items:flex-start;justify-content:center;gap:2px;height:129px;padding:5px 3px 23px;border-right:1px solid #abc2da;overflow:hidden;';
                g[1].forEach((x, xi) => {
                  const tile = u.el('div', 'ribbon-tile icon-' + gi + '-' + xi, group);
                  tile.style.cssText =
                    'display:flex;flex:1 1 0;flex-direction:column;align-items:center;justify-content:flex-start;gap:4px;min-width:0;height:94px;padding:0 1px;text-align:center;color:#203858;font:12px Segoe UI,Tahoma,Arial,sans-serif;';
                  const ri = u.el('span', 'ribbon-icon', tile);
                  ri.style.cssText =
                    'display:flex;flex:none;width:48px;height:54px;align-items:center;justify-content:center;';
                  const art = [
                    '<path d="M4 3h11l5 5v13H4z" fill="#fff" stroke="#527ba5"/><path d="M15 3v6h5" fill="none" stroke="#527ba5"/><path d="M8 13h7M8 16h7" stroke="#377dc0"/>',
                    '<path d="M12 20V5m-7 7 7-7 7 7" fill="none" stroke="#24963a" stroke-width="3"/>',
                    '<path d="M3 8h18v12H3zM2 8l3-4h14l3 4" fill="#ffd36b" stroke="#c28b23" stroke-width="1.5"/>',
                    '<path d="M12 4v15m-7-7 7 7 7-7" fill="none" stroke="#2784cf" stroke-width="3"/>',
                    '<circle cx="8" cy="8" r="4" fill="#8da9be"/><circle cx="17" cy="9" r="4" fill="#5f91be"/><path d="M1 21c0-5 3-8 7-8s7 3 7 8M11 21c0-4 2-7 6-7s6 3 6 7" fill="#83b66b" stroke="#4d7650"/>',
                    '<path d="M2 5h20v14H2z" fill="#fff" stroke="#8298b2"/><path d="m3 6 9 8 9-8" fill="none" stroke="#4382bd" stroke-width="2"/>',
                    '<path d="M3 7h14v12H3zM7 4h14v12" fill="#d8ebfb" stroke="#5686b8" stroke-width="2"/>',
                    '<path d="M3 7h12l2 3h5v10H3z" fill="#ffcf62" stroke="#bf8a23"/><path d="M12 13h9m-4-4 4 4-4 4" fill="none" stroke="#2378c6" stroke-width="2"/>',
                    '<path d="M5 3h9l7 7v11H5z" fill="#fff" stroke="#6689b0"/><path d="M14 3v7h7M2 7v15h15" fill="none" stroke="#5983b4" stroke-width="2"/>',
                    '<path d="M5 3h14v18H5z" fill="#df493b"/><path d="m8 8 8 8m0-8-8 8" stroke="#fff" stroke-width="3"/>',
                    '<path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18" fill="#e5f2ff" stroke="#6085ac"/><path d="M12 10v6m0-9v1" stroke="#2370b4" stroke-width="2"/>',
                    '<circle cx="12" cy="12" r="9" fill="#e9f1fa" stroke="#607f9f" stroke-width="2"/><path d="M12 6v6l4 3" fill="none" stroke="#54779a" stroke-width="2"/>',
                  ];
                  ri.innerHTML =
                    '<svg viewBox="0 0 24 24" aria-hidden="true">' +
                    art[gi === 0 ? xi : gi === 1 ? xi + 2 : gi === 2 ? xi + 4 : gi === 3 ? xi + 6 : xi + 10] +
                    '</svg>';
                  ri.firstChild.style.cssText =
                    'display:block;width:44px;height:44px;max-width:44px;max-height:44px;filter:drop-shadow(1px 1px 1px #8395a8);';
                  u.el('span', 'ribbon-label', tile, x[1]);
                });
                u.el('div', 'ribbon-caption', group, g[0]);
              });
            }
          },
        'frame.18': (base, S) =>
          function (_c) {
            const { cfg } = S;
            const { u, work } = _c;
            if (cfg.side) {
              _c.aside = u.el('aside', 'inspector', work);
              cfg.side.split('|').forEach((s, i) => {
                if (i < 4) u.el(i === 0 || i === 3 ? 'h2' : 'p', '', _c.aside, s);
                else {
                  const row = u.el('div', 'help-action', _c.aside);
                  const ico = u.el('span', 'help-icon help-icon-' + (i - 4), row);
                  ico.style.cssText =
                    'display:flex;flex:none;width:31px;height:31px;align-items:center;justify-content:center;overflow:hidden;';
                  const paths = [
                    '<path d="M4 9h16v10H4zM2 9l3-5h14l3 5M9 13h6"/>',
                    '<path d="M8 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6M3 20c0-3 2-5 5-5s5 2 5 5M17 11a3 3 0 1 0-1-6M16 15c3 0 5 2 5 5"/>',
                    '<path d="M4 4h13v12H4zM8 20h12V8M7 8h7M7 11h7"/>',
                    '<path d="M3 8h8l2 2h8v9H3zM13 13h7m-3-3 3 3-3 3"/>',
                    '<path d="M4 3h11l5 5v13H4zM15 3v6h5M7 12h9M7 16h9"/>',
                    '<path d="M5 5l14 14M19 5 5 19"/>',
                  ];
                  ico.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true">' + paths[i - 4] + '</svg>';
                  ico.firstChild.style.cssText = 'display:block;width:30px;height:30px;max-width:30px;max-height:30px;';
                  const fill = ['#b7b7b4', '#75bd61', '#c5def2', '#ffcd64', '#eaf4fc', '#de4a3e'][i - 4];
                  ico.firstChild.querySelector('path').setAttribute('fill', fill);
                  ico.firstChild
                    .querySelector('path')
                    .setAttribute('stroke', ['#737a82', '#4b8b4e', '#4e7fae', '#bd8625', '#5783b2', '#a52e27'][i - 4]);
                  u.el('span', 'help-copy', row, s);
                }
              });
            }
          },
        'frame.22': (base, S) =>
          function (_c) {
            const { center, ctx, foot, note } = _c;
            if (ctx.display === 'panel') {
              const notes = foot.querySelector('.dock-section:nth-child(3)');
              const oldNote = notes && notes.querySelector('.dock-note');
              if (oldNote) oldNote.remove();
              note.style.cssText =
                'display:block;position:static;width:auto;max-width:none;margin:4px 2px;padding:8px 10px;text-align:left;font:16px Arial,sans-serif;font-weight:400;line-height:1.25;white-space:normal;overflow-wrap:anywhere;background:#fafbfd;border:2px inset #e0e5eb;box-shadow:none;transform:none;z-index:auto;';
              (notes || _c.aside || center).appendChild(note);
            }
          },
        'frame.36': (base, S) =>
          function (_c) {
            const { collideRng, ctx, decoyBtn, foot, label, placement, shell, statusbar, u } = _c;
            if (!ctx.finish) {
              const actions = foot.querySelector('.dock-section:last-child') || foot;
              const makeEnd = (parent, compact) => {
                const b = u.el('button', compact ? 'submit chrome-submit' : 'submit', parent, label);
                b.type = 'button';
                b.addEventListener('click', ctx.submit);
                if (compact)
                  b.style.cssText =
                    'width:auto;min-width:74px;height:27px;margin:0 0 0 8px;padding:2px 10px;font:700 14px Arial;vertical-align:middle;';
                return b;
              };
              if (placement === 'actions') {
                _c.submit = makeEnd(actions, false);
                const resetBtn = actions.querySelector('.reset-task');
                if (resetBtn) actions.insertBefore(_c.submit, resetBtn);
              } else if (placement === 'header') _c.submit = makeEnd(shell.querySelector('.tools'), true);
              else _c.submit = makeEnd(statusbar, true);
              if (_c.collide) decoyBtn(collideRng.pick([shell.querySelector('.tools'), actions]), _c.collide, true);
            }
          },
      },
    },
  });
})();
