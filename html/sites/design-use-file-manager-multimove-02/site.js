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
      // This design uses the fixed oatmeal Motif palette regardless of the scaffold theme draw.
      for (const [k, v] of Object.entries({ bg:'#c8c6c1', panel:'#d6d4cf', fg:'#111827', muted:'#444444', line:'#8d8c89' })) root.style.setProperty(`--${k}`, v);
      root.style.setProperty('--accent', '#4b74a8');
      root.dataset.theme = name;
      Object.assign(_c, { accent, content, name, rng, root, tr, util });
    },
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const frame = util.el('div', 'motif-titlebar', header);
      util.el('span', 'motif-system', frame, '');
      util.el('strong', 'motif-appname', frame, 'Company CD-ROM Library');
      const winbuttons = util.el('div', 'motif-winbuttons', frame);
      util.el('span', 'motif-library-art', winbuttons, '▥　◉');
      const menubar = util.el('div', 'motif-menubar', header);
      for (const item of ['Home', 'Documents', 'Photos', 'Music', 'Reference', 'Tools']) {
        const tab = util.el('span', item === 'Documents' ? 'motif-tab active' : 'motif-tab', menubar, item);
      }
      S.frameBrand(_c, header);
      Object.assign(_c, { frame, header, menubar, winbuttons });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const rail = util.el('aside', 'motif-rail', body);
      util.el('h2', 'motif-index-title', rail, 'Documents Index');
      util.el('div', 'motif-index-art', rail, '▤');
      const index = util.el('div', 'motif-index-table', rail);
      const head = util.el('div', 'motif-index-row motif-index-head', index);
      util.el('span', '', head, 'Name');
      util.el('span', '', head, 'Type');
      for (const [icon, label, type] of [
        ['▰','Annual Reports','Folder'],['▰','Budgets','Folder'],['▰','Correspondence','Folder'],['▰','HR','Folder'],
        ['▰','Marketing','Folder'],['▰','Meeting Notes','Folder'],['▰','Product Info','Folder'],['▰','Projects','Folder'],
        ['▰','Shared drive','Folder'],['▰','Templates','Folder'],['▧','Company Overview.doc','Document'],
        ['▧','Holiday Schedule.xls','Spreadsheet'],['▧','Logo.png','Image'],['▧','Press Release.doc','Document'],
        ['▧','Quarterly Financials.xls','Spreadsheet'],['▤','Readme.txt','Text Document']
      ]) {
        const row = util.el('div', 'motif-index-row', index);
        const nameCell = util.el('span', 'motif-index-name', row);
        util.el('i', icon === '▰' ? 'motif-index-folder' : 'motif-index-file', nameCell);
        util.el('span', '', nameCell, label);
        util.el('span', '', row, type);
      }
      const motContent = util.el('div', 'motif-content', body);
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, head, index, motContent, rail });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, motContent, rail, util } = _c;
      const panel = Array.from(body.children).find(child => child.classList.contains('ref-panel'));
      if (panel) rail.prepend(panel);
      const stage = util.el('main', 'ref-stage', motContent);
      S.frameAlign(_c, stage);
      Object.assign(_c, { stage });
    },
  };

  env.site({
    name: 'design-use-file-manager-multimove-02',
    template: 'site/base',
    design: { parts },
  });
})();
