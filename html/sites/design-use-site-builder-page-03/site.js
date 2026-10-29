// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const titlebar = util.el('div', 'cb-titlebar', header);
      util.el('span', 'cb-sun', titlebar, '✿');
      util.el('strong', 'cb-title', titlebar, 'NetSite Manager');
      const windowControls = util.el('div', 'cb-window-controls', titlebar);
      for (const glyph of ['−', '□', '×']) util.el('span', 'cb-window-control', windowControls, glyph);
      const menu = util.el('nav', 'cb-menu', header);
      for (const item of ['Your Site', 'Explore the Web', 'Business Solutions', 'Help']) {
        const m = util.el('span', 'cb-menu-item', menu, item);
        m.dataset.role = 'nav';
      }
      const search = util.el('form', 'cb-search', menu);
      search.addEventListener('submit', (e) => e.preventDefault());
      util.el('label', '', search, 'Search the Directory:');
      const searchInput = util.el('input', '', search);
      searchInput.type = 'text';
      searchInput.setAttribute('aria-label', 'Search the Directory');
      util.el('button', '', search, 'Go').type = 'button';
      const toolbar = util.el('div', 'cb-toolbar', header);
      for (const [icon, label] of [['▧','New'],['📂','Open'],['🌐','Preview'],['🌐','Publish'],['✂','Cut'],['▤','Copy'],['▣','Paste'],['↶','Undo'],['↷','Redo'],['▤','Page'],['☷','Properties'],['▧','Media']]) {
        const item = util.el('div', 'cb-tool', toolbar);
        util.el('span', 'cb-tool-icon', item, icon);
        util.el('span', 'cb-tool-label', item, label);
      }
      toolbar.appendChild(util.el('span', 'cb-tool-spacer', toolbar));
      S.frameBrand(_c, header);
      Object.assign(_c, { header, menu, search, searchInput, titlebar, toolbar, windowControls });
    },
    'frame.panel': (base, S) => function (_c) {
      const { body, display, rng } = _c;
      let panelHeading = null;
      if (display === 'panel') {
        panelHeading = rng.pick(['Your task', 'Instructions', 'To do', 'Goal']);
        if (rng.bool(0.5)) body.classList.add('ref-panel-right');
      }
      Object.assign(_c, { panelHeading });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, ctx, lr, panelHeading, util, word } = _c;
      const { K } = S;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const index = util.el('aside', 'cb-index', body);
      util.el('div', 'cb-section-title', index, 'Pages');
      const pageList = util.el('div', 'cb-page-list', index);
      for (const [i, name] of ['Home Page','Products','Services','About Us','News','Events','Contact','Support','Privacy Policy','Terms of Use'].entries()) {
        const row = util.el('div', `cb-page-row${i === 0 ? ' selected' : ''}`, pageList);
        util.el('span', 'cb-page-icon', row, '▯');
        util.el('span', '', row, name);
      }
      const details = util.el('section', 'cb-details', index);
      util.el('div', 'cb-section-title', details, 'Page Details');
      const fields = util.el('div', 'cb-detail-fields', details);
      for (const [label, value] of [['Title:','Home Page'],['URL:','/index.html']]) {
        const row = util.el('div', 'cb-detail-row', fields);
        util.el('span', '', row, label);
        const input = util.el('input', '', row);
        input.value = value;
        input.setAttribute('aria-label', label.replace(':',''));
      }
      const status = util.el('div', 'cb-detail-line', fields);
      util.el('span', '', status, 'Status:');
      util.el('strong', 'cb-unpublished', status, 'Unpublished');
      util.el('div', 'cb-detail-line', fields, 'Last Modified:  Apr 14, 1998  10:24 AM');
      util.el('div', 'cb-detail-line', fields, 'Created:  Apr 10, 1998  09:15 AM');
      const publish = util.el('section', 'cb-publish', index);
      util.el('div', 'cb-section-title', publish, 'Publish');
      const publishButton = util.el('button', 'cb-publish-button', publish, 'Publish Changes');
      publishButton.type = 'button';
      publishButton.addEventListener('click', () => {
        const target = [...stage.querySelectorAll('button')].find((button) => button.textContent.trim().toLowerCase() === 'publish changes');
        if (target) target.click();
      });
      if (panelHeading) {
        const panel = util.el('aside', 'ref-panel', index);
        util.el('div', 'ref-panel-title', panel, word ? word(lr.pick(K.panel)) : panelHeading);
        util.el('div', 'ref-panel-text', panel, ctx.instruction);
      }
      Object.assign(_c, { details, fields, index, pageList, publish, publishButton, stage, status });
    },
  };

  env.site({
    name: 'design-use-site-builder-page-03',
    template: 'site/base',
    design: { parts },
  });
})();
