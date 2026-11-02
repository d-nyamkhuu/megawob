// Adds the directory toolbar and alphabet strip, with this site's contact columns and status details.
(function () {
  'use strict';

  const SEARCH_ICON = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="7" cy="7" r="4.6"/><path d="M10.5 10.5L14 14"/></svg>';

  env.widget({
    task: 'find-fact',
    site: 'design-find-fact-phone-book-08',
    name: 'design',
    split: 'train',
    scenarios: ['phone-book'],
    template: 'find-fact/phone-book',
    design: {
      headers: ['Name', 'Address', 'Email', 'Phone'],
      widths: ['23%', '29%', '31%', '17%'],
      props: ['address', 'email', 'phone'],
      parts: {
        book: (base, S) => (ctx, B) => {
          base(ctx, B);
          const { util } = ctx;
          const { bc, body, search } = B;
          const heading = bc.querySelector('h3');
          heading.firstChild.textContent = 'Contact Book';
          const tools = util.el('div', 'book-tools', heading);
          const searchSlot = util.el('div', 'book-search-slot', tools);
          if (!search) {
            const hint = util.el('div', 'book-search-hint', searchSlot, 'Search contacts…');
            hint.setAttribute('aria-hidden', 'true');
          }
          util.el('span', 'book-search-icon', tools).innerHTML = SEARCH_ICON;
          const department = util.el('button', 'book-department', tools, 'All Departments');
          department.type = 'button';
          department.addEventListener('click', () => env.log('decoy', { label: 'All Departments' }));
          const alphabet = util.el('div', 'book-alphabet', bc);
          bc.insertBefore(alphabet, body);
          ['All', '0-9', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'].forEach((letter, i) => {
            util.el('span', i ? '' : 'active', alphabet, letter);
          });
          B.searchSlot = searchSlot;
        },
        searchParent: (base, S) => (ctx, B) => B.searchSlot,
        picked: (base, S) => (ctx, B, model, lastPick, wrong) => {
          base(ctx, B, model, lastPick, wrong);
          B.status.classList.toggle('has-pick', Boolean(lastPick));
        },
        footer: (base, S) => (ctx, B, count) => {
          base(ctx, B, count);
          const footerCount = document.querySelector('.ds-footer > span');
          if (footerCount) footerCount.textContent = B.search
            ? count.textContent
            : `Showing ${count.textContent} contacts`;
        },
      },
    },
  });
})();
