// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.theme': (base, S) => function (_c) {
      const { ctx } = _c;
      const { ACCENTS, LOW_ACCENTS, LOW_THEME, THEMES } = S;
      const { rng, util, content } = ctx;
      document.body.classList.add('ref-workbench');
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
      root.dataset.theme = name;
      Object.assign(_c, { accent, content, name, rng, root, tr, util });
    },
    'frame.layout': (base, S) => function (_c) {
      const { ctx } = _c;
      const W = window.innerWidth;
      const H = window.innerHeight;
      const roomy = W >= 1260;
      const tall = H >= 700;
      let display = ctx.display || 'header';
      if (display === 'panel' && !roomy) display = 'header';
      if (display === 'toast' && !tall) display = 'header';
      // reset() reuses the body: a previous toast must not shrink later episodes.
      document.body.classList.toggle('ref-has-note', display === 'toast');
      document.body.classList.toggle('ref-has-header-note', display === 'header');
      Object.assign(_c, { H, W, display, roomy, tall });
    },
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const winControls = util.el('div', 'irix-window-controls', header);
      for (const glyph of ['−', '□', '×']) util.el('span', 'irix-window-button', winControls, glyph);
      S.frameBrand(_c, header);
      Object.assign(_c, { header, winControls });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const shelf = util.el('div', 'irix-shelf', body);
      const shelfMain = util.el('div', 'irix-shelf-main', shelf);
      util.el('div', 'irix-toolbar', shelfMain, '⌂       ↥          ▱              ▤         ✂          ▤           ▤\nHome     Up     New Folder     Copy      Cut      Paste      Delete');
      util.el('div', 'irix-preferences', shelfMain, 'Preferences');
      util.el('div', 'irix-sections', shelfMain, '▱   General                    ▣   Storage                    ♟   Sharing');
      const help = util.el('aside', 'wb-help', shelf);
      util.el('div', 'wb-help-title', help, 'Properties');
      util.el('div', 'wb-help-copy', help, '⚙   Preferences\n     Configure file manager settings.\n\nSection:          General\nItems:             3 settings\nModified:          —\nLocation:          —');
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, help });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, display, util } = _c;
      body.classList.toggle('irix-panel', display === 'panel');
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const dock = util.el('nav', 'wb-dock', document.body);
      for (const [icon, title] of [['⌂','Home'], ['✉','Mail'], ['▤','Projects'], ['♟','People'], ['⚙','Preferences']]) {
        const item = util.el('div', `wb-dock-item${title === 'Preferences' ? ' selected' : ''}`, dock);
        util.el('span', 'wb-dock-icon', item, icon);
        util.el('span', '', item, title);
      }
      Object.assign(_c, { dock, stage });
    },
  };

  env.site({
    name: 'design-change-settings-dependent-02',
    template: 'site/base',
    design: { parts },
  });
})();
