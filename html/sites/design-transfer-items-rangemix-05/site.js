// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.layout': (base, S) => function (_c) {
      base(_c);
      document.body.classList.add('kinetic-app');
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const rail = util.el('nav', 'app-rail', body);
      const mark = util.el('div', 'rail-mark', rail);
      mark.innerHTML = '<svg viewBox="0 0 28 28"><path fill="#eff7ff" d="M2 2h11v11H2zM2 15h11v11H2z"/><path fill="#2c67fb" d="M15 2h11v11H15zM15 15h11v11H15z"/></svg>';
      const icons = {
        fields: '<rect x="3" y="4" width="19" height="18"/><path d="M7 9h4m-2-2v11m4-9h5m-3 0v9m-2-3h5"/>',
        runs: '<path d="M6 3l15 9-15 9z"/>',
        shipments: '<path d="M12 2L2 7v12l10 5 10-5V7zM2 7l10 5 10-5M12 12v12M7 4.5l10 5"/>',
        reports: '<path d="M2 15h4v8H2zM10 10h4v13h-4zM18 4h4v19h-4z"/>',
        settings: '<path d="M10 2h4l1 4 3-1 3 3-2 3 3 2-1 4-4 1-1 4h-4l-1-4-4 1-2-3 2-3-2-3 2-3 4 1z"/><circle cx="12" cy="12" r="4"/>'
      };
      for (const [icon, label, active] of [['fields','',true],['runs','Runs',false],['shipments','Shipments',false],['reports','Reports',false],['settings','Settings',false]]) {
        const item = util.el('div', active ? 'rail-item active' : 'rail-item', rail);
        util.el('span', 'rail-icon', item).innerHTML = `<svg viewBox="0 0 26 26" fill="none" stroke="currentColor" stroke-width="2">${icons[icon]}</svg>`;
        if (label) util.el('span', '', item, label);
      }
      S.frameSidebar(_c, body);
      const runPanel = util.el('aside', 'runs-panel', body);
      util.el('div', 'runs-kicker', runPanel, 'RUNS');
      const runTitle = util.el('div', 'runs-title', runPanel);
      util.el('strong', '', runTitle, 'All runs'); util.el('span', '', runTitle, '24 runs');
      const table = util.el('div', 'runs-table', runPanel);
      const head = util.el('div', 'runs-head', table);
      for (const h of ['Run ID','Date ↓','Status','Shipment number']) util.el('span','',head,h);
      const statuses = ['Completed','Completed','Running','Completed','Failed','Completed','Completed','Running','Completed','Completed','Failed','Completed','Completed','Running','Completed'];
      for (let i=0;i<statuses.length;i++) {
        const row=util.el('div','run-row',table);
        util.el('span','',row,`R-${1048-i}`); util.el('span','',row,['Apr 23, 2025','Apr 22, 2025','Apr 20, 2025','Apr 18, 2025','Apr 16, 2025','Apr 14, 2025','Apr 12, 2025','Apr 10, 2025','Apr 8, 2025','Apr 6, 2025','Apr 4, 2025','Apr 2, 2025','Mar 31, 2025','Mar 29, 2025','Mar 27, 2025'][i]);
        util.el('span',`run-status ${statuses[i].toLowerCase()}`,row,statuses[i]); util.el('span','',row,`SHP-${[77821,77817,77803,77796,77788,77773,77761,77750,77741,77728,77714,77703,77691,77684,77671][i]}`);
      }
      Object.assign(_c, { body, rail, runPanel });
    },
    'frame.panel': (base) => function (_c) {
      base(_c);
      const panel = document.querySelector('.ref-panel');
      if (panel && _c.body) _c.body.append(panel);
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      Object.assign(_c, { stage });
    },
    'frame.toast': (base) => function (_c) {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.lastElementChild;
        const row = _c.util.el('div', 'app-notice-row', document.body);
        row.append(note);
      }
    },
    'frame.floating': (base, S) => function (_c) {
      const { endBtn, label, placement, util } = _c;
      let { submit } = _c;
      let dock;
      if (placement === 'floating') {
        // Reserve the control's space so it cannot intercept task clicks or drags.
        // On scrollable pages the dock follows the content, just like a form footer.
        dock = util.el('div', 'ref-float-dock', document.body);
        submit = endBtn(dock, 'ref-submit ref-float', label);
      }
      const appDock = util.el('footer', 'app-dock', document.body);
      const tabs = [];
      const existingTools = document.querySelector('.ref-foot .ref-tools');
      if (existingTools) appDock.append(existingTools);
      if (dock) appDock.append(dock);
      Object.assign(_c, { appDock, existingTools, submit, tabs });
    },
    overlay: (base) => function (ctx) {
      const result = base(ctx);
      if (ctx.kind === 'promo') {
        const box = result.el.querySelector('.ref-ov-box');
        const illustration = ctx.util.el('div', 'promo-illustration', box);
        illustration.innerHTML = '<svg viewBox="0 0 150 150" fill="none"><circle cx="75" cy="75" r="65" fill="#e5f2ff"/><g stroke="#1d4eb8" stroke-width="4" stroke-linejoin="round"><path d="M36 53l76-12 9 66-76 12z" fill="#fff"/><path d="M37 54l44 26 31-37M45 117l24-40m50 29L89 72M54 25l3 12m29-20-2 13m30-6-7 12M24 42l12 5"/></g></svg>';
        const copy = ctx.util.el('div', 'promo-copy', box);
        ctx.util.el('strong', 'promo-title', copy, 'Get product updates');
        copy.append(box.querySelector('.ref-ov-text'));
        const field = ctx.util.el('input', 'promo-email', copy);
        field.type = 'email';
        field.placeholder = 'Your email address';
        field.setAttribute('aria-label', 'Your email address');
        copy.append(box.querySelector('.ref-ov-row'));
        const close = ctx.util.el('button', 'promo-close', box, '×');
        close.type = 'button'; close.setAttribute('aria-label', 'Close');
        close.addEventListener('click', () => ctx.dismiss('close'));
      }
      return result;
    },
  };

  env.site({
    name: 'design-transfer-items-rangemix-05',
    template: 'site/base',
    design: { parts },
  });
})();
