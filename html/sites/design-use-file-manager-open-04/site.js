// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.panel': (base, S) => function (_c) {
      const { body, ctx, display, lr, rng, util, word } = _c;
      const { K } = S;
      const tips = util.el('aside', 'fm-notes', body);
      if (display === 'panel') {
        const panel = util.el('aside', 'ref-panel', tips);
        const heading = rng.pick(['Your task', 'Instructions', 'To do', 'Goal']);
        util.el('div', 'ref-panel-title', panel, word ? word(lr.pick(K.panel)) : heading);
        util.el('div', 'ref-panel-text', panel, ctx.instruction);
        if (rng.bool(0.5)) body.classList.add('ref-panel-right');
      }
      util.el('h1', '', tips, 'Files');
      util.el('div', 'fm-folder-mark', tips);
      util.el('p', '', tips, 'Organize, view and manage your files and folders.');
      util.el('div', 'fm-rule', tips, '◆');
      util.el('h2', '', tips, 'Tips');
      const list = util.el('ul', '', tips);
      for (const tip of ['Double-click a file to open it.', 'Right-click for more options.',
        'Use Ctrl or Shift to select multiple items.', 'Drag and drop files between folders.',
        'Hover over a folder while dragging to open it automatically.',
        'Use the Back and Up buttons or the breadcrumb to navigate.',
        'You can undo a deletion using the Undo button.']) util.el('li', '', list, tip);
      Object.assign(_c, { list, tips });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      const widgetStage = util.el('div', 'fm-widget-stage', stage);
      S.frameAlign(_c, widgetStage);
      const appTitle = util.el('div', 'fm-app-title', stage);
      util.el('span', 'fm-title-icon', appTitle, '▰');
      util.el('strong', '', appTitle, 'My Files');
      const win = util.el('span', 'fm-window-buttons', appTitle, '−　□　×');
      const menu = util.el('div', 'fm-app-menu', stage, 'File　　Edit　　View　　Go　　Tools　　Help');
      const actions = util.el('div', 'fm-actionbar', stage);
      for (const [icon, label] of [['⬅','Back'],['➜','Forward'],['⬆','Up'],['📁','New Folder'],['✖','Delete'],['▣','Rename'],['↶','Undo']]) {
        const item = util.el('span', 'fm-action', actions);
        util.el('b', '', item, icon);
        util.el('span', '', item, label);
      }
      const views = util.el('span', 'fm-view-actions', actions, '▤　▦　☷');
      // Keep the decorative 2010 window frame ahead of the working explorer widget.
      stage.insertBefore(actions, widgetStage);
      stage.insertBefore(menu, actions);
      stage.insertBefore(appTitle, menu);
      stage.appendChild(widgetStage);
      Object.assign(_c, { actions, appTitle, menu, stage, views, widgetStage, win });
    },
    'frame.end': (base, S) => function (_c) {
      const { submit, widgetStage } = _c;
      return { stage: widgetStage, submit };
    },
  };

  env.site({
    name: 'design-use-file-manager-open-04',
    template: 'site/base',
    design: { parts },
  });
})();
