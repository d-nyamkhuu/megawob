(function () {
  'use strict';
  const C = { site: 'design-read-figure-ascending-12', task: 'read-figure', scenario: 'ascending' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      document.body.className = 'win31 instruction-' + ctx.display;
      const endR = ctx.rng.fork('chrome/end'),
        collideR = ctx.rng.fork('chrome/collide'),
        labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)),
        endLabels = ctx.content.END_LABELS.map(labelOf),
        referenceEnd = endR.bool(0.5),
        placement = referenceEnd ? 'actions' : endR.pick(['toolbar', 'taskbar']),
        endLabel = referenceEnd ? 'Submit' : endR.pick(endLabels);
      const u = ctx.util,
        desk = u.el('div', 'desktop', document.body);
      const icons = u.el('div', 'desktop-icons', desk);
      [
        ['▣', 'Program Manager'],
        ['📁', 'My Documents'],
        ['▤', 'Notepad'],
        ['♲', 'Recycle Bin'],
      ].forEach(([icon, label]) => {
        const it = u.el('div', 'desktop-icon', icons);
        u.el('span', 'desktop-glyph', it, icon);
        u.el('span', '', it, label);
      });
      const app = u.el('main', 'app-window', desk),
        title = u.el('header', 'titlebar', app);
      const ico = u.el('span', 'app-icon', title, '▣');
      u.el('span', 'window-title', title, 'Number Sequence');
      const wc = u.el('div', 'window-controls', title);
      [
        ['−', 'minimize'],
        ['□', 'maximize'],
        ['×', 'close'],
      ].forEach(([t, c]) => u.el('span', c, wc, t));
      const upper = u.el('div', 'upper-row', app),
        task = u.el('section', 'task-panel', upper),
        taskhead = u.el('div', 'section-title', task, 'Task'),
        taskbody = u.el('div', 'task-body', task);
      if (ctx.display !== 'hidden') u.el('div', 'task-instruction', taskbody, ctx.instruction);
      u.el('div', 'separator', taskbody);
      u.el(
        'div',
        'task-copy',
        taskbody,
        ctx.display === 'hidden'
          ? 'Number Sequence\nWorkspace ready.\nPreview and Help are optional controls.'
          : 'Click all the numbers from the smallest to the largest.\nEach number is used once.' +
              (ctx.finish ? '' : '\nWhen you have selected them in order, click ' + endLabel + '.'),
      );
      const work = u.el('section', 'workspace-panel', upper);
      const workhead = u.el('div', 'section-title workspace-title', work, 'Workspace');
      const stage = u.el('div', 'stage', work);
      const actions = u.el('section', 'actions-panel', app);
      const actionhead = u.el('div', 'section-title actions-title', actions, 'Actions'),
        titleTools = u.el('div', 'action-title-tools', actionhead);
      const strip = u.el('div', 'action-strip', actions);
      const preview = u.el('button', 'preview-action', strip, 'Preview');
      preview.type = 'button';
      preview.setAttribute('aria-label', 'Preview');
      preview.addEventListener('click', () => env.log('decoy', { label: 'Preview' }));
      const sep = u.el('div', 'action-divider', strip);
      const clear = u.el('button', 'quiet-action clear-action', strip, 'Clear Selection');
      clear.type = 'button';
      clear.addEventListener('click', () => env.log('decoy', { label: 'Clear Selection' }));
      let submit = null;
      const endButton = (parent, cls) => {
        const b = u.el('button', cls, parent, endLabel);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.title = endLabel;
        b.setAttribute('aria-label', endLabel);
        b.addEventListener('click', ctx.submit);
        return b;
      };
      if (!ctx.finish && placement === 'actions') submit = endButton(strip, 'quiet-action submit');
      if (!ctx.finish && placement === 'toolbar') submit = endButton(workhead, 'quiet-action chrome-end toolbar-end');
      const collideOptions = [...new Set(endLabels)].filter(
        (label) => label.trim().toLowerCase() !== endLabel.trim().toLowerCase(),
      );
      if (collideR.bool(0.3) && collideOptions.length) {
        const label = collideR.pick(collideOptions),
          b = u.el('button', 'quiet-action chrome-xtra', titleTools, label);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label, collide: true }));
      }
      const help = u.el('button', 'quiet-action help-action', strip, 'Help');
      help.type = 'button';
      help.addEventListener('click', () => env.log('decoy', { label: 'Help' }));
      const taskbar = u.el('footer', 'taskbar', document.body),
        start = u.el('div', 'start-button', taskbar);
      u.el('span', 'windows-mark', start, '▦');
      u.el('b', '', start, 'Start');
      const tasktab = u.el('div', 'task-tab', taskbar);
      u.el('span', 'task-tab-icon', tasktab, '▣');
      u.el('b', '', tasktab, 'Number Sequence');
      if (!ctx.finish && placement === 'taskbar') submit = endButton(taskbar, 'chrome-end taskbar-end');
      u.el('div', 'clock', taskbar, '10:24 AM');
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
