(function () {
  'use strict';
  const C = { site: 'design-read-figure-grid-12' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      document.body.className = 'breeze split-grid instruction-' + ctx.display;
      const er = ctx.rng.fork('chrome/end'),
        labels = ctx.content.END_LABELS.map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name)),
        placement = er.pick(['tools', 'tools', 'menu', 'status']),
        endLabel = placement === 'tools' ? 'Submit' : er.pick(labels);
      if (ctx.finish) document.body.classList.add('finish-mode');
      const u = ctx.util,
        app = u.el('main', 'app', document.body),
        title = u.el('header', 'window-title', app);
      const icon = u.svg('svg', { width: 24, height: 24, viewBox: '0 0 24 24' }, title);
      u.svg('rect', { x: 1, y: 1, width: 22, height: 22, rx: 3, fill: '#168bd2' }, icon);
      u.svg('path', { d: 'M5 6h5v5H5zm8 0h6v3h-6zm0 5h6v7h-6zm-8 2h5v5H5z', fill: '#fff' }, icon);
      u.el('span', 'window-name', title, 'Coordinate Practice — KDE');
      const win = u.el('div', 'window-controls', title);
      ['−', '□', '×'].forEach((x) => u.el('span', '', win, x));
      const menu = u.el('nav', 'menu', app);
      ['File', 'Edit', 'View', 'Settings', 'Help'].forEach((x) => u.el('span', 'menu-item', menu, x));
      const menuActions = u.el('div', 'menu-actions', menu);
      const overview = u.el('section', 'overview', app),
        heading = u.el('h1', '', overview, 'Coordinate Practice');
      u.el('p', 'subheading', overview, 'Click the point on the grid described below.');
      const row = u.el('div', 'overview-row', overview),
        brief = u.el('div', 'brief', row, ctx.display === 'hidden' ? '' : ctx.instruction);
      u.el('p', 'brief-detail', brief, 'Use the mouse pointer to click the correct point on the grid.');
      u.el('p', 'brief-state', brief, 'The point is not yet marked.');
      const about = u.el('aside', 'about-grid', row);
      u.el('b', '', about, 'About the grid');
      const list = u.el('ul', '', about);
      [
        'The horizontal axis is the x-axis (positive to the right).',
        'The vertical axis is the y-axis (positive upward).',
        'The origin is at (0, 0).',
        'Coordinates can be negative.',
      ].forEach((x) => u.el('li', '', list, x));
      const work = u.el('section', 'work-area', app),
        stage = u.el('section', 'stage', work),
        tools = u.el('aside', 'tool-panel', work);
      u.el('h2', '', tools, 'Tools');
      const select = u.el('button', 'tool-button active', tools);
      select.type = 'button';
      u.el('span', 'tool-icon cursor-icon', select, '➤');
      u.el('span', '', select, 'Select (click point)');
      const clear = u.el('button', 'tool-button clear-tool', tools);
      clear.type = 'button';
      u.el('span', 'tool-icon eraser-icon', clear, '◆');
      u.el('span', '', clear, 'Clear selection');
      clear.addEventListener('click', () => document.querySelector('.reference-reset')?.click());
      u.el('div', 'tool-divider', tools);
      u.el('h2', 'view-title', tools, 'View');
      const checks = u.el('div', 'check-row', tools);
      u.el('span', 'checkbox checked', checks, '✓');
      u.el('span', '', checks, 'Show grid');
      const checks2 = u.el('div', 'check-row', tools);
      u.el('span', 'checkbox checked', checks2, '✓');
      u.el('span', '', checks2, 'Show axis labels');
      const save = u.el('button', 'save-view', tools);
      save.type = 'button';
      u.el('span', 'gear', save, '⚙');
      u.el('span', 'save-label', save, 'Save view');
      u.el('small', 'save-note', save, 'Saves only display preferences\n(does not submit your answer).');
      save.addEventListener('click', () => env.log('decoy', { label: 'Save view' }));
      select.addEventListener('click', () => env.log('decoy', { label: 'Select (click point)' }));
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const options = labels.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (options.length) {
          const label = cr.pick(options),
            decoy = u.el('button', 'chrome-xtra', menuActions, label);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label, collide: true }));
        }
      }
      let submit = null;
      const status = u.el('footer', 'status-bar', app);
      u.el('span', '', status, 'Ready');
      u.el('span', 'status-right', status, 'No point selected');
      if (!ctx.finish) {
        const parent = placement === 'tools' ? tools : placement === 'menu' ? menuActions : status;
        submit = u.el('button', 'submit end-' + placement, parent, endLabel);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.addEventListener('click', ctx.submit);
      }
      if (ctx.display === 'hidden') brief.remove();
      if (ctx.instruction.length > 90) brief.classList.add('long-instruction');
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body);
      const messages = {
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
