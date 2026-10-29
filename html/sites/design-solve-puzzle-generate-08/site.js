(function () {
  'use strict';
  const C = {
    site: 'design-solve-puzzle-generate-08',
    task: 'solve-puzzle',
    scenario: 'generate',
    style: 'industrial',
    title: 'CalibPro 1.3  -  Sensor Calibration Utility',
    layout: 'ribbon',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      document.body.className = C.style + ' ' + C.layout + ' instruction-' + ctx.display;
      const u = ctx.util,
        app = u.el('main', 'app', document.body),
        top = u.el('header', 'top', app);
      u.el('span', '', top, C.title);
      const wc = u.el('div', 'native-window-controls', top);
      for (const kind of ['min', 'max', 'close']) {
        u.el('span', 'window-control ' + kind, wc, kind === 'min' ? '_' : kind === 'max' ? '□' : '×');
      }
      const menu = u.el('nav', 'menu', app);
      ['File', 'Tools', 'View', 'Help'].forEach((x) => u.el('span', 'menu-item', menu, x));
      const ribbon = u.el('section', 'ribbon', app),
        groups = [
          [
            'Session',
            [
              ['▯', 'New'],
              ['▱', 'Open'],
              ['▣', 'Save'],
            ],
          ],
          [
            'Device',
            [
              ['⌁', 'Connect'],
              ['◌', 'Disconnect'],
              ['⚙', 'Settings'],
            ],
          ],
          [
            'Calibration',
            [
              ['⊙', 'Calibrate'],
              ['▥', 'View Log'],
              ['▤', 'Export'],
            ],
          ],
          [
            'System',
            [
              ['🔧', 'Preferences'],
              ['?', 'Help'],
            ],
          ],
        ];
      groups.forEach(([label, items]) => {
        const g = u.el('div', 'ribbon-group', ribbon);
        const row = u.el('div', 'ribbon-buttons', g);
        items.forEach(([icon, text]) => {
          const b = u.el('div', 'ribbon-button', row);
          u.el('span', 'ribbon-icon', b, icon);
          u.el('span', '', b, text);
        });
        u.el('div', 'ribbon-label', g, label);
      });
      const title = u.el('div', 'workspace-title', app, 'Random Number Calibration'),
        center = u.el('div', 'center', app),
        brief = u.el(
          'div',
          'brief mode-' + ctx.display,
          center,
          ctx.display === 'header' || ctx.display === 'panel' || ctx.display === 'toast' ? ctx.instruction : '',
        ),
        stage = u.el('section', 'stage', center),
        footer = u.el('footer', 'bottom', app);
      ['Ready', 'Device: CAL-200', 'Status: Connected', '18 Apr 2004   14:27'].forEach((x, i) =>
        u.el('div', 'status-cell status-' + i, footer, x),
      );
      const er = ctx.rng.fork('chrome/end'),
        cr = ctx.rng.fork('chrome/collide');
      const labels = (
        (ctx.content && ctx.content.END_LABELS) || [
          'Submit',
          'Done',
          'Finish',
          'Continue',
          'Save',
          'OK',
          'Confirm',
          'Apply',
          'Complete',
        ]
      ).map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)));
      const placement = ctx.finish ? null : er.bool(0.5) ? 'footer' : er.pick(['toolbar', 'link']);
      const label = er.bool(0.5) ? 'Submit' : String(er.pick(labels));
      let submit = null;
      const addEnd = (parent, cls, text) => {
        const b = u.el(cls === 'end-link' ? 'a' : 'button', cls, parent, text);
        if (b.tagName === 'BUTTON') b.type = 'button';
        else b.href = '#';
        b.dataset.role = 'submit';
        b.title = label;
        b.setAttribute('aria-label', label);
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      if (!ctx.finish) {
        if (placement === 'footer') {
          submit = addEnd(footer.children[0], 'submit chrome-end', label);
        } else if (placement === 'toolbar') {
          const g = ribbon.querySelector('.ribbon-group:last-child .ribbon-buttons');
          submit = addEnd(g, 'ribbon-button chrome-end', label);
        } else {
          submit = addEnd(footer.children[0], 'end-link', label);
        }
      }
      const collide = cr.bool(0.3);
      if (collide) {
        const other = labels
          .map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name))
          .filter((x) => String(x).toLowerCase() !== label.toLowerCase());
        if (other.length) {
          const text = String(cr.pick(other)),
            where = cr.pick(['toolbar', 'footer']),
            parent = where === 'toolbar' ? ribbon.querySelector('.ribbon-group:last-child .ribbon-buttons') : footer,
            b = u.el('button', 'xtra-end', parent, text);
          b.type = 'button';
          b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body),
        messages = {
          cookie: 'This application stores preferences on your device.',
          toast: 'Your workspace has been synced.',
          chat: 'Need help with this exercise?',
          promo: 'Try the new practice collection.',
          banner: 'An updated practice collection is available.',
        };
      u.el('span', '', el, messages[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Dismiss');
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
