// Adds the storefront's infinite catalog, product cards and read-only pre-search preview.
env.widget({
  task: 'use-shop',
  site: 'design-use-shop-search-08',
  name: 'design',
  split: 'train',
  scenarios: ['search'],
  traits: { corpus: 'products', infinite: true },
  template: 'use-shop/store',
  design: {
    parts: {
      buildSearch: (base, S) => (ctx, body) => {
        const { F, hashStr, where, btn, trackFocus, mirrorPitch, ICON, FAV } = S.H;
            const { util, spec, rng } = ctx;
            const commit = (m) => { ctx.update(m); paint(ctx.model); };
            const main = util.el('div', 'se-main', body);
            main.style.paddingLeft = rng.int(18, 40) + 'px';
            const col = util.el('div', 'se-col', main);
            const bar = util.el('div', 'se-bar', col);
            const box = util.el('div', 'se-box', bar);
            box.innerHTML = ICON.search;
            const input = util.el('input', 'se-input', box);
            Object.assign(input, { type: 'text', autocomplete: 'off', spellcheck: false,
              placeholder: rng.pick(['Search the web', `Search ${spec.engine}`, 'Type to search', 'What are you looking for?']) });
            input.dataset.role = 'search-field';
            const go = btn(util, 'as-btn primary se-go', bar, rng.pick(['Search', 'Search', 'Go']), 'search-button');
            input.placeholder = 'Search for products, brands and more...';
            go.textContent = 'Search';
            const meta = util.el('div', 'se-meta', col);
            const inf = !!spec.infinite;
            const pane = util.el('div', 'se-pane', col);
            const list = util.el('div', 'se-list', pane);
            let lbx = null;
            const scroll = util.el('div', 'se-scroll', pane);
            const scrollUp = util.el('button', 'se-scroll-up', scroll);
            scrollUp.type = 'button';
            scrollUp.setAttribute('aria-label', 'Scroll results up');
            const scrollWell = util.el('div', 'se-scroll-well', scroll);
            const scrollThumb = util.el('div', 'se-scroll-thumb', scrollWell);
            const scrollDown = util.el('button', 'se-scroll-down', scroll);
            scrollDown.type = 'button';
            scrollDown.setAttribute('aria-label', 'Scroll results down');
            function syncScroll() {
              if (lbx) return;
              const range = list.scrollHeight - list.clientHeight;
              const h = scrollWell.clientHeight;
              const thumbH = Math.max(24, h * Math.min(.36, list.clientHeight / Math.max(1, list.scrollHeight)));
              scrollThumb.hidden = range <= 1;
              scrollThumb.style.height = thumbH + 'px';
              scrollThumb.style.top = (range > 0 ? (h - thumbH) * list.scrollTop / range : 0) + 'px';
            }
            list.addEventListener('scroll', syncScroll);
            scrollUp.addEventListener('click', () => { list.scrollTop -= 80; syncScroll(); });
            scrollDown.addEventListener('click', () => { list.scrollTop += 80; syncScroll(); });
            let scrollGrab = null;
            const moveScroll = (e) => {
              if (lbx || scrollGrab === null) return;
              const travel = scrollWell.clientHeight - scrollThumb.offsetHeight;
              const position = e.clientY - scrollWell.getBoundingClientRect().top - scrollGrab;
              list.scrollTop = Math.max(0, Math.min(1, position / Math.max(1, travel))) * (list.scrollHeight - list.clientHeight);
              syncScroll();
            };
            scrollWell.addEventListener('pointerdown', (e) => {
              if (lbx) return;
              e.preventDefault();
              scrollGrab = e.target === scrollThumb ? e.clientY - scrollThumb.getBoundingClientRect().top : scrollThumb.offsetHeight / 2;
              scrollWell.setPointerCapture(e.pointerId);
              moveScroll(e);
            });
            scrollWell.addEventListener('pointermove', moveScroll);
            scrollWell.addEventListener('pointerup', () => { scrollGrab = null; });
            scrollWell.addEventListener('pointercancel', () => { scrollGrab = null; });
            const pager = util.el('div', 'se-pager', col);
            const visit = util.el('div', 'se-visit', col);
            visit.hidden = true;
            pager.style.minHeight = '44px';
            const bh = body.getBoundingClientRect().height;
            const avail = bh - 32 - 46 - 40 - 50;
            const cardH = inf ? list.clientHeight / spec.rows
              : Math.max(60, Math.min(118, Math.floor(avail / spec.perPage)));
            pane.style.setProperty('--search-row-height', cardH + 'px');
            if (inf) mirrorPitch(ctx, cardH);
            const lines = cardH >= 98 ? 2 : cardH >= 78 ? 1 : 0;
            col.style.setProperty('--se-lines', Math.max(1, lines));
            if (body.getBoundingClientRect().width > 1080) {
              const side = util.el('aside', 'se-side', main);
              const b1 = util.el('div', 'se-box2', side);
              util.el('h4', '', b1, 'Related searches');
              const chips = util.el('div', 'se-chips', b1);
              for (const t of rng.sample(['news', 'reviews', 'near me', 'images', 'wiki', 'videos', 'prices', 'today', 'map'], 5)) util.el('span', '', chips, t);
              const b2 = util.el('div', 'se-box2', side);
              util.el('h4', '', b2, 'Search tips');
              util.el('p', '', b2, 'Results are listed a few per page. Use the page numbers below the results to see more.');
            }

            const tf = env.ui.textField(input, { value: ctx.model.text, label: 'search', onInput: (v) => commit({ ...ctx.model, text: v }) });
            trackFocus(ctx, input, 'search');
            const doSearch = () => {
              if (!input.value.trim() || ctx.model.pick) return;
              commit(F().apply({ ...ctx.model, text: input.value }, spec, { click: { button: 'search' } }));
            };
            go.addEventListener('click', doSearch);
            input.addEventListener('keydown', (e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                doSearch();
              }
            });

            let shown = null;
            let titles = [];
            let pages = [];
            let feed = null;
            function paintFoot(m) {
              feed.foot.replaceChildren();
              feed.foot.classList.toggle('busy', m.loading > 0);
              util.el('span', '', feed.foot, m.loading > 0 ? 'Loading more results…'
                : m.loaded >= spec.results.length ? 'You have reached the end of the results.'
                : 'Scroll down for more results');
            }
            function feedMore(m) {
              while (feed.shown < m.loaded) {
                const i = feed.shown++;
                const card = feed.mkCard(i);
                list.insertBefore(card, feed.foot);
                lbx.option(i, card);
              }
              meta.querySelector('.se-count').textContent = `Showing 1 - ${feed.shown} of ${feed.total} results`;
              paintFoot(m);
              lbx.refresh();
            }
            function refreshList(m) {
              if (!lbx) {
                lbx = env.ui.listbox(list, {
                  label: 'results', options: titles.map((title, i) => [i, title.closest('.se-card')]),
                  onScroll(i) {
                    if (ctx.model.query === null || ctx.model.pick) return;
                    const scroll = Math.round(i * 1000) / 1000;
                    if (ctx.model.scroll !== scroll) ctx.update({ ...ctx.model, scroll });
                  },
                  scrollbar: { track: scrollWell, thumb: scrollThumb, pad: 0, minThumb: 24 },
                });
              }
              titles.forEach((title, i) => lbx.option(i, title.closest('.se-card')));
              lbx.refresh();
              lbx.set({ scroll: m.scroll || 0 });
            }
            let prev = null;
            let next = null;
            let back = null;
            function rebuildVisit(m) {
              visit.replaceChildren();
              const r = F().resultsFor(spec, m.query)[m.pick.index];
              const vb = util.el('div', 'se-vbar', visit);
              back = btn(util, 'as-btn sm', vb, '← Back to results', 'back');
              back.addEventListener('click', () => commit(F().apply(ctx.model, spec, { click: { back: true } })));
              util.el('span', '', vb, `https://${r.host}/${r.path}`);
              const page = util.el('div', 'se-vpage', visit);
              const site = util.el('div', 'se-vsite', page);
              const fav = util.el('span', 'se-fav', site, r.host.charAt(0).toUpperCase());
              fav.style.background = FAV[hashStr(r.host) % FAV.length];
              util.el('span', '', site, r.host.replace(/^www\./, ''));
              util.el('h2', '', page, r.title);
              util.el('p', '', page, r.desc);
              const extra = env.content.SENTENCES || [];
              if (extra.length) {
                const h = hashStr(`${r.host}|${r.title}`);
                util.el('p', '', page, [0, 1, 2].map((k) => extra[(h + k * 7919) % extra.length]).join(' '));
              }
            }
            function rebuild(m) {
              feed = null;
              list.replaceChildren();
              pager.replaceChildren();
              titles = [];
              pages = [];
              list.hidden = !!m.pick;
              pager.hidden = !!m.pick || !!spec.infinite;
              pane.hidden = !!m.pick;
              visit.hidden = !m.pick;
              if (m.pick) {
                rebuildVisit(m);
                return;
              }
              // The storefront can show a read-only catalog before a search is submitted.
              // This is presentation only: query remains null, and the task still requires
              // the Search action before any result can be selected or scored.
              const preview = m.query === null;
              pane.classList.toggle('preview', preview);
              const res = F().resultsFor(spec, preview ? '' : m.query);
              const p0 = preview || spec.infinite ? 0 : m.page * spec.perPage;
              const pageSize = preview ? Math.min(10, res.length) : inf ? m.loaded : spec.perPage;
              meta.replaceChildren();
              util.el('strong', '', meta, 'Results for your search');
              util.el('span', 'se-count', meta, `Showing ${p0 + 1} - ${Math.min(p0 + pageSize, res.length)} of ${res.length} results`);
              if (preview) pane.style.setProperty('--catalog-row-height', (list.clientHeight / Math.min(6, Math.max(1, pageSize))) + 'px');
              const mkCard = (i) => {
                const r = res[i];
                const card = util.el('div', 'se-card');
                card.style.height = cardH + 'px';
                util.el('span', 'se-number', card, String(i + 1));
                const photo = util.el('div', 'se-photo', card);
                const photoY = [315, 410, 505, 600, 695, 790][(i + 2) % 6];
                photo.innerHTML = `<svg viewBox="360 ${photoY} 115 75" aria-hidden="true"><image href="sites/design-use-shop-search-08/assets/shoe-source.webp" width="1672" height="941"/></svg>`;
                const url = util.el('div', 'se-url', card);
                const fav = util.el('span', 'se-fav', url, r.host.charAt(0).toUpperCase());
                fav.style.background = FAV[hashStr(r.host) % FAV.length];
                util.el('span', 'se-host', url, r.host);
                util.el('span', 'se-path', url, `› ${r.path.replace(/\//g, ' › ')}`);
                const t = util.el(preview ? 'span' : 'a', 'se-title', card, r.title);
                t.dataset.role = preview ? 'catalog-preview' : 'result';
                t.dataset.index = i;
                t.addEventListener('click', () => {
                  if (ctx.model.pick || ctx.model.query === null) return;
                  commit(F().apply(ctx.model, spec, { click: { result: i } }));
                });
                titles[i] = t;
                const fields = spec.corpus ? F().resultMeta(spec, r) : [];
                const priceField = fields.find(([label]) => /price/i.test(label));
                const ratingField = fields.find(([label]) => /rating/i.test(label));
                const score = ratingField ? parseFloat(ratingField[1]) : 4.5;
                const rating = util.el('div', 'se-rating', card);
                if (ratingField) rating.title = ratingField[1];
                const stars = util.el('span', 'se-stars', rating);
                const starPath = 'M10 1l2.7 5.7 6.3.9-4.5 4.4 1.1 6.3-5.6-3-5.6 3 1.1-6.3L1 7.6l6.3-.9z';
                stars.innerHTML = `<svg viewBox="0 0 100 20" aria-label="${score} out of 5 stars"><defs><linearGradient id="half-star-${i}"><stop offset="${score % 1 * 100}%" stop-color="#ffae00"/><stop offset="${score % 1 * 100}%" stop-color="#e4e4e4"/></linearGradient></defs>${[0,1,2,3,4].map(s=>`<path transform="translate(${s*20} 0)" d="${starPath}" fill="${s < Math.floor(score) ? '#ffae00' : s === Math.floor(score) ? 'url(#half-star-'+i+')' : '#e4e4e4'}"/>`).join('')}</svg>`;
                const reviews = ratingField && ratingField[1].match(/\([^)]*\)/);
                util.el('span', 'se-reviews', rating, reviews ? reviews[0] : '(' + (240 + hashStr(r.title) % 400) + ')');
                // Product corpus metadata occupies the existing price and description slots.
                const price = util.el('span', 'se-price', card, priceField ? priceField[1]
                  : ['$119.99', '$89.99', '$64.99', '$159.99', '$139.99', '$145.00'][(i + 2) % 6]);
                if (priceField) price.title = priceField[0];
                const desc = util.el('div', 'se-desc', card);
                if (fields.length) fields.filter(field => field !== priceField && field !== ratingField).forEach(([label, text], k) => {
                  if (k) desc.append(' · ');
                  const field = util.el('span', '', desc, text);
                  field.title = label;
                });
                else desc.textContent = r.desc;
                return card;
              };
              for (let i = p0; i < Math.min(p0 + pageSize, res.length); i++) list.append(mkCard(i));
              if (preview) {
                list.setAttribute('aria-label', 'Catalog preview — search to select a result');
                list.scrollTop = Math.max(0, list.scrollHeight - list.clientHeight);
                syncScroll();
                return;
              }
              list.setAttribute('aria-label', 'Search results');
              if (inf) {
                feed = { mkCard, shown: m.loaded, total: res.length, foot: util.el('div', 'se-foot', list) };
                feed.foot.style.height = Math.round(cardH * .6) + 'px';
                paintFoot(m);
                refreshList(m);
                return;
              }
              const mk = (label, page, cls = '') => {
                const b = btn(util, 'se-pg' + cls, pager, label);
                b.addEventListener('click', () => {
                  if (ctx.model.pick || b.disabled) return;
                  const p = page === 'prev' ? ctx.model.page - 1 : page === 'next' ? ctx.model.page + 1 : page;
                  if (p >= 0 && p < spec.pages && p !== ctx.model.page) commit({ ...ctx.model, page: p });
                });
                return b;
              };
              prev = mk('‹', 'prev');
              prev.disabled = m.page === 0;
              for (let p = 0; p < spec.pages; p++) pages[p] = mk(String(p + 1), p, p === m.page ? ' on' : '');
              next = mk('›', 'next');
              next.disabled = m.page === spec.pages - 1;
              list.scrollTop = 0;
              syncScroll();
            }
            function paint(m) {
              if (input.value !== m.text) tf.set(m.text);
              const key = JSON.stringify([m.query, m.page, m.pick]);
              if (key !== shown) {
                shown = key;
                rebuild(m);
              } else if (feed && !m.pick && m.query !== null) {
                if (feed.shown !== m.loaded || feed.foot.classList.contains('busy') !== (m.loading > 0)) feedMore(m);
              }
            }
            paint(ctx.model);
            return {
              paint,
              locate(t) {
                if (t.thumb === 'list') return lbx ? lbx.locateThumb() : where(scrollThumb, 'results scrollbar thumb');
                if (t.scroll !== undefined) return lbx && lbx.locateThumbFor(t.scroll);
                if (t.pane === 'list') return where(list, 'results list');
                if (t.field) return tf.locate();
                if (t.button) return where(go, 'Search button');
                if (t.back) return where(back, 'Back to results');
                if (t.page !== undefined) return where(pages[t.page], `page ${t.page}`);
                if (t.pager) return where(t.pager === 'prev' ? prev : next, `pager ${t.pager}`);
                if (t.result !== undefined) return where(titles[t.result], `result ${t.result}`);
                return null;
              },
            };
      },
    },
  },
});
