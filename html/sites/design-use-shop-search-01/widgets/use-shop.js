// GreenLeaf keeps its frame search slot, product cards and native scrolling results rail.
(function () {
  'use strict';

  env.widget({
    task: 'use-shop',
    site: 'design-use-shop-search-01',
    name: 'design',
    split: 'train',
    scenarios: ['search'],
    traits: { corpus: 'products' },
    template: 'use-shop/adapted',
    design: {
      brand: 'GreenLeaf',
      goLabel: null,
      placeholder: (spec) => spec.query,
      sizing: 'reference',
      pageNav: false,
      markSelected: false,
      sideDetail: false,
      pagerAria: false,
      pagerSync: false,
      css: '\n.design-header{height:94px}.site-shell{grid-template-rows:94px minmax(0,1fr) 62px}.design-brand{font:700 53px Georgia}.design-nav{font:16px Georgia}.task-note{padding:30px;background:#fff8de;font-size:25px;font-weight:400;margin:16px;border:1px solid #d6cfb5;align-self:start}.task-note h2{font:700 36px Georgia}.stage{margin:15px 0 0 24px;border:1px solid #d1cbbd}.se-title{color:#a51c16}.end-control{background:#a92323}\n.se-card{position:relative;padding-left:40px}.result-number{position:absolute;left:8px;top:12px;font:700 17px var(--font)}',
      parts: {
        searchBar: (base, S) => (V) => {
          base(V);
          document.querySelector('.search-slot').append(V.bar);
        },
        searchSort: (base, S) => (V) => {
          const { util, col } = V;
          const head = (V.resultsHead = util.el('div', 'results-head', col));
          const label = util.el('div', 'result-sort', head, 'Sort by: ');
          const button = (V.sortButton = S.H.btn(util, 'sort-button', label, 'Relevance'));
          const menu = util.el('div', 'sort-menu', label);
          menu.hidden = true;
          for (const name of ['Relevance', 'Title', 'Date']) {
            const option = S.H.btn(util, 'sort-option', menu, name);
            option.addEventListener('click', () => {
              button.textContent = name;
              menu.hidden = true;
              env.log('decoy', { what: 'sort ' + name });
            });
          }
          button.addEventListener('click', () => {
            menu.hidden = !menu.hidden;
          });
          V.meta = util.el('div', 'se-meta', head);
        },
        searchPanes: (base, S) => (V) => {
          const { util, col } = V;
          V.resultsPane = util.el('div', 'se-results-pane', col);
          V.list = util.el('div', 'se-list', V.resultsPane);
          V.scrollbar = util.el('div', 'se-scrollbar', V.resultsPane);
          V.scrollUp = S.H.btn(util, 'se-scroll-arrow up', V.scrollbar, '');
          V.scrollUp.setAttribute('aria-label', 'Scroll results up');
          const rail = (V.scrollRail = util.el('div', 'se-scroll-rail', V.scrollbar));
          const thumb = (V.scrollThumb = util.el('div', 'se-scroll-thumb', rail));
          V.scrollDown = S.H.btn(util, 'se-scroll-arrow down', V.scrollbar, '');
          V.scrollDown.setAttribute('aria-label', 'Scroll results down');
          const sync = (V.syncScrollbar = () => {
            const extent = Math.max(0, V.list.scrollHeight - V.list.clientHeight);
            const railHeight = rail.clientHeight;
            const thumbHeight = Math.min(
              railHeight,
              Math.max(28, Math.min(120, (railHeight * V.list.clientHeight) / Math.max(1, V.list.scrollHeight))),
            );
            thumb.hidden = extent === 0;
            thumb.style.height = thumbHeight + 'px';
            thumb.style.top = (extent ? (V.list.scrollTop / extent) * (railHeight - thumbHeight) : 0) + 'px';
            V.scrollUp.disabled = V.list.scrollTop <= 0;
            V.scrollDown.disabled = V.list.scrollTop >= extent;
          });
          let scrollDrag = null;
          V.list.addEventListener('scroll', sync);
          V.scrollUp.addEventListener('click', () => {
            V.list.scrollTop -= 108;
            sync();
          });
          V.scrollDown.addEventListener('click', () => {
            V.list.scrollTop += 108;
            sync();
          });
          rail.addEventListener('pointerdown', (e) => {
            if (e.target !== rail) return;
            const direction = e.clientY < thumb.getBoundingClientRect().top ? -1 : 1;
            V.list.scrollTop += direction * V.list.clientHeight * 0.9;
            sync();
          });
          thumb.addEventListener('pointerdown', (e) => {
            e.preventDefault();
            scrollDrag = { y: e.clientY, top: V.list.scrollTop };
            thumb.setPointerCapture(e.pointerId);
          });
          thumb.addEventListener('pointermove', (e) => {
            if (!scrollDrag) return;
            const travel = rail.clientHeight - thumb.offsetHeight;
            const extent = V.list.scrollHeight - V.list.clientHeight;
            if (travel > 0) V.list.scrollTop = scrollDrag.top + ((e.clientY - scrollDrag.y) * extent) / travel;
            sync();
          });
          for (const event of ['pointerup', 'pointercancel', 'lostpointercapture'])
            thumb.addEventListener(event, () => {
              scrollDrag = null;
            });
          V.pager = util.el('div', 'se-pager', col);
          V.visit = util.el('div', 'se-visit', col);
          V.visit.hidden = true;
          V.pager.style.minHeight = '44px';
        },
        searchSizing: () => (V) => {
          const bh = V.body.getBoundingClientRect().height;
          V.cardH = Math.max(32, Math.min(118, Math.floor((bh - 205) / V.spec.perPage)));
          V.lines = V.cardH >= 98 ? 2 : V.cardH >= 78 ? 1 : 0;
          V.col.style.setProperty('--se-lines', Math.max(1, V.lines));
        },
        searchNav: () => () => {},
        searchHide: () => (V, m) => {
          V.resultsPane.hidden = V.list.hidden = V.pager.hidden = !!m.pick;
        },
        searchMeta: () => (V, m, res) => {
          V.meta.replaceChildren();
          V.meta.append(`Showing ${m.page * V.spec.perPage + 1} – ${res.length} of ${res.length} results for “`);
          V.util.el('strong', '', V.meta, (m.query ?? V.spec.query).trim());
          V.meta.append('”');
        },
        searchCard: (base, S) => (V, r, i, res, m, parent = V.list) => {
          const { ctx, util, spec, cardH, lines, titles, commit } = V;
          const card = util.el('div', 'se-card', parent);
          util.el('b', 'result-number', card, String(i + 1) + '.');
          card.style.height = cardH + 'px';
          card.classList.toggle('compact', cardH < 60);
          const thumb = util.el('div', 'search-thumb', card);
          thumb.dataset.art = String(i % 6);
          thumb.setAttribute('aria-hidden', 'true');
          const url = util.el('div', 'se-url', card);
          const fav = util.el('span', 'se-fav', url, r.host.charAt(0).toUpperCase());
          fav.style.background = S.H.FAV[S.H.hashStr(r.host) % S.H.FAV.length];
          util.el('span', 'se-host', url, r.host);
          util.el('span', 'se-path', url, `› ${r.path.replace(/\//g, ' › ')}`);
          const title = util.el('a', 'se-title', card, r.title);
          title.dataset.role = 'result';
          title.dataset.index = i;
          title.addEventListener('click', () => {
            if (ctx.model.pick) return;
            commit(S.H.F().apply({ ...ctx.model, page: Math.floor(i / spec.perPage) }, spec, { click: { result: i } }));
          });
          titles[i] = title;
          if (lines) util.el('div', 'se-desc', card, r.desc);
          const meta = S.H.F().resultMeta ? S.H.F().resultMeta(spec, r) : [];
          const price = meta.find(([label]) => String(label).toLowerCase() === 'price');
          const ph = S.H.hashStr(r.title + r.host);
          util.el('div', 'se-price', card, price ? price[1] : '$' + (8 + (ph % 24)) + '.' + ['95', '50', '99', '45'][ph % 4]);
          const commerce = meta
            .filter(([label]) => String(label).toLowerCase() !== 'price')
            .map(([label, value]) => label + ': ' + value)
            .join('  |  ');
          util.el(
            'div',
            'se-detail',
            card,
            r.host.replace(/^www\./, '') + '  |  ' + r.path.replace(/\//g, ' › ') + (commerce ? '  |  ' + commerce : ''),
          );
        },
        searchRows: (base, S) => (V, m, res) => {
          const p0 = m.page * V.spec.perPage;
          V.list.scrollTop = 0;
          V.list.style.setProperty('--search-fit-pitch', Math.max(36, Math.floor(V.list.clientHeight / V.spec.perPage)) + 'px');
          res.slice(p0).forEach((r, k) => S.P.searchCard(V, r, p0 + k, res, m));
        },
        searchPager: (base, S) => (V, m) => {
          const { util, spec, pager, commit, ctx } = V;
          const mk = (label, page, cls = '') => {
            const b = S.H.btn(util, 'se-pg' + cls, pager, label);
            b.addEventListener('click', () => {
              if (ctx.model.pick || b.disabled) return;
              const p = page === 'prev' ? ctx.model.page - 1 : page === 'next' ? ctx.model.page + 1 : page;
              if (p >= 0 && p < spec.pages && p !== ctx.model.page) commit({ ...ctx.model, page: p });
            });
            return b;
          };
          V.prev = mk('‹', 'prev');
          V.prev.disabled = m.page === 0;
          for (let p = 0; p < spec.pages; p++) V.pages[p] = mk(String(p + 1), p, p === m.page ? ' on' : '');
          V.next = mk('Next »', 'next');
          V.next.disabled = m.page === spec.pages - 1;
        },
        searchPaint: (base, S) => (V, m) => {
          base(V, m);
          V.syncScrollbar();
        },
      },
    },
  });
})();
