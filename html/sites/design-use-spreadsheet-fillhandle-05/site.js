// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const art = {
    project: '<path d="M6 2h20l6 7v28H6z" fill="url(#paper)" stroke="#3a7dc4" stroke-width="1.5"/><path d="M26 2v8h6M10 17h18M10 23h18M10 29h18M16 14v20M23 14v20" fill="none" stroke="#76ace2"/><path d="M9 5h14v8H9zM10 25h5v5h-5zM18 18h5v5h-5z" fill="url(#blue)"/>',
    sheet: '<path d="M6 2h19l6 6v29H6z" fill="url(#paper)" stroke="#35844b" stroke-width="1.5"/><path d="M25 2v7h6" fill="#bce5a5" stroke="#35844b"/><path d="M8 5h15v9H8z" fill="url(#green)"/><path d="M8 18h20M8 24h20M8 30h20M14 16v18M21 16v18" stroke="#5b9a65" stroke-width="1.2"/>',
    home: '<path d="M2 19L19 3l17 16-4 3-3-3v18H9V19l-3 3z" fill="url(#silver)" stroke="#536d81" stroke-width="2"/><path d="M15 25h8v12h-8z" fill="#7899b4"/><path d="M15 12h8v8h-8z" fill="#c6eafa" stroke="#60809a"/><path d="M27 5h4v10" fill="#c6dae8" stroke="#536d81"/>',
    contacts: '<circle cx="19" cy="10" r="6" fill="url(#blue)" stroke="#386795"/><circle cx="7" cy="14" r="5" fill="url(#blue)" stroke="#386795"/><circle cx="31" cy="14" r="5" fill="url(#blue)" stroke="#386795"/><path d="M1 33v-8c0-10 13-10 13 0v8zM24 33v-8c0-10 13-10 13 0v8z" fill="url(#blue)" stroke="#386795"/><path d="M10 37V24c0-13 18-13 18 0v13z" fill="url(#blue)" stroke="#386795"/>',
    calendar: '<rect x="4" y="6" width="30" height="31" rx="2" fill="url(#paper)" stroke="#386795" stroke-width="2"/><path d="M4 16h30V6H4z" fill="url(#blue)" stroke="#386795"/><path d="M11 2v9M27 2v9" stroke="#355a7b" stroke-width="3" stroke-linecap="round"/><path d="M10 21h4m5 0h4m5 0h2M10 27h4m5 0h4m5 0h2M10 33h4m5 0h4" stroke="#609bda" stroke-width="3"/>',
    document: '<path d="M7 2h19l7 8v27H7z" fill="url(#paper)" stroke="#326bb4" stroke-width="2"/><path d="M25 2v10h8M11 16h17m-17 5h17m-17 5h17m-17 5h17" fill="none" stroke="#6596c7" stroke-width="1.4"/>',
    reports: '<path d="M3 4v33h33" fill="none" stroke="#6084a3"/><path d="M7 20h6v16H7z" fill="url(#blue)" stroke="#386795"/><path d="M17 11h6v25h-6z" fill="url(#orange)" stroke="#b66d36"/><path d="M27 6h6v30h-6z" fill="url(#blue)" stroke="#386795"/>',
    print: '<path d="M11 3h17v12H11z" fill="url(#paper)" stroke="#5c6d7e"/><rect x="4" y="13" width="31" height="17" rx="4" fill="url(#silver)" stroke="#5c6d7e"/><path d="M10 24h20v12H10z" fill="url(#paper)" stroke="#5c6d7e"/><path d="M14 28h12m-12 4h12" stroke="#6f8092"/><circle cx="29" cy="18" r="1.4" fill="#72a548"/>',
    share: '<path d="M7 2h17l7 7v25H7z" fill="url(#paper)" stroke="#4678b2"/><path d="M24 2v8h7M11 14h12m-12 5h12m-12 5h8" fill="none" stroke="#8aa8c5"/><path d="M27 24v14m-7-7h14" stroke="#2468b5" stroke-width="3"/>',
    alignleft: '<path d="M6 9h25M6 15h17M6 21h25M6 27h17" stroke="#344859" stroke-width="2.5"/>',
    aligncenter: '<path d="M6 9h25M10 15h17M6 21h25M10 27h17" stroke="#344859" stroke-width="2.5"/>',
    alignright: '<path d="M6 9h25M14 15h17M6 21h25M14 27h17" stroke="#344859" stroke-width="2.5"/>',
    paint: '<path d="M9 22L25 5l5 5-16 17z" fill="url(#blue)" stroke="#245d9b"/><path d="M9 20l8 8-6 9-9-8z" fill="#acd842" stroke="#467eb0"/><path d="M21 7l5 5" stroke="white" stroke-width="2"/>',
    bucket: '<path d="M9 5l15 15-11 12L1 20z" fill="url(#paper)" stroke="#406c9a"/><path d="M7 3l13 13M4 36h27" stroke="#6684a2" stroke-width="3"/><path d="M28 18q-7 9 0 9t0-9" fill="#3b8cda"/>',
    table: '<path d="M4 4h29v30H4zM4 11h29M4 19h29M4 26h29M13 4v30M23 4v30" fill="none" stroke="#47637f" stroke-width="1.5"/>'
  };
  function drawIcon(util, parent, type, cls = '') {
    const span = util.el('span', `app-icon ${cls}`, parent);
    span.innerHTML = '<svg viewBox="0 0 40 40" aria-hidden="true"><defs><linearGradient id="paper" x2="0" y2="1"><stop stop-color="#fff"/><stop offset="1" stop-color="#dcecf9"/></linearGradient><linearGradient id="green" x2="0" y2="1"><stop stop-color="#b5e984"/><stop offset=".5" stop-color="#70bc4c"/><stop offset="1" stop-color="#4c9c37"/></linearGradient><linearGradient id="blue" x2="0" y2="1"><stop stop-color="#b4dcff"/><stop offset=".5" stop-color="#75abe3"/><stop offset="1" stop-color="#357cbd"/></linearGradient><linearGradient id="silver" x2="0" y2="1"><stop stop-color="#f7fbff"/><stop offset=".5" stop-color="#c3d5e4"/><stop offset="1" stop-color="#91abc0"/></linearGradient><linearGradient id="orange" x2="0" y2="1"><stop stop-color="#f8d298"/><stop offset="1" stop-color="#cf7136"/></linearGradient></defs><g' + (type === 'sheet' || type === 'project' ? ' transform="translate(-5 -1) scale(1.3 1.08)"' : '') + '>' + art[type] + '</g></svg>';
    return span;
  }

  const parts = {
    'frame.placement': (base) => function (_c) {
      base(_c);
      _c.originalWantFooter = _c.wantFooter;
      const r = _c.rng.fork('workbook/end');
      _c.placement = _c.ctx.finish ? null : r.pick(['footer', 'footer', 'footer', 'header', 'icon', 'link']);
      if (r.bool(.5) && !_c.word) _c.label = 'OK';
      if (_c.collide && _c.collide.text === _c.label) _c.collide.text = _c.label === 'Continue' ? 'Done' : 'Continue';
      _c.wantFooter = _c.placement === 'footer' || _c.placement === 'link';
    },
    'frame.header': (base, S) => function (_c) {
      const { content, ctx, display, local, nav, rng, util } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      if (display === 'header') header.classList.add('has-instruction');
      if (display === 'panel') header.classList.add('has-panel');
      // Preserve the original seeded frame draws while presenting this design's workbook tabs.
      S.frameBrand(_c, header);
      if (nav) local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
      const left = util.el('div', 'app-sidehead', header);
      util.el('strong', 'app-project-label', left, 'Projects');
      const newProject = util.el('button', 'app-new-project', left, 'New Project');
      newProject.type = 'button';
      const rightHead = util.el('div', 'app-righthead', header);
      const titleRow = util.el('div', 'app-titlerow', rightHead);
      const title = util.el('div', 'app-title-area', titleRow);
      drawIcon(util, title, 'sheet');
      util.el('span', '', title, 'Q3 Marketing Plan');
      const actions = util.el('div', 'app-head-actions', titleRow);
      const print = util.el('span', 'app-head-action', actions);
      drawIcon(util, print, 'print'); util.el('span', '', print, 'Print');
      const share = util.el('span', 'app-head-action', actions);
      drawIcon(util, share, 'share'); util.el('span', '', share, 'Share　⌄');
      if (display === 'header') util.el('div', 'ref-instruction', rightHead, ctx.instruction);
      const ribbon = util.el('div', 'app-ribbon', rightHead);
      for (const [text, cls] of [['Trebuchet MS　⌄','font'],['10　⌄','size'],['B','bold'],['I','italic'],['U','underline'],['alignleft','tool'],['aligncenter','tool selected'],['alignright','tool'],['paint','tool'],['bucket','tool'],['table','tool'],['%','tool'],['.0','tool'],['.00','tool'],['reports','tool'],['Σ　⌄','tool']]) {
        const item = util.el('span', `app-ribbon-item ${cls}`, ribbon);
        if (art[text]) drawIcon(util, item, text); else item.textContent = text;
      }
      Object.assign(_c, { header, hero: header, tabs: left, ribbon });
    },
    'frame.tools': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, hero, label, placement, util, wantFooter } = _c;
      let submit = null;
      const headerTools = util.el('div', 'ref-tools', _c.ribbon);
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      Object.assign(_c, { headerTools, submit });
      if (headerTools.childElementCount) _c.ribbon.classList.add('has-tools');
    },
    'frame.nav': (base, S) => function (_c) {
    },
    'frame.instruction': (base, S) => function (_c) {
    },
    'frame.body': (base, S) => function (_c) {
      const { content, local, rng, util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      S.frameSidebar(_c, body);
      body.style.setProperty('--chrome-height', _c.header.getBoundingClientRect().height + 'px');
      const side = util.el('aside', 'app-projects', body);
      util.el('div', 'app-search', side, 'Search projects...');
      const list = util.el('div', 'app-list', side);
      const listHead = util.el('div', 'app-list-head', list);
      util.el('span', '', listHead, 'Name'); util.el('span', '', listHead, 'Modified ⌄');
      const rows = [['Q3 Marketing Plan','Aug 14, 2005'],['Product Launch','Aug 10, 2005'],['Website Redesign','Aug 2, 2005'],['Customer Survey','Jul 28, 2005'],['Budget 2006','Jul 14, 2005'],['Sales Forecast','Jul 1, 2005'],['Event Planning','Jun 18, 2005'],['Market Research','Jun 5, 2005'],['Training Plan','May 27, 2005'],['Office Move','May 12, 2005'],['Vendor List','Apr 30, 2005'],['Team Goals','Apr 18, 2005'],['Expense Tracking','Apr 3, 2005'],['Q2 Review','Mar 20, 2005'],['Product Ideas','Mar 8, 2005'],['Holiday Campaign','Feb 25, 2005'],['IT Upgrade','Feb 11, 2005'],['Facilities Plan','Jan 30, 2005']];
      for (const [i, row] of rows.entries()) { const item = util.el('div', `app-project-row${i === 0 ? ' active' : ''}`, list); drawIcon(util, item, 'sheet', 'app-sheet-icon'); util.el('span', 'app-project-name', item, row[0]); util.el('span', 'app-project-date', item, row[1]); }
      const rail = util.el('div', 'app-scrollrail', side); util.el('span', '', rail, '');
      const stage = util.el('main', 'ref-stage', body);
      Object.assign(_c, { body, stage });
    },
    'frame.panel': (base) => function (_c) {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) {
        const title = panel.querySelector('.ref-panel-title');
        title.textContent = '';
        drawIcon(_c.util, title, 'document');
        _c.util.el('strong', '', title, 'Task Note');
        const close = _c.util.el('button', 'app-note-close', title, '×');
        close.type = 'button'; close.title = _c.closeLabel; close.setAttribute('aria-label', _c.closeLabel);
        close.addEventListener('click', () => { panel.style.visibility = 'hidden'; env.log('note-close'); });
      }
    },
    'frame.stage': (base, S) => function (_c) { S.frameAlign(_c, _c.stage); },
    'frame.footer': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, label, placement, rng, util, wantFooter, lr, word } = _c;
      let { submit } = _c;
      if (_c.originalWantFooter) {
        rng.pick(['© 2024 Example Co.', 'All changes are saved automatically.', 'Need help? Contact your administrator.', 'v4.2.1 · Status: all systems normal']);
        if (word) lr.pick([`© 2024 Example Co. ${word('footRights')}`, word('footSaved'), word('footHelp'), `v4.2.1 · ${word('footStatus')}`]);
      }
      if (wantFooter) {
        const strip = util.el('div', 'app-completion', document.body);
        const tools = util.el('div', 'ref-tools app-footer-tools', strip);
        if (decoys.length > 1) decoyBtn(tools, decoys[1]);
        if (collide && collide.where === 'footer') decoyBtn(tools, collide.text, true);
        if (placement === 'footer') submit = endBtn(tools, 'ref-submit', label);
        if (placement === 'link') submit = endBtn(tools, 'ref-endlink', `${label} ›`);
      }
      const dock = util.el('footer', 'app-dock', document.body);
      for (const [icon, name, active] of [['home','Home',false],['project','Projects',true],['contacts','Contacts',false],['calendar','Calendar',false],['document','Documents',false],['reports','Reports',false]]) {
        const item = util.el('div', `app-dock-item${active ? ' active' : ''}`, dock); drawIcon(util,item,icon); util.el('span','',item,name);
      }
      Object.assign(_c, { submit });
    },
  };

  env.site({
    name: 'design-use-spreadsheet-fillhandle-05',
    template: 'site/base',
    design: { parts },
  });
})();
