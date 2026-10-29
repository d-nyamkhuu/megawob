// Design of this site on the click-control/controls template (templates/click-control/controls.js): a file table behind the menu; long menus are compacted and their fly-outs kept inside the page.
env.widget({
  task: 'click-control',
  site: 'design-click-control-menu-06',
  name: 'design',
  split: 'train',
  scenarios: ['menu'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {
    menuLabel: 'Menu',
    decoysBefore: ['Settings', 'Help'],
    decoysAfter: ['Print', 'Exit'],
    parts: {
      menuPrelude: () => (ctx, content) => {
        const { util } = ctx;
        const list=util.el('div','file-table',content);const heading=util.el('div','file-head',list);util.el('span','c-name',heading,'Name');util.el('span','c-size',heading,'Size');util.el('span','c-mod',heading,'Modified');const files=[['Project Plan.doc','56 KB','Apr 12, 1994  10:24 AM'],['Budget.xls','22 KB','Apr 10, 1994  2:15 PM'],['Notes.txt',' 3 KB','Apr  8, 1994   9:03 AM'],['Schedule.doc','41 KB','Apr  6, 1994   4:20 PM']];files.forEach(f=>{const row=util.el('div','file-row',list);const nm=util.el('span','c-name',row);nm.innerHTML='<svg viewBox="0 0 20 26" fill="#fff" stroke="#000" stroke-width="1.4"><path d="M1 1h12l6 6v18H1Z"/><path d="M13 1v6h6M4 10h12M4 13h12M4 16h12M4 19h12M4 22h12" stroke-width="1"/></svg>';util.el('a','',nm,f[0]);util.el('span','c-size',row,f[1]);util.el('span','c-mod',row,f[2]);})
      },
      menuBuilt: () => (ctx, content, wrap, root) => {
        const { spec } = ctx;
      // Keep the root below its trigger; compact long seeded menus before fitting fly-outs.
      function fitPanels(panel) {
        const bounds = content.getBoundingClientRect();
        let rect = panel.getBoundingClientRect();
        if (panel === root && rect.bottom > bounds.bottom - 4) {
          const padding = parseFloat(getComputedStyle(panel).paddingTop) * 2 + 2;
          const rowHeight = Math.floor((bounds.bottom - rect.top - padding - 6) / (spec.tree.length + 4));
          panel.style.setProperty('--menu-row-height', Math.max(18, rowHeight) + 'px');
          rect = panel.getBoundingClientRect();
        }
        if (rect.bottom > bounds.bottom - 4) {
          const shift = Math.min(rect.bottom - bounds.bottom + 4, rect.top - bounds.top - 4);
          panel.style.top = (parseFloat(getComputedStyle(panel).top) - Math.max(0, shift)) + 'px';
        }
        Array.from(panel.children).forEach(row => {
          const sub = Array.from(row.children).find(el => el.classList.contains('uc-mpanel'));
          if (sub) fitPanels(sub);
        });
      }
      fitPanels(root);
      },
    },
  },
});
