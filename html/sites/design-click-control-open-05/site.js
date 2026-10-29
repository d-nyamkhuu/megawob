// Design on templates/site/ui-click-hover-menu-01.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-click-control-open-05',
    styles: ['site.css'],
    template: 'site/click-control-hover-menu-01',
    design: {
      cfg: {
        'title': 'Pictures',
        'theme': 'industrial',
        'layout': 'calibration',
        'tools': 'File|Edit|View|Tools|Help',
        'rail':
          'Related Records|Pictures|Annual_Report.pdf|Beach.png|Family.jpg|IMG_9278.jpg|IMG_9279.jpg|IMG_9280.jpg|IMG_9281.jpg|IMG_9282.gif|IMG_9283.jpg|Landscape.jpg|Presentation.png|Sunset.jpg',
        'side': '',
        'foot': '',
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
                .split('|')
                .forEach((label) => {
                  const item = u.el('span', 'menu-label', tools);
                  u.el('u', '', item, label[0]);
                  u.el('span', '', item, label.slice(1));
                });
            }
            const bar = u.el('div', 'app-actions', head);
            const symbols = {
              Back: '<path d="M17 4 9 12l8 8M9 12h17"/>',
              Forward: '<path d="m9 4 8 8-8 8m8-8H0"/>',
              Up: '<path d="m5 12 9-9 9 9M14 3v23"/>',
              Share: '<path d="M4 22v-6c0-5 5-8 13-8V3l9 9-9 9v-5C9 16 6 18 4 22Z"/>',
              Copy: '<path d="M10 5h12v20H10zM6 21H3V2h13v3"/>',
              Delete: '<path d="M4 7h21M9 7l1 18h10l1-18M8 7V4h13v3M13 11v10m4-10v10"/>',
              Properties: '<circle cx="14" cy="14" r="11"/><path d="M14 12v8m0-12v1"/>',
              Folder: '<path d="M2 6h9l3 3h13v15H2z"/>',
            };
            const addAction = (label, symbol, slot) => {
              const item = u.el('span', 'app-action' + (slot ? ' action-slot' : ''), bar);
              item.innerHTML = '<svg viewBox="0 0 28 28" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round">' + symbol + '</svg><span>' + label + '</span>';
              return item;
            };
            addAction('Back', symbols.Back);
            addAction('Forward', symbols.Forward);
            addAction('Up', symbols.Up);
            u.el('i', 'action-separator', bar);
            addAction('Open', symbols.Folder, 'open');
            addAction('Share', symbols.Share);
            addAction('Copy', symbols.Copy);
            addAction('Delete', symbols.Delete);
            u.el('i', 'action-separator', bar);
            addAction('New folder', symbols.Folder, 'folder');
            addAction('Properties', symbols.Properties);
            const extras = u.el('span', 'action-extras', bar);
            Object.assign(_c, { actionBar: bar, actionExtras: extras });
          },
        'frame.16': (base, S) =>
          function (_c) {
            const { center, ctx, head, note, u } = _c;
            if (ctx.display === 'header') head.appendChild(note);
            const stage = u.el('div', 'stage', center);
            Object.assign(_c, { stage });
          },
        'frame.20': (base, S) =>
          function (_c) {
            const { cfg } = S;
            const { ctx, note, shell, u } = _c;
            if (cfg.layout === 'calibration' && _c.aside && ctx.display === 'panel') {
              _c.aside.insertBefore(note, _c.aside.children[1] || null);
            }
            const foot = u.el('footer', 'footer', shell);
            Object.assign(_c, { foot });
          },
        'frame.22': (base, S) =>
          function (_c) {
            const { cfg } = S;
            const { ctx, foot, note, u } = _c;
            if (cfg.layout === 'calibration') {
              const records = u.el('div', 'record-table', foot);
              records.innerHTML =
                '<div class=record-head><span>Date</span><span>Instrument ID</span><span>Type</span><span>Result</span><span>Technician</span><span>Notes</span></div><div><span>2024-02-18</span><span>TS-1003</span><span>Temperature Sensor</span><span>Pass</span><span>J. Carter</span><span>Within specification</span></div><div><span>2024-02-10</span><span>PS-2201</span><span>Pressure Sensor</span><span>Pass</span><span>M. Singh</span><span>Zero adjusted</span></div><div><span>2024-02-03</span><span>FM-3300</span><span>Flow Meter</span><span class=fail>Fail</span><span>L. Gomez</span><span>Recalibrated</span></div><div><span>2024-01-27</span><span>EM-4402</span><span>Electrical Meter</span><span>Pass</span><span>D. Kim</span><span>No issues</span></div><div><span>2024-01-20</span><span>TS-1001</span><span>Temperature Sensor</span><span>Pass</span><span>J. Carter</span><span>Within specification</span></div>';
            }
            if (ctx.display === 'panel' && cfg.layout !== 'calibration') {
              const notes = foot.querySelector('.dock-section:nth-child(3)');
              const oldNote = notes.querySelector('.dock-note');
              if (oldNote) oldNote.remove();
              note.style.cssText =
                'display:block;position:static;width:auto;max-width:none;margin:4px 2px;padding:8px 10px;text-align:left;font:16px Arial,sans-serif;font-weight:400;line-height:1.25;white-space:normal;overflow-wrap:anywhere;background:#fafbfd;border:2px inset #e0e5eb;box-shadow:none;transform:none;z-index:auto;';
              notes.appendChild(note);
            }
          },
        'frame.31': (base, S) =>
          function (_c) {
            const { endRng } = _c;
            const placement = endRng.pick(['header', 'header', 'status']);
            Object.assign(_c, { placement });
          },
        'frame.36': (base, S) =>
          function (_c) {
            const { collideRng, ctx, decoyBtn, label, placement, shell, statusbar, u } = _c;
            if (!ctx.finish) {
              const actions = shell.querySelector('.tools');
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
