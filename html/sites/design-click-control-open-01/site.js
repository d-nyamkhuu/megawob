// Design on templates/site/ui-click-hover-menu-01.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-click-control-open-01',
    styles: ['site.css'],
    template: 'site/click-control-hover-menu-01',
    design: {
      cfg: {
        'title': 'Instrument Calibration Utility',
        'theme': 'industrial',
        'layout': 'calibration',
        'tools': 'Instruments|Calibrations|Data Logs|Reports|Tools|Preferences|Help',
        'rail':
          'Instruments|All Instruments|Temperature Sensors|Pressure Sensors|Flow Meters|Electrical Meters|Lab Equipment',
        'side':
          'Instrument Details|ID: TS-1003|Type: Temperature Sensor|Range: -50 °C to 150 °C|Last Cal: 2024-02-18|Next Cal: 2024-08-18|Status: In Tolerance|Related Documents|specification.pdf|calibration_procedure.odt|maintenance_plan.odt|wiring_diagram.pdf|datasheet.pdf',
        'foot': 'Recent Calibration Records',
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
