// Design on templates/site/form-text-login-01.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-type-text-sections-05',
    styles: ['site.css'],
    scripts: [],
    template: 'site/type-text-login-01',
    design: {
      parts: {
        'frame.5': (base) => function (c) {
          base(c);
          c.top.classList.add('qt-native-title');
        },
        'frame.6': () => function (c) {
          c.u.el('span', 'qt-native-appicon', c.top, '▦');
          c.u.el('span', 'ds-brand', c.top, 'Company Manager');
        },
        'frame.7': () => function (c) {
          const controls = c.u.el('div', 'qt-native-controls', c.top);
          ['−', '□', '×'].forEach(t => c.u.el('span', '', controls, t));
        },
        'frame.8': () => function (c) {
          const menu = c.u.el('nav', 'qt-native-menu', document.body);
          ['File', 'Edit', 'View', 'Tools', 'Help'].forEach(t => c.u.el('span', '', menu, t));
          c.toolbar = c.u.el('div', 'qt-native-toolbar', document.body);
          const icons = [
            '<path d="M5 2h12l6 6v23H5z" fill="url(#paper)" stroke="#315e93"/><path d="M17 2v7h6" fill="#d5e7fb" stroke="#315e93"/>',
            '<path d="M3 8h10l3 4h13v18H3z" fill="#d2a63e" stroke="#866b29"/><path d="M4 5h10l4 4h9v19H4z" fill="#fff4bd" stroke="#9b7b31"/><path d="M5 13h25l-4 17H2z" fill="url(#folder)" stroke="#91722c"/>',
            '<path d="M5 3h23v28H5z" fill="url(#blue)" stroke="#244f8f"/><path d="M9 10l15 15m0-15L9 25" stroke="white" stroke-width="4"/><path d="M6 3h20l-4 5H10z" fill="#d5e8ff"/>',
            '<path d="M8 2h17v10H8z" fill="url(#paper)" stroke="#315e93"/><path d="M3 12h27v14H3z" fill="#c8cdd3" stroke="#3b485b"/><path d="M8 21h17v11H8z" fill="url(#paper)" stroke="#315e93"/><path d="M11 25h11m-11 3h11" stroke="#456080"/><path d="M25 15h2" stroke="#25854e" stroke-width="2"/>',
            '<path d="M6 6h7v12H5zm14 0h7l1 12h-8z" fill="#64758d" stroke="#152237"/><path d="M5 11h8l2 17H2zm15 0h8l3 17H18z" fill="url(#blue)" stroke="#152237"/><path d="M12 14h9v6h-9z" fill="#313b4a"/><ellipse cx="8" cy="26" rx="6" ry="5" fill="#8ac4f4" stroke="#162b49"/><ellipse cx="25" cy="26" rx="6" ry="5" fill="#8ac4f4" stroke="#162b49"/>'
          ];
          ['New User', 'Open', 'Delete', 'Print', 'Find'].forEach((label, i) => {
            const b = c.u.el('button', 'qt-native-tool', c.toolbar);
            b.type = 'button';
            const icon = c.u.el('span', 'qt-native-icon', b);
            icon.innerHTML = '<svg viewBox="0 0 34 34" aria-hidden="true"><defs><linearGradient id="paper" x2="0" y2="1"><stop stop-color="#fff"/><stop offset="1" stop-color="#d8e8f8"/></linearGradient><linearGradient id="folder" x2="0" y2="1"><stop stop-color="#fff1a5"/><stop offset="1" stop-color="#d5ad45"/></linearGradient><linearGradient id="blue" x2="0" y2="1"><stop stop-color="#739ddb"/><stop offset="1" stop-color="#1956ac"/></linearGradient></defs>' + icons[i] + '</svg>';
            c.u.el('span', '', b, label);
          });
        },
        'frame.13': (base) => function (c) {
          base(c);
          if (c.top.getBoundingClientRect().width <= 1100 && (c.mode === 'left' || c.mode === 'toast')) c.mode = 'top';
        },
        'frame.15': (base) => function (c) {
          base(c);
          const note = c.content.querySelector('.ds-header-note');
          if (note) document.body.insertBefore(note, c.body);
        },
        'frame.27': (base) => function (c) {
          const note = document.querySelector('.ds-header-note');
          document.body.style.setProperty('--banner-top', `${note ? note.getBoundingClientRect().bottom : c.toolbar.getBoundingClientRect().bottom}px`);
          return base(c);
        },
        'frame.26': (base) => function (c) {
          base(c);
          if (c.submit && !c.submit.classList.contains('ds-submit-link')) {
            const group = c.u.el('div', 'qt-native-end', c.toolbar);
            document.querySelectorAll('.ds-pq-header').forEach(n => group.appendChild(n));
            group.appendChild(c.submit);
          }
        },
      },
    },
  });
})();
