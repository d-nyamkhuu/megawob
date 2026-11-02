// IRIX nl design with its taller rows and toolbar utility controls.
(function () {
  'use strict';
  env.widget({
    task: 'use-email',
    site: 'design-use-email-nl-03',
    name: 'design',
    split: 'train',
    scenarios: ['nl'],
    template: 'use-email/mail',
    design: {
      rowHeight: 54,
      parts: {
        toolbarMade: (base, S) => () => {
          const { root, folders, toolbar } = S.els;
          const utility = (label, svg, fn) => {
            const b = S.el('button', 'utility-button', utilities);
            b.type = 'button';
            b.title = label;
            b.setAttribute('aria-label', label);
            b.innerHTML = svg;
            b.addEventListener('click', fn);
            return b;
          };
          const utilities = S.el('div', 'utility-tools', toolbar);
          const searchToggle = utility(
            'Search messages',
            '<svg viewBox="0 0 24 24"><circle cx="10" cy="10" r="7"/><path d="m15 15 6 6"/></svg>',
            () => {
              root.classList.toggle('search-open');
              if (root.classList.contains('search-open')) S.els.search.focus();
            },
          );
          utility(
            'Mailbox folders',
            '<svg viewBox="0 0 24 24"><path d="M3 5h18 M3 11h12 M3 17h5"/></svg>',
            () => S.navToggle(),
          );
          const menuToggle = utility(
            'More mail actions',
            '<svg viewBox="0 0 24 24" class="kebab"><circle cx="12" cy="4" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="20" r="1.5"/></svg>',
            () => root.classList.toggle('actions-open'),
          );
          S.els.searchToggle = searchToggle;
          S.els.menuToggle = menuToggle;
        },
        locateEarly: (base, S) => (t) => {
          if (t.search && !S.visible(S.els.search)) return S.center(S.els.searchToggle);
          if (t.compose === 'new' && !S.visible(S.els.reg.get('compose:new'))) return S.center(S.els.menuToggle);
        },
      },
    },
  });
})();
