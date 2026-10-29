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
      root.style.setProperty('--accent', '#1683e8');
      root.dataset.theme = name;
      Object.assign(_c, { accent, content, name, rng, root, tr, util });
    },
    'frame.layout': (base, S) => function (_c) {
      const { ctx, util } = _c;
      const W = window.innerWidth;
      const H = window.innerHeight;
      // OfficeSuite 2008 window frame and document index.
      const titlebar = util.el('div', 'office-titlebar', document.body);
      util.el('span', 'office-apptitle', titlebar, 'Preferences');
      const windowButtons = util.el('div', 'office-window-buttons', titlebar);
      for (const glyph of ['−', '□', '×']) util.el('span', 'office-window-button', windowButtons, glyph);
      const roomy = W >= 1260;
      const tall = H >= 700;
      let display = ctx.display || 'header';
      if (display === 'panel' && !roomy) display = 'header';
      if (display === 'toast' && !tall) display = 'header';
      // reset() reuses the body: a previous toast must not shrink later episodes.
      document.body.classList.toggle('ref-has-note', display === 'toast');
      Object.assign(_c, { H, W, display, roomy, tall, titlebar, windowButtons });
    },
    'frame.instruction': (base, S) => function (_c) {
      const { ctx, display, header, util } = _c;
      if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
      else util.el('div', 'ref-spacer', header);
      document.body.classList.toggle('office-no-instruction', display === 'hidden');
    },
    'frame.tools': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, display, endBtn, header, label, placement, titlebar, util, wantFooter } = _c;
      let submit = null;
      const headerTools = util.el('div', 'ref-tools', header);
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      if (display === 'hidden') titlebar.appendChild(headerTools);
      Object.assign(_c, { headerTools, submit });
    },
    'frame.body': (base, S) => function (_c) {
      const { content, rng, sidebar, util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      // Preserve the sibling's draws while this design uses contextual help.
      if (sidebar) rng.sample(content.NAV_ITEMS, rng.int(4, 7));
      const side = util.el('aside', 'office-documents', body);
      util.el('h1', 'help-heading', side, 'Settings help');
      util.el('p', 'help-intro', side, 'Use these settings to customize how the app works for you.');
      const tips = util.el('section', 'help-tips', side);
      util.el('h2', '', tips, 'Tips');
      const list = util.el('ul', '', tips);
      ['Use the search field to quickly find a setting.', 'Some settings reveal additional options when enabled.', 'Changes are not saved until you click Save.', 'You can return to these settings any time.'].forEach((t) => util.el('li', '', list, t));
      const common = util.el('section', 'help-common', side);
      util.el('h2', '', common, 'Common settings');
      [['Allow guest access','Lets people explore limited features without an account.'],['Display currency','Controls which currency is used for prices and reports.'],['Allow microphone access','Lets the app use your device’s microphone for calls and recordings.']].forEach(([a,b]) => {
        util.el('strong', '', common, a); util.el('p', '', common, b);
      });
      Object.assign(_c, { body, common, list, side, tips });
    },
  };

  env.site({
    name: 'design-change-settings-mixed-03',
    template: 'site/base',
    design: { parts },
  });
})();
