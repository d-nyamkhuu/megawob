// Design of this site on click-control/controls: notebook resource rows with pixel icons and a fitted article.
(function () {
  'use strict';
  const S = (c) => `<svg viewBox="0 0 24 24" width="100%" height="100%" shape-rendering="crispEdges">${c}</svg>`;
  const icons = [
    S('<path d="M16 2h3v8h-3z" fill="#f3f3e9" stroke="#080f38"/><path d="M4 11h16v12H4z" fill="#f7fcff" stroke="#080f38" stroke-width="1.5"/><path d="M2 12V9h3V6h3V3h3V1h3v3h3v3h3v3h2v3h-3v-2h-3V8h-3V5h-2v3H8v3H5v2z" fill="#f35c2a" stroke="#080f38"/><path d="M7 12v9h3v-7h5v7h3v-9l-5-5z" fill="#cde9f4"/><path d="M10 15h4v7h-4z" fill="#cbaa45"/><path d="M6 13h3v3H6zM16 13h2v3h-2z" fill="#fff"/>'),
    S('<path d="M3 1h17v22H3z" fill="#e0e7eb" stroke="#090f37" stroke-width="1.4"/><path d="M5 3h13v18H5z" fill="#fff"/><path d="M6 6h9M6 9h11M6 12h11M6 15h11M6 18h8" stroke="#138aff" stroke-width="1.3"/><path d="M17 3v18h-2" fill="none" stroke="#bcd8f0"/>'),
    S('<path d="M2 5V2h7l2 2h11v17H2z" fill="#fff8ca" stroke="#090f37" stroke-width="1.4"/><path d="M1 7h19v15H1z" fill="#ffe167" stroke="#090f37" stroke-width="1.3"/><path d="M3 9h15v11H3z" fill="#ffeb7b"/><path d="M3 9h15M3 10v9" fill="none" stroke="#fffbb9"/><path d="M19 8v13H2" fill="none" stroke="#ba8e26"/>'),
    S('<path d="M4 1h6v2h2v6h-2v2h2v3h2v9H1V14h2v-3h2V9H3V3h1z" fill="#079ded" stroke="#090f37" stroke-width="1.3"/><path d="M5 3h4v5H5zM3 14h4v7H3z" fill="#36caff"/><path d="M15 5h5v2h2v6h-2v2h2v8H11v-8h2v-2h1V7h1z" fill="#c7e85a" stroke="#090f37" stroke-width="1.2"/><path d="M13 17h8v5h-8z" fill="#47b52d"/><path d="M16 7h3v4h-3z" fill="#fff09a"/>'),
    S('<path d="M10 1h4v3h3V2h3v4h-2v3h5v5h-4v3h2v3h-4v-2h-3v5h-5v-4H6v2H3v-4h2v-3H1V9h4V6H3V3h4v2h3z" fill="#d2dbe1" stroke="#090f37" stroke-width="1.3"/><path d="M9 7h6v2h2v6h-2v2H9v-2H7V9h2z" fill="#8c9da9"/><path d="M10 9h4v6h-4z" fill="#fff" stroke="#090f37"/>'),
    S('<path d="M8 1h8v1h3v2h2v3h2v10h-2v3h-3v2H7v-2H4v-3H2V7h2V4h4z" fill="#07214a"/><path d="M8 2h8v1h3v3h2v11h-2v3h-3v1H8v-2H5v-3H3V8h2V5h3z" fill="#0086e9"/><path d="M8 3h6v2h-3v2H7v3H5V7h2V5h1zM14 3h3v3h3v3h-4V7h-2zM4 11h5v2h3v3h-2v5H8v-3H6v-3H4zM17 11h4v5h-2v3h-3v-4h-2v-2h3z" fill="#6ac72e"/><path d="M7 4h3v1H7zM4 8h2v3H4z" fill="#7ae4ff"/>'),
    S('<path d="M1 4h22v17H1z" fill="#fff" stroke="#090f37" stroke-width="1.5"/><path d="M3 6h2v2h3v2h3v2h3v-2h3V8h3V6h2" fill="none" stroke="#0789ff"/><path d="M3 18h18V7" fill="none" stroke="#c9dfe8"/>'),
  ];
  const descs = [
    'Home page with general information.', 'Articles and guides.', 'Browse our document archive.',
    'Learn more about our team.', 'Adjust your preferences.', 'Additional resources and references.',
    'Contact us for support.',
  ];
  env.widget({
    task: 'click-control',
    site: 'design-click-control-link-10',
    name: 'design',
    split: 'train',
    scenarios: ['link'],
    traits: { menuOpen: ['hover', 'click'] },
    template: 'click-control/controls',
    design: {
      articleFit: { slack: 2 },
      parts: {
        linkDecor: () => (ctx, art, links) => {
          const { util } = ctx;
          Array.from(art.children).forEach((el) => { if (el.tagName !== 'H3') el.remove(); });
          art.firstChild.textContent = 'Useful Links';
          util.el('p', 'notebook-intro', art, 'Explore the links below to find helpful information.');
          const resources = util.el('ul', 'notebook-resources', art);
          links.forEach((a, i) => {
            const row = util.el('li', '', resources);
            const ic = util.el('span', 'pix-ic', row);
            ic.innerHTML = icons[i % icons.length];
            row.append(a);
            util.el('span', 'pix-desc', row, descs[i % descs.length]);
          });
          const unit = parseFloat(getComputedStyle(art).fontSize) / 23;
          const labelWidth = Math.max(184 * unit, ...links.map((a) => a.getBoundingClientRect().width + 28 * unit));
          resources.style.setProperty('--link-column', labelWidth + 'px');
        },
      },
    },
  });
})();
