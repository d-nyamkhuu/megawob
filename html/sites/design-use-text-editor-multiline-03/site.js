// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { rng, util } = _c;
      const { TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      header.classList.add('vs-titlebar');
      {
        rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, 'CodeLab');
        brand.dataset.role = 'brand';
      }
      const winTools = util.el('div', 'cl-window-tools', header);
      for (const icon of ['⌕', '⚙', '−', '□', '×']) util.el('span', 'cl-window-icon', winTools, icon);
      Object.assign(_c, { header, winTools });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body vs-workspace', document.body);
      const activity = util.el('aside', 'vs-activity', body);
      for (const icon of ['▣', '⌕', '⑂', '▷', '▦']) util.el('div', 'vs-activity-icon', activity, icon);
      util.el('div', 'vs-activity-settings', activity, '⚙');
      const explorer = util.el('aside', 'vs-explorer', body);
      util.el('div', 'vs-explorer-heading', explorer, 'EXPLORER');
      util.el('div', 'vs-tree-root', explorer, '⌄　▰　ProjectSite');
      const tree = util.el('div', 'vs-tree', explorer);
      for (const [depth, icon, label, cls] of [
        [1,'⌄　▰','assets',''], [2,'›　▰','css',''], [2,'›　▰','images',''], [2,'⌄　▰','js',''],
        [3,'　JS','app.js','selected'], [3,'　JS','gallery.js',''], [3,'　JS','utils.js',''], [1,'›　▰','views',''],
        [1,'‹　','index.html',''], [1,'ⓘ　','README.md',''], [1,'{}　','package.json','']
      ]) { const row = util.el('div', `vs-tree-row ${cls}`, tree, `${icon}　${label}`); row.style.setProperty('--depth', depth); }
      util.el('div', 'vs-section', explorer, '⌄　OUTLINE');
      util.el('div', 'vs-section', explorer, '⌄　FILES');
      const stats = util.el('div', 'vs-stats', explorer);
      for (const [k,v] of [['Total Files','8'],['HTML','1'],['CSS','1'],['JavaScript','3'],['Images','2'],['Other','1']]) {
        const row = util.el('div', 'vs-stat', stats); util.el('span','',row,k); util.el('span','',row,v);
      }
      S.frameSidebar(_c, body);
      Object.assign(_c, { activity, body, explorer, stats, tree });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, header, util } = _c;
      const editor = util.el('section', 'vs-editor', body);
      const tab = util.el('div', 'vs-tab', editor);
      util.el('span','vs-js-icon',tab,'PY');
      util.el('span','',tab,'calculator.py');
      util.el('span','vs-tab-close',tab,'×');
      const stage = util.el('main', 'ref-stage', editor);
      S.frameAlign(_c, stage);
      const band = util.el('div', 'cl-record-band', document.body);
      const record = util.el('div', 'cl-record', band);
      util.el('div', 'cl-file-icon', record, '▤');
      const details = util.el('div', 'cl-record-details', record);
      util.el('div', 'cl-record-name', details, 'calculator.py');
      for (const [k,v] of [['Path','/workspace/calculator.py'],['Language','Python'],['Size','612 bytes'],['Last modified','Apr 24, 2019  10:18 AM']]) {
        const row = util.el('div','cl-record-row',details); util.el('span','',row,k); util.el('b','',row,v);
      }
      const files = util.el('aside', 'cl-project-files', band);
      util.el('h2','',files,'Project Files');
      for (const f of ['calculator.py','math_utils.py','tests.py','README.md']) {
        const row=util.el('div',`cl-file-row${f==='calculator.py'?' active':''}`,files);
        util.el('span','cl-file-glyph',row,'♧'); util.el('span','',row,f);
      }
      const inspector = util.el('aside','cl-inspector',body);
      util.el('h2','',inspector,'File Properties');
      for (const [k,v] of [['Name','calculator.py'],['Path','/workspace/calculator.py'],['Type','Python Source File'],['Size','612 bytes'],['Modified','Apr 24, 2019  10:18 AM']]) {
        const row=util.el('div','cl-property',inspector); util.el('span','',row,k); util.el('b','',row,v);
      }
      util.el('hr','',inspector);
      for (const [k,v] of [['Language','Python'],['Tab Size','4'],['Indentation','Spaces'],['Line Endings','LF (Unix)']]) {
        const row=util.el('div','cl-setting',inspector); util.el('span','',row,k); util.el('b','',row,`${v}　⌄`);
      }
      util.el('hr','',inspector);
      util.el('h2','',inspector,'Statistics');
      for (const [k,v] of [['Lines','19'],['Characters','612'],['Words','58'],['Functions','2']]) {
        const row=util.el('div','cl-property',inspector); util.el('span','',row,k); util.el('b','',row,v);
      }
      band.after(header);
      Object.assign(_c, { band, details, editor, files, inspector, record, stage, tab });
    },
    'frame.floating': (base, S) => function (_c) {
      const { endBtn, header, label, placement, util } = _c;
      let { submit } = _c;
      if (placement === 'floating') {
        // Reserve the control's space so it cannot intercept task clicks or drags.
        // On scrollable pages the dock follows the content, just like a form footer.
        const dock = util.el('div', 'ref-float-dock', document.body);
        submit = endBtn(dock, 'ref-submit ref-float', label);
      }
      const menu = util.el('div', 'vs-menubar', document.body);
      menu.textContent = 'File　 Edit　 Selection　 View　 Go　 Run　 Terminal　 Help';
      header.after(menu);
      Object.assign(_c, { menu, submit });
    },
  };

  env.site({
    name: 'design-use-text-editor-multiline-03',
    template: 'site/base',
    design: { parts },
  });
})();
