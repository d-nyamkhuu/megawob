// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.theme': (base, S) => function (_c) {
      const { ctx } = _c;
      const { ACCENTS, LOW_ACCENTS, THEMES } = S;
      const { rng, util, content } = ctx;
      let name = rng.pick(Object.keys(THEMES));
      const root = document.documentElement;
      let accent = rng.pick(ACCENTS);
      const tr = rng.fork('chrome/theme');
      if (tr.bool(0.08)) {
        name = 'low';
        accent = tr.pick(LOW_ACCENTS);
      }
      for (const [k, v] of Object.entries({ ...THEMES.light, bg: '#c0c0c0', panel: '#c0c0c0', fg: '#000', muted: '#404040', line: '#808080' })) root.style.setProperty(`--${k}`, v);
      root.style.setProperty('--accent', '#000080');
      root.dataset.theme = 'light';
      Object.assign(_c, { accent, content, name, rng, root, tr, util });
    },
    'frame.tools': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, header, label, placement, util, wantFooter } = _c;
      let submit = null;
      const headerTools = util.el('div', 'ref-tools', header);
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      const menu = util.el('div', 'win95-menu', document.body);
      for (const item of ['File', 'Edit', 'View', 'Records', 'Tools', 'Window', 'Help']) {
        util.el('span', 'win95-menu-item', menu, item);
      }
      const categories = util.el('nav', 'win95-categories', document.body);
      for (const [i, item] of ['Departments', 'Cost Centers', 'Employees', 'Vendors', 'System Codes'].entries()) {
        const tab = util.el('span', `win95-category${i === 1 ? ' active' : ''}`, categories, item);
        tab.setAttribute('aria-current', i === 1 ? 'page' : 'false');
      }
      const toolbar = util.el('div', 'win95-toolbar', document.body);
      for (const [icon, label] of [['▯', 'New'], ['📂', 'Open'], ['✕', 'Delete'], ['◀◀', 'First'], ['◀', 'Previous'], ['▶', 'Next'], ['▶▶', 'Last'], ['⌕', 'Find'], ['▤', 'Print']]) {
        const item = util.el('div', `win95-tool${['First', 'Previous', 'Next', 'Last'].includes(label) ? ' muted' : ''}`, toolbar);
        util.el('span', 'win95-tool-icon', item, icon);
        util.el('span', 'win95-tool-label', item, label);
      }
      Object.assign(_c, { categories, headerTools, menu, submit, toolbar });
    },
    'frame.toast': (base, S) => function (_c) {
      const { closeLabel, ctx, display, util } = _c;
      if (display === 'toast') {
        const note = util.el('div', 'ref-note', document.body);
        util.el('div', 'ref-note-text', note, ctx.instruction);
        const x = util.el('button', 'ref-note-x', note, '×');
        x.type = 'button';
        x.setAttribute('aria-label', closeLabel);
        x.addEventListener('click', () => { note.style.visibility = 'hidden'; env.log('note-close'); });
      }
      const help = util.el('section', 'win95-help', document.body);
      const helpCopy = util.el('div', 'win95-help-copy', help);
      util.el('strong', 'win95-help-heading', helpCopy, 'ⓘ  Help');
      util.el('div', '', helpCopy, 'Maintain records in the directory. Select a record and edit its fields on the General tab.');
      util.el('div', '', helpCopy, 'Use Apply to save changes to the current record. Required fields: Cost center and Description.');
      const tips = util.el('div', 'win95-help-tips', help);
      util.el('strong', '', tips, 'Field Tips');
      util.el('div', '', tips, 'Cost center:  4 digits, e.g. 1000');
      util.el('div', '', tips, 'Description:  up to 30 characters');
      util.el('div', '', tips, 'Retry limit:  0 - 99');
      util.el('div', '', tips, 'Status:  Active or Inactive');
      Object.assign(_c, { help, helpCopy, tips });
    },
  };

  env.site({
    name: 'design-use-legacy-app-win95-03',
    template: 'site/base',
    design: { parts },
  });
})();
