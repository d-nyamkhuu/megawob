// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const icon = (name) => {
    const paths = {
      jobs: '<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V4h8v3M3 12q9 5 18 0M10 14h4"/>',
      paper: '<path d="M6 2h9l5 5v15H6zM14 2v6h6M9 12h8M9 16h8"/>',
      chat: '<path d="M21 11c0 5-5 8-11 7l-6 3 1-6C-1 6 6 1 13 3c5 0 8 3 8 8z"/>',
      book: '<path d="M12 5v17M12 5Q6 1 1 4v16q6-3 11 2 5-5 11-2V4q-5-3-11 1z"/>',
      search: '<circle cx="10" cy="10" r="7"/><path d="m16 16 6 6"/>',
      pin: '<path d="M12 22S4 13 4 8a8 8 0 0 1 16 0c0 5-8 14-8 14z"/><circle cx="12" cy="8" r="3" fill="white"/>',
      people: '<circle cx="12" cy="6" r="4"/><circle cx="3" cy="8" r="3"/><circle cx="21" cy="8" r="3"/><path d="M5 22v-5a7 7 0 0 1 14 0v5zM0 12q5-2 5 4v6H0zM24 12q-5-2-5 4v6h5z"/>',
      arrow: '<path d="M3 12h18m-7-7 7 7-7 7"/>',
    };
    return `<svg viewBox="0 0 24 24" aria-hidden="true" fill="${name === 'people' || name === 'pin' ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths[name] || paths.paper}</svg>`;
  };

  const parts = {
    'frame.layout': (base, S) => function (_c) {
      const { ctx } = _c;
      const W = window.innerWidth;
      const H = window.innerHeight;
      const roomy = W >= 1260;
      const tall = H >= 700;
      let display = ctx.display || 'header';
      if (display === 'panel' && !roomy) display = 'header';
      if (display === 'toast' && !tall) display = 'header';
      // reset() reuses the body: a previous toast must not shrink later episodes.
      document.body.classList.toggle('ref-has-note', display === 'toast');
      document.body.classList.toggle('ref-has-header-note', display === 'header');
      document.body.classList.toggle('ref-has-panel-note', display === 'panel');
      Object.assign(_c, { H, W, display, roomy, tall });
    },
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, util, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebar = roomy && rng.bool(0.35);
      const nav = W >= 1180 && rng.bool(0.5);
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      const titlebar = util.el('div', 'gtk-titlebar', document.body);
      util.el('span', 'gtk-appicon', titlebar, '▣');
      util.el('strong', '', titlebar, 'TalentHub');
      const win = util.el('div', 'gtk-window-controls', titlebar);
      for (const [c, t] of [['min','−'], ['max','□'], ['close','×']]) util.el('span', `gtk-win-${c}`, win, t);
      const menubar = util.el('nav', 'gtk-menubar', document.body);
      for (const t of ['File', 'Edit', 'View', 'Tools', 'Help']) util.el('span', '', menubar, t);
      Object.assign(_c, { collide, cr, decoys, label, menubar, nav, placement, sidebar, titlebar, wantFooter, win });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, rng, util } = _c;
      const workspace = util.el('section', 'gtk-workspace', body);
      const hero = util.el('section', 'job-hero', workspace);
      const mark = util.el('div', 'job-mark', hero, '❧');
      mark.innerHTML = '<svg viewBox="0 0 100 100" aria-hidden="true"><defs><linearGradient id="leaf" x2="1" y2="1"><stop stop-color="#174b48"/><stop offset="1" stop-color="#398475"/></linearGradient></defs><path d="M35 92Q44 61 67 32M43 66Q27 52 25 31" fill="none" stroke="#28685c" stroke-width="3"/><path d="M49 57Q46 14 84 13Q86 49 49 57M38 69Q14 55 21 29Q43 37 38 69M43 80Q52 57 78 65Q68 86 43 80" fill="url(#leaf)"/><path d="m49 55 24-30M37 65 25 37M45 79l24-10" fill="none" stroke="#508c7e" stroke-width=".6"/></svg>';
      const title = util.el('div', 'job-heading', hero);
      util.el('strong', '', title, 'Analytics Engineer');
      util.el('span', '', title, 'Frosted Fig');
      const facts = util.el('div', 'job-facts', title);
      for (const [symbol, label] of [['pin','Remote'], ['jobs','Full-time'], ['people','Data & Analytics']]) {
        const fact = util.el('span', '', facts);
        util.el('b', '', fact).innerHTML = icon(symbol); util.el('span', '', fact, label);
      }
      const landscape = util.el('div', 'job-landscape', hero);
      const photo = util.el('img', '', landscape);
      photo.src = 'sites/design-complete-wizard-application-05/assets/mountain-lake.png';
      photo.alt = 'Mountain lake with a wooded alpine shore';
      const workarea = util.el('div', 'application-workarea', workspace);
      const stage = util.el('main', 'ref-stage', workarea);
      // Preserve the episode's draws; the desktop work area always fills its pane.
      rng.pick(['center', 'center', 'flex-start', 'flex-end']);
      rng.pick(['center', 'center', 'flex-start', 'flex-end']);
      stage.style.justifyContent = 'center';
      stage.style.alignItems = 'flex-start';
      const index = util.el('aside', 'jobs-index', body);
      const indexHead = util.el('div', 'jobs-index-head', index);
      util.el('strong', '', indexHead, 'Open Positions'); util.el('span', '', indexHead, '12');
      const search = util.el('div', 'jobs-search', index, '⌕　Search positions...');
      search.innerHTML = icon('search') + '<span>Search positions...</span>';
      const filters = util.el('div', 'jobs-filters', index);
      for (const label of ['All Departments⌄', 'All Locations⌄', 'Remote & On-site⌄']) util.el('span', '', filters, label);
      const rows = util.el('div', 'jobs-rows', index);
      const jobs = [
        ['Analytics Engineer','Frosted Fig','Remote','Feb 14, 2024'], ['Data Analyst','Rivermere Labs','London, UK','Feb 12, 2024'],
        ['Senior Data Engineer','Northpeak','Remote','Feb 9, 2024'], ['Business Intelligence Analyst','Clearbank','London, UK','Feb 6, 2024'],
        ['Analytics Manager','Zephyr Health','Hybrid · London, UK','Feb 5, 2024'], ['Data Platform Engineer','Maple & Rowe','Remote','Jan 30, 2024'],
        ['Data Scientist','Helix Systems','London, UK','Jan 28, 2024'], ['Machine Learning Engineer','Orchid Tech','Remote','Jan 24, 2024']
      ];
      for (const [name, company, place, date] of jobs) {
        const row = util.el('div', 'job-row', rows);
        util.el('strong', '', row, name); util.el('span', 'job-company', row, company);
        const line = util.el('div', 'job-row-meta', row);
        util.el('span', '', line).innerHTML = icon('pin') + '<span>' + place + '</span>';
        util.el('time', '', line, date);
      }
      Object.assign(_c, { index, stage, workspace, workarea });
    },
    'frame.end': (base, S) => function (_c) {
      const { header, menubar, body, index, headerTools, workspace, workarea } = _c;
      // These are frame nodes only. Reserve their space before the widget renders.
      menubar.appendChild(headerTools);
      const nav = header.querySelector('.ref-nav') || _c.util.el('nav', 'ref-nav', header);
      if (nav) {
        const labels = ['Jobs', 'My Applications', 'Messages', 'Career Resources'];
        const icons = ['jobs', 'paper', 'chat', 'book'];
        while (nav.children.length < labels.length) {
          const link = _c.util.el('a', 'ref-navlink', nav);
          link.addEventListener('click', () => env.log('decoy', { what: 'nav', label: link.textContent }));
        }
        for (const [i, link] of [...nav.querySelectorAll('.ref-navlink')].entries()) {
          if (labels[i]) link.innerHTML = `<b aria-hidden="true">${icon(icons[i])}</b><span>${labels[i]}</span>`;
        }
        const brand = document.createElement('div'); brand.className = 'talent-nav-brand';
        brand.innerHTML = `<b aria-hidden="true">${icon('people')}</b><strong>TalentHub</strong>`;
        menubar.insertBefore(brand, menubar.firstChild);
        const search = document.createElement('div'); search.className = 'talent-search';
        search.innerHTML = `<span aria-hidden="true">${icon('search')}</span> Search <i></i><b aria-hidden="true">CP</b>`;
        menubar.insertBefore(search, headerTools);
        menubar.insertBefore(nav, search);
      }
      const side = body.querySelector('.ref-side');
      if (side) index.appendChild(side);
      const panel = body.querySelector('.ref-panel');
      if (panel) workarea.appendChild(panel);
      const note = document.body.querySelector('.ref-note');
      if (note) workspace.querySelector('.job-hero').appendChild(note);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) body.appendChild(foot);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) body.appendChild(dock);
      return base(_c);
    },
  };

  env.site({
    name: 'design-complete-wizard-application-05',
    template: 'site/base',
    design: { parts },
  });
})();
