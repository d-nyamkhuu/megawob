// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { content, local, rng, util } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      if (true) {
        rng.pick(TITLES);
      }
      if (true) {
        local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
      }
      Object.assign(_c, { header });
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
      const actions = util.el('div', 'studio-actions', header);
      util.el('span', 'studio-search', actions, '⌕');
      util.el('i', '', actions);
      util.el('span', 'studio-avatar', actions, 'JD');
      Object.assign(_c, { actions, headerTools, submit });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const column = util.el('section', 'sheet-content', body);
      const marker = util.el('div', 'sheet-marker', column);
      util.el('b', '', marker, '01'); util.el('strong', '', marker, 'Content');
      const stage = util.el('main', 'ref-stage', column);
      S.frameAlign(_c, stage);
      const help = util.el('aside', 'studio-help', body);
      const panelNote = body.querySelector('.ref-panel');
      if (panelNote) help.appendChild(panelNote);
      const doc = util.el('section', 'paper-editor', column);
      const docHead = util.el('div', 'paper-head', doc, 'Document');
      util.el('span', '', docHead, 'guide.md');
      const bar = util.el('div', 'paper-toolbar', doc);
      util.el('span', 'paragraph', bar, 'Paragraph⌄');
      util.el('span', '', bar, 'B'); util.el('i', '', bar, 'I'); util.el('u', '', bar, 'U');
      const icons = [
        ['Link','M9 15l6-6M7 12l-2 2a4 4 0 005 5l3-3M11 8l3-3a4 4 0 015 5l-2 2'],
        ['Bulleted list','M8 5h12M8 12h12M8 19h12M3 5h1M3 12h1M3 19h1'],
        ['Numbered list','M9 5h11M9 12h11M9 19h11M3 3h1v5M2 11h3l-3 5h3M2 19h3v3H2'],
        ['Align left','M3 5h18M3 10h12M3 15h18M3 20h12'],
        ['Align center','M3 5h18M6 10h12M3 15h18M6 20h12'],
        ['Align right','M3 5h18M9 10h12M3 15h18M9 20h12'],
        ['Image','M3 3h18v18H3zM5 18l5-6 4 4 3-3 3 5M15 8h.1'],
        ['Table','M3 3h18v18H3zM3 9h18M3 15h18M9 3v18M15 3v18'],
      ];
      for (const [label,path] of icons) {
        const icon = util.el('span','paper-tool',bar); icon.title=label;
        icon.innerHTML='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="'+path+'"/></svg>';
      }
      const page = util.el('div', 'paper-copy', doc);
      util.el('h1', '', page, 'Project Guide');
      util.el('p', '', page, 'This project helps people plan and share their travel itineraries. You can visit popular destinations, save places and create custom routes.');
      util.el('p', '', page, 'To get started, visit the Getting Started page and follow the setup steps.');
      util.el('p', '', page, 'The app also lets you visit your saved places offline, and you can share your itinerary with friends.');
      const top = util.el('div', 'inspector-heading', help); util.el('b', '', top, '02'); util.el('strong', '', top, 'Details');
      const fields = util.el('div', 'inspector-fields', help);
      for (const [key, val] of [['Name','routes.js'],['Type','JavaScript File'],['Size','542 bytes'],['Location','/project/routes.js'],['Modified','Apr 12, 2016, 10:24 AM'],['Language','JavaScript'],['Indentation','Spaces (2)'],['Encoding','UTF-8'],['Line endings','LF (Unix)']]) { const row=util.el('div','inspector-row',fields); util.el('span','',row,key); util.el('b','',row,val); }
      util.el('h3','inspector-subhead',help,'Statistics');
      for (const [key,val] of [['Lines','14'],['Words','48'],['Characters','542']]) { const row=util.el('div','inspector-stat',help); util.el('span','',row,key); util.el('b','',row,val); }
      util.el('h3','inspector-subhead',help,'Structure');
      for (const [index, name] of ['routes.js','logVisit(req, res, next)','<anonymous>'].entries()) {
        const row = util.el('div', 'structure-item' + (index ? ' child' : ''), help);
        util.el('span','tree-toggle',row,index ? '▸' : '▾');
        const icon = util.el('span','tree-icon',row);
        icon.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><path d="' + (index ? 'M12 2 3 7v10l9 5 9-5V7zM3 7l9 5 9-5M12 12v10' : 'M5 2h9l5 5v15H5zM14 2v6h5') + '"/></svg>';
        util.el('span','structure-label',row,name);
      }
      Object.assign(_c, { help, panelNote, stage, doc, column });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-use-text-editor-findreplace-05',
    template: 'site/base',
    design: { parts },
  });
})();
