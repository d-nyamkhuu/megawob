(function () {
  'use strict';
  const C = { site: 'design-act-in-time-popup-04' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util,
        r = ctx.rng.fork('chrome/end');
      const desktop = u.el('div', 'ds-desktop', document.body);
      const win = u.el('section', 'ds-window', desktop);
      const top = u.el('header', 'ds-top', win);
      u.el('span', 'ds-app-icon', top, '▤');
      u.el('span', 'ds-brand', top, 'Display Calibration Utility');
      u.el('small', 'ds-version', top, 'v1.4.2');
      const controls = u.el('span', 'ds-window-controls', top);
      ['−', '□', '×'].forEach((x) => u.el('b', '', controls, x));
      const menu = u.el('nav', 'ds-menu', win);
      ['File', 'Tools', 'Profiles', 'Help'].forEach((x) => u.el('span', '', menu, x));
      const body = u.el('div', 'ds-body', win);
      const rail = u.el('aside', 'ds-rail', body);
      ['▸ Login', 'Calibration', 'Display Info', 'Color Profiles', 'Settings', 'Diagnostics'].forEach((x, i) => {
        u.el('div', i === 0 ? 'active' : '', rail, x);
      });
      const content = u.el('div', 'ds-content', body);
      const display = ctx.display || 'header';
      if (display === 'panel') content.classList.add('ds-panel-mode');
      const instruction = (parent, cls) => {
        const b = u.el('aside', cls, parent);
        if (cls === 'ds-brief') u.el('h2', '', b, 'Task Instructions');
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      };
      if (display === 'header') instruction(content, 'ds-header-note');
      const main = u.el('div', 'ds-main', content);
      if (display === 'panel') instruction(main, 'ds-brief');
      if (display === 'toast') instruction(content, 'ds-toast');
      const stage = u.el('main', 'ds-stage', main);
      const info = u.el('section', 'ds-system', content);
      const left = u.el('div', 'ds-system-block', info);
      u.el('h3', '', left, 'System Information');
      u.el(
        'p',
        '',
        left,
        'Display:           LCD-17A\nResolution:        1280 × 1024\nColor Depth:       24-bit\nCurrent Profile:   Default',
      );
      const right = u.el('div', 'ds-system-block ds-status', info);
      u.el('h3', '', right, 'Status');
      u.el('p', '', right, 'Not logged in.\nCalibration tools are disabled.');
      const foot = u.el('footer', 'ds-footer', win);
      u.el('span', 'ds-ready', foot, 'Ready');
      let submit = null;
      const placement = ctx.finish ? null : r.pick(['footer', 'footer', 'footer', 'header', 'link', 'icon']);
      const labels = ctx.content && ctx.content.END_LABELS;
      const picked = labels && labels.length ? r.pick(labels) : 'Submit';
      const label = typeof picked === 'string' ? picked : picked.label || picked.text || 'Submit';
      const end = (parent, cls, text) => {
        const b = u.el(cls === 'ds-endlink' ? 'a' : 'button', cls, parent, text);
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
      const cr = ctx.rng.fork('chrome/collide');
      const pool =
        labels && labels.length
          ? labels.map((x) => (typeof x === 'string' ? x : x.label || x.text || 'Submit'))
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const collideOptions = [...new Set(pool)].filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
      let collide = null;
      if (collideOptions.length && cr.bool(0.3))
        collide = { text: cr.pick(collideOptions), where: cr.pick(['header', 'footer']) };
      const decoy = (parent, text) => {
        const b = u.el('button', 'ds-end ds-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        return b;
      };
      if (collide && collide.where === 'header') decoy(top, collide.text);
      if (placement === 'header') submit = end(top, 'ds-end', label);
      else if (placement === 'icon') submit = end(top, 'ds-end ds-end-icon', '✓');
      else if (placement === 'link') submit = end(foot, 'ds-endlink', label + ' ›');
      else if (!ctx.finish) submit = end(foot, 'ds-end', label);
      if (collide && collide.where === 'footer') decoy(foot, collide.text);
      const taskbar = u.el('div', 'ds-taskbar', desktop);
      u.el('span', 'ds-launch', taskbar, '⚙  Applications   Places   System');
      u.el('span', 'ds-task-icon', taskbar, '▣');
      u.el('span', 'ds-task-active', taskbar, 'Display Calibration Utility');
      u.el('span', 'ds-tray', taskbar, '◖))   Mon Apr 26 2004   10:24');
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const title = u.el('header', 'ds-overlay-title', el, ctx.kind === 'cookie' ? 'Update Notice' : 'System Notice');
      u.el('span', 'ds-overlay-x', title, '×');
      u.el('div', 'ds-overlay-copy', el, 'A newer calibration database is available (v1.5). Install it now?');
      const row = u.el('div', 'ds-overlay-row', el);
      u.el('span', 'ds-checkbox', row, '□');
      u.el('span', 'ds-check-label', row, "Don't show this again");
      const dismiss = u.el('button', 'ds-overlay-close', el, 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
