// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';


  const TITLES = ['Relayboard'];

  function icon(util, parent, name) {
    const paths = {
      file: 'M5 2h9l5 5v15H5zM14 2v6h5M8 12h8M8 16h8',
      search: 'M16 16l6 6M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',
      home: 'M2 11 12 2l10 9h-4v11h-5v-7h-4v7H5V11z',
      flow: 'M10 2h4v5h-4zM3 17h5v5H3zM17 17h5v5h-5zM12 7v5M5 17v-5h14v5',
      plug: 'M8 2v7M16 2v7M6 9h12v5a6 6 0 0 1-12 0zM12 20v4',
      data: 'M4 5c0-5 16-5 16 0s-16 5-16 0v14c0 5 16 5 16 0V5M4 10c0 5 16 5 16 0M4 15c0 5 16 5 16 0',
      reports: 'M2 22h21M5 18V11h3v7zM11 18V6h3v12zM17 18V2h3v16z',
      people: 'M9 8a4 4 0 1 0 0-8 4 4 0 0 0 0 8M18 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6M2 23v-7a7 7 0 0 1 14 0v7zM16 13a6 6 0 0 1 7 6v4h-5',
      settings: 'M9.5 1h5l.8 3 2.4 1.4 3-.9 2.5 4.3-2.2 2.1v2.8l2.2 2.1-2.5 4.3-3-.9-2.4 1.4-.8 3h-5l-.8-3-2.4-1.4-3 .9L.3 15l2.2-2.1v-2.8L.3 8l2.5-4.3 3 .9L8.7 4zM16 12a4 4 0 1 0-8 0 4 4 0 0 0 8 0',
    };
    const svg = util.svg('svg', { viewBox:'0 0 24 24', fill:'none', stroke:'currentColor', 'stroke-width':1.8, 'stroke-linejoin':'round', 'stroke-linecap':'round', 'aria-hidden':'true' }, parent);
    util.svg('path', {d: paths[name] || paths.file, 'fill-rule':'evenodd'}, svg);
    if (name === 'data') util.svg('path', {d:'M4 6c0 5 16 5 16 0M4 11c0 5 16 5 16 0M4 16c0 5 16 5 16 0',fill:'none',stroke:'#cce6c4','stroke-width':1.1}, svg);
    return svg;
  }

  const parts = {
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
      const masthead = util.el('div', 'rb-masthead', document.body);
      const logo = util.el('div', 'rb-brand', masthead);
      const mark = util.svg('svg', {viewBox:'0 0 52 48', 'aria-hidden':'true'}, logo);
      util.svg('path', {d:'M12 30 34 12M12 30l30 7', fill:'none', stroke:'#478c37', 'stroke-width':4}, mark);
      for (const [cx,cy,r,fill,stroke] of [[34,12,7,'#b5e783','#4b9a20'],[12,30,7,'#b9e784','#4b9a20'],[42,37,7,'#62bdeb','#247db0']]) util.svg('circle',{cx,cy,r,fill,stroke,'stroke-width':2},mark);
      util.el('strong', '', logo, 'Relayboard');
      const mainNav = util.el('nav', 'rb-main-nav', masthead);
      for (const label of ['Automate','Integrate','Coordinate']) util.el('span', '', mainNav, label);
      const searchBox = util.el('div', 'rb-global-search', masthead);
      icon(util, searchBox, 'search');
      util.el('span', '', searchBox, 'Search workflows, steps or contacts');
      util.el('span', 'rb-help', masthead, 'Help ▾');
      util.el('span', 'rb-account', masthead, 'My Account ▾');
      masthead.appendChild(headerTools);
      document.body.insertBefore(masthead, header);
      const navigation = util.el('nav', 'rb-bottom-nav', document.body);
      for (const [glyph,label] of [['home','Home'],['flow','Workflows'],['plug','Connections'],['data','Data'],['reports','Reports'],['people','People'],['settings','Settings']]) {
        const tab = util.el('div', 'rb-dock-tab' + (label === 'Workflows' ? ' active' : ''), navigation);
        icon(util, tab, glyph); util.el('span', '', tab, label);
      }
      Object.assign(_c, { headerTools, logo, mainNav, mark, masthead, navigation, searchBox, submit });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const records = util.el('aside', 'rb-records', body);
      const recordHead = util.el('div', 'rb-record-head', records);
      util.el('strong', '', recordHead, 'Workflows');
      util.el('button', 'rb-new-workflow', recordHead, 'New Workflow');
      const recordList = util.el('div', 'rb-record-list', records);
      for (const label of ['Patient Intake','Appointment Reminders','Insurance Verification','Lab Results Sync','Referral Management','Discharge Follow-up','Patient Feedback','Monthly Reports','Data Cleanup','Eligibility Check']) {
        const row = util.el('div', 'rb-record-row' + (label === 'Patient Intake' ? ' selected' : ''), recordList);
        icon(util, row, 'file'); util.el('span', '', row, label);
      }
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, recordHead, recordList, records });
    },
  };

  env.site({
    name: 'design-use-workflow-editor-configure-02',
    template: 'site/base',
    design: { TITLES, parts },
  });
})();
