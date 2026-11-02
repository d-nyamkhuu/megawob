// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.nav': (base) => function (_c) {
      const nav = _c.util.el('nav', 'ref-nav', _c.header);
      for (const label of ['Home', 'Shop ⌄', 'Men ⌄', 'Women ⌄', 'Gear ⌄', 'Sale', 'Help']) {
        const link = _c.util.el('a', 'ref-navlink', nav, label);
        link.href = '#';
        link.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label }); });
      }
      Object.assign(_c, { nav });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const side = util.el('aside', 'help-sidebar', body);
      util.el('h3', '', side, 'Help Topics');
      const topics = [['All Topics',24],['Orders & Shipping',9],['Returns & Refunds',5],['Products & Sizing',4],['Payment & Billing',3],['Account & Privacy',2],['Warranty',2],['Contact Support',2]];
      topics.forEach(([label,count], i) => { const a=util.el('a', `help-topic${i===0?' selected':''}`, side); a.href='#'; a.addEventListener('click',e=>{e.preventDefault();env.log('decoy',{what:'help-topic',label});}); util.el('span','',a,label); util.el('span','topic-count',a,`(${count})`); });
      util.el('h3', 'sidebar-subhead', side, 'Popular Articles');
      ['Track an Order','Return an Item','Shipping Information','Size Guide','Product Care','Gift Cards','Promotions & Discounts','Create an Account'].forEach(label=>{const a=util.el('a','popular-link',side,label);a.href='#';a.addEventListener('click',e=>{e.preventDefault();env.log('decoy',{what:'popular-article',label});});});
      util.el('h3', 'sidebar-subhead', side, 'Need More Help?');
      util.el('p', 'sidebar-copy', side, 'Our support team is happy to assist you with any questions.');
      const contact=util.el('button','contact-button',side,'✉  Contact Us'); contact.type='button';
      Object.assign(_c, { body, side });
    },
  };

  env.site({
    name: 'design-scroll-page-accordion-05',
    template: 'site/base',
    design: { parts },
  });
})();
