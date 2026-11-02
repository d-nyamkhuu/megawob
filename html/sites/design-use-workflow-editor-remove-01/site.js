// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.theme': (base, S) => function (_c) {
      const { ctx } = _c;
      const { ACCENTS, LOW_ACCENTS, LOW_THEME, THEMES } = S;
      const { rng, util, content } = ctx;
      let name = rng.pick(Object.keys(THEMES));
      const root = document.documentElement;
      let accent = rng.pick(ACCENTS);
      const tr = rng.fork('chrome/theme');
      if (tr.bool(0.08)) {
        name = 'low';
        accent = tr.pick(LOW_ACCENTS);
      }
      for (const [k, v] of Object.entries(name === 'low' ? LOW_THEME : THEMES[name])) root.style.setProperty(`--${k}`, v);
      root.style.setProperty('--accent', accent);
      // Fixed workstation palette: keep the original draws above for seed stability.
      root.style.setProperty('--bg', '#aeb4c0');
      root.style.setProperty('--panel', '#c4c8d1');
      root.style.setProperty('--fg', '#111626');
      root.style.setProperty('--muted', '#3b4050');
      root.style.setProperty('--line', '#697183');
      root.style.setProperty('--accent', '#6955bd');
      root.dataset.theme = name;
      Object.assign(_c, { accent, content, name, rng, root, tr, util });
    },
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, util, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebar = roomy && rng.bool(0.35);
      const nav = W >= 1180 && rng.bool(0.5);
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      const frame = util.el('div', 'irix-titlebar', document.body);
      util.el('span', 'irix-menu-glyph', frame, '≡');
      util.el('strong', 'irix-title', frame, 'Relayboard  -  Customer Support Flow');
      const win = util.el('div', 'irix-window-controls', frame);
      for (const label of ['−', 'T', '×']) util.el('button', 'irix-winbtn', win, label);
      const menu = util.el('nav', 'irix-menubar', document.body);
      for (const label of ['File', 'Edit', 'View', 'Workflow', 'Node', 'Window', 'Help']) util.el('span', 'irix-menuitem', menu, label);
      const tabs = util.el('nav', 'irix-tabs', document.body);
      for (const [i, label] of ['Workflows', 'Integrations', 'Schedules', 'Monitors', 'Library'].entries()) {
        const tab = util.el('button', i === 0 ? 'irix-tab active' : 'irix-tab', tabs, label);
        tab.type = 'button';
      }
      Object.assign(_c, { collide, cr, decoys, frame, label, menu, nav, placement, sidebar, tabs, wantFooter, win });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);

      // The reference workstation keeps the drawing surface between a tool shelf and a help pane.
      // These are site frame; the workflow itself remains owned by the use-workflow-editor widget.
      const palette = util.el('aside', 'irix-palette', body);
      util.el('div', 'irix-panel-title', palette, 'Step Palette');
      const shelves = [
        ['Communication', [['✉', 'Send Email'], ['▤', 'Send Message'], ['☎', 'Call Webhook']]],
        ['Logic', [['⌘', 'Check Condition'], ['‡', 'Split'], ['⑂', 'Merge']]],
        ['Time', [['◷', 'Wait'], ['▦', 'Schedule']]],
        ['Data', [['▤', 'Read Data'], ['▤', 'Write Data']]],
        ['Utilities', [['▧', 'Add Note'], ['⚙', 'Set Variable']]],
      ];
      for (const [title, items] of shelves) {
        const section = util.el('section', 'irix-shelf', palette);
        util.el('div', 'irix-shelf-title', section, `▾  ${title}`);
        const grid = util.el('div', 'irix-shelf-grid', section);
        for (const [icon, text] of items) {
          const item = util.el('div', 'irix-tool', grid);
          util.el('span', 'irix-tool-icon', item, icon);
          util.el('span', 'irix-tool-label', item, text);
        }
      }
      const help = util.el('aside', 'irix-help', body);
      util.el('div', 'irix-panel-title', help, 'Help & Reference');
      const helpSections = [
        ['Workflow Editor', 'Build automation by dragging steps from the palette onto the canvas and connecting them. Each step has input and output ports. Draw a connection from an output port to an input port to define the flow.'],
        ['Steps', 'Steps perform actions such as sending messages, checking conditions, or storing data. Configure a step by double-clicking it on the canvas.'],
        ['Connections', 'Connections show the direction of data or control flow. Click and drag from an output port to an input port to create a connection.'],
      ];
      for (const [title, copy] of helpSections) {
        const section = util.el('section', 'irix-help-section', help);
        util.el('div', 'irix-help-title', section, `▾  ${title}`);
        util.el('p', 'irix-help-copy', section, copy);
      }
      const tips = util.el('section', 'irix-help-section irix-tips', help);
      util.el('div', 'irix-help-title', tips, '▾  Tips');
      const ul = util.el('ul', 'irix-help-copy', tips);
      for (const tip of ['Use the hand tool to pan around the canvas.', 'Use the mouse wheel to zoom in or out.', 'Arrange steps for clarity.', 'You can delete a step to remove it and its connections.']) util.el('li', '', ul, tip);
      Object.assign(_c, { help, helpSections, palette, shelves, stage, tips, ul });
    },
  };

  env.site({
    name: 'design-use-workflow-editor-remove-01',
    template: 'site/base',
    design: { parts },
  });
})();
