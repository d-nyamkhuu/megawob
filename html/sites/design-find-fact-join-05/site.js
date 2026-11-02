(function () {
  'use strict';
  env.site({
    name: 'design-find-fact-join-05',
    template: 'site/base',
    styles: ['site.css'],
    design: {
      parts: {
        'frame.header': (_base, S) => (_c) => {
          const { ctx } = _c;
          const u = ctx.util;
          const root = u.el('div', 'nw-shell', document.body);
          const rail = u.el('aside', 'nw-rail', root);
          const brand=u.el('div', 'nw-brand', rail);u.el('span','nw-mark',brand,'⬡');u.el('b','',brand,'Northwind');
          const nav = u.el('nav', 'nw-nav', rail);
          [['▦','Orders'],['♙','Customers'],['⬡','Products'],['▥','Reports'],['⚙','Settings']].forEach((x,i) => {
            const a = u.el('div', i === 0 ? 'nw-navitem active' : 'nw-navitem', nav);
            u.el('span', 'nw-navicon', a, x[0]); u.el('span', '', a, x[1]);
          });
          const backdrop = u.el('div', 'nw-workspace', root);
          const ghost = u.el('div', 'nw-ghost', backdrop);
          const left = u.el('div', 'nw-ghostcol', ghost);
          u.el('h3', '', left, 'Recent Orders');
          const mini = u.el('div', 'nw-minitable', left);
          ['Order ID','O7719','O7718','O7717','O7716','O7715','O7714','O7713','O7712'].forEach((t,i)=>u.el('div', i?'':'head',mini,t));
          u.el('h3', '', left, 'Top Products');
          ['Product','Wireless Mouse','Mechanical Keyboard','USB-C Hub','27” Monitor','Laptop Stand'].forEach((t,i)=>u.el('div',i?'nw-minirow':'nw-minirow head',left,t));
          const stats = u.el('aside', 'nw-stats', ghost);
          function card(title, icon, rows) { const c=u.el('section','nw-stat',stats); const h=u.el('h3','',c);u.el('i','',h,icon);u.el('span','',h,title); rows.forEach((r)=>{const q=u.el('div','nw-statrow',c);u.el('span','',q,r[0]);u.el('b','',q,r[1]);}); }
          card('Orders','🛒',[['Total orders','8'],['Shipped','3'],['Processing','3'],['Delivered','2']]);
          card('Customers','♟',[['Total customers','10'],['Countries','7'],['New this month','2']]);
          card('Revenue','▥',[['Total (USD)','$2,193.90'],['Average order','$274.24']]);
          u.el('div','nw-art',stats);
          root.classList.add(`mode-${_c.display}`);
          const shell = u.el('section','nw-window',backdrop);
          const header = u.el('header','nw-windowhead',shell);
          u.el('h1','',header,'Customer Directory and Orders');
          Object.assign(_c, { header, shell });
        },
        'frame.nav': () => () => {},
        'frame.instruction': (base) => (_c) => {
          base(_c);
          const note = _c.header.querySelector('.ref-instruction');
          if (note) note.classList.add('nw-note');
        },
        'frame.tools': (base) => (_c) => {
          base(_c);
          _c.headerTools.classList.add('nw-controls');
        },
        'frame.body': () => (_c) => {
          _c.body = _c.util.el('div', 'nw-body', _c.shell);
        },
        'frame.stage': (base) => (_c) => {
          base(_c);
          _c.stage.classList.add('nw-stage');
        },
        'frame.toast': (base) => (_c) => {
          base(_c);
          const note = document.body.querySelector('.ref-note');
          if (note) _c.shell.insertBefore(note, _c.body);
        },
        'frame.footer': (base) => (_c) => {
          base(_c);
          const foot = document.body.querySelector('.ref-foot');
          if (foot) { foot.classList.add('nw-foot'); _c.shell.appendChild(foot); }
        },
        'frame.floating': (base) => (_c) => {
          base(_c);
          const dock = document.body.querySelector('.ref-float-dock');
          if (dock) _c.shell.appendChild(dock);
        },
      },
    },
  });
})();
