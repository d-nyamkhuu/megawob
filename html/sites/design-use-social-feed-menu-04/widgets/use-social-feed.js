// Pixel avatars and squared, pixel edged illustrations preserve this site's custom feed appearance.
(function () {
  'use strict';

  env.widget({
    task: 'use-social-feed',
    site: 'design-use-social-feed-menu-04',
    name: 'design',
    split: 'train',
    scenarios: ['menu'],
    template: 'use-social-feed/feed',
    design: {
      scenarioDecor: false,
      scrollSet: 'model',
      menuPlace: 'always',
      icons: {
        reply: '<path d="M3 3h18v15H12l-5 5v-5H3z"/>',
        retweet: '<path d="M2 7l4-4 4 4M6 3v18h8M12 3h8v18M16 17l4 4 3-4"/>',
        like: '<path d="M12 22L2 12V5l3-3h4l3 3 3-3h4l3 3v7z"/>',
        more: '<path d="M2 10h4v4H2zM10 10h4v4h-4zM18 10h4v4h-4z" fill="currentColor" stroke="none"/>',
        block: '<path d="M8 2h8l6 6v8l-6 6H8l-6-6V8zM5 5l14 14"/>',
        report: '<path d="M4 22V2h10v12H4M14 5h7v12h-7"/>',
      },
      parts: {
        svg: () => (body, cls = '') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="square" stroke-linejoin="miter">${body}</svg>`,
        photoSvg: () => (hue, k) => {
          const h2 = (hue + 35 + k * 20) % 360;
          return (
            `<svg viewBox="0 0 100 60" preserveAspectRatio="xMidYMid slice" shape-rendering="crispEdges">` +
            `<rect width="100" height="60" fill="hsl(${hue},40%,72%)"/><path d="M0 10h100v10H0z" fill="hsl(${hue},42%,69%)"/><path d="M0 20h100v12H0z" fill="hsl(${hue},42%,65%)"/>` +
            `<path d="M67 8h8v2h3v8h-3v2h-8v-2h-3v-8h3z" fill="#f6dfb4"/>` +
            `<path d="M0 48h5v-5h5v-6h5v-5h5v-5h5v-4h5v5h5v5h5v5h5v5h5v5h5v12H0z" fill="hsl(${h2},30%,41%)"/>` +
            `<path d="M28 60v-7h6v-6h6v-6h6v-6h6v-6h6v-6h6v-4h6v6h6v6h6v6h6v6h6v6h6v11z" fill="hsl(${h2},30%,33%)"/>` +
            `<path d="M58 23h6v-4h6v6h6v6h-6v-3h-6v3h-6v4h-6v-6h6z" fill="#c7dce0"/>` +
            `<path d="M0 53h100v7H0z" fill="#446a71"/><path d="M0 55h18v2H0zM27 58h23v2H27zM62 54h19v2H62z" fill="#668c8b"/>` +
            `<path d="M8 60V42H4v-6H0v-5h4v-6h4v-6h4v6h4v6h4v5h-4v6h-4v18z" fill="#254e42"/><path d="M4 31h4v-6h4v6h4v5H8v6H4z" fill="#416e4e"/></svg>`
          );
        },
        headed: (base) => (R) => {
          base(R);
          if (R.live) {
            const nav = document.querySelector('.ws-tabs');
            const slots = nav && [...nav.children].slice(0, 2);
            if (slots)
              Object.entries(R.tabEls).forEach(([k, t], i) => {
                const names = { foryou: 'Home', following: 'Explore' };
                t.title = names[k];
                t.setAttribute('aria-label', names[k]);
                t.textContent = i === 0 ? 'Home' : 'Explore';
                t.classList.add('ws-tab');
                slots[i].replaceWith(t);
              });
          }
        },
        avatar: (base) => (R, row, post, p, m) => {
          const av = R.util.el('div', 'as-av', row);
          av.style.backgroundColor = R.colorOf(post.handle);
          const authorIndex = R.handles.indexOf(post.handle);
          av.dataset.portrait = /dog|pup|pet/i.test(post.handle) ? '2' : String(authorIndex % 3);
          av.title = post.name;
          return av;
        },
        menuItemMade: (base) => (R, el, k) => {
          el.dataset.item = k;
        },
      },
    },
  });
})();
