(function () {
  'use strict';
  const C = { site: 'design-act-in-time-moving-08' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const primary = u.el('section', 'ds-window ds-primary', document.body);
      const title = u.el('header', 'ds-titlebar', primary);
      u.el('span', 'ds-appicon', title, '');
      u.el('span', 'ds-brand', title, 'Shape Catcher');
      const controls = u.el('div', 'ds-window-buttons', title);
      ['−', '□', '×'].forEach((t, i) => {
        const b = u.el('button', '', controls, t);
        b.type = 'button';
        b.className = 'ds-wb ds-wb-' + i;
      });
      const tabs = u.el('nav', 'ds-tabs', primary);
      ['Home', 'Game', 'View'].forEach((t, i) => u.el('span', i === 0 ? 'active' : '', tabs, t));
      const ribbon = u.el('div', 'ds-ribbon', primary);
      const groups = [
        [
          'Game Controls',
          [
            ['Ⅱ', 'Pause'],
            ['■', 'Reset'],
          ],
        ],
        [
          'Settings',
          [
            ['⚙', 'Difficulty⌄'],
            ['▥', 'Sound⌄'],
          ],
        ],
        [
          'Display',
          [
            ['□', 'Fit to Window'],
            ['↗', 'Full Screen'],
          ],
        ],
      ];
      groups.forEach(([name, items]) => {
        const g = u.el('div', 'ds-ribbon-group', ribbon);
        const row = u.el('div', 'ds-ribbon-tools', g);
        items.forEach(([icon, label]) => {
          const b = u.el('button', 'ds-tool', row);
          b.type = 'button';
          u.el('span', 'ds-tool-icon', b, icon);
          u.el('span', '', b, label);
        });
        u.el('div', 'ds-group-label', g, name);
      });
      let display = ctx.display || 'header';
      if (display === 'panel' && ctx.size && ctx.size.width < 1260) display = 'header';
      if (display === 'toast' && ctx.size && ctx.size.height < 700) display = 'header';
      document.body.dataset.dsDisplay = display;
      const note = u.el('div', 'ds-instruction-note', primary, ctx.instruction);
      note.hidden = display !== 'header';
      note.style.display = display === 'header' ? 'flex' : 'none';
      if (display === 'toast') {
        note.hidden = false;
        note.style.display = 'flex';
        note.classList.add('ds-toast-note');
      }
      const endR = ctx.rng.fork('chrome/end');
      const endPlacement = ctx.finish ? null : endR.bool(0.5) ? 'panel' : endR.pick(['ribbon', 'taskbar']);
      const endLabels = (ctx.content && ctx.content.END_LABELS) || [
        'Submit',
        'Done',
        'Finish',
        'Continue',
        'Save',
        'OK',
        'Confirm',
        'Apply',
        'Complete',
        "I'm done",
      ];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const variedLabel =
        endPlacement === 'panel'
          ? 'Submit'
          : labelOf(endR.pick(endLabels.filter((x) => labelOf(x).toLowerCase() !== 'submit')) || 'Done');
      let submit = null;
      if (endPlacement === 'ribbon') {
        const eb = u.el('button', 'ds-chrome-end ds-ribbon-end', ribbon, variedLabel);
        eb.type = 'button';
        eb.dataset.role = 'submit';
        eb.addEventListener('click', () => ctx.submit());
        submit = eb;
      }
      const stage = u.el('main', 'ds-stage', primary);
      const panel = u.el('section', 'ds-window ds-panel', document.body);
      const pt = u.el('header', 'ds-titlebar', panel);
      u.el('span', 'ds-appicon', pt, '');
      u.el('span', 'ds-brand', pt, 'Timer & Controls');
      const pc = u.el('div', 'ds-window-buttons', pt);
      ['−', '□', '×'].forEach((t, i) => {
        const b = u.el('button', '', pc, t);
        b.type = 'button';
        b.className = 'ds-wb ds-wb-' + i;
      });
      const pTabs = u.el('nav', 'ds-panel-tabs', panel);
      u.el('span', 'active', pTabs, 'Control');
      u.el('span', '', pTabs, 'Info');
      if (display === 'panel') u.el('div', 'ds-panel-note', panel, ctx.instruction);
      const timer = u.el('section', 'ds-timer-card', panel);
      u.el('strong', '', timer, 'Time Remaining');
      const progress = u.el('div', 'ds-progress', timer);
      u.el('i', '', progress);
      const controlsArea = u.el('div', 'ds-panel-controls', panel);
      u.el('div', 'ds-control-label', controlsArea, 'Target Shape');
      u.el('div', 'ds-control-label', controlsArea, 'Board Size');
      u.el('div', 'ds-value', controlsArea, 'Medium');
      u.el('div', 'ds-control-label', controlsArea, 'Speed');
      u.el('div', 'ds-value', controlsArea, 'Normal');
      const actions = u.el('div', 'ds-panel-actions', panel);
      const pause = u.el('button', 'ds-pause', actions, 'Pause');
      pause.type = 'button';
      if (!ctx.finish && endPlacement === 'panel') {
        submit = u.el('button', 'ds-submit', actions, 'Submit');
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.addEventListener('click', () => ctx.submit());
      }
      const taskbar = u.el('footer', 'ds-taskbar', document.body);
      u.el('span', 'ds-start', taskbar, '⊞');
      u.el('span', 'ds-taskbar-app', taskbar, '▣');
      u.el('span', 'ds-taskbar-app', taskbar, '▶');
      const tray = u.el('div', 'ds-tray', taskbar);
      u.el('span', '', tray, '⌃');
      u.el('span', '', tray, '◖');
      u.el('span', '', tray, '▣');
      u.el('span', 'ds-time', tray, '10:15 AM');
      u.el('span', '', tray, '4/22/2008');
      if (endPlacement === 'taskbar') {
        submit = u.el('button', 'ds-chrome-end ds-taskbar-end', taskbar, variedLabel);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.addEventListener('click', () => ctx.submit());
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (!ctx.finish && cr.bool(0.3)) {
        const own = variedLabel.trim().toLowerCase();
        const choices = endLabels.map(labelOf).filter((x) => x.trim().toLowerCase() !== own);
        if (choices.length) {
          const d = u.el('button', 'ds-pq', ribbon, cr.pick(choices));
          d.type = 'button';
          d.dataset.role = 'xtra';
          d.addEventListener('click', () => env.log('decoy', { label: d.textContent, collide: true }));
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
