// Design of this site on click-control/controls: numbered tabs with notebook overview and summary panels.
env.widget({
  task: 'click-control',
  site: 'design-click-control-tab-09',
  name: 'design',
  split: 'train',
  scenarios: ['tab'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {
    parts: {
      tabLabel: () => (t, i) => `${i + 1}. ${t.label}`,
      tabButton: () => () => {},
      tabPanel: () => (ctx, p, t, i, links) => {
        const { spec, util } = ctx;
        const overview = util.el('section', 'notebook-overview', p);
        util.el('h2', 'section-title', overview, 'Overview');
        const card = util.el('div', 'notebook-card', overview);
        util.el('h3', 'welcome', card, 'Welcome to My Notebook!');
        const words = util.el('div', 'notebook-words', card);
        t.words.forEach((word, j) => {
          const line = util.el('div', 'notebook-line', words);
          if (word.link) {
            const a = util.el('span', 'uc-link', line, word.text);
            a.dataset.key = i + '.' + j;
            a.dataset.role = 'link';
            links.push(a);
          } else line.append(word.text);
        });
        const art = util.el('div', 'notebook-art', card);
        art.innerHTML =
          '<svg viewBox="0 0 180 180"><defs><linearGradient id="sheet' +
          i +
          '" x2=".8" y2="1"><stop stop-color="white"/><stop offset="1" stop-color="#e5efff"/></linearGradient><linearGradient id="gold' +
          i +
          '"><stop stop-color="#af6700"/><stop offset=".25" stop-color="#ffe38a"/><stop offset=".5" stop-color="#ffbc18"/><stop offset=".85" stop-color="#f69b00"/><stop offset="1" stop-color="#b56a06"/></linearGradient><linearGradient id="rubber' +
          i +
          '"><stop stop-color="#8c180d"/><stop offset=".5" stop-color="#ff6c52"/><stop offset="1" stop-color="#c72e19"/></linearGradient></defs><g transform="rotate(-2 80 100)"><path d="m19 31 113 2 2 130-114 4Z" fill="#000" opacity=".22"/><path d="m9 25 114-1 3 137-115 3Z" fill="#d8e6f6" stroke="#667a96" stroke-width="2"/><path d="m14 18 114 1-1 137-114 2Z" fill="white" stroke="#9bb0cc" stroke-width="2"/><path d="m22 8 113 1-2 137-112 2Z" fill="url(#sheet' +
          i +
          ')" stroke="#91a8c9" stroke-width="2"/><path d="M34 31h87M34 46h87M34 61h87M34 76h87M34 91h87M34 106h87M34 121h87" stroke="#c2d5ee" stroke-width="2.5"/></g><g transform="rotate(44 119 78)"><path d="M110 31h19v81h-19Z" fill="url(#gold' +
          i +
          ')" stroke="#845113" stroke-width="2"/><path d="m110 112 9 25 10-25Z" fill="#e5c48d" stroke="#66513b" stroke-width="2"/><path d="m116 128 3 9 4-9Z" fill="#222"/><path d="M110 18h19v14h-19Z" fill="#bcc7d4" stroke="#515d6c" stroke-width="2"/><path d="M110 18V6q0-4 4-4h11q4 0 4 4v12Z" fill="url(#rubber' +
          i +
          ')" stroke="#8c2414" stroke-width="2"/><path d="M114 36v70" stroke="#ffea97" stroke-width="2"/></g></svg>';
        const summary = util.el('section', 'notebook-summary', p);
        util.el('h2', 'section-title', summary, 'Quick Summary');
        const totals = util.el('dl', 'notebook-card summary-values', summary);
        [
          ['Total Tabs:', spec.tabs.length],
          ['Current Page:', i + 1],
          ['Documents:', t.words.filter((w) => !w.link).length],
          ['Links:', t.words.filter((w) => w.link).length],
          ['Total Items:', t.words.length],
        ].forEach(([label, value]) => {
          util.el('dt', '', totals, label);
          util.el('dd', '', totals, String(value));
        });
      },
    },
  },
});
