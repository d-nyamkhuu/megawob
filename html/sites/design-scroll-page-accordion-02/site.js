// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const qtTabs = util.el('nav', 'qt-tabs', header);
      for (const tab of ['ShopMart', 'Products', 'Deals', 'Orders', 'Account', 'Help Center']) {
        util.el('span', tab === 'Help Center' ? 'qt-tab qt-tab-active' : 'qt-tab', qtTabs, tab);
      }
      S.frameBrand(_c, header);
      Object.assign(_c, { header, qtTabs });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const page = util.el('section', 'qt-page', body);
      const webhead = util.el('div', 'qt-webhead', page);
      const content = util.el('div', 'qt-content', page);
      const pageNav = util.el('aside', 'qt-page-nav', content);
      const stage = util.el('main', 'ref-stage', content);
      S.frameAlign(_c, stage);
      util.el('strong', 'qt-webbrand', webhead, 'ShopMart');
      const webnav = util.el('nav', 'qt-webnav', webhead);
      for (const item of ['Shop by Category', "Today's Deals", 'Gift Cards', 'Customer Support']) {
        util.el('span', '', webnav, item);
      }
      const search = util.el('div', 'qt-search', webhead);
      util.el('span', '', search, 'Search Help');
      util.el('button', '', search, 'Search');
      util.el('strong', '', pageNav, 'Help Center');
      for (const item of ['Help Center Home', 'Ordering & Payment', 'Shipping & Delivery', 'Returns & Refunds',
        'Account & Security', 'Product Support', 'Managing Your Orders', 'Promotions & Gift Cards', 'Accessibility', 'Contact Us']) {
        util.el('span', item === 'Help Center Home' ? 'qt-page-selected' : '', pageNav, item);
      }
      const detail = util.el('aside', 'qt-detail', body);
      const panel = body.querySelector('.ref-panel');
      if (panel) detail.append(panel);
      const side = body.querySelector('.ref-side');
      if (side) pageNav.append(side);
      const inspector = util.el('aside', 'qt-inspector', detail);
      util.el('div', 'qt-inspector-title', inspector, 'Page Properties');
      const properties = util.el('div', 'qt-properties', inspector);
      for (const [key, value] of [['Title:', 'Returns & Refunds - ShopMart'], ['URL:', 'https://www.shopmart.com/help'],
        ['Type:', 'Web Page'], ['Size:', '42 KB'], ['Modified:', 'Mar 3, 2002, 10:24 AM']]) {
        const row = util.el('div', 'qt-property', properties);
        util.el('span', '', row, key);
        util.el('span', '', row, value);
      }
      util.el('div', 'qt-inspector-title qt-related-title', inspector, 'Related Links');
      const related = util.el('div', 'qt-related', inspector);
      for (const item of ['Help Center Home', 'Contact Us', 'Shipping Information', 'Track Your Order', 'Return a Gift', 'International Orders']) {
        util.el('a', '', related, item);
      }
      Object.assign(_c, { detail, inspector, pageNav, properties, related, search, stage, webhead, webnav });
    },
    'frame.toast': (base, S) => function (_c) {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.detail.prepend(note);
    },
    'frame.footer': (base, S) => function (_c) {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.header.append(foot);
    },
    'frame.floating': (base, S) => function (_c) {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.headerTools.append(dock);
    },
  };

  env.site({
    name: 'design-scroll-page-accordion-02',
    template: 'site/base',
    design: { parts },
  });
})();
