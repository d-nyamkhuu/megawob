// Design on templates/site/ui-click-hover-menu-01.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: "design-click-control-row-reveal-05",
    styles: ['site.css'],
    template: 'site/click-control-hover-menu-01',
    design: {
      cfg: {"title": "Northwind\nExtranet", "theme": "news", "layout": "dock", "tools": "File    Edit    View    Documents    Tools    Help", "foot": "Task List|Status|Notes|Actions"},
      parts: {
        'frame.5': (base) => function (_c) {
          base(_c);
          const { title, u } = _c;
          title.textContent = '';
          const globe = u.el('span', 'nw-globe', title);
          globe.innerHTML = '<svg viewBox="0 0 64 50" aria-hidden="true"><ellipse cx="32" cy="25" rx="29" ry="22" fill="#8ab4d5"/><g fill="none" stroke="#244e78" stroke-width="1.7"><ellipse cx="32" cy="25" rx="29" ry="22"/><ellipse cx="32" cy="25" rx="15" ry="22"/><path d="M32 3v44M3 25h58M8 12q24 11 48 0M8 38q24-11 48 0"/></g></svg>';
          u.el('strong', '', title, 'Northwind');
          u.el('small', '', title, 'Extranet');
        },
        'frame.7': (base) => function (_c) {
          base(_c);
          const { head, u } = _c;
          const tools = head.querySelector('.tools');
          tools.textContent = '';
          const tabs = u.el('nav', 'nw-tabs', tools);
          ['Home', 'Projects', 'Documents', 'Team', 'Reports', 'Support'].forEach(label => {
            const tab = u.el('span', label === 'Documents' ? 'nw-tab active' : 'nw-tab', tabs, label);
          });
          u.el('div', 'nw-partners', head, 'Partners　 |　 Projects　 |　 Resources');
          u.el('div', 'nw-account', head, 'My Profile　 |　 Help　 |　 Log Out');
          const search = u.el('div', 'nw-search', head);
          const field = u.el('input', '', search);
          field.placeholder = 'Search files...';
          field.setAttribute('aria-label', 'Search files');
          const go = u.el('button', '', search, 'Go');
          go.type = 'button';
        },
        'frame.22': (base, S) => function (_c) {
          const { center, ctx, note, head, shell } = _c;
          shell.dataset.instruction = ctx.display;
          if (ctx.display === 'header') head.appendChild(note);
          else if (ctx.display === 'panel' || ctx.display === 'toast') center.appendChild(note);
        },
        'frame.37': (base) => function (_c) {
          const { shell, statusbar, u, note, ctx, foot } = _c;
          statusbar.querySelectorAll('span').forEach(el => el.style.display = 'none');
          u.el('div', 'nw-confidential', statusbar, 'Northwind Extranet　 |　 Confidential');
          u.el('div', 'nw-copyright', statusbar, '© 1999 Northwind Traders　　All rights reserved.');
          shell.style.setProperty('--note-height', note.hidden ? '0px' : note.getBoundingClientRect().height + 'px');
          foot.classList.toggle('nw-empty', !foot.querySelector('.submit, .xtra-task'));
          return base(_c);
        },
        'overlay.7': (base) => function (_c) {
          const { ctx, el, dismiss } = _c;
          if (ctx.kind === 'cookie') {
            el.classList.add('nw-consent');
            el.querySelector('strong').textContent = 'We use cookies';
            el.querySelector('p').textContent = 'We use cookies to improve your experience, analyse site usage, and show you relevant content.';
            const close = ctx.util.el('button', 'nw-dismiss', el, 'Dismiss');
            close.type = 'button';
            close.addEventListener('click', ctx.dismiss);
          }
          return base(_c);
        },
      },
    },
  });
})();
