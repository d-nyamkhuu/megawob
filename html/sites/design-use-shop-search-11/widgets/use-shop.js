// Design of this site on the use-shop/adapted template (templates/use-shop/adapted.js): a product search with a
// header strip (title and cart count), a styled sort trigger, a scroll rail beside the results and, for
// infinite-scroll episodes (spec.infinite), a result feed that appends rows as the pane scrolls.
(function () {
  'use strict';
  env.widget({
    task: 'use-shop',
    site: 'design-use-shop-search-11',
    name: 'design',
    split: 'train',
    scenarios: ['search'],
    traits: { corpus: 'products', infinite: true },
    template: 'use-shop/adapted',
    design: {
      brand: 'ShopEase',
      css: '\n.stage{margin:24px 12% 12px 0;border:5px ridge #b5e5ff;border-radius:14px}.task-note{margin:60px 14px 0 20px;padding:20px;background:#fffddd;border:1px solid #ead764;align-self:start;border-radius:12px;font-size:20px}.design-header{background:linear-gradient(#f6fcff,#9edaff)}.design-brand{font-size:29px;font-style:italic;color:#266cae}.end-control,.se-go{background:linear-gradient(#a3d650,#2c8c12);border:2px ridge #a5cd73;border-radius:10px;color:#fff}\n.se-card{position:relative;padding-left:40px}.result-number{position:absolute;left:8px;top:12px;font:700 17px var(--font)}',
      icons: {
        cart: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 2h2l1.6 8h7.4l1.5-5.5H4.3M5 7h8M7.4 4.5l.7 5.5M10.7 4.5l-.4 5.5"/><circle cx="6.2" cy="13.2" r="1"/><circle cx="11.8" cy="13.2" r="1"/></svg>',
      },
      placeholder: () => 'Search for products...',
      sizing: 'reference',
      pageNav: false,
      markSelected: false,
      sideDetail: false,
      pagerAria: false,
      pagerSync: false,
      parts: {
        searchCommit: (base, S) => (V) => {
          const { ctx } = V;
          V.x.inf = !!V.spec.infinite;
          V.x.lbx = null;
          V.x.feed = null;
          V.x.restoringScroll = false;
          return (m) => {
            ctx.update(m);
            V.paint(ctx.model);
            // Use the actual Aero row height for the task's wheel steps. This is
            // mirrored after an interaction, never by changing the initial model.
            const pitch = V.list.firstElementChild?.getBoundingClientRect().height;
            if (V.x.inf && ctx.model.query !== null && !ctx.model.pick && pitch && ctx.model.pitch !== pitch)
              ctx.update({ ...ctx.model, pitch });
          };
        },
        searchBar: (base, S) => (V) => {
          const { ctx, util, spec, rng } = V;
          const { btn, ICON, F, hashStr, FAV, where } = S.H;
          V.bar = util.el('div', 'se-bar', V.col);
          V.box = util.el('div', 'se-box', V.bar);
          V.box.innerHTML = ICON.search;
          V.input = util.el('input', 'se-input', V.box);
          Object.assign(V.input, {
            type: 'text',
            autocomplete: 'off',
            spellcheck: false,
            placeholder: rng.pick([
              'Search the web',
              `Search ${spec.engine}`,
              'Type to search',
              'What are you looking for?',
            ]),
          });
          V.input.placeholder = 'Search for products...';
          V.input.dataset.role = 'search-field';
          V.go = btn(util, 'as-btn primary se-go', V.bar, rng.pick(['Search', 'Search', 'Go']), 'search-button');
          V.go.textContent = 'Search';
          V.go.insertAdjacentHTML('afterbegin', ICON.search);
          const heading = util.el('div', 'search-heading', V.col);
          util.el('h1', 'search-section-title', heading, 'Search Results');
          const cart = util.el('span', 'search-cart', heading, 'Cart (0)');
          cart.insertAdjacentHTML('afterbegin', ICON.cart);
        },
        searchSort: (base, S) => (V) => {
          const { ctx, util, spec, rng } = V;
          const { btn, ICON, F, hashStr, FAV, where } = S.H;
          V.resultsHead = util.el('div', 'results-head', V.col);
          V.meta = util.el('div', 'se-meta', V.resultsHead);
          const sortLabel = util.el('div', 'result-sort', V.resultsHead, 'Sort by: ');
          const sortSelect = btn(util, 'sort-trigger', sortLabel, 'Relevance');
          sortSelect.insertAdjacentHTML('beforeend', ICON.chev);
          const sortMenu = util.el('div', 'sort-menu', sortLabel);
          sortMenu.hidden = true;
          for (const name of ['Relevance', 'Title', 'Date']) {
            const option = btn(util, '', sortMenu, name);
            option.addEventListener('click', () => {
              sortSelect.firstChild.textContent = name;
              sortMenu.hidden = true;
              env.log('decoy', { what: 'sort ' + name });
            });
          }
          sortSelect.addEventListener('click', () => {
            sortMenu.hidden = !sortMenu.hidden;
          });
        },
        searchPanes: (base, S) => (V) => {
          const { ctx, util, spec, rng } = V;
          const { btn, ICON, F, hashStr, FAV, where } = S.H;
          V.x.pane = util.el('div', 'se-results-pane', V.col);
          V.list = util.el('div', 'se-list', V.x.pane);
          const scrollRail = util.el('div', 'se-scroll-rail', V.x.pane);
          const scrollUp = btn(util, 'se-scroll-arrow up', scrollRail, '');
          scrollUp.setAttribute('aria-label', 'Scroll results up');
          V.x.scrollTrack = util.el('div', 'se-scroll-track', scrollRail);
          V.x.scrollThumb = util.el('div', 'se-scroll-thumb', V.x.scrollTrack);
          const scrollDown = btn(util, 'se-scroll-arrow down', scrollRail, '');
          scrollDown.setAttribute('aria-label', 'Scroll results down');
          V.x.updateScrollRail = () => {
            const height = V.x.scrollTrack.clientHeight;
            const total = V.list.scrollHeight;
            const visible = V.list.clientHeight;
            const thumbHeight = Math.min(height, Math.max(28, (height * visible) / Math.max(1, total)));
            const range = Math.max(0, total - visible);
            // The listbox owns thumb geometry while the infinite feed is active.
            if (!V.x.lbx) {
              V.x.scrollThumb.style.height = thumbHeight + 'px';
              V.x.scrollThumb.style.top = (range ? ((height - thumbHeight) * V.list.scrollTop) / range : 0) + 'px';
            }
            scrollRail.classList.toggle('no-overflow', !range);
            scrollUp.disabled = V.list.scrollTop <= 0;
            scrollDown.disabled = V.list.scrollTop >= range;
          };
          V.list.addEventListener('scroll', V.x.updateScrollRail);
          const scrollRow = (direction) => {
            V.list.scrollTop += direction * (V.list.firstElementChild?.getBoundingClientRect().height || 56);
            V.x.updateScrollRail();
          };
          scrollUp.addEventListener('click', () => scrollRow(-1));
          scrollDown.addEventListener('click', () => scrollRow(1));
          let dragScroll = null;
          V.x.scrollThumb.addEventListener('pointerdown', (event) => {
            if (V.x.lbx) return;
            event.preventDefault();
            dragScroll = { y: event.clientY, scroll: V.list.scrollTop };
            V.x.scrollThumb.setPointerCapture(event.pointerId);
          });
          V.x.scrollThumb.addEventListener('pointermove', (event) => {
            if (!dragScroll) return;
            const travel = V.x.scrollTrack.clientHeight - V.x.scrollThumb.clientHeight;
            if (travel > 0)
              V.list.scrollTop =
                dragScroll.scroll +
                ((event.clientY - dragScroll.y) * (V.list.scrollHeight - V.list.clientHeight)) / travel;
            V.x.updateScrollRail();
          });
          const endScrollDrag = () => {
            dragScroll = null;
          };
          V.x.scrollThumb.addEventListener('pointerup', endScrollDrag);
          V.x.scrollThumb.addEventListener('pointercancel', endScrollDrag);
          V.x.scrollTrack.addEventListener('pointerdown', (event) => {
            if (V.x.lbx) return;
            if (event.target !== V.x.scrollTrack) return;
            const direction = event.clientY < V.x.scrollThumb.getBoundingClientRect().top ? -1 : 1;
            V.list.scrollTop += direction * V.list.clientHeight;
            V.x.updateScrollRail();
          });
          V.pager = util.el('div', 'se-pager', V.col);
          V.visit = util.el('div', 'se-visit', V.col);
          V.visit.hidden = true;
          V.pager.style.minHeight = '44px';
          V.x.paintFoot = function (m) {
            V.x.feed.foot.replaceChildren();
            V.x.feed.foot.classList.toggle('busy', m.loading > 0);
            util.el(
              'span',
              '',
              V.x.feed.foot,
              m.loading > 0
                ? 'Loading more results…'
                : m.loaded >= spec.results.length
                  ? 'You have reached the end of the results.'
                  : 'Scroll down for more results',
            );
            if (m.loading > 0) util.el('i', '', V.x.feed.foot, '● ● ●');
          };
          V.x.feedMore = function (m) {
            V.x.restoringScroll = true;
            while (V.x.feed.shown < m.loaded) {
              const i = V.x.feed.shown++;
              const card = V.x.feed.mkCard(i);
              V.list.insertBefore(card, V.x.feed.foot);
              V.x.lbx.option(i, card);
            }
            V.x.paintFoot(m);
            V.x.lbx.refresh();
            V.x.restoringScroll = false;
            V.x.updateScrollRail();
          };
        },
        searchReset: (base, S) => (V, m) => {
          const { ctx, util, spec, rng } = V;
          const { btn, ICON, F, hashStr, FAV, where } = S.H;
          if (V.x.lbx) {
            // A new feed gets fresh event targets, as in the reference's listPane.
            // This also prevents old listbox listeners surviving Back or a new query.
            if (typeof V.x.lbx.destroy === 'function') V.x.lbx.destroy();
            const freshList = V.list.cloneNode(false);
            V.list.replaceWith(freshList);
            V.list = freshList;
            V.list.addEventListener('scroll', V.x.updateScrollRail);
            const freshTrack = V.x.scrollTrack.cloneNode(false);
            V.x.scrollTrack.replaceWith(freshTrack);
            V.x.scrollTrack = freshTrack;
            V.x.scrollThumb = util.el('div', 'se-scroll-thumb', V.x.scrollTrack);
          }
          V.x.lbx = null;
          V.x.feed = null;
          V.x.pane.classList.remove('infinite-feed');
        },
        searchHide: (base, S) => (V, m) => {
          V.x.pane.hidden = V.list.hidden = V.pager.hidden = !!m.pick;
        },
        searchMeta: (base, S) => (V, m, res) => {
          const { ctx, util, spec, rng } = V;
          const { btn, ICON, F, hashStr, FAV, where } = S.H;
          V.meta.textContent = `Showing 1 - ${V.x.inf && m.query !== null ? m.loaded : res.length} of ${res.length} results`;
        },
        searchRows: (base, S) => (V, m, res) => {
          const { ctx, util, spec, rng } = V;
          const { btn, ICON, F, hashStr, FAV, where } = S.H;
          const p0 = m.page * spec.perPage;

          // Keep the model's page controls, but show the seeded result sequence in
          // one continuous pane. Selecting a row activates its existing model page.
          const mkCard = (i, parent) => {
            const r = res[i];
            const card = util.el('div', 'se-card', parent);
            const number = util.el('b', 'result-number', card, String(i + 1) + '.');
            card.style.height = V.cardH + 'px';
            card.classList.toggle('compact', V.cardH < 60);
            const thumb = util.el('div', 'search-thumb', card);
            thumb.setAttribute('aria-hidden', 'true');
            thumb.style.backgroundPosition = `${(i % 2) * 100}% ${Math.floor((i % 10) / 2) * 25}%`;
            const tone = [
              '#646950',
              '#a4bbc5',
              '#33383c',
              '#727879',
              '#c7d5dd',
              '#313335',
              '#2682ad',
              '#626e4d',
              '#a6a087',
              '#c7dadd',
            ][i % 10];
            thumb.innerHTML =
              '<svg viewBox="0 0 110 65"><defs><linearGradient id="shoe' +
              i +
              '" x2="0" y2="1"><stop stop-color="white" stop-opacity=".25"/><stop offset="1" stop-color="black" stop-opacity=".3"/></linearGradient></defs><ellipse cx="54" cy="55" rx="48" ry="5" fill="#a6b3b8" opacity=".25"/><path d="M9 45l5-26 10 7 15-6 7-8 14 8 12 17 21 5 9 9-4 7-48 2-30-4-14-4z" fill="' +
              tone +
              '" stroke="#64717b" stroke-width="1"/><path d="M9 45c21 8 60 12 91 2l2 7c-17 11-71 9-96-2z" fill="#e4e8e5" stroke="#718087"/><path d="M13 26l11 9 13-7M44 25l14 12 15 6-29 4-15-10z" fill="#b9c8cd" opacity=".55"/><path d="M45 26l14 1M48 30l15 1M52 34l14 1M56 38l14 1" stroke="#e5e9e6" stroke-width="2"/><path d="M9 45l5-26 10 7 15-6 7-8 14 8 12 17 21 5 9 9-4 7-48 2-30-4-14-4z" fill="url(#shoe' +
              i +
              ')"/></svg>';
            const url = util.el('div', 'se-url', card);
            const fav = util.el('span', 'se-fav', url, r.host.charAt(0).toUpperCase());
            fav.style.background = FAV[hashStr(r.host) % FAV.length];
            util.el('span', 'se-host', url, r.host);
            util.el('span', 'se-path', url, `› ${r.path.replace(/\//g, ' › ')}`);
            const t = util.el('a', 'se-title', card, r.title);
            t.dataset.role = 'result';
            t.dataset.index = i;
            t.addEventListener('click', () => {
              if (ctx.model.pick) return;
              const page = Math.floor(i / spec.perPage);
              const model = V.x.inf || page === ctx.model.page ? ctx.model : { ...ctx.model, page };
              V.commit(F().apply(model, spec, { click: { result: i } }));
            });
            V.titles[i] = t;
            if (V.lines) util.el('div', 'se-desc', card, r.desc);
            const commerce = F().resultMeta && F().resultMeta(spec, r);
            if (commerce && commerce.length) {
              card.classList.add('commerce-result');
              util.el(
                'div',
                'se-product-meta',
                card,
                commerce.map(([label, value]) => `${label}: ${value}`).join('  ·  '),
              );
            }
            return card;
          };
          if (V.x.inf && m.query !== null) {
            V.pager.hidden = true;
            V.x.feed = { res, mkCard, shown: m.loaded };
            const options = [...Array(m.loaded).keys()].map((i) => [i, mkCard(i, V.list)]);
            // The task measures scrolling in visible rows, not in whole pages.
            // Keep the existing table styling, but fit exactly the sampled rows.
            const pitch = V.list.firstElementChild?.getBoundingClientRect().height || V.cardH;
            V.x.pane.style.setProperty('--feed-height', spec.rows * pitch + 2 + 'px');
            V.x.pane.classList.add('infinite-feed');
            V.x.lbx = env.ui.listbox(V.list, {
              label: 'results',
              options,
              onScroll(i) {
                if (V.x.restoringScroll) return;
                const scroll = Math.round(i * 1000) / 1000;
                const pitch = V.list.firstElementChild?.getBoundingClientRect().height || ctx.model.pitch;
                if (ctx.model.scroll !== scroll || ctx.model.pitch !== pitch)
                  ctx.update({ ...ctx.model, scroll, pitch });
              },
              scrollbar: { track: V.x.scrollTrack, thumb: V.x.scrollThumb, pad: 1, minThumb: 28 },
            });
            V.x.feed.foot = util.el('div', 'se-foot', V.list);
            V.x.feed.foot.style.height =
              Math.round((V.list.firstElementChild?.getBoundingClientRect().height || V.cardH) * 0.6) + 'px';
            V.x.paintFoot(m);
            V.x.restoringScroll = true;
            V.x.lbx.set({ scroll: m.scroll || 0 });
            V.x.lbx.refresh();
            V.x.restoringScroll = false;
            V.x.updateScrollRail();
            return true;
          }
          res.forEach((r, i) => mkCard(i, V.list));
          // A page-navigation action brings that page's rows into view. The app
          // anchor and all locate() target names remain unchanged.
          V.list.scrollTop = p0 * (V.list.firstElementChild?.getBoundingClientRect().height || V.cardH);
          V.x.updateScrollRail();
        },
        searchPaint: (base, S) => (V, m) => {
          const { ctx, util, spec, rng } = V;
          const { btn, ICON, F, hashStr, FAV, where } = S.H;
          if (V.input.value !== m.text) V.tf.set(m.text);
          const key = JSON.stringify([m.query, m.page, m.pick]);
          if (key !== V.shown) {
            V.shown = key;
            S.P.searchRebuild(V, m);
          } else if (V.x.feed && !m.pick && m.query !== null) {
            if (V.x.feed.shown !== m.loaded || V.x.feed.foot.classList.contains('busy') !== m.loading > 0)
              V.x.feedMore(m);
            V.meta.textContent = `Showing 1 - ${m.loaded} of ${V.x.feed.res.length} results`;
          }
        },
        searchLocate: (base, S) => (V, t) => {
          const { ctx, util, spec, rng } = V;
          const { btn, ICON, F, hashStr, FAV, where } = S.H;
          if (t.field) return V.tf.locate();
          if (t.button) return where(V.go, 'Search button');
          if (t.back) return where(V.back, 'Back to results');
          if (t.thumb === 'list')
            return V.x.lbx ? V.x.lbx.locateThumb() : where(V.x.scrollThumb, 'results scrollbar thumb');
          if (t.scroll !== undefined && V.x.lbx) return V.x.lbx.locateThumbFor(t.scroll);
          if (t.pane) return where(V.list, 'results list');
          if (t.page !== undefined) return where(V.pages[t.page], `page ${t.page}`);
          if (t.pager) return where(t.pager === 'prev' ? V.prev : V.next, `pager ${t.pager}`);
          if (t.result !== undefined) return where(V.titles[t.result], `result ${t.result}`);
          return null;
        },
      },
    },
  });
})();
