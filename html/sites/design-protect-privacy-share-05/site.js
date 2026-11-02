// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const drawings = {
    search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
    help:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 0 1 5 .5c0 2-2.5 2-2.5 4M12 17h.01"/>',
    settings:'<path d="m9 3-1 3-3 1 1 3-2 2 2 2-1 3 3 1 1 3h6l1-3 3-1-1-3 2-2-2-2 1-3-3-1-1-3z"/><circle cx="12" cy="12" r="3"/>',
    apps:'<g fill="currentColor" stroke="none"><circle cx="5" cy="5" r="1.7"/><circle cx="12" cy="5" r="1.7"/><circle cx="19" cy="5" r="1.7"/><circle cx="5" cy="12" r="1.7"/><circle cx="12" cy="12" r="1.7"/><circle cx="19" cy="12" r="1.7"/><circle cx="5" cy="19" r="1.7"/><circle cx="12" cy="19" r="1.7"/><circle cx="19" cy="19" r="1.7"/></g>',
    plus:'<path d="M12 4v16M4 12h16"/>',
    drive:'<rect x="4" y="3" width="16" height="18" rx="2" fill="#07579b" stroke="none"/><path d="m7 13 3-5 3 5h-6Zm3 0h6l-3-5m-6 5 2 3h6l2-3" stroke="white" stroke-width="1.2"/>',
    people:'<circle cx="9" cy="7" r="3"/><path d="M3 20v-3a6 6 0 0 1 12 0v3ZM17 4a3 3 0 0 1 0 6M18 14c3 0 4 2 4 5"/>',
    person:'<circle cx="12" cy="7" r="3"/><path d="M5 20v-2a7 7 0 0 1 14 0v2Z"/>',
    recent:'<circle cx="12" cy="12" r="9"/><path d="M12 6v7l4 2"/>',
    star:'<path d="m12 3 2.8 5.8 6.4.9-4.6 4.5 1.1 6.3L12 17.5l-5.7 3 1.1-6.3-4.6-4.5 6.4-.9Z"/>',
    trash:'<path d="M4 6h16M9 6V3h6v3M7 6v15h10V6M10 9v9M14 9v9"/>',
    cloud:'<path d="M6 19a5 5 0 0 1-1-10 7 7 0 0 1 13-2 6 6 0 0 1 0 12Z"/>',
    folder:'<path d="M2 6a2 2 0 0 1 2-2h5l2 2h9a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2Z" fill="#636f77" stroke="none"/><path d="M2 9h20" stroke="#72818a" stroke-width="1"/>',
    doc:'<path d="M4 1h11l5 5v17H4Z" fill="#2879ff" stroke="none"/><path d="M15 1v5h5" fill="#a7cbff" stroke="none"/><path d="M7 10h10M7 14h10M7 18h7" stroke="white" stroke-width="1.7"/>',
    sheet:'<rect x="2" y="2" width="20" height="20" rx="2" fill="#0ca350" stroke="none"/><path d="M12 5v14M5 12h14" stroke="white"/>',
    pdf:'<path d="M4 1h11l5 5v17H4Z" fill="#eb453b" stroke="none"/><path d="M15 1v5h5" fill="#f6a39e" stroke="none"/><text x="5" y="16" fill="white" stroke="none" font-family="Arial" font-size="6" font-weight="700">PDF</text>',
    edit:'<path d="m4 16 12-12 4 4L8 20l-5 1ZM14 6l4 4"/>',
    file:'<path d="M5 2h10l5 5v15H5ZM15 2v6h5M8 12h8M8 16h6"/>',
    chevron:'<path d="m9 5 7 7-7 7"/>'
  };
  function icon(el, name) { el.innerHTML = '<svg viewBox="'+(name==='doc'?'3 0 18 24':'0 0 24 24')+'" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + drawings[name] + '</svg>'; }

  const parts = {
    'frame.header': (base, S) => function (_c) {
      base(_c);
      const {header,util}= _c;
      const brand=util.el('div','drive-top-brand',header);
      const mark=util.el('span','drive-logo',brand);
      mark.innerHTML='<svg viewBox="0 0 48 48" aria-hidden="true"><path fill="#0f9d58" d="M3 34 20 5h10L13 34Z"/><path fill="#fbbc04" d="m30 5 17 29-6 10-17-29Z"/><path fill="#4285f4" d="M3 34h44l-6 10H9Z"/><path fill="#188038" d="m20 5 10 0-6 10Z"/><path fill="#1967d2" d="m3 34 10 0-4 10Z"/><path fill="#ea8600" d="m41 24 6 10H35Z"/></svg>';
      util.el('span','',brand,'Drive');
      const search=util.el('div','drive-search',header);
      icon(util.el('span','drive-search-icon',search),'search');
      util.el('span','',search,'Search in Drive');
      const utilities=util.el('div','drive-top-utilities',header);
      for(const [name,label] of [['help','Help'],['settings','Settings'],['apps','Google apps']]) {
        const b=util.el('button','drive-icon-button',utilities); b.type='button';b.title=label;icon(b,name);
      }
      util.el('span','drive-account',utilities,'J');
    },
    'frame.body': (base, S) => function (_c) {
      const { content, local, rng, util } = _c;
      const { K } = S;
      const body = util.el('div', 'ref-body', document.body);
      if (true) {
        const side = util.el('aside', 'ref-side', body);
        const create=util.el('div','drive-create',side);icon(util.el('span','drive-navicon',create),'plus');util.el('span','',create,'New');
        local(rng.sample(content.NAV_ITEMS, rng.int(4, 7)), K.nav); // retain the original frame draws
        const folders = [['drive','My Drive'],['people','Shared with me'],['recent','Recent'],['star','Starred'],['trash','Trash']];
        for (const [item, count] of folders) {
          const a = util.el('a', 'ref-sidelink', side);
          icon(util.el('span', 'drive-navicon', a),item);
          util.el('span', '', a, count);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label: item }); });
        }
        util.el('div', 'drive-side-rule', side);
        const summary = util.el('div', 'mac-summary', side);
        const storage=util.el('strong','drive-storage-title',summary);icon(util.el('span','drive-navicon',storage),'cloud');util.el('span','',storage,'Storage');
        util.el('div', '', summary, '24.6 GB of 100 GB used');
        util.el('div', 'mac-meter', summary);
        const under = util.el('div', 'drive-underlay', body);
        util.el('h1', '', under, 'My Drive');
        util.el('div', 'drive-under-sort', under, 'Name　↑');
        for (const [icon,name,type] of [['📁','Engineering','folder'],['📁','Product','folder'],['📁','Research','folder'],['📁','Templates','folder'],['▤','Meeting notes','doc'],['▦','Q2 budget','sheet'],['▤','Production change log','doc'],['PDF','Project plan.pdf','pdf'],['▦','Roadmap','sheet'],['▤','Status update','doc']]) {
          const row = util.el('div', 'drive-file-row', under);
          const mark=util.el('span', `drive-file-icon ${type}`, row);mark.innerHTML='<svg viewBox="'+(type==='doc'?'3 0 18 24':'0 0 24 24')+'" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8">'+drawings[type]+'</svg>';
          util.el('span', 'drive-file-name', row, name);
          if(name==='Production change log'){row.classList.add('drive-file-current');row.dataset.current='true';}
        }
        const detail = util.el('div', 'drive-details', body);
        const title=util.el('div','drive-detail-title',detail);icon(util.el('span','drive-detail-docicon',title),'doc');const tb=util.el('div','',title);util.el('div','drive-detail-docname',tb,'Production change log');util.el('div','drive-detail-sub',tb,'Google Docs');
        const tabs=util.el('div','drive-detail-tabs',detail);util.el('span','active',tabs,'Details');util.el('span','',tabs,'Activity');
        for (const [label,value] of [['Type','Google Docs'],['Size','12 KB'],['Location','My Drive'],['Owner','Jordan Lee'],['Modified','Apr 18, 2024 by Daniel Cho'],['Created','Mar 28, 2024']]) {const row=util.el('div','drive-detail-row',detail);util.el('span','drive-detail-label',row,label);const val=util.el('span','drive-detail-value',row);if(label==='Location')icon(util.el('span','drive-detail-folder',val),'folder');util.el('span','',val,value);}
        util.el('div','drive-detail-section',detail,'Sharing');
        const sharing=util.el('div','drive-sharing-count',detail);icon(util.el('span','drive-navicon',sharing),'person');util.el('span','',sharing,'2 people have access');icon(util.el('span','drive-detail-arrow',sharing),'chevron');
        for(const [initials,name,role] of [['JL','Jordan Lee','Owner'],['DC','Daniel Cho','Can edit']]){const row=util.el('div','drive-person-row',detail);util.el('span','drive-person-avatar '+initials,row,initials);util.el('span','drive-person-name',row,name);util.el('span','drive-person-role',row,role);}
        util.el('div','drive-detail-section',detail,'File activity');
        for(const [name,action,person] of [['edit','Edited 2 days ago','Daniel Cho'],['file','Opened Apr 18, 2024','Maha Rahim']]){const row=util.el('div','drive-activity-row',detail);icon(util.el('span','drive-navicon',row),name);const text=util.el('div','',row);util.el('div','',text,action);util.el('div','',text,person);}
      }
      Object.assign(_c, { body });
    },
    'frame.footer': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, label, lr, placement, rng, util, wantFooter, word } = _c;
      let { submit } = _c;
      if (wantFooter) {
        const foot = util.el('footer', 'ref-foot', document.body);
        const footText = rng.pick(['© 2024 Example Co.', 'All changes are saved automatically.',
          'Need help? Contact your administrator.', 'v4.2.1 · Status: all systems normal']);
        util.el('span', 'ref-foot-text', foot, word ? lr.pick([`© 2024 Example Co. ${word('footRights')}`,
          word('footSaved'), word('footHelp'), `v4.2.1 · ${word('footStatus')}`]) : footText);
        const tools = util.el('div', 'ref-tools', foot);
        if (decoys.length > 1) decoyBtn(tools, decoys[1]);
        if (collide && collide.where === 'footer') decoyBtn(tools, collide.text, true);
        if (placement === 'footer') submit = endBtn(tools, 'ref-submit', label);
        if (placement === 'link') submit = endBtn(tools, 'ref-endlink', `${label} ›`);
      }
      const dock = util.el('nav', 'mac-dock', document.body);
      for (const [icon, text] of [['▤','Documents'],['✉','Mail'],['▦','Calendar'],['♙','Contacts'],['☷','Tasks']]) {
        const item = util.el('span', 'mac-dock-item', dock);
        util.el('b', '', item, icon);
        util.el('span', '', item, text);
      }
      Object.assign(_c, { dock, submit });
    },
  };

  env.site({
    name: 'design-protect-privacy-share-05',
    template: 'site/base',
    design: { parts },
  });
})();
