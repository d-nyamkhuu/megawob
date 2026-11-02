// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { rng, util } = _c;
      const { TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      const title = rng.pick(TITLES);
      const brand = util.el('div', 'ref-brand', header, 'The Daily Chronicle');
      brand.dataset.role = 'brand';
      const nav = util.el('nav', 'news-nav', header);
      for (const [name, active] of [['Home', false], ['Articles', false], ['Documents', true], ['Media', false], ['Contacts', false], ['Settings', false]]) {
        const item = util.el('span', active ? 'news-nav-item active' : 'news-nav-item', nav, name);
        if (active) item.setAttribute('aria-current', 'page');
      }
      const search = util.el('div', 'news-search', header);
      util.el('span', '', search, 'Search documents...'); util.el('b', '', search, '⌕');
      util.el('div', 'news-date', header, 'Tue, Apr 12, 2011');
      Object.assign(_c, { brand, header, title });
    },
    'frame.tools': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, header, label, placement, util, wantFooter } = _c;
      let submit = null;
      const headerTools = util.el('div', 'ref-tools', header);
      const quick = (glyph, label) => {
        const b = util.el('button', 'ref-quick', headerTools, glyph);
        b.type = 'button'; b.title = label; b.setAttribute('aria-label', label);
      };
      quick('⌕', 'Search');
      quick('ⓘ', 'Help');
      quick('⚙', 'Settings');
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      Object.assign(_c, { headerTools, quick, submit });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const side = util.el('aside', 'news-sidebar', body);
      const section = (title) => { const el = util.el('section', 'news-section', side); util.el('h2', '', el, title); return el; };
      const files = section('Documents');
      const newDoc = util.el('button', 'news-new', files, 'New Document'); newDoc.type = 'button';
      const documentIcon = '<svg viewBox="0 0 24 28" aria-hidden="true"><path d="M4 1.5h11l5 5V26H4z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M15 1.5V7h5M7 11h10M7 15h10M7 19h8" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>';
      const tagIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 2h9l11 11-9 9L2 11z" fill="currentColor"/><circle cx="7" cy="7" r="1.5" fill="#fff"/></svg>';
      const publishedIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="3"/><path d="M12 4a8 8 0 0 1 8 8" fill="none" stroke="currentColor" stroke-width="3"/></svg>';
      for (const [name, date, selected] of [['site.js','Apr 12, 2011',true],['styles.css','Apr 11, 2011'],['index.html','Apr 10, 2011'],['about.html','Apr 09, 2011'],['contact.html','Apr 08, 2011']]) {
        const row = util.el('div', selected ? 'news-file selected' : 'news-file', files);
        util.el('span', 'news-file-icon', row).innerHTML = documentIcon; util.el('span', 'news-file-name', row, name); util.el('time', '', row, date);
      }
      const stats = section('Status');
      for (const [name, value, icon] of [['Total Documents','24','◆'],['Edited Today','5','◆'],['In Review','3','◆'],['Published','16','◉']]) {
        const row=util.el('div','news-stat',stats); util.el('span','news-stat-icon',row).innerHTML = name === 'Published' ? publishedIcon : tagIcon; util.el('span','',row,name); util.el('b','',row,value);
      }
      const tags=section('Tags');
      for (const [name,value] of [['All Tags','24'],['news','8'],['sports','6'],['lifestyle','5'],['business','4'],['tech','3']]) {
        const row=util.el('div','news-stat',tags); util.el('span','news-stat-icon',row).innerHTML = name === 'All Tags' ? '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="currentColor"/></svg>' : tagIcon; util.el('span','',row,name); util.el('b','',row,value);
      }
      const taskarea = util.el('section', 'news-taskarea', body);
      const titlebar = util.el('div', 'news-titlebar', taskarea);
      const filetitle = util.el('div', 'news-file-meta', titlebar);
      util.el('h1', '', filetitle, 'site.js');
      util.el('div', 'news-edit-meta', filetitle, 'Last edited Apr 12, 2011 10:24 AM　│　1.2 KB');
      util.el('div', 'news-language', titlebar, 'JavaScript');
      const panes = util.el('div', 'news-panes', taskarea);
      const stage = util.el('main', 'ref-stage', panes);
      S.frameAlign(_c, stage);
      stage.style.alignItems = 'flex-start';
      stage.style.justifyContent = 'flex-start';
      // The companion reading surface mirrors the newspaper document preview.
      const doc = util.el('section', 'ref-document', panes);
      util.el('div', 'ref-doc-head', doc);
      const toolbar = util.el('div', 'ref-doc-toolbar', doc);
      const modes=util.el('div','ref-doc-modes',toolbar);
      for (const [name,active] of [['Editing',true],['Suggesting',false],['Viewing',false]]) util.el('button',active?'ref-doc-mode active':'ref-doc-mode',modes,`${name}${active?'　▾':''}`);
      const format=util.el('div','ref-format-tools',toolbar);
      const fmtSvg = (body) => `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">${body}</svg>`;
      const glyphs = [
        ['B','bold'],['I','italic'],['U','underline'],
        [fmtSvg('<path d="M4 5h16M4 9h12M4 13h16M4 17h12"/>'),'format-icon'],
        [fmtSvg('<path d="M4 5h16M7 9h10M4 13h16M7 17h10"/>'),'format-icon'],
        [fmtSvg('<circle cx="4" cy="6" r="1" fill="currentColor"/><circle cx="4" cy="12" r="1" fill="currentColor"/><circle cx="4" cy="18" r="1" fill="currentColor"/><path d="M9 6h11M9 12h11M9 18h11"/>'),'format-icon'],
        [fmtSvg('<path d="M4 5h2M4 11h2M4 17h2M9 6h11M9 12h11M9 18h11"/>'),'format-icon'],
        [fmtSvg('<path d="M10 14l4-4M8 17H6a4 4 0 0 1 0-8h4M14 7h4a4 4 0 0 1 0 8h-4"/>'),'format-icon'],
        [fmtSvg('<rect x="2" y="3" width="20" height="18"/><circle cx="16" cy="8" r="2" fill="currentColor" stroke="none"/><path d="M3 18l6-6 4 4 3-3 5 5"/>'),'format-icon']
      ];
      for (const [label, cls] of glyphs) { const item=util.el('span',cls,format); if (cls === 'format-icon') item.innerHTML=label; else item.textContent=label; }
      const docBody = util.el('div', 'ref-doc-body', doc);
      const article = util.el('article', 'ref-article', docBody);
      util.el('h1', '', article, 'Site Scripts for The Daily Chronicle');
      util.el('p', '', article, 'This document describes the JavaScript used on The Daily Chronicle website. The scripts handle navigation, search, and other interactive features across the site.');
      util.el('p', '', article, 'The navigation script attaches click handlers to the main menu links and loads the selected page without a full refresh. The search script provides quick access to articles and other content.');
      util.el('p', '', article, 'These scripts help create a faster, more seamless experience for readers while maintaining the newspaper’s clean and simple design.');
      const docFoot = util.el('div', 'ref-doc-foot', doc);
      util.el('span', '', docFoot, 'JavaScript　 ·　 English (US)'); util.el('span', '', docFoot, 'Ln 8, Col 26');
      Object.assign(_c, { article, doc, docBody, docFoot, stage, toolbar, side, taskarea, titlebar, panes });
    },
  };

  env.site({
    name: 'design-use-text-editor-cursor-05',
    template: 'site/base',
    design: { parts },
  });
})();
