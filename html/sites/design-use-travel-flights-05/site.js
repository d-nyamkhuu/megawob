// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  env.site({
    name: 'design-use-travel-flights-05',
    template: 'site/base',
    design: {
      parts: {
        'frame.header': (base) => (_c) => {
          base(_c);
          const {util, header} = _c;
          const bar = util.el('div', 'sky-masthead', header);
          const brand = util.el('div', 'sky-brand', bar);
          brand.innerHTML = '<svg viewBox="0 0 40 32" aria-hidden="true"><path fill="currentColor" d="m2 17 10 1 8-5L11 4l4-2 13 8 8-4c6-2 8 2 2 6L26 19l-5 12-4 1 2-10-6 3-4-4-7-1Z"/></svg><b>SkyWay</b>';
          const nav = util.el('nav', 'sky-navigation', bar);
          for (const name of ['Flights','Hotels','Cars','Packages','My Trips']) util.el('span', name === 'Flights' ? 'active' : '', nav, name);
        },
        'frame.tools': (base) => (_c) => {
          base(_c);
          const account = _c.util.el('div', 'sky-account', _c.headerTools);
          account.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10" cy="10" r="7"/><path d="m15 15 6 6"/></svg><span>Help</span><b>JD</b><span class="sky-account-down">⌄</span>';
          _c.headerTools.prepend(account);
        },
      },
    },
  });
})();
