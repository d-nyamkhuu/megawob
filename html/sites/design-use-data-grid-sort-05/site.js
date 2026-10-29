// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      // Application navigation; task state stays in the widget.
      const winbar = util.el('div', 'ol-windowbar', header);
      util.el('strong', 'ol-windowtitle', winbar, 'NORTHWIND');
      const menubar = util.el('nav', 'ol-menubar', winbar);
      for (const label of ['Orders', 'Customers', 'Inventory', 'Reporting', 'Settings']) util.el('span', 'ol-menuitem' + (label === 'Orders' ? ' on' : ''), menubar, label);
      const ts = util.el('span', 'ol-topsearch', winbar);
      ts.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dbe5f6" stroke-width="2"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 21 21"/></svg><span>Search...</span>';
      util.el('span', 'ol-bell', winbar).innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8"><path d="M6 17V11a6 6 0 0 1 12 0v6l2 2H4z"/><path d="M10 21h4"/></svg>';
      util.el('span', 'ol-avatar', winbar, 'JD');
      const wincontrols = winbar;
      S.frameBrand(_c, header);
      Object.assign(_c, { header, menubar, winbar, wincontrols });
    },
    'frame.tools': (base, S) => function (_c) {
      base(_c);
      _c.winbar.appendChild(_c.headerTools);
    },
    'frame.toast': (base, S) => function (_c) {
      base(_c);
      const note = document.querySelector('.ref-note');
      if (note) _c.header.appendChild(note);
    },
    overlay: (base, S) => function (ctx) {
      const overlay = base(ctx);
      if (ctx.kind === 'banner') overlay.el.style.setProperty('--nw-banner-top', document.querySelector('.ref-task').getBoundingClientRect().bottom + 'px');
      return overlay;
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const rail = util.el('nav', 'ol-rail', body);
      const rh = util.el('div', 'ol-railhead', rail);
      util.el('span', '', rh, 'Customers');
      util.el('span', 'ol-railnew', rh, '+  New');
      const search = util.el('input', 'ol-railsearch', rail);
      search.placeholder = '⌕  Search customers...';
      search.setAttribute('aria-label', 'Search customers');
      const list = util.el('div', 'ol-raillist', rail);
      for (const [n, c, k] of [['All Customers', '', 129], ['Acme Corp', 'New York, NY', 12], ['Beta Industries', 'San Francisco, CA', 8], ['Cedar Wholesale', 'Chicago, IL', 15], ['Delta Retail', 'Austin, TX', 11], ['Evergreen Supply', 'Seattle, WA', 14], ['Forge & Co', 'Boston, MA', 9], ['Global Mart', 'Atlanta, GA', 13], ['Harbor Goods', 'Portland, OR', 8], ['Ion Systems', 'Dallas, TX', 10], ['Jasper Traders', 'Denver, CO', 7], ['Keen Electronics', 'San Jose, CA', 11]]) {
        const item = util.el('div', `ol-railitem${k === 129 ? ' active' : ''}`, list);
        const t = util.el('span', 'ol-raillabel', item);
        util.el('b', '', t, n);
        if (c) util.el('i', '', t, c);
        util.el('span', 'ol-railicon', item, String(k));
      }
      search.addEventListener('input', () => {
        for (const item of list.children) item.hidden = !item.textContent.toLowerCase().includes(search.value.toLowerCase());
      });
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, rail });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      Object.assign(_c, { stage });
    },
  };

  env.site({
    name: 'design-use-data-grid-sort-05',
    template: 'site/base',
    design: { parts },
  });
})();
