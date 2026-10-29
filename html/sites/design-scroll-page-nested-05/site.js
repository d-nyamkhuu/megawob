// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const iconArt = {
    home: '<path fill="#ee2929" d="M4 22 24 4 44 22 40 26 24 12 8 27Z"/><path fill="#fff" d="M11 24 24 13 37 24V44H11Z"/><path fill="#ef2424" d="M33 7H39V19L33 14Z"/><path fill="#ffcf28" d="M20 29H28V44H20Z"/><path fill="#ffe75b" d="M21 17H27V24H21Z"/>',
    article: '<path fill="#fff" d="M9 3H39V45H9Z"/><path fill="#000080" d="M13 7H35V15H13Z"/><path fill="#fff" stroke="none" d="M15 9H30V11H15Z"/><path d="M14 20H34M14 25H34M14 30H34M14 35H34M14 40H29"/>',
    contact: '<path fill="#fff" d="M24 7C12 7 4 13 4 22S12 36 26 36L38 44 35 33C42 29 44 26 44 21 44 13 36 7 24 7Z"/><g fill="#000" stroke="none"><circle cx="15" cy="22" r="2"/><circle cx="24" cy="22" r="2"/><circle cx="33" cy="22" r="2"/></g>',
    book: '<path fill="#15942b" d="M3 10H20L24 14 28 10H45V43H28L24 45 20 43H3Z"/><path fill="#fff" d="M7 6C14 5 19 7 24 11 29 7 34 5 41 6V38C34 37 30 38 24 41 18 38 14 37 7 38Z"/><path fill="none" d="M24 11V40M11 13 20 17M11 20 20 24M11 27 20 31M28 17 37 13M28 24 37 20M28 31 37 27"/>',
    tips: '<path fill="#fff" d="M9 4H37V45H9Z"/><path d="M14 3V9M21 3V9M28 3V9M34 3V9M13 15H31M13 22H30M13 29H27M13 36H30"/><path fill="#ffe029" d="M22 32 38 12 44 17 28 37 21 39Z"/><path fill="#f22" d="M38 12 41 9 47 14 44 17Z"/><path fill="#000" d="M22 32 21 39 28 37Z"/>',
    people: '<path fill="#0000dc" d="M3 44V29C4 22 11 21 17 23L23 28V44Z"/><path fill="#8078da" d="M23 44V31C23 26 28 23 34 25 41 25 45 30 45 36V44Z"/><path fill="#fff2d9" d="M7 8C12 2 20 6 20 13V19C17 25 9 23 7 17Z"/><path fill="#fff2d9" d="M28 15C33 8 40 12 40 19V24C37 30 30 28 28 23Z"/><path fill="#000080" d="M6 12V8L11 3H16L21 8V13L17 11 14 7 10 11Z"/><path fill="#000080" d="M27 19V14L32 10H37L42 15V20L37 17 32 15 30 19Z"/><path fill="none" d="M12 29V42M33 32V43"/>'
  };
  function drawIcon(util, parent, name, cls) {
    const icon = util.el('span', cls || 'garden-icon', parent);
    icon.innerHTML = '<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><g stroke="#111" stroke-width="2.3" stroke-linejoin="miter">' + iconArt[name] + '</g></svg>';
    return icon;
  }
  function browseArticles(event) {
    if (event) event.preventDefault();
    const pane = document.querySelector('.ps-pane');
    const target = pane ? pane.closest('.ps-sec') || pane : document.querySelector('.ref-stage');
    if (target) target.scrollIntoView({ block: 'start' });
  }
  function syncPageBar() {
    const track = document.querySelector('.garden-page-track');
    const thumb = document.querySelector('.garden-page-thumb');
    if (!track || !thumb) return;
    const doc = document.scrollingElement;
    if (doc.scrollTop === 0) {
      thumb.style.height = Math.min(126, track.clientHeight) + 'px';
      thumb.style.top = '0px';
      return;
    }
    const range = Math.max(1, doc.scrollHeight - document.documentElement.clientHeight);
    const height = Math.max(50, Math.min(track.clientHeight, track.clientHeight * document.documentElement.clientHeight / doc.scrollHeight));
    thumb.style.height = height + 'px';
    thumb.style.top = Math.max(0, Math.min(1, doc.scrollTop / range)) * (track.clientHeight - height) + 'px';
  }
  document.addEventListener('scroll', syncPageBar, { passive: true });

  const parts = {
    'frame.theme': (base, S) => function (_c) {
      const { ctx } = _c;
      const { ACCENTS, LOW_ACCENTS, THEMES } = S;
      const { rng, util, content } = ctx;
      let name = rng.pick(Object.keys(THEMES));
      const root = document.documentElement;
      let accent = rng.pick(ACCENTS);
      const tr = rng.fork('chrome/theme');
      if (tr.bool(0.08)) {
        name = 'low';
        accent = tr.pick(LOW_ACCENTS);
      }
      // Keep the reference's white help article palette while consuming the clone's original theme draws.
      for (const [k, v] of Object.entries({ bg: '#ffffff', panel: '#f3f8fc', fg: '#17345a', muted: '#60758c', line: '#c6d8e8' })) root.style.setProperty(`--${k}`, v);
      root.style.setProperty('--accent', '#075fc5');
      root.dataset.theme = 'light';
      Object.assign(_c, { accent, content, name, rng, root, tr, util });
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
      const windowbar = util.el('div', 'vista-windowbar', document.body);
      drawIcon(util, windowbar, 'home', 'garden-app-icon');
      util.el('span', 'vista-window-title', windowbar, 'Garden Center Help');
      const winControls = util.el('div', 'vista-window-controls', windowbar);
      for (const glyph of ['−', '□', '×']) util.el('span', 'vista-window-control', winControls, glyph);
      util.el('div', 'garden-window-edge', document.body);
      Object.assign(_c, { collide, cr, decoys, label, nav, placement, sidebar, wantFooter, winControls, windowbar });
    },
    'frame.header': (base, S) => function (_c) {
      const { rng, util, display } = _c;
      const { TITLES } = S;
      document.body.dataset.gardenDisplay = display;
      const header = util.el('header', 'ref-task', document.body);
      {
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, 'Garden Center Help');
        brand.dataset.role = 'brand';
        util.el('span', 'vista-brand-divider', header);
        util.el('div', 'vista-section-title', header, '');
      }
      Object.assign(_c, { header });
    },
    'frame.instruction': (base, S) => function (_c) {
      const { ctx, display, header, util } = _c;
      if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
      else util.el('div', 'ref-spacer', header);
      const search = util.el('div', 'vista-search', header);
      Object.assign(_c, { search });
    },
    'frame.tools': (base, S) => function (_c) {
      base(_c);
      _c.windowbar.insertBefore(_c.headerTools, _c.winControls);
    },
    'frame.body': (base, S) => function (_c) {
      base(_c);
      const { body, util } = _c;
      const rail = util.el('nav', 'garden-rail', body);
      rail.setAttribute('aria-label', 'Garden Center navigation');
      for (const [name, icon] of [['Home','home'],['Help Articles','article'],['Contact Us','contact'],['Product Info','book'],['Tips & Guides','tips'],['Community','people']]) {
        const button = util.el('button', 'garden-nav-item' + (icon === 'article' ? ' selected' : ''), rail);
        button.type = 'button';
        drawIcon(util, button, icon);
        util.el('span', '', button, name);
        button.addEventListener('click', icon === 'home' ? () => window.scrollTo(0, 0) : browseArticles);
      }
      const summary = util.el('aside', 'garden-summary', body);
      util.el('h2', 'garden-summary-title', summary, 'Help Center');
      util.el('h3', 'garden-summary-heading', summary, 'Help articles');
      const counts = util.el('dl', 'garden-counts', summary);
      for (const [label, value] of [['Total articles:',48],['Gardening basics:',14],['Plant care:',12],['Pests & problems:',8],['Design & landscaping:',9],['Tools & materials:',5]]) {
        util.el('dt', '', counts, label); util.el('dd', '', counts, String(value));
      }
      const resources = util.el('section', 'garden-resources', summary);
      util.el('h3', 'garden-summary-heading', resources, 'Other resources');
      const other = util.el('dl', 'garden-counts', resources);
      for (const [label, value] of [['FAQs:',6],['Video guides:',4],['Community topics:',18]]) {
        util.el('dt', '', other, label); util.el('dd', '', other, String(value));
      }
      const scrollBar = util.el('div', 'garden-page-scrollbar', body);
      const up = util.el('button', 'garden-page-arrow', scrollBar, '▲'); up.type = 'button'; up.setAttribute('aria-label', 'Scroll up');
      const track = util.el('div', 'garden-page-track', scrollBar);
      const thumb = util.el('div', 'garden-page-thumb', track);
      const down = util.el('button', 'garden-page-arrow', scrollBar, '▼'); down.type = 'button'; down.setAttribute('aria-label', 'Scroll down');
      up.addEventListener('click', () => window.scrollBy(0, -150));
      down.addEventListener('click', () => window.scrollBy(0, 150));
      track.addEventListener('click', function (event) {
        if (event.target === thumb) return;
        window.scrollBy(0, (event.clientY < thumb.getBoundingClientRect().top ? -1 : 1) * document.documentElement.clientHeight * 0.8);
      });
      thumb.addEventListener('pointerdown', function (event) {
        event.preventDefault(); syncPageBar();
        const initialY = event.clientY, initialScroll = window.scrollY;
        const range = document.scrollingElement.scrollHeight - document.documentElement.clientHeight;
        const travel = Math.max(1, track.clientHeight - thumb.clientHeight);
        thumb.setPointerCapture(event.pointerId);
        const move = (e) => window.scrollTo(0, initialScroll + (e.clientY - initialY) * range / travel);
        const end = () => { thumb.removeEventListener('pointermove', move); thumb.removeEventListener('pointerup', end); };
        thumb.addEventListener('pointermove', move); thumb.addEventListener('pointerup', end);
      });
      Object.assign(_c, { gardenSummary: summary });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, header, util, gardenSummary } = _c;
      const panel = body.querySelector('.ref-panel');
      if (panel) gardenSummary.appendChild(panel);
      const welcome = util.el('section', 'garden-welcome', body);
      util.el('h1', '', welcome, 'Help Center');
      util.el('p', 'garden-subtitle', welcome, 'Advice and information for your garden');
      const image = util.el('img', 'garden-banner', welcome);
      image.src = 'sites/design-scroll-page-nested-05/assets/garden-banner.png';
      image.alt = 'A stone garden wall beside a path and flowering plants';
      util.el('h2', '', welcome, 'Welcome to the Help Center');
      util.el('p', 'garden-introduction', welcome, 'Find practical advice, step-by-step guides, and answers to common questions about gardening, plants, and outdoor projects. Use the topics below to browse our most popular resources or search for a specific subject.');
      const quick = util.el('section', 'garden-quick', welcome);
      util.el('h3', '', quick, 'Quick links');
      const columns = util.el('div', 'garden-quick-columns', quick);
      for (const labels of [['Getting started with gardening','Plant care basics','Pests and problems','Garden design ideas'],['Tools and materials','Seasonal advice','Frequently asked questions','Community forum']]) {
        const list = util.el('ul', '', columns);
        for (const label of labels) {
          const item = util.el('li', '', list);
          const a = util.el('a', '', item, label); a.href = '#help-articles'; a.addEventListener('click', browseArticles);
        }
      }
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      document.body.style.setProperty('--content-top', (60 + header.getBoundingClientRect().height) + 'px');
      Object.assign(_c, { stage });
    },
    'frame.toast': (base, S) => function (_c) {
      base(_c);
      const note = document.querySelector('.ref-note');
      if (note && _c.gardenSummary) _c.gardenSummary.appendChild(note);
    },
    'frame.footer': (base, S) => function (_c) {
      base(_c);
      const foot = document.querySelector('.ref-foot');
      if (foot && _c.placement !== 'footer' && _c.placement !== 'link') {
        const tools = foot.querySelector('.ref-tools');
        if (tools) _c.windowbar.insertBefore(tools, _c.winControls);
        foot.remove();
      }
    },
  };

  env.site({
    name: 'design-scroll-page-nested-05',
    template: 'site/base',
    design: { parts },
  });
})();
