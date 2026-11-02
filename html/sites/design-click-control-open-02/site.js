// Design on templates/site/ui-click-hover-menu-01.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-click-control-open-02',
    styles: ['site.css'],
    template: 'site/click-control-hover-menu-01',
    design: {
      cfg: {
        'title': 'Acme Corporation',
        'theme': 'intranet',
        'layout': 'dock',
        'tools': 'File    Edit    View    Tools    Help',
        'overview':
          'Riverside Marketing Campaign|Project: Riverside Marketing Campaign\nProject ID: PRJ-1042\nStatus: Active\nStart Date: Mar 01, 2000\nEnd Date: Aug 31, 2000|Client: Riverside Holdings\nProject Manager: Dana Mitchell\nDepartment: Marketing\nLast Updated: May 12, 2000\nDescription: Product launch campaign for the Riverside line.',
        'side': 'File Details|No file selected|Type: —|Size: —|Modified: —|Dimensions: —',
        'foot': '',
      },
      parts: {
        'frame.22': (base, S) =>
          function (_c) {
            const { ctx, note, shell } = _c;
            if (ctx.display === 'panel') {
              const panel = shell.querySelector('.inspector');
              note.style.cssText =
                'display:block;position:static;width:auto;max-width:none;margin:4px 0;padding:8px 10px;text-align:left;font:14px Arial,sans-serif;font-weight:400;line-height:1.3;white-space:normal;overflow-wrap:anywhere;background:#f5f2cc;border:1px solid #b7b17a;box-shadow:none;transform:none;z-index:auto;';
              panel.insertBefore(note, panel.children[1] || null);
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
