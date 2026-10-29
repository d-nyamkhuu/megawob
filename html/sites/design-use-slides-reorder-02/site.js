// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';


  const THEMES = {
    light: { bg: '#e5eee9', panel: '#f8fbf9', fg: '#163b34', muted: '#526e66', line: '#a9c4b9' },
    dark: { bg: '#e5eee9', panel: '#f8fbf9', fg: '#163b34', muted: '#526e66', line: '#a9c4b9' },
    warm: { bg: '#e5eee9', panel: '#f8fbf9', fg: '#163b34', muted: '#526e66', line: '#a9c4b9' },
  };

  const ACCENTS = ['#275e50', '#275e50', '#275e50', '#275e50', '#275e50', '#275e50'];

  const parts = {
    'frame.panel': (base, S) => function (_c) {
      const { body, ctx, display, label, lr, rng, tall, util, word } = _c;
      const { K } = S;
      if (display === 'panel') {
        const panel = util.el('aside', 'ref-panel', body);
        const heading = rng.pick(['Your task', 'Instructions', 'To do', 'Goal']);
        util.el('div', 'ref-panel-title', panel, word ? word(lr.pick(K.panel)) : heading);
        util.el('div', 'ref-panel-text', panel, ctx.instruction);
        if (rng.bool(0.5)) body.classList.add('ref-panel-right');
      }
      const appRail = util.el('aside', 'app-rail', body);
      util.el('div', 'app-rail-mark', appRail, '▧');
      util.el('div', 'app-rail-brand', appRail, 'ClearPath Office');
      for (const [icon, text] of [['▣','Slides'],['▤','Documents'],['▦','Spreadsheets'],['✉','Mail'],['▦','Calendar'],['♟','Contacts'],['▥','Projects']]) {
        const item = util.el('div', `app-rail-item${text === 'Slides' ? ' active' : ''}`, appRail);
        util.el('span', 'app-rail-icon', item, icon);
        util.el('span', '', item, text);
      }
      const ribbon = util.el('div', 'app-ribbon', body);
      const tabs = util.el('div', 'app-ribbon-tabs', ribbon);
      for (const tab of ['Home', 'Insert', 'Design', 'Transitions', 'Animations', 'Slide Show', 'Review', 'View']) {
        util.el('div', `app-ribbon-tab${tab === 'Home' ? ' active' : ''}`, tabs, tab);
      }
      const tools = util.el('div', 'app-ribbon-tools', ribbon);
      const group = (title, entries, extra = '') => {
        const box = util.el('div', `app-ribbon-group ${extra}`, tools);
        const row = util.el('div', 'app-ribbon-actions', box);
        for (const [glyph, label, tall] of entries) {
          const item = util.el('div', `app-ribbon-action${tall ? ' tall' : ''}`, row);
          util.el('span', 'app-ribbon-glyph', item, glyph);
          util.el('span', 'app-ribbon-label', item, label);
        }
        util.el('div', 'app-ribbon-caption', box, title);
      };
      group('Clipboard', [['▣','Paste',1],['✂','Cut'],['▧','Copy'],['◈','Format Painter',1]]);
      group('Slides', [['▤','New Slide',1],['▦','Layout'],['↶','Reset'],['▾','Section',1]]);
      const font = util.el('div', 'app-ribbon-group app-ribbon-font', tools);
      const fontRow = util.el('div', 'app-ribbon-font-select', font);
      util.el('span', '', fontRow, 'Arial');
      util.el('span', 'app-ribbon-select-arrow', fontRow, '▾');
      util.el('span', 'app-ribbon-size', font, '32  ▾');
      const fontActions = util.el('div', 'app-ribbon-actions app-ribbon-font-actions', font);
      for (const [glyph, label] of [['B','Bold'],['I','Italic'],['U','Underline'],['A','Font colour'],['▰','Highlight']]) {
        const item = util.el('div', 'app-ribbon-action', fontActions);
        util.el('span', 'app-ribbon-glyph', item, glyph); item.title = label;
      }
      util.el('div', 'app-ribbon-caption', font, 'Font');
      group('Paragraph', [['☷','Bullets',1],['≡','Numbering',1],['⇤','Decrease indent'],['⇥','Increase indent'],['↕','Spacing',1]]);
      group('Drawing', [['◇','Shapes',1],['◩','Shape Fill'],['▱','Outline'],['✧','Effects',1]]);
      group('Arrange', [['▣','Arrange',1],['↔','Align'],['▦','Group'],['↻','Rotate',1]]);
      Object.assign(_c, { appRail, font, fontActions, fontRow, group, ribbon, tabs, tools });
    },
  };

  env.site({
    name: 'design-use-slides-reorder-02',
    template: 'site/base',
    design: { THEMES, ACCENTS, parts },
  });
})();
