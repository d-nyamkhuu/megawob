// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    overlay: (base, S) => function (ctx) {
      const overlay = base(ctx);
      if (ctx.kind === 'banner') {
        const header = document.querySelector('.ref-task');
        if (header) overlay.el.style.top = `${header.getBoundingClientRect().bottom + 1}px`;
      }
      return overlay;
    },
    'frame.header': (base, S) => function (_c) {
      base(_c);
      const brand = _c.header.querySelector('.ref-brand') || _c.util.el('div', 'ref-brand', _c.header);
      brand.textContent = 'Workspace';
    },
    'frame.nav': (base, S) => function (_c) {
      base(_c);
      const nav = _c.header.querySelector('.ref-nav') || _c.util.el('nav', 'ref-nav', _c.header);
      nav.replaceChildren();
      for (const label of ['Projects', 'Documents', 'Search', 'Team', 'Settings']) {
        const link = _c.util.el('a', 'ref-navlink', nav, label);
        link.href = '#';
        link.addEventListener('click', e => { e.preventDefault(); env.log('decoy', { what: 'nav', label }); });
      }
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);

      // Project explorer and details inspector from the reference design.
      const explorer = util.el('aside', 'editor-explorer', body);
      body.insertBefore(explorer, stage);
      const hdr = document.body.querySelector('.ref-task');
      if (hdr) { const ic = util.el('div', 'hdr-icons', hdr); util.el('span', 'hdr-bell', ic); util.el('span', 'hdr-avatar', ic); }
      const inspector = util.el('aside', 'editor-inspector', body);
      for (const panel of Array.from(body.children)) {
        if (panel.classList.contains('ref-panel')) inspector.appendChild(panel);
        if (panel.classList.contains('ref-side')) panel.style.display = 'none';
      }
      const project = util.el('section', 'editor-project', explorer);
      const projectHead = util.el('div', 'editor-panel-head', project);
      util.el('strong', '', projectHead, 'Project Files');
      const tree = util.el('div', 'editor-tree', project);
      const row = (depth, label, type, selected) => {
        const line = util.el('div', `tree-row${selected ? ' is-selected' : ''}`, tree);
        line.style.setProperty('--depth', depth);
        const arrow = util.el('span', 'project-arrow', line);
        if (type === 'folder') {
          const open = depth === 0 || label === 'src' || label === 'services';
          arrow.innerHTML = `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="${open ? 'M4 6l4 4 4-4' : 'M6 4l4 4-4 4'}"/></svg>`;
        }
        const icon = util.el('span', `project-glyph ${type === 'folder' ? 'project-folder' : 'project-file'}`, line);
        icon.innerHTML = type === 'folder'
          ? '<svg viewBox="0 0 24 22" aria-hidden="true"><path fill="currentColor" d="M1 5a2 2 0 0 1 2-2h6l3 3h9a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2z"/><path fill="#079ca4" d="M2 8h20v11H2z" opacity=".55"/></svg>'
          : '<svg viewBox="0 0 22 27" aria-hidden="true"><path d="M3 2h10l6 6v17H3zM13 2v7h6" fill="none" stroke="currentColor" stroke-width="2"/><path d="M6 12h10M6 16h10M6 20h6" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>';
        util.el('span', 'tree-label', line, label);
      };
      row(0, 'task-manager', 'folder');
      row(1, '.git', 'folder');
      row(1, 'assets', 'folder');
      row(1, 'src', 'folder');
      row(2, 'components', 'folder');
      row(2, 'app.js', 'file');
      row(2, 'data.js', 'file');
      row(2, 'helpers.js', 'file', true);
      row(2, 'index.js', 'file');
      row(2, 'storage.js', 'file');
      row(1, 'styles', 'folder');
      row(1, 'tests', 'folder');
      row(1, '.gitignore', 'file');
      row(1, 'package.json', 'file');
      row(1, 'README.md', 'file');
      const props = util.el('section', 'editor-properties', inspector);
      const propHead = util.el('div', 'editor-panel-head', props);
      util.el('strong', '', propHead, 'File Properties');
      const fileHead = util.el('div', 'prop-file', props);
      const fileIcon = util.el('span', 'prop-file-icon', fileHead);
      fileIcon.innerHTML = '<svg viewBox="0 0 30 38" aria-hidden="true"><path d="M3 2h15l9 10v24H3zM18 2v11h9M8 18h14M8 23h14M8 28h9" fill="none" stroke="currentColor" stroke-width="2"/></svg>';
      const fh = util.el('div', '', fileHead);
      util.el('strong', '', fh, 'helpers.js'); util.el('div', 'prop-path', fh, 'src/helpers.js');
      const propList = util.el('div', 'property-list', props);
      for (const [key, value] of [['Type', 'JavaScript File'], ['Size', '1.2 KB'], ['Modified', 'Apr 12, 2015 10:24 AM'], ['Location', '/task-manager/src']]) {
        const item = util.el('div', 'property-row', propList);
        util.el('span', '', item, key); util.el('span', '', item, value);
      }
      const sym = util.el('section', 'editor-sec', inspector);
      util.el('h3', '', sym, 'Symbols');
      for (const s of ['formatDate(date)', 'summarizeTasks(tasks)', 'titleCase(str)']) {
        const li = util.el('div', 'sym-row', sym);
        util.el('i', '', li, 'fx'); util.el('span', '', li, s);
      }
      const det = util.el('section', 'editor-sec', inspector);
      util.el('h3', '', det, 'Details');
      for (const [key, value] of [['Encoding', 'UTF-8'], ['Line Endings', 'LF'], ['Language', 'JavaScript'], ['Indentation', '2 spaces']]) {
        const item = util.el('div', 'property-row det-row', det);
        util.el('span', '', item, key); util.el('span', '', item, value);
      }
      Object.assign(_c, { explorer, project, projectHead, propHead, propList, props, row, stage, tree });
    },
    'frame.footer': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, label, lr, placement, rng, util, word } = _c;
      let { submit } = _c;
      {
        const foot = util.el('footer', 'ref-foot', document.body);
        const footText = rng.pick(['© 2024 Example Co.', 'All changes are saved automatically.',
          'Need help? Contact your administrator.', 'v4.2.1 · Status: all systems normal']);
        util.el('span', 'ref-foot-text', foot, word ? lr.pick([`© 2024 Example Co. ${word('footRights')}`,
          word('footSaved'), word('footHelp'), `v4.2.1 · ${word('footStatus')}`]) : footText);
        const dock = util.el('nav', 'editor-dock', foot);
        util.el('div', 'editor-live-status', dock);
        util.el('span', 'dock-item dock-settings', dock, 'INS');
        const tools = util.el('div', 'ref-tools', foot);
        if (decoys.length > 1) decoyBtn(tools, decoys[1]);
        if (collide && collide.where === 'footer') decoyBtn(tools, collide.text, true);
        if (placement === 'footer') submit = endBtn(tools, 'ref-submit', label);
        if (placement === 'link') submit = endBtn(tools, 'ref-endlink', `${label} ›`);
      }
      Object.assign(_c, { submit });
    },
    'frame.floating': (base, S) => function (_c) {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) document.body.querySelector('.ref-foot').appendChild(dock);
    },
  };

  env.site({
    name: 'design-use-text-editor-multicursor-05',
    template: 'site/base',
    design: { parts },
  });
})();
