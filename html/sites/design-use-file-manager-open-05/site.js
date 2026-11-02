// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  env.site({
    name: 'design-use-file-manager-open-05',
    template: 'site/base',
    design: {
      parts: {
        'frame.header': (base, S) => (_c) => {
          base(_c);
          const {util} = _c;
          const menu = util.el('div','fm-desktop-menu',document.body);
          const apple = util.el('span','fm-menu-apple',menu);
          apple.innerHTML = '<svg width="22" height="24" viewBox="0 0 26 26" fill="currentColor" aria-hidden="true"><path d="M17.5 12.3c0-2.1 1.7-3.2 1.8-3.3-1-1.5-2.7-1.7-3.2-1.7-1.4-.2-2.8.9-3.5.9-.7 0-1.8-.9-3-.9C7.9 7.3 6.3 8.3 5.5 9.8c-1.7 3-.4 7.5 1.3 10 .8 1.2 1.8 2.4 3.1 2.3 1.2-.1 1.7-.8 3.2-.8s1.9.8 3.2.8 2.2-1.2 3-2.4c1-1.4 1.4-2.8 1.4-2.9-.1 0-3.2-1.2-3.2-4.5zM15 5.7c.7-.9 1.2-2.1 1.1-3.3-1.1.1-2.4.7-3.2 1.6-.7.8-1.3 2-1.2 3.2 1.2.1 2.5-.6 3.3-1.5z"/></svg>';
          for(const text of ['Finder','File','Edit','View','Go','Window','Help']) util.el('span',text==='Finder'?'fm-menu-bold':'',menu,text);
          const status=util.el('div','fm-desktop-status',menu);
          status.innerHTML='<svg width="24" height="22" viewBox="0 0 28 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M2 7q12-10 24 0M6 12q8-7 16 0M10 17q4-4 8 0"/><circle cx="14" cy="21" r="1" fill="currentColor"/></svg><svg width="25" height="23" viewBox="0 0 28 26" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="2" y="3" width="24" height="16" rx="1"/><path d="m14 19-5 5h10z" fill="currentColor"/></svg><svg width="29" height="20" viewBox="0 0 34 22" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="3" width="28" height="16" rx="3"/><path d="M32 8v6"/><rect x="4" y="6" width="22" height="10" fill="currentColor"/></svg>';
          util.el('span','fm-desktop-clock',status,'Mon 10:24 AM');
          status.insertAdjacentHTML('beforeend','<svg width="20" height="20" viewBox="0 0 26 26" fill="none" stroke="currentColor" stroke-width="2"><circle cx="10" cy="10" r="7"/><path d="m15 15 8 8"/></svg><svg width="24" height="22" viewBox="0 0 28 24" stroke="currentColor" stroke-width="2.5"><path d="M8 5h18M8 12h18M8 19h18M2 5h2M2 12h2M2 19h2"/></svg>');
        },
      },
    },
  });
})();
